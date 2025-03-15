import * as React from "react";
import { View } from "react-native";
import { useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatInterface from "~/components/Chat/chatinterface";
import { Routine, WorkoutSession } from "~/lib/types";
import { useChatStore } from "~/stores/chatStore";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { RoutinePreview } from "~/lib/Chat/RoutinePreview";
import WorkoutSessionLog from "~/components/WorkoutCompletion/WorkoutLogOverview";

export default function ChatScreen() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { messages, sendChatMessage: sendMessage, deleteMessage, resendMessage } = useChatStore();
  const { addRoutine, updateRoutine } = useUserRoutineStore();
  const routines = useUserRoutineStore((state) => state.routines);
  const { profile } = useUserProfileStore();
  const [isTyping, setIsTyping] = React.useState(false);

  const [previewContent, setPreviewContent] = React.useState<"routine" | "workoutSession" | null>(null);
  const [previewRoutine, setPreviewRoutine] = React.useState<Routine | null>(null);
  const [previewWorkoutSessionLog, setPreviewWorkoutSessionLog] = React.useState<WorkoutSession | null>(null);

  const showPreviewRoutine = (routine: Routine) => {
    setPreviewRoutine(routine);
    setPreviewContent("routine");
    actionSheetRef.current?.show();
  };

  const showPreviewWorkoutSessionLog = (workoutSession: WorkoutSession) => {
    setPreviewWorkoutSessionLog(workoutSession);
    setPreviewContent("workoutSession");
    actionSheetRef.current?.show();
  };

  const handleSendMessage = async (message: string, images: string[]): Promise<void> => {
    try {
      setIsTyping(true);
      await sendMessage(message, images || [], routines, JSON.stringify(profile, null, 2));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResendMessage = async (messageId: string) => {
    try {
      setIsTyping(true);
      await resendMessage(messageId, routines, JSON.stringify(profile, null, 2));
    } catch (error) {
      console.error("Error resending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ChatInterface
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        showPreviewRoutine={showPreviewRoutine}
        showPreviewWorkoutSessionLog={showPreviewWorkoutSessionLog}
        deleteMessage={deleteMessage}
        resendMessage={handleResendMessage}
      />

      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[95]}
        initialSnapIndex={0}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
        elevation={2}
      >
        {previewContent === "routine" && previewRoutine && (
          <RoutinePreview
            allRoutines={routines}
            previewRoutine={previewRoutine}
            handleAddRoutine={addRoutine}
            handleModifyRoutine={updateRoutine}
          />
        )}
        {previewContent === "workoutSession" && previewWorkoutSessionLog && (
          <WorkoutSessionLog workout={previewWorkoutSessionLog} />
        )}
      </ActionSheet>
    </View>
  );
}
