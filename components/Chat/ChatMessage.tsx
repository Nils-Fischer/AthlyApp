import * as React from "react";
import { View, Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";
import { Button } from "~/components/ui/button";
import { Routine } from "~/lib/types";
import { ChatMessage as ChatMessageType } from "~/lib/types";
import { extractMessageContent, extractUserContent } from "~/lib/Chat/chatUtils";
import { DataContent } from "ai";
import { parseJSON } from "~/lib/utils";
import { CircleX } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { RefreshCw, Trash2 } from "~/lib/icons/Icons";

export const ChatMessage = React.memo<{
  message: ChatMessageType;
  showRoutine: (routine: Routine) => void;
  deleteMessage: () => void;
  resendMessage: () => void;
}>(({ message, showRoutine, deleteMessage, resendMessage }) => {
  const isAI = message.role === "assistant";
  const timestamp = new Date(message.createdAt);
  let messageContent: string = "";
  let images: (DataContent | URL)[] = [];
  let newRoutine: Routine | null = null;
  if (isAI) {
    const content = extractMessageContent(message);
    messageContent = content[1];
    const routineString = content.at(2);
    newRoutine = routineString ? parseJSON<Routine>(routineString) : null;
  } else if (message.role === "user") {
    const { message: messageResult, images: imagesResult } = extractUserContent(message);
    messageContent = messageResult;
    images = imagesResult;
  }

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
            {images.map((image, index) => {
              if (typeof image === "string") {
                return <Image key={`image-${index}`} source={{ uri: image }} className="w-20 h-20 rounded-lg" />;
              }
              return null;
            })}
          </View>
          <View className="flex-row justify-end items-center">
            <Card className={`${isAI ? "bg-secondary/30" : "bg-primary"}  border-0 shadow-sm p-4`}>
              <View className="flex-col">
                <View className="flex-row flex-wrap  items-end justify-end gap-x-2">
                  <Text className={`${isAI ? "text-foreground" : "text-primary-foreground"}`}>{messageContent}</Text>
                </View>

                {newRoutine && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onPress={() => {
                      newRoutine && showRoutine(newRoutine);
                    }}
                  >
                    <Text>Routine ansehen</Text>
                  </Button>
                )}
              </View>
            </Card>
            {message.role === "user" && message.status === "failed" && (
              <CustomDropdownMenu
                items={[
                  {
                    name: "Resend",
                    icon: RefreshCw,
                    onPress: resendMessage,
                  },
                  {
                    name: "Delete",
                    icon: Trash2,
                    onPress: deleteMessage,
                    destructive: true,
                  },
                ]}
                trigger={
                  <Button variant="ghost">
                    <CircleX className="text-destructive" />
                  </Button>
                }
                align="end"
                side="top"
              />
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

ChatMessage.displayName = "ChatMessage";
