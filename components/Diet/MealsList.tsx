import * as React from "react";
import { View } from "react-native";
import { H2 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { MealCard } from "./MealCard";
import { Meal } from "~/lib/types";

interface MealsListProps {
  meals: Meal[];
  onMealPress: (meal: Meal) => void;
  onAddMeal: () => void;
}

export const MealsList = React.memo<MealsListProps>(
  ({ meals, onMealPress, onAddMeal }) => (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <H2 className="text-xl">Mahlzeiten</H2>
        <Button variant="default" onPress={onAddMeal}>
          <Text className="text-primary-foreground">+ Mahlzeit</Text>
        </Button>
      </View>
      <View>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onPress={onMealPress} />
        ))}
      </View>
    </View>
  )
);

MealsList.displayName = "MealsList";