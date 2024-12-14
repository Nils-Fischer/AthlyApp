import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Routine } from "~/lib/types";
import { RoutineCard } from "../Routine/RoutineCard";
import Animated, { FadeInDown } from "react-native-reanimated";
import { generateId } from "~/lib/utils";

const TRAINING_SPLITS: Record<number, Routine[]> = {
  1: [
    {
      id: generateId(),
      name: "Ganzkörper-Training",
      description: "Maximale Effizienz in einer Session",
      workouts: [],
      frequency: 1,
      active: false,
    },
  ],
  2: [
    {
      id: generateId(),
      name: "Push Pull Legs Split",
      description: "Der Klassiker für gezielte Muskelentwicklung",
      workouts: [],
      frequency: 3,
      active: false,
    },
    {
      id: generateId(),
      name: "Ganzkörper 2x Split",
      description: "Optimale Trainingsfrequenz für konstante Fortschritte",
      workouts: [],
      frequency: 2,
      active: false,
    },
    {
      id: generateId(),
      name: "Upper/Lower Split",
      description: "Effektive Aufteilung für gezielten Muskelaufbau",
      workouts: [],
      frequency: 3,
      active: false,
    },
  ],
  3: [
    {
      id: generateId(),
      name: "Upper/Lower 4-Tage Split",
      description: "Intensive Trainingsfrequenz für maximale Resultate",
      workouts: [],
      frequency: 4,
      active: false,
    },
    {
      id: generateId(),
      name: "5-Tage Power Split",
      description: "Fortgeschrittenes Training für maximale Intensität",
      workouts: [],
      frequency: 5,
      active: false,
    },
    {
      id: generateId(),
      name: "Push Pull Legs 2x",
      description: "Maximales Trainingsvolumen für optimale Ergebnisse",
      workouts: [],
      frequency: 6,
      active: false,
    },
  ],
};

interface AnimatedRoutineCardProps {
  index: number;
  routine: Routine;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const AnimatedRoutineCard = ({ index, routine, isSelected, onSelect }: AnimatedRoutineCardProps) => {
  const enteringAnimation = FadeInDown.delay(index * 500)
    .springify()
    .damping(12)
    .stiffness(80);

  return (
    <Animated.View entering={enteringAnimation}>
      <RoutineCard
        onPress={() => onSelect(routine.id)}
        routine={{
          ...routine,
          active: isSelected,
        }}
        onToggleActive={() => onSelect(routine.id)}
        showDropdown={false}
      />
    </Animated.View>
  );
};

interface RoutinePreviewProps {
  frequency: number;
  selectedRoutine: number | null;
  onRoutineSelect: (routineId: number) => void;
}

export function RoutinePreview({ frequency, selectedRoutine, onRoutineSelect }: RoutinePreviewProps) {
  const availableRoutines = TRAINING_SPLITS[frequency] || [];

  return (
    <View className="flex-1">
      <Animated.View className="px-4" entering={FadeInDown.duration(1000).springify()}>
        <Text className="text-2xl font-bold mb-2">Wähle dein Trainingsprogramm</Text>
        <Text className="text-base text-muted-foreground mb-6">Basierend auf deiner gewählten Trainingsfrequenz</Text>
      </Animated.View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="gap-4">
          {availableRoutines.map((routine, index) => (
            <AnimatedRoutineCard
              key={routine.id}
              index={index}
              routine={routine}
              isSelected={selectedRoutine === routine.id}
              onSelect={onRoutineSelect}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
