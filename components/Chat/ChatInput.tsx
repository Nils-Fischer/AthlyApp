import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <View className="p-4 border-t border-border flex-row items-center gap-2">
      <View className="flex-1 bg-muted rounded-lg p-3">
        <Text className="text-muted-foreground">Schreibe eine Nachricht...</Text>
      </View>
      <Button size="icon" variant="secondary" onPress={handleSend}>
        <Text>➤</Text>
      </Button>
    </View>
  );
};