import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Clock, Hourglass, Timer } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";

interface TrainingDurationProps {
  duration: number | null;
  onDurationChange: (duration: number) => void;
}

export function TrainingDuration({
  duration,
  onDurationChange,
}: TrainingDurationProps) {
  const options = [
    {
      value: 45,
      title: "Kurz",
      description: "Ideal für ein effektives und zeitsparendes Workout",
      icon: Hourglass,
      stats: "Effizientes Training • Fokus auf Hauptübungen",
      range: "30-60 Minuten",
    },
    {
      value: 60,
      title: "Normal",
      description: "Ausgewogene Zeit für ein vollständiges Training",
      icon: Clock,
      stats: "Optimale Balance • Zeit für Warm-up & Cool-down",
      range: "60-90 Minuten",
    },
    {
      value: 90,
      title: "Lang",
      description: "Ausführliches Training mit Raum für Zusatzübungen",
      icon: Timer,
      stats: "Umfangreiches Training • Zeit für Details",
      range: "90-120 Minuten",
    },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold mb-6">
        Wie lange möchtest du trainieren?
      </Text>
      <View className="gap-4 w-full">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={duration === option.value ? "default" : "ghost"}
            size="lg"
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-between",
              duration === option.value && "bg-primary"
            )}
            onPress={() => onDurationChange(option.value)}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <option.icon
                size={24}
                className={cn(
                  "text-foreground",
                  duration === option.value && "text-primary-foreground"
                )}
              />
              <View className="flex-1 gap-0 mr-3">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={cn(
                      "font-semibold",
                      duration === option.value && "text-primary-foreground"
                    )}
                  >
                    {option.title}
                  </Text>
                </View>
                <Text
                  className={cn(
                    "text-sm text-muted-foreground",
                    duration === option.value && "text-primary-foreground/70"
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
