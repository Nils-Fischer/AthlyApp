import * as React from "react";
import { View, Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
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
  const timestamp = new Date(message.timestamp);

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      className={`flex-row ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <View className={`flex-row max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
        {isAI && (
          <View className={`${isAI ? "mr-2" : "ml-2"} justify-start`}>
            <MessageAvatar isAI={isAI} />
            <Text className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
        <View className="gap-y-1">
          <View className="flex-row flex-wrap items-end justify-end gap-x-1">
            {message.content.map((section) => {
              if (typeof section === "object" && "uri" in section) {
                return (
                  <Image source={{ uri: `data:image/jpeg;base64,${section.uri}` }} className="w-20 h-20 rounded-lg" />
                );
              }
              return null;
            })}
          </View>
          <Card className={`${isAI ? "bg-secondary/30" : "bg-primary"}  border-0 shadow-sm p-4`}>
            <View className="flex-col">
              <View className="flex-row flex-wrap  items-end justify-end gap-x-2">
                <Text className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>
                  {message.message.trim()}
                </Text>
              </View>

              {Array.isArray(message.content) ? (
                message.content.map((section: Content, index: number) => {
                  if (typeof section === "object" && "workouts" in section) {
                    return (
                      <Button
                        key={index}
                        variant="secondary"
                        className="mt-2"
                        onPress={() => {
                          section && showRoutine?.(section as Routine);
                        }}
                      >
                        <Text>Routine ansehen</Text>
                      </Button>
                    );
                  }
                  return null;
                })
              ) : (
                <Text className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>{message.content}</Text>
              )}
            </View>
          </Card>
        </View>
      </View>
    </Animated.View>
  );
});

ChatMessage.displayName = "ChatMessage";
