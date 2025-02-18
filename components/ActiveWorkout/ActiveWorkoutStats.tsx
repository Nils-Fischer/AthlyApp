import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Timer, Dumbbell, CheckSquare } from "~/lib/icons/Icons";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatItem = ({ icon, value, label }: StatItemProps) => (
  <View className="items-center flex-1">
    <View className="mb-1">{icon}</View>
    <Text className="text-lg font-medium text-foreground">{value}</Text>
    <Text className="text-xs text-muted-foreground">{label}</Text>
  </View>
);

const formatTime = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function ActiveWorkoutStats({
  elapsedTime,
  completedExercises,
  remainingExercises,
  totalVolume,
}: {
  elapsedTime: number;
  completedExercises: number;
  remainingExercises: number;
  totalVolume: number;
}) {
  return (
    <View className="px-4 pt-3">
      <View className="backdrop-blur-lg">
        <View className="flex-row justify-between">
          <StatItem
            icon={<Dumbbell size={20} className="text-primary" />}
            value={`${totalVolume}kg`}
            label="Gesamtvolumen"
          />
          <StatItem
            icon={<Timer size={20} className="text-primary" />}
            value={formatTime(elapsedTime / 1000)}
            label="Trainingszeit"
          />
          <StatItem
            icon={<CheckSquare size={20} className="text-primary" />}
            value={completedExercises}
            label="Abgeschlossen"
          />
        </View>
        <View className="h-[1px] bg-border mt-3" />
      </View>
    </View>
  );
}
