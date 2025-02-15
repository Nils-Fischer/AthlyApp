import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text } from "~/components/ui/text";
import { Trophy, Target, Calendar } from "~/lib/icons/Icons";
import { LineChart } from "react-native-chart-kit";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";

export interface ExerciseProgressProps {
  workoutExercise: WorkoutExercise;
  exercise: Exercise;
  onSave: (workoutExercise: WorkoutExercise) => void;
  navigateBack: () => void;
}

export const ExerciseProgress: React.FC<ExerciseProgressProps> = ({ workoutExercise, onSave, navigateBack }) => {
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
    <ExerciseBottomSheetHeader
      title="Übungsstatistiken"
      closeMode={"back"}
      onClose={navigateBack}
      onSave={() => onSave(workoutExercise)}
    >
      <View className="flex-1 bg-background">
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
              <Text className="text-muted-foreground text-center">
                Hier erscheinen deine letzten Trainingseinheiten
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ExerciseBottomSheetHeader>
  );
};
