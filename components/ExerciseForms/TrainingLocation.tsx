import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Building,
  Clock,
  Dumbbell,
  Home,
  Shield,
  Timer,
  Users,
} from "~/lib/icons/Icons";
import { LocationType } from "~/lib/types";
import { cn } from "~/lib/utils";

interface TrainingLocationProps {
  location: LocationType | null;
  onLocationChange: (location: LocationType) => void;
}

export function TrainingLocation({
  location,
  onLocationChange,
}: TrainingLocationProps) {
  const locations = [
    {
      value: LocationType.Home,
      title: "Zuhause",
      description: "Flexibles Training ohne Equipment",
      icon: Home,
      benefits: [
        {
          text: "Keine Anfahrt nötig",
          icon: Clock,
        },
        {
          text: "Maximale Flexibilität",
          icon: Timer,
        },
        {
          text: "Privatsphäre",
          icon: Shield,
        },
      ],
      stats: "Perfekt für flexibles Training von Zuhause oder im Park",
    },
    {
      value: LocationType.Gym,
      title: "Fitnessstudio",
      description: "Professionelles Equipment",
      icon: Building,
      benefits: [
        {
          text: "Vielfältiges Equipment",
          icon: Dumbbell,
        },
        {
          text: "Community & Support",
          icon: Users,
        },
        {
          text: "Professionelle Umgebung",
          icon: Shield,
        },
      ],
      stats: "Ideal bei bestehender oder geplanter Gym-Mitgliedschaft",
    },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold mb-6">
        Wo möchtest du trainieren?
      </Text>
      <View className="gap-4 w-full">
        {locations.map((loc) => (
          <Button
            key={loc.value}
            variant={location === loc.value ? "default" : "ghost"}
            size="lg"
            className={cn(
              "w-full h-auto p-4 flex-row items-center justify-between",
              location === loc.value && "bg-primary"
            )}
            onPress={() => onLocationChange(loc.value)}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <loc.icon
                size={24}
                className={cn(
                  "text-foreground",
                  location === loc.value && "text-primary-foreground"
                )}
              />
              <View className="flex-1 gap-0 mr-3">
                <Text
                  className={cn(
                    "font-semibold",
                    location === loc.value && "text-primary-foreground"
                  )}
                >
                  {loc.title}
                </Text>
                <Text
                  className={cn(
                    "text-sm text-muted-foreground",
                    location === loc.value && "text-primary-foreground/70"
                  )}
                  numberOfLines={2}
                >
                  {loc.description}
                </Text>
              </View>
            </View>
          </Button>
        ))}
      </View>
    </View>
  );
}
