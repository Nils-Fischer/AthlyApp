import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
    >
      <View className="flex-row gap-3 px-4">
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => onSelectCategory(category)}
          >
            <View className={`px-4 py-2 rounded-full ${
              selectedCategory === category 
                ? 'bg-primary' 
                : 'bg-muted border border-border/50'
            }`}>
              <Text className={`text-sm font-medium ${
                selectedCategory === category 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};