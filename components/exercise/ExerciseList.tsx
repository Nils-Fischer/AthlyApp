// TrainTechApp/components/exercise/ExerciseList.tsx
import React from "react";
import { ScrollView, View } from "react-native";
import { Exercise } from "~/lib/types";
import { ExerciseCard } from "./ExerciseCard";
import { Text } from "~/components/ui/text"; // Add this import

interface ExerciseListProps {
  exercises: Exercise[];
}

export const ExerciseList = ({ exercises }: ExerciseListProps) => {
  // Add the check right at the start of the component
  if (exercises.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-muted-foreground text-center">
          Keine Übungen gefunden
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="gap-3">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </View>
    </ScrollView>
  );
};