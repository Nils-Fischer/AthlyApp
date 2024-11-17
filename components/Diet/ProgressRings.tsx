import * as React from "react";
import { View } from "react-native";
import { ProgressRing } from "./ProgressRing";
import { NutritionProgress } from "~/lib/types";

interface ProgressRingsProps {
  progress: NutritionProgress;
}

const calculateProgress = (current: number, goal: number) => {
  return Math.round((current / goal) * 100);
};

export const ProgressRings = React.memo<ProgressRingsProps>(({ progress }) => (
  <View className="flex-row justify-between mb-6">
    <ProgressRing
      progress={calculateProgress(progress.consumed.calories, progress.goals.calories)}
      size={120}
      strokeWidth={12}
      label="Kalorien"
      value={`${progress.consumed.calories}`}
    />
    <ProgressRing
      progress={calculateProgress(progress.consumed.protein, progress.goals.protein)}
      size={120}
      strokeWidth={12}
      label="Protein"
      value={`${progress.consumed.protein}g`}
    />
    <ProgressRing
      progress={calculateProgress(progress.consumed.carbs, progress.goals.carbs)}
      size={120}
      strokeWidth={12}
      label="Carbs"
      value={`${progress.consumed.carbs}g`}
    />
  </View>
));

ProgressRings.displayName = "ProgressRings";