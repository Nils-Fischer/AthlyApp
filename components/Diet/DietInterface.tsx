import * as React from "react";
import { View, ScrollView } from "react-native";
import { H1 } from "~/components/ui/typography";
import { ProgressRings } from "./ProgressRings";
import { NutritionSummary } from "./NutritionSummary";
import { MealsList } from "./MealsList";
import { NutritionProgress, Meal } from "~/lib/types";

export default function DietInterface() {
  const [progress, setProgress] = React.useState<NutritionProgress>({
    consumed: {
      calories: 1450,
      protein: 80,
      carbs: 150,
      fat: 45,
    },
    goals: {
      calories: 2200,
      protein: 120,
      carbs: 250,
      fat: 70,
    },
  });

  const [meals, setMeals] = React.useState<Meal[]>([
    {
      id: "1",
      name: "Protein Oatmeal",
      type: "breakfast",
      calories: 350,
      protein: 20,
      carbs: 45,
      fat: 12,
      time: "08:30",
    },
    {
      id: "2",
      name: "Chicken Salad",
      type: "lunch",
      calories: 550,
      protein: 35,
      carbs: 45,
      fat: 20,
      time: "12:30",
    },
    {
      id: "3",
      name: "Protein Shake",
      type: "snack",
      calories: 250,
      protein: 25,
      carbs: 30,
      fat: 5,
      time: "15:00",
    },
  ]);

  const handleAddMeal = React.useCallback(() => {
    // Implement meal adding logic
    console.log("Add meal");
  }, []);

  const handleMealPress = React.useCallback((meal: Meal) => {
    // Implement meal details/editing logic
    console.log("Meal pressed:", meal);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6 bg-secondary/30">
          <H1 className="text-2xl mb-4">Ernährungstracker</H1>
          <ProgressRings progress={progress} />
          <NutritionSummary progress={progress} />
        </View>
        <MealsList meals={meals} onMealPress={handleMealPress} onAddMeal={handleAddMeal} />
      </ScrollView>
    </View>
  );
}
