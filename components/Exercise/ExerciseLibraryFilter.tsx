import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { MuscleGroup } from "~/lib/types";
import * as Haptics from "expo-haptics";

interface CategoryFilterProps {
  categories: (MuscleGroup | "all")[];
  selectedCategory: MuscleGroup | "all";
  onSelectCategory: (category: MuscleGroup | "all") => void;
}

export const ExerciseLibraryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
      <View className="flex-row gap-3">
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => {
              onSelectCategory(category);
              Haptics.selectionAsync();
            }}
          >
            <View
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category ? "bg-primary" : "bg-muted border border-border/50"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};
