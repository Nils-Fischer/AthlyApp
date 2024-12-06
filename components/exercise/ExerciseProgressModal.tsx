// ExerciseProgressModal.tsx
import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Trophy, Target, Calendar } from "~/lib/icons/Icons";
import { LineChart } from "react-native-chart-kit";
import { Exercise } from "~/lib/types";
import { Router } from "react-native-actions-sheet";

export interface ExerciseProgressProps {
  router: Router<"sheet-with-router">;
  exercise: Exercise;
  onClose: () => void;
}

export const ExerciseProgress: React.FC<ExerciseProgressProps> = ({ exercise, onClose, router }) => {
  // Beispieldaten für Chart
  const data = {
    labels: ["1.W", "2.W", "3.W", "4.W"],
    datasets: [
      {
        data: [0, 0, 0, 0],
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-2 flex-row items-center border-b border-border">
        <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onPress={() => router.goBack()}>
          <ChevronLeft size={24} />
        </Button>
        <View>
          <Text className="text-lg font-semibold">Fortschritt & Analyse</Text>
          <Text className="text-sm text-muted-foreground">{exercise.name}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Quick Stats */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-secondary/10 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Trophy size={18} className="text-primary mr-2" />
              <Text className="font-medium">Bestleistung</Text>
            </View>
            <Text className="text-2xl font-semibold">-</Text>
            <Text className="text-sm text-muted-foreground">Noch keine Daten</Text>
          </View>
          <View className="flex-1 bg-secondary/10 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Target size={18} className="text-primary mr-2" />
              <Text className="font-medium">Nächstes Ziel</Text>
            </View>
            <Text className="text-2xl font-semibold">-</Text>
            <Text className="text-sm text-muted-foreground">Ziel setzen</Text>
          </View>
        </View>

        {/* Weight Progress Chart */}
        <View className="bg-secondary/10 p-4 rounded-xl mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-medium">Gewichtsverlauf</Text>
              <Text className="text-sm text-muted-foreground">Letzte 4 Wochen</Text>
            </View>
          </View>

          <View className="items-center justify-center py-4">
            <LineChart
              data={data}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "transparent",
                backgroundGradientTo: "transparent",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // Purple (primary)
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // Gray
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#9333ea",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withInnerLines={false}
              withOuterLines={true}
              withDots={true}
              withShadow={false}
            />
            <Text className="text-muted-foreground text-center mt-4">Noch keine Trainingsdaten vorhanden</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="bg-secondary/10 p-4 rounded-xl">
          <Text className="font-medium mb-3">Letzte Aktivitäten</Text>
          <View className="items-center py-8">
            <Calendar size={40} className="text-muted-foreground mb-3" />
            <Text className="text-muted-foreground text-center">Hier erscheinen deine letzten Trainingseinheiten</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
