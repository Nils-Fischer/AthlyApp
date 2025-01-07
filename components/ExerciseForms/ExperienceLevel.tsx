import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Difficulty } from "~/lib/types";
import { cn } from "~/lib/utils";
import { Baby, UserCircle, Trophy } from "~/lib/icons/Icons";

interface ExperienceLevelProps {
  difficulty: Difficulty | null;
  onDifficultyChange: (difficulty: Difficulty | null) => void;
}

export function ExperienceLevel({ difficulty, onDifficultyChange }: ExperienceLevelProps) {
  const options = [
    {
      value: Difficulty.Beginner,
      title: "Anfänger",
      description: "Weniger als 1 Jahr",
      icon: Baby,
    },
    {
      value: Difficulty.Intermediate,
      title: "Fortgeschritten",
      description: "1-3 Jahre",
      icon: UserCircle,
    },
    {
      value: Difficulty.Advanced,
      title: "Experte",
      description: "Mehr als 3 Jahre",
      icon: Trophy,
    },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold">Wie viel Erfahrung hast du mit Training?</Text>
      <Text className="text-base text-muted-foreground mb-6">Hilft uns deinen Trainingsplan optimal anzupassen.</Text>
      <View className="gap-4 w-full">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={difficulty === option.value ? "default" : "ghost"}
            size="lg"
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-between",
              difficulty === option.value && "bg-primary"
            )}
            onPress={() => onDifficultyChange(option.value)}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <option.icon
                size={24}
                className={cn("text-foreground", difficulty === option.value && "text-primary-foreground")}
              />
              <View className="flex-1 gap-0 mr-3">
                <Text className={cn("font-semibold", difficulty === option.value && "text-primary-foreground")}>
                  {option.title}
                </Text>
                <Text
                  className={cn(
                    "text-sm text-muted-foreground",
                    difficulty === option.value && "text-primary-foreground/70"
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
