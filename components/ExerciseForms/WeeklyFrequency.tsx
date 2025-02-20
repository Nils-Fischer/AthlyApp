import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Activity, CalendarCheck, Trophy } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";

interface WeeklyFrequencyProps {
  frequency: 1 | 2 | 3 | null;
  onFrequencyChange: (frequency: 1 | 2 | 3) => void;
}

export function WeeklyFrequency({ frequency, onFrequencyChange }: WeeklyFrequencyProps) {
  const options = [
    {
      value: 1,
      title: "Einstiegstraining",
      description: "Perfekt für Einsteiger oder zur Aufrechterhaltung",
      icon: Activity,
      stats: "Grundlegende Routine • Fokus auf Ganzkörperübungen",
      range: "1x pro Woche",
    },
    {
      value: 2,
      title: "Regelmäßiges Training",
      description: "Ideal für konstanten Fortschritt und ausgewogenes Training",
      icon: CalendarCheck,
      stats: "Ausgewogene Routine • Fokus auf Hauptmuskelgruppen",
      range: "2-3x pro Woche",
    },
    {
      value: 3,
      title: "Häufiges Training",
      description: "Für fortgeschrittene Athleten mit hoher Trainingsbereitschaft",
      icon: Trophy,
      stats: "Intensive Routine • Fokus auf einzelne Muskeln",
      range: "4+ pro Woche",
    },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold">Wie oft möchtest du pro Woche trainieren?</Text>
      <Text className="text-base text-muted-foreground mb-6">Wähle eine für dich realistische Frequenz.</Text>
      <View className="gap-4 w-full">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={frequency === option.value ? "default" : "ghost"}
            size="lg"
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-between",
              frequency === option.value && "bg-primary"
            )}
            onPress={() => onFrequencyChange(option.value as 1 | 2 | 3)}
            haptics={frequency === option.value ? "success" : "light"}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <option.icon
                size={24}
                className={cn("text-foreground", frequency === option.value && "text-primary-foreground")}
              />
              <View className="flex-1 gap-0 mr-3">
                <View className="flex-row items-center gap-2">
                  <Text className={cn("font-semibold", frequency === option.value && "text-primary-foreground")}>
                    {option.title}
                  </Text>
                </View>
                <Text
                  className={cn(
                    "text-sm text-muted-foreground",
                    frequency === option.value && "text-primary-foreground/70"
                  )}
                  numberOfLines={2}
                >
                  {option.range}
                </Text>
              </View>
            </View>
          </Button>
        ))}
      </View>
    </View>
  );
}
