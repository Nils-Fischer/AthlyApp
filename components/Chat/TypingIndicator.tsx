import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { MessageAvatar } from "./MessageAvatar";

export const TypingIndicator = React.memo(() => (
  <Animated.View entering={FadeInUp.duration(300).springify()} className="flex-row justify-start mb-4">
    <View className="flex-row max-w-[85%]">
      <View className="mr-2 justify-start">
        <MessageAvatar isAI={true} />
      </View>
      <View className="flex-row justify-end items-center">
        <Card className="bg-secondary/30 border-0 shadow-sm p-4">
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" />
            <Text className="text-sm text-muted-foreground">schreibt...</Text>
          </View>
        </Card>
      </View>
    </View>
  </Animated.View>
));

TypingIndicator.displayName = "TypingIndicator";
