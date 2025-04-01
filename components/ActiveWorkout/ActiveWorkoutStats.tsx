import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Timer, Dumbbell, CheckSquare } from "~/lib/icons/Icons";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { cn } from "~/lib/utils";

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
    <Card className="p-4 mt-4 mx-4">
      <View className="flex-column gap-4 items-center">
        <Progress
          className={cn("h-1 w-[95%]", remainingExercises === 0 && "bg-success")}
          value={(completedExercises / (remainingExercises + completedExercises)) * 100}
        />
        <View className="flex-row justify-between">
          <StatItem
            icon={<Dumbbell size={20} className="text-primary" />}
            value={`${totalVolume} kg`}
            label="Gesamtvolumen"
          />
          <StatItem
            icon={<Timer size={20} className="text-primary" />}
            value={formatTime(elapsedTime / 1000)}
            label="Trainingszeit"
          />
          <StatItem
            icon={<CheckSquare size={20} className="text-primary" />}
            value={`${completedExercises} / ${remainingExercises + completedExercises}`}
            label="Abgeschlossen"
          />
        </View>
      </View>
    </Card>
  );
}
