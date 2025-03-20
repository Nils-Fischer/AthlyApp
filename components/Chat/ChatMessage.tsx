import * as React from "react";
import { View, Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";
import { Button } from "~/components/ui/button";
import { Routine, WorkoutSession, AssistantChatMessage, UserChatMessage as UserChatMessageType } from "~/lib/types";
import { ChatMessage as ChatMessageType } from "~/lib/types";
import { CircleX } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { RefreshCw, Trash2 } from "~/lib/icons/Icons";
import ChatAudioMessage from "./ChatAudioMessage";

type MessageTimestampProps = {
  timestamp: Date;
};

const MessageTimestamp = ({ timestamp }: MessageTimestampProps) => (
  <Text className="text-xs text-muted-foreground">
    {timestamp.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </Text>
);

type UserChatMessageProps = {
  message: UserChatMessageType;
  showWorkoutSessionLog: (workoutSession: WorkoutSession) => void;
  deleteMessage: () => void;
  resendMessage: () => void;
};

const UserChatMessage = React.memo<UserChatMessageProps>(
  ({ message, showWorkoutSessionLog, deleteMessage, resendMessage }) => {
    const { audioUrl, workoutSession, images } = message;

    return (
      <Animated.View entering={FadeInUp.duration(300).springify()} className="flex-row justify-end mb-4">
        <View className="flex-row max-w-[85%]">
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
              <Card className="bg-primary border-0 shadow-sm p-4">
                {audioUrl ? (
                  <ChatAudioMessage audioUrl={audioUrl} />
                ) : (
                  <View className="flex-col">
                    <View className="flex-row flex-wrap items-end justify-end gap-x-2">
                      <Text className="text-primary-foreground">{message.message}</Text>
                    </View>

                    {workoutSession && (
                      <Button
                        variant="secondary"
                        className="mt-2"
                        onPress={() => showWorkoutSessionLog(workoutSession)}
                      >
                        <Text>Workout ansehen</Text>
                      </Button>
                    )}
                  </View>
                )}
              </Card>
              {message.status === "failed" && (
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
  }
);

UserChatMessage.displayName = "UserChatMessage";

type AiChatMessageProps = {
  message: AssistantChatMessage;
  showRoutine: (routine: Routine) => void;
};

const AiChatMessage = React.memo<AiChatMessageProps>(({ message, showRoutine }) => {
  const timestamp = new Date(message.createdAt);
  const { routine } = message;

  return (
    <Animated.View entering={FadeInUp.duration(300).springify()} className="flex-row justify-start mb-4">
      <View className="flex-row max-w-[85%]">
        <View className="mr-2 justify-start">
          <MessageAvatar isAI={true} />
          <MessageTimestamp timestamp={timestamp} />
        </View>
        <View className="gap-y-1">
          <View className="flex-row justify-end items-center">
            <Card className="bg-secondary/30 border-0 shadow-sm p-4">
              <View className="flex-col">
                <View className="flex-row flex-wrap items-end justify-end gap-x-2">
                  <Text className="text-foreground">{message.message}</Text>
                </View>

                {routine && (
                  <Button variant="secondary" className="mt-2" onPress={() => showRoutine(routine)} haptics="medium">
                    <Text>Routine ansehen</Text>
                  </Button>
                )}
              </View>
            </Card>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

AiChatMessage.displayName = "AiChatMessage";

export const ChatMessage = React.memo<{
  message: ChatMessageType;
  showRoutine: (routine: Routine) => void;
  showWorkoutSessionLog: (workoutSession: WorkoutSession) => void;
  deleteMessage: () => void;
  resendMessage: () => void;
}>(({ message, showRoutine, showWorkoutSessionLog, deleteMessage, resendMessage }) => {
  if (message.role === "assistant") {
    return <AiChatMessage message={message} showRoutine={showRoutine} />;
  } else {
    return (
      <UserChatMessage
        message={message}
        showWorkoutSessionLog={showWorkoutSessionLog}
        deleteMessage={deleteMessage}
        resendMessage={resendMessage}
      />
    );
  }
});

ChatMessage.displayName = "ChatMessage";
