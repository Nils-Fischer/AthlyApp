import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Exercise } from "~/lib/types";
import { ExerciseOverviewCard } from "~/components/Exercise/ExerciseOverviewCard";
import { Text } from "~/components/ui/text";

interface ExerciseListProps {
  exercises: Exercise[];
  onPress?: (exercise: Exercise) => void;
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
    <FlashList
      data={exercises.sort((a, b) => a.name.localeCompare(b.name))}
      renderItem={({ item }) => <ExerciseOverviewCard exercise={item} onPress={onPress} />}
      keyExtractor={(item) => item.id.toString()}
      estimatedItemSize={150}
      showsVerticalScrollIndicator={false}
    />
  );
};
