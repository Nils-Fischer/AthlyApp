import * as React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatInterface from "~/components/Chat/chatinterface";
import { Message } from "~/components/Chat/types";
import { createMessage, createTextMessage, getAnswer } from "~/lib/chatUtils";
import { Routine } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { H1 } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { RoutineOverview } from "~/components/exercise/RoutineOverview";
import { Button } from "~/components/ui/button";

const initialMessages = [
  createTextMessage("Hallo! 👋 Ich bin dein AI Personal Trainer. Wie kann ich dir heute helfen?", "ai"),
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
      const userMessage: Message = createTextMessage(content, "user");

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const { aiMessage } = await getAnswer(exerciseList, content);

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    },
    [exerciseList]
  );

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
        snapPoints={[20, 40, 75, 95]}
        initialSnapIndex={2}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
        elevation={2}
      >
        <ScrollView className="p-4 bg-background min-h-full">
          <H1 className="text-xl font-semibold text-foreground m-4">Trainingsplan Vorschau</H1>
          {routine ? (
            <View className="space-y-4">
              <RoutineOverview routine={routine} />
              <View className="px-4 pb-4">
                <Button
                  className="w-full"
                  onPress={() => {
                    // Add your logic to save to profile here
                    console.log("Saving to profile:", routine);
                  }}
                >
                  <Text className="text-primary-foreground font-medium">Zum Profil hinzufügen</Text>
                </Button>
              </View>
            </View>
          ) : (
            <View className="p-4 items-center justify-center">
              <Text className="text-muted-foreground text-center">
                Keine Routine ausgewählt. Frag mich nach einem Trainingsplan!
              </Text>
            </View>
          )}
        </ScrollView>
      </ActionSheet>
    </View>
  );
}
