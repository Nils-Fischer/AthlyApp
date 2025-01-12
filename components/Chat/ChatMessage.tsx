import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";
import { Button } from "~/components/ui/button";
import type { Message, Content } from "../../lib/Chat/types";
import { Routine } from "~/lib/types";

export const ChatMessage = React.memo<{
  message: Message;
  showRoutine?: (routine: Routine) => void;
}>(({ message, showRoutine }) => {
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
              {Array.isArray(message.content) ? (
                message.content.map((section: Content, index: number) => {
                  if (section.tag === "text") {
                    return (
                      <P key={index} className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>
                        {(section.content || "").toString()}
                      </P>
                    );
                  }
                  if (section.tag === "routine") {
                    return (
                      <Button
                        key={index}
                        variant="secondary"
                        className="mt-2"
                        onPress={() => {
                          section.content && showRoutine?.(section.content as Routine);
                        }}
                      >
                        <Text>Routine ansehen</Text>
                      </Button>
                    );
                  }
                  return null;
                })
              ) : (
                <P className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>{message.content}</P>
              )}
            </View>
          </Card>
          <Text className="text-xs text-muted-foreground mt-1 ml-1">{message.timestamp}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

ChatMessage.displayName = "ChatMessage";
