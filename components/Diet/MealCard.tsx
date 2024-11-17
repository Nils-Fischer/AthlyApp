// components/Diet/MealCard.tsx
import * as React from "react";
import { Pressable, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import { Meal } from "~/lib/types";

interface MealCardProps {
  meal: Meal;
  onPress: (meal: Meal) => void;
}

export const MealCard = React.memo<MealCardProps>(({ meal, onPress }) => (
  <Pressable onPress={() => onPress(meal)}>
    <Card className="mb-4">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <CardTitle>{meal.name}</CardTitle>
          <Text className="text-muted-foreground">{meal.time}</Text>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-lg font-semibold">{meal.calories}</Text>
            <Small className="text-muted-foreground">kcal</Small>
          </View>
          <View className="flex-row gap-4">
            <View>
              <Small className="text-muted-foreground">Protein</Small>
              <Text>{meal.protein}g</Text>
            </View>
            <View>
              <Small className="text-muted-foreground">Carbs</Small>
              <Text>{meal.carbs}g</Text>
            </View>
            <View>
              <Small className="text-muted-foreground">Fat</Small>
              <Text>{meal.fat}g</Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  </Pressable>
));

MealCard.displayName = "MealCard";