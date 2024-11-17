import * as React from "react";
import { View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { ChatAvatar } from "./ChatAvatar";

interface ChatMessageProps {
  isAI: boolean;
  message: string;
  time: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isAI, message, time }) => (
  <View className={`flex flex-row gap-2 mb-4 ${isAI ? "" : "flex-row-reverse"}`}>
    <ChatAvatar isAI={isAI} />
    <View className="flex-1">
      <Card>
        <CardContent className="p-3">
          <P>{message}</P>
          <Text className="text-xs text-muted-foreground mt-1">{time}</Text>
        </CardContent>
      </Card>
    </View>
  </View>
);
