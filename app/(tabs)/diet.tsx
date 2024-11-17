import * as React from "react";
import { View } from "react-native";
import DietInterface from "~/components/Diet/DietInterface";

export default function Screen() {
  return (
    <View className="flex-1">
      <DietInterface />
    </View>
  );
}
