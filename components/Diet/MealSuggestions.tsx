// TrainTechApp/components/Diet/MealSuggestions.tsx
import React, { useState } from "react";
import { View, ScrollView, Pressable, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react-native";

interface MealSuggestion {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  description: string;
}

const MEAL_SUGGESTIONS: MealSuggestion[] = [
  {
    id: "1",
    name: "Protein Pancakes",
    category: "Frühstück",
    calories: 420,
    protein: 35,
    carbs: 45,
    fat: 12,
    image: "/api/placeholder/200/200",
    description: "Fluffige Pancakes mit hohem Proteingehalt, perfekt für den Muskelaufbau."
  },
  {
    id: "2",
    name: "Quinoa Bowl",
    category: "Mittagessen",
    calories: 550,
    protein: 25,
    carbs: 65,
    fat: 20,
    image: "/api/placeholder/200/200",
    description: "Nährstoffreiche Bowl mit Quinoa, Gemüse und Hühnchen."
  },
  {
    id: "3",
    name: "Protein Smoothie",
    category: "Snack",
    calories: 280,
    protein: 30,
    carbs: 35,
    fat: 5,
    image: "/api/placeholder/200/200",
    description: "Erfrischender Smoothie mit Whey Protein, Banane und Beeren."
  },
  // Add more meal suggestions as needed
];

const MealSuggestionCard = ({ meal }: { meal: MealSuggestion }) => {
  return (
    <Pressable className="mb-4">
      <View className="bg-card rounded-xl overflow-hidden border border-border">
        <Image
          source={{ uri: meal.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-lg font-semibold mb-1">{meal.name}</Text>
              <Text className="text-sm text-muted-foreground">{meal.category}</Text>
            </View>
            <Text className="text-sm font-medium">{meal.calories} kcal</Text>
          </View>
          
          <Text className="text-sm text-muted-foreground mb-3">
            {meal.description}
          </Text>

          <View className="flex-row gap-3">
            <View className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-xs text-primary">P: {meal.protein}g</Text>
            </View>
            <View className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-xs text-primary">K: {meal.carbs}g</Text>
            </View>
            <View className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-xs text-primary">F: {meal.fat}g</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function MealSuggestions() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
  
    const categories = ["all", "Frühstück", "Mittagessen", "Abendessen", "Snack"];
  
    const filteredMeals = MEAL_SUGGESTIONS.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || meal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
    return (
      <View className="flex-1"> {/* Main container */}
        <View className="px-4">
          <Input
            placeholder="Mahlzeit suchen..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            startContent={<Search size={20} className="text-muted-foreground" />}
            className="mb-4"
          />
  
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 -mx-4 px-4"
          >
            <View className="flex-row gap-2">
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View 
                    className={`px-4 py-2 rounded-full border ${
                      selectedCategory === category
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                  >
                    <Text 
                      className={`text-sm ${
                        selectedCategory === category
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {category === "all" ? "Alle" : category}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
  
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="gap-4">
            {filteredMeals.map((meal) => (
              <Pressable key={meal.id}>
                <View className="bg-card rounded-xl overflow-hidden border border-border">
                  <Image
                    source={{ uri: meal.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View>
                        <Text className="text-lg font-semibold mb-1">{meal.name}</Text>
                        <Text className="text-sm text-muted-foreground">{meal.category}</Text>
                      </View>
                      <Text className="text-sm font-medium">{meal.calories} kcal</Text>
                    </View>
                    
                    <Text className="text-sm text-muted-foreground mb-3">
                      {meal.description}
                    </Text>
  
                    <View className="flex-row gap-3">
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary">P: {meal.protein}g</Text>
                      </View>
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary">K: {meal.carbs}g</Text>
                      </View>
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary">F: {meal.fat}g</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
  