import * as React from "react";
import { View, ScrollView } from "react-native";
import { useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatInterface from "~/components/Chat/chatinterface";
import { createMessage, sendMessage } from "~/lib/Chat/chatUtils";
import { Routine } from "~/lib/types";
import { H1 } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import { Button } from "~/components/ui/button";
import { useChatStore } from "~/stores/chatStore";
import { Image } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useUserProfileStore } from "~/stores/userProfileStore";

export default function Screen() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { messages, addMessage, updateMessageStatus, context } = useChatStore();
  const { exercises } = useExerciseStore();
  const { routines, addRoutine } = useUserRoutineStore();
  const { profile } = useUserProfileStore();
  const exerciseList = exercises?.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n") || "";
  const [isTyping, setIsTyping] = React.useState(false);
  const [routine, setRoutine] = React.useState<Routine | null>(null);
  const [isAdded, setIsAdded] = React.useState(false);

  const previewRoutine = (routine: Routine) => {
    setRoutine(routine);
    actionSheetRef.current?.show();
  };

  const handleSendMessage = async (message: string, image?: Image): Promise<void> => {
    console.log("Sending message:", message);
    const newMessage = createMessage(message, image ? [image] : [], "user");
    console.log("New message:", newMessage);
    addMessage(newMessage);
    setIsTyping(true);
    try {
      updateMessageStatus(newMessage.id, "sent");
      const updatedMessages = [...messages, newMessage];
      const answer = await sendMessage(updatedMessages, exerciseList, routines, profile, context);
      console.log("Answer:", answer);
      addMessage(answer);
    } catch (error) {
      console.error("Error sending message:", error);
      updateMessageStatus(newMessage.id, "failed");
    }
    setIsTyping(false);
  };

  const handleAddRoutine = async (routine: Routine) => {
    addRoutine(routine);
    setIsAdded(true);
  };

  React.useEffect(() => {
    setIsAdded(false);
  }, [routine]);

  return (
    <View className="flex-1 bg-background">
      <ChatInterface
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        showRoutine={previewRoutine}
      />

      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[95]}
        initialSnapIndex={0}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
        elevation={2}
      >
        <View className="p-4 bg-background min-h-full">
          <View className="flex-row justify-between items-center mb-4 mx-2">
            <H1 className="text-xl font-semibold text-foreground">Trainingsplan Vorschau</H1>
            {routine && !(isAdded || routines.find((r) => r.id === routine.id)) ? (
              <Button variant="ghost" size="icon" className="w-24" onPress={() => handleAddRoutine(routine)}>
                <Text className="text-lg font-semibold text-destructive">Speichern</Text>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="w-24" disabled>
                <Text className="text-green-500 text-center text-lg">Gespeichert</Text>
              </Button>
            )}
          </View>

          {routine ? (
            <View className="space-y-4 flex-1">
              <RoutineOverview routine={routine} />
            </View>
          ) : (
            <View className="p-4 items-center justify-center">
              <Text className="text-muted-foreground text-center">
                Keine Routine ausgewählt. Frag mich nach einem Trainingsplan!
              </Text>
            </View>
          )}
        </View>
      </ActionSheet>
    </View>
  );
}
