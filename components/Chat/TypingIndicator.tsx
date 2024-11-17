import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Card } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { MessageAvatar } from "./MessageAvatar";

export const TypingIndicator = React.memo(() => (
  <View className="flex-row items-center gap-2 ml-4 mb-4">
    <MessageAvatar isAI={true} />
    <Card className="bg-secondary/30 border-0">
      <View className="px-4 py-2.5 flex-row items-center gap-2">
        <ActivityIndicator size="small" />
        <P className="text-sm text-muted-foreground">schreibt...</P>
      </View>
    </Card>
  </View>
));

TypingIndicator.displayName = "TypingIndicator";
