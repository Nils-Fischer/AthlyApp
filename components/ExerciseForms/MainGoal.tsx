import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { TrainingGoal } from "~/lib/types";
import { Dumbbell, Timer, Zap } from "~/lib/icons/Icons";

interface MainGoalProps {
  goal: TrainingGoal | null;
  onGoalChange: (goal: TrainingGoal) => void;
}

export function MainGoal({ goal, onGoalChange }: MainGoalProps) {
  const mainGoals = [
    {
      value: TrainingGoal.Strength,
      title: "Kraft",
      description: "Maximale Kraftentwicklung",
      icon: Zap,
      stats: "Schweres Gewicht • 4-8 Wiederholungen",
    },
    {
      value: TrainingGoal.Hypertrophy,
      title: "Muskeln",
      description: "Fokus auf Muskelaufbau",
      icon: Dumbbell,
      stats: "Moderates Gewicht • 8-12 Wiederholungen",
    },
    {
      value: TrainingGoal.Endurance,
      title: "Ausdauer",
      description: "Förderung der Muskelausdauer",
      icon: Timer,
      stats: "Leichtes Gewicht • 12+ Wiederholungen",
    },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold">Was ist dein Ziel?</Text>
      <Text className="text-base text-muted-foreground mb-6">
        Wähle deinen primären Fokus für dein Training.
      </Text>
      <View className="gap-4 w-full">
        {mainGoals.map((option) => (
          <Button
            key={option.value}
            variant={goal === option.value ? "default" : "ghost"}
            size="lg"
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-between",
              goal === option.value && "bg-primary"
            )}
            onPress={() => onGoalChange(option.value)}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <option.icon
                size={24}
                className={cn(
                  "text-foreground",
                  goal === option.value && "text-primary-foreground"
                )}
              />
              <View className="flex-1 gap-0 mr-3">
                <Text
                  className={cn(
                    "font-semibold",
                    goal === option.value && "text-primary-foreground"
                  )}
                >
                  {option.title}
                </Text>
                <Text
                  className={cn(
                    "text-sm text-muted-foreground",
                    goal === option.value && "text-primary-foreground/70"
                  )}
                  numberOfLines={2}
                >
                  {option.description}
                </Text>
              </View>
            </View>
          </Button>
        ))}
      </View>
    </View>
  );
}
