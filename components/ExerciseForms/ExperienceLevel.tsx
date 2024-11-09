// components/ExperienceLevel.tsx
import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SignalZero, SignalMedium, SignalLow } from "~/lib/icons/Icons";
import { Level } from "~/lib/types";
import { cn } from "~/lib/utils";

interface ExperienceLevelProps {
  level: Level | null;
  onLevelChange: (level: Level | null) => void;
}

export function ExperienceLevel({
  level,
  onLevelChange,
}: ExperienceLevelProps) {
  const toggleLevel = (newLevel: Level) => {
    onLevelChange(newLevel === level ? null : newLevel);
  };

  const options = [
    {
      level: Level.Beginner,
      title: "Anfänger",
      description:
        "You've been training for less than a year or are just starting.",
      stats: "Basic Training • Focus on Technique",
      icon: SignalZero,
    },
    {
      level: Level.Intermediate,
      title: "Fortgeschritten",
      description:
        "You've been training regularly for 1-3 years and know the basic exercises.",
      stats: "Advanced Training • Focus on Progression",
      icon: SignalLow,
    },
    {
      level: Level.Expert,
      title: "Experte",
      description:
        "You've been training consistently for 3+ years and know your limits well.",
      stats: "Specialized Training • Focus on Optimization",
      icon: SignalMedium,
    },
  ];

  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold mb-4">Wie erfahren bist du?</Text>
      <View className="gap-4">
        {options.map((option) => (
          <Button
            key={option.level}
            variant={level === option.level ? "default" : "secondary"}
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-start gap-3",
              level === option.level && "bg-primary"
            )}
            onPress={() => toggleLevel(option.level)}
          >
            <option.icon
              size={28}
              className={cn(
                "text-foreground",
                level === option.level && "text-primary-foreground"
              )}
            />
            <Text
              className={cn(
                "text-foreground",
                level === option.level && "text-primary-foreground"
              )}
            >
              {option.title}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
}
