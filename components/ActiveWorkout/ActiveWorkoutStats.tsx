import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Timer, Dumbbell, CheckSquare } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";

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

export function ActiveWorkoutStats() {
  const { isStarted, isPaused, elapsedTime, getCurrentStats } = useActiveWorkoutStore();
  const stats = getCurrentStats();

  return (
    <View className="px-4 py-3">
      <Card className={cn("bg-card border-border", isStarted && "bg-card/95 backdrop-blur-sm")}>
        <View className="flex-row justify-between p-4">
          <StatItem
            icon={<Dumbbell size={20} className="text-primary" />}
            value={`${stats.totalVolume}kg`}
            label="Total Volume"
          />
          <StatItem
            icon={<Timer size={20} className="text-primary" />}
            value={formatTime(elapsedTime / 1000)}
            label="Workout Time"
          />
          <StatItem
            icon={<CheckSquare size={20} className="text-primary" />}
            value={stats.completedExercises}
            label="Completed"
          />
        </View>
      </Card>
    </View>
  );
}
