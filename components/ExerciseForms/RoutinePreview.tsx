import React, { useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Difficulty, Routine, TrainingGoal } from "~/lib/types";
import { RoutineCard } from "../Routine/RoutineCard";
import Animated, { FadeInDown } from "react-native-reanimated";
import { generateId } from "~/lib/utils";
import {
  createFullBodyWorkout,
  createLegsWorkout,
  createPullWorkout,
  createPushWorkout,
  createUpperBodyWorkout,
} from "~/lib/generateWorkouts";

export function createPreviewRoutines(
  frequency: 1 | 2 | 3,
  duration: 45 | 60 | 90,
  goal: TrainingGoal,
  difficulty: Difficulty
) {
  switch (frequency) {
    case 1:
      return [
        {
          id: generateId(),
          name: "Ganzkörper-Training",
          description: "Maximale Effizienz in einer Session",
          workouts: [createFullBodyWorkout(duration, goal, difficulty)],
          frequency: 1,
          active: false,
        },
      ];
    case 2:
      return [
        {
          id: generateId(),
          name: "Push Pull Legs Split",
          description: "Der Klassiker für gezielte Muskelentwicklung",
          workouts: [
            createPushWorkout(duration, goal, difficulty),
            createPullWorkout(duration, goal, difficulty),
            createLegsWorkout(duration, goal, difficulty),
          ],
          frequency: 3,
          active: false,
        },
        {
          id: generateId(),
          name: "Ganzkörper 2x Split",
          description: "Optimale Trainingsfrequenz für konstante Fortschritte",
          workouts: [createFullBodyWorkout(duration, goal, difficulty)],
          frequency: 2,
          active: false,
        },
        {
          id: generateId(),
          name: "Upper/Lower Split",
          description: "Effektive Aufteilung für gezielten Muskelaufbau",
          workouts: [createUpperBodyWorkout(duration, goal, difficulty), createLegsWorkout(duration, goal, difficulty)],
          frequency: 3,
          active: false,
        },
      ];
    case 3:
      return [
        {
          id: generateId(),
          name: "Upper/Lower 4-Tage Split",
          description: "Intensive Trainingsfrequenz für maximale Resultate",
          workouts: [createUpperBodyWorkout(duration, goal, difficulty), createLegsWorkout(duration, goal, difficulty)],
          frequency: 4,
          active: false,
        },
        {
          id: generateId(),
          name: "5-Tage Power Split",
          description: "Fortgeschrittenes Training für maximale Intensität",
          workouts: [
            createUpperBodyWorkout(duration, goal, difficulty),
            { ...createLegsWorkout(duration, goal, difficulty), name: "Beine #1" },
            createPullWorkout(duration, goal, difficulty),
            createPushWorkout(duration, goal, difficulty),
            { ...createLegsWorkout(duration, goal, difficulty), name: "Beine #2" },
          ],
          frequency: 5,
          active: false,
        },
        {
          id: generateId(),
          name: "Push Pull Legs 2x",
          description: "Maximales Trainingsvolumen für optimale Ergebnisse",
          workouts: [
            createPushWorkout(duration, goal, difficulty),
            createPullWorkout(duration, goal, difficulty),
            createLegsWorkout(duration, goal, difficulty),
          ],
          frequency: 6,
          active: false,
        },
      ];
  }
}

interface AnimatedRoutineCardProps {
  index: number;
  routine: Routine;
  isSelected: boolean;
  onSelect: (id: string) => void;
  shouldAnimate: boolean;
}

const AnimatedRoutineCard = ({ index, routine, isSelected, onSelect, shouldAnimate }: AnimatedRoutineCardProps) => {
  const enteringAnimation = shouldAnimate
    ? FadeInDown.delay(index * 500)
        .springify()
        .damping(12)
        .stiffness(80)
    : undefined;

  useEffect(() => {
    console.log("active", isSelected);
  }, [isSelected]);

  return (
    <Animated.View entering={enteringAnimation}>
      <RoutineCard
        onPress={() => onSelect(routine.id)}
        routine={{
          ...routine,
          active: isSelected,
        }}
        showActive={isSelected}
      />
    </Animated.View>
  );
};

interface RoutinePreviewProps {
  availableRoutines: Routine[];
  selectedRoutine: Routine | null;
  onRoutineSelect: (routine: Routine) => void;
}

export function RoutinePreview({ availableRoutines, selectedRoutine, onRoutineSelect }: RoutinePreviewProps) {
  const initialRenderRef = useRef(true);

  const shouldAnimate = initialRenderRef.current;

  if (initialRenderRef.current) {
    initialRenderRef.current = false;
  }

  return (
    <View className="flex-1">
      <Animated.View className="px-4" entering={shouldAnimate ? FadeInDown.duration(1000).springify() : undefined}>
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
              isSelected={selectedRoutine?.id === routine.id}
              onSelect={() => onRoutineSelect(routine)}
              shouldAnimate={shouldAnimate}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
