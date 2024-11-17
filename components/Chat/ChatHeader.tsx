import * as React from "react";
import { View } from "react-native";
import { H1 } from "~/components/ui/typography";

export const ChatHeader: React.FC = () => (
  <View className="p-4 border-b border-border">
    <H1 className="text-xl">AI Personal Trainer</H1>
  </View>
);