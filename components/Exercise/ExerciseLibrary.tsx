import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { useExerciseStore } from "~/stores/exerciseStore";
import { ExerciseLibraryFilter } from "~/components/Exercise/ExerciseLibraryFilter";
import { ExerciseLibraryList } from "~/components/Exercise/ExerciseLibraryList";
import { Search } from "~/lib/icons/Icons";
import { getMuscleGroup } from "~/lib/utils";
import { MuscleGroup } from "~/lib/types";

interface ExerciseLibraryProps {
  onPress?: (exerciseId: number) => void;
}

export const ExerciseLibrary = ({ onPress }: ExerciseLibraryProps) => {
  const { exercises, isLoading } = useExerciseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | "all">("all");
  const categories: (MuscleGroup | "all")[] = ["all", ...Object.values(MuscleGroup)];

  const filteredExercises = useMemo(() => {
    return (
      exercises?.filter((exercise) => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          exercise.primaryMuscles.map(getMuscleGroup).includes(selectedCategory as MuscleGroup);
        return matchesSearch && matchesCategory;
      }) ?? []
    );
  }, [exercises, searchQuery, selectedCategory]);

  return (
    <View className="flex-1 px-4">
      <View className="space-y-3">
        <Input
          placeholder="Übung suchen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          startContent={<Search size={20} className="text-muted-foreground" />}
        />

        <ExerciseLibraryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      <View className="flex-1 mt-4">
        {isLoading ? (
          <View className="space-y-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </View>
        ) : (
          <ExerciseLibraryList exercises={filteredExercises} onPress={onPress} />
        )}
      </View>
    </View>
  );
};
