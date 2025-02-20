// components/AdditionalGoals.tsx
import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Brain,
  CalendarCheck,
  Clock,
  Heart,
  Mountain,
  Move,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Weight,
  Zap,
} from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";

interface AdditionalGoalsProps {
  selectedGoals: string[];
  onGoalToggle: (goal: string) => void;
}

export function AdditionalGoals({ selectedGoals, onGoalToggle }: AdditionalGoalsProps) {
  const goals = [
    { id: "athletic", label: "Athletischer werden", icon: Zap },
    { id: "weight", label: "Abnehmen", icon: Weight },
    { id: "health", label: "Gesundheit verbessern", icon: Heart },
    { id: "consistency", label: "Konstant bleiben", icon: CalendarCheck },
    { id: "aging", label: "Gesund altern", icon: Clock },
    { id: "mobility", label: "Beweglichker werden", icon: Move },
    { id: "definition", label: "Muskeldefinition", icon: Target },
    { id: "stress", label: "Stress abbauen", icon: Brain },
    { id: "confidence", label: "Selbstbewusstsein steigern", icon: Sparkles },
    { id: "plateaus", label: "Plateaus überwinden", icon: Mountain },
    { id: "competition", label: "Wettkampf", icon: Trophy },
    { id: "injury", label: "Verletzungsprävention", icon: Shield },
  ];

  return (
    <View className="flex-1 w-full px-4 min-w-[350]">
      <Text className="text-2xl font-bold">Weitere Ziele</Text>
      <Text className="text-base text-muted-foreground mb-6">Wähle weitere Ziele, die auf dich zutreffen.</Text>
      <View className="flex-row flex-wrap gap-3">
        {goals.map((goal) => (
          <Button
            key={goal.id}
            variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
            size="sm"
            className={cn("flex-row items-center gap-2", selectedGoals.includes(goal.id) && "bg-primary")}
            onPress={() => onGoalToggle(goal.id)}
            haptics={selectedGoals.includes(goal.id) ? "success" : "light"}
          >
            <goal.icon
              size={16}
              className={cn("text-foreground", selectedGoals.includes(goal.id) && "text-primary-foreground")}
            />
            <Text className={cn("text-sm", selectedGoals.includes(goal.id) && "text-primary-foreground")}>
              {goal.label}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
}
