import * as React from "react";
import { View } from "react-native";
import { WorkoutForm } from "~/components/ExerciseForms/Form";
import { H1 } from "~/components/ui/typography";

export default function Screen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <WorkoutForm />
    </View>
  );
}
