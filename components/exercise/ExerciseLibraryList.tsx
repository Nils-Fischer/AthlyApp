import React from "react";
import { ScrollView, View } from "react-native";
import { Exercise } from "~/lib/types";
import { ExerciseOverviewCard } from "~/components/Exercise/ExerciseOverviewCard";
import { Text } from "~/components/ui/text";

interface ExerciseListProps {
  exercises: Exercise[];
  onPress?: (exerciseId: number) => void;
}

export const ExerciseLibraryList = ({ exercises, onPress }: ExerciseListProps) => {
  if (exercises.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground text-center">Keine Übungen gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 20,
      }}
    >
      <View className="gap-3">
        {exercises.map((exercise) => (
          <ExerciseOverviewCard key={exercise.id} exercise={exercise} onPress={onPress} />
        ))}
      </View>
    </ScrollView>
  );
};
