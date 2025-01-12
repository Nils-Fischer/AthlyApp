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
import { useUserStore } from "~/stores/userStore";
import Animated, { FadeOut, FadeIn } from "react-native-reanimated";
import { useChatStore } from "~/stores/chatStore";
import { Image } from "~/lib/types";

export default function Screen() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { messages, addMessage, updateMessageStatus } = useChatStore();
  const [isTyping, setIsTyping] = React.useState(false);
  const [routine, setRoutine] = React.useState<Routine | null>(null);
  const [isAdded, setIsAdded] = React.useState(false);

  const userStore = useUserStore();

  const previewRoutine = (routine: Routine) => {
    setRoutine(routine);
    actionSheetRef.current?.show();
  };

  const handleSendMessage = async (message: string, image?: Image): Promise<void> => {
    const newMessage = createMessage(message, image ? [image] : [], "user");
    addMessage(newMessage);
    setIsTyping(true);
    try {
      const answerPromise = sendMessage(messages);
      updateMessageStatus(newMessage.id, "sent");
      const answer = await answerPromise;
      addMessage(answer);
    } catch (error) {
      updateMessageStatus(newMessage.id, "failed");
    }
    setIsTyping(false);
  };

  const handleAddRoutine = async (routine: Routine) => {
    await userStore.addRoutine(routine);
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
              {isAdded || userStore.userData?.routines.find((r) => r.id === routine.id) ? (
                <Animated.View entering={FadeIn} className="px-4 pb-4">
                  <Text className="text-green-500 text-center font-medium">✓ Bereits in deinem Profil</Text>
                </Animated.View>
              ) : (
                <Animated.View exiting={FadeOut} className="px-4 pb-4">
                  <Button className="w-full" onPress={() => handleAddRoutine(routine)}>
                    <Text className="text-primary-foreground font-medium">Zum Profil hinzufügen</Text>
                  </Button>
                </Animated.View>
              )}
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
