import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react-native";
import { useExerciseStore } from "~/stores/exerciseStore";
import { CategoryFilter } from "./CategoryFilter";
import { ExerciseList } from "./ExerciseList";

export const ExerciseLibrary = () => {
    const { exercises, isLoading } = useExerciseStore();
    const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const uniqueCategories = ["all", ...new Set(exercises.map(ex => ex.category))];
    return uniqueCategories;
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);
  

  return (
    <View className="flex-1 px-4">
      <View className="mb-4">
        <Input
          placeholder="Übung suchen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          startContent={<Search size={20} className="text-muted-foreground" />}
        />
      </View>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
     {isLoading ? (
        // Loading skeleton
        <View className="gap-4">
          {[1, 2, 3].map((i) => (
            <View 
              key={i} 
              className="h-24 bg-muted/50 rounded-xl animate-pulse"
            />
          ))}
        </View>
      ) : (
        <ExerciseList exercises={filteredExercises} />
      )}
    </View>
  );
};