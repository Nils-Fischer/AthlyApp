// components/Diet/NutritionSummary.tsx
import * as React from "react";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { NutritionProgress } from "~/lib/types";

interface NutritionSummaryProps {
  progress: NutritionProgress;
}

export const NutritionSummary = React.memo<NutritionSummaryProps>(
  ({ progress }) => (
    <Card>
      <CardHeader>
        <CardTitle>Tagesübersicht</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium">Ziel</Text>
          <Text>{progress.goals.calories} kcal</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium">Gegessen</Text>
          <Text>{progress.consumed.calories} kcal</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium">Verbleibend</Text>
          <Text>{progress.goals.calories - progress.consumed.calories} kcal</Text>
        </View>
      </CardContent>
    </Card>
  )
);

NutritionSummary.displayName = "NutritionSummary";