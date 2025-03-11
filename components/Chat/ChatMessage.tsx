import * as React from "react";
import { View, Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";
import { Button } from "~/components/ui/button";
import { Routine, WorkoutSession } from "~/lib/types";
import { ChatMessage as ChatMessageType } from "~/lib/types";
import { DataContent } from "ai";
import { CircleX } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { RefreshCw, Trash2 } from "~/lib/icons/Icons";

export const ChatMessage = React.memo<{
  message: ChatMessageType;
  showRoutine: (routine: Routine) => void;
  showWorkoutSessionLog: (workoutSession: WorkoutSession) => void;
  deleteMessage: () => void;
  resendMessage: () => void;
}>(({ message, showRoutine, showWorkoutSessionLog, deleteMessage, resendMessage }) => {
  const isAI = message.role === "assistant";
  const timestamp = new Date(message.createdAt);
  let messageContent: string = "";
  let images: (DataContent | URL)[] = [];
  let newRoutine: Routine | undefined = undefined;
  let workoutSession: WorkoutSession | undefined = undefined;
  if (isAI) {
    messageContent = message.message;
    newRoutine = message.routine;
  } else if (message.role === "user") {
    messageContent = message.message;
    images = message.images;
    workoutSession = message.workoutSession;
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
                    haptics="medium"
                  >
                    <Text>Routine ansehen</Text>
                  </Button>
                )}

                {workoutSession && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onPress={() => {
                      workoutSession && showWorkoutSessionLog(workoutSession);
                    }}
                  >
                    <Text>Workout ansehen</Text>
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
                  <Button variant="ghost" haptics="light">
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
