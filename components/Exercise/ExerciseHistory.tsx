import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from "~/components/ui/card";
import { format } from "date-fns";
import { WorkoutSession, Exercise } from "~/lib/types";
import { Dumbbell, Calendar, Target } from "~/lib/icons/Icons";

interface ExerciseHistoryProps {
  exercise: Exercise;
  history: WorkoutSession[];
}

export function ExerciseHistory({ exercise, history }: ExerciseHistoryProps) {
  const exerciseHistory = history
    .filter((session) => session.entries.some((entry) => entry.exerciseId === exercise.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIntensityLabel = (intensity: number) => {
    const labels = ["Very Light", "Light", "Moderate", "Hard", "Very Hard"];
    return labels[intensity - 1] || "Unknown";
  };

  const getIntensityColor = (intensity: number) => {
    const colors = {
      1: "bg-blue-500/20 text-blue-500",
      2: "bg-green-500/20 text-green-500",
      3: "bg-yellow-500/20 text-yellow-500",
      4: "bg-orange-500/20 text-orange-500",
      5: "bg-red-500/20 text-red-500",
    };
    return colors[intensity as keyof typeof colors] || "bg-primary/10 text-primary";
  };

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <Text className="text-2xl font-bold mb-6 text-foreground">Exercise History</Text>

      {exerciseHistory.length === 0 ? (
        <Card className="p-6 bg-card/50 rounded-2xl">
          <View className="items-center py-8">
            <Dumbbell size={32} className="text-muted-foreground mb-4" />
            <Text className="text-muted-foreground text-center">No history available for this exercise yet.</Text>
          </View>
        </Card>
      ) : (
        exerciseHistory.map((session, sessionIndex) => {
          const exerciseEntry = session.entries.find((entry) => entry.exerciseId === exercise.id);

          if (!exerciseEntry) return null;

          return (
            <Card key={sessionIndex} className="mb-4 p-5 bg-card/50 rounded-2xl">
              <View className="flex-row items-center mb-4">
                <Calendar size={18} className="text-primary mr-2" />
                <Text className="text-base text-foreground">{format(new Date(session.date), "MMMM d, yyyy")}</Text>
              </View>

              <View className="space-y-3">
                {exerciseEntry.sets.map((set, setIndex) => (
                  <View key={setIndex} className="bg-background/50 p-4 rounded-xl">
                    <View className="flex-row items-center mb-4">
                      <Text className="text-lg font-medium text-foreground">Set {setIndex + 1}</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="space-y-1">
                        <Text className="text-sm text-muted-foreground">Weight</Text>
                        <Text className="text-base text-foreground">{set.weight || 0} kg</Text>
                      </View>

                      <View className="space-y-1">
                        <Text className="text-sm text-muted-foreground">Reps</Text>
                        <Text className="text-base text-foreground">{set.reps || 0}</Text>
                      </View>

                      <View className="space-y-1">
                        <Text className="text-sm text-muted-foreground">Target</Text>
                        <Text className="text-base text-foreground">
                          {set.targetWeight}kg × {set.targetReps}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {exerciseEntry.intensity && (
                  <View className={`p-3 rounded-xl mt-2 ${getIntensityColor(exerciseEntry.intensity)}`}>
                    <View className="flex-row items-center justify-center space-x-3">
                      <Target className="mr-2 text-destructive" size={16} />
                      <Text className="text-sm font-medium">{getIntensityLabel(exerciseEntry.intensity)}</Text>
                    </View>
                  </View>
                )}
              </View>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}
