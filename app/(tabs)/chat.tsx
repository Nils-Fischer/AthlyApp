import * as React from "react";
import ChatInterface from "~/components/Chat/chatinterface";
import { Message } from "~/components/Chat/types";
import { createMessage, getAnswer } from "~/lib/chatUtils";
import { Routine } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useRef } from "react";
import { H1 } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useScrollHandlers } from "react-native-actions-sheet";
import { RoutineOverview } from "~/components/exercise/RoutineOverview";
import { WorkoutPage } from "~/components/exercise/WorkoutPage";

const initialMessages = [
  createMessage("Hallo! 👋 Ich bin dein AI Personal Trainer. Wie kann ich dir heute helfen?", "ai"),
];

export default function Screen() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const exerciseStore = useExerciseStore();
  const exerciseList = exerciseStore.exercises.map((exercise) => `${exercise.id} - ${exercise.name}`).join("\n");

  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);
  const [routine, setRoutine] = React.useState<Routine | null>(null);

  const previewRoutine = (routine: Routine) => {
    setRoutine(routine);
    actionSheetRef.current?.show();
  };

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: Message = createMessage(content, "user");

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const { aiMessage, routine } = await getAnswer(exerciseList, content);
      routine && previewRoutine(routine);

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    },
    [exerciseList]
  );

  return (
    <View className="flex-1 relative">
      <ChatInterface messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />
      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[20, 40, 75, 95]}
        initialSnapIndex={3}
        gestureEnabled={true}
        closeOnTouchBackdrop={false}
        elevation={2}
      >
        <ScrollView className="p-4 bg-background min-h-full">
          <H1 className="text-xl font-semibold text-foreground m-4">Details</H1>
          {routine && <RoutineOverview routine={routine} />}
        </ScrollView>
      </ActionSheet>
    </View>
  );
}
