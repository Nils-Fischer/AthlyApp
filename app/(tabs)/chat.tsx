import * as React from "react";
import { View } from "react-native";
import { useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ChatInterface from "~/components/Chat/chatinterface";
import { Routine } from "~/lib/types";
import { H1 } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import { Button } from "~/components/ui/button";
import { useChatStore } from "~/stores/chatStore";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useUserProfileStore } from "~/stores/userProfileStore";

export default function ChatScreen() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { messages, sendMessage, clearMessages } = useChatStore();
  const { routines, addRoutine } = useUserRoutineStore();
  const { profile } = useUserProfileStore();
  const [isTyping, setIsTyping] = React.useState(false);
  const [routine, setRoutine] = React.useState<Routine | null>(null);
  const [isAdded, setIsAdded] = React.useState(false);

  const previewRoutine = (routine: Routine) => {
    setRoutine(routine);
    actionSheetRef.current?.show();
  };

  const handleSendMessage = async (message: string, images: string[]): Promise<void> => {
    try {
      setIsTyping(true);
      await sendMessage(message, images || [], { routines, profile });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddRoutine = async (routine: Routine) => {
    addRoutine(routine);
    setIsAdded(true);
  };

  React.useEffect(() => {
    setIsAdded(false);
    clearMessages();
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
