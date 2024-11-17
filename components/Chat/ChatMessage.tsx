import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";
import type { Message } from "./types";

export const ChatMessage = React.memo<{ message: Message }>(({ message }) => {
  const isAI = message.sender === "ai";

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      className={`flex-row ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <View className={`flex-row max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
        <View className={`${isAI ? "mr-2" : "ml-2"} justify-end`}>
          <MessageAvatar isAI={isAI} />
        </View>

        <View>
          <Card className={`${isAI ? "bg-secondary/30" : "bg-primary"} border-0 shadow-sm`}>
            <View className="px-4 py-2.5">
              <P className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>{message.content}</P>
            </View>
          </Card>
          <Text className="text-xs text-muted-foreground mt-1 ml-1">{message.timestamp}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

ChatMessage.displayName = "ChatMessage";
