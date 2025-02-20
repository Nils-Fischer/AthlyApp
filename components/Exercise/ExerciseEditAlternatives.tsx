import React, { useState } from "react";
import { View, ScrollView, Image, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { getThumbnail } from "~/lib/utils";
import * as Haptics from "expo-haptics";

export interface ExerciseEditAlternativesProps {
  workoutExercise: WorkoutExercise;
  onSelection: (updatedWorkoutExercise: WorkoutExercise) => void;
  withConfirmation?: boolean;
}

export const ExerciseEditAlternatives: React.FC<ExerciseEditAlternativesProps> = ({
  workoutExercise,
  onSelection,
  withConfirmation = true,
}) => {
  const exerciseStore = useExerciseStore();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const alternativeExercises: Exercise[] =
    exerciseStore.exercises?.filter((ex) => workoutExercise.alternatives.includes(ex.id)) ?? [];

  const createUpdatedWorkoutExercise = (selected: Exercise): WorkoutExercise => ({
    ...workoutExercise,
    alternatives: [...workoutExercise.alternatives.filter((id) => id !== selected.id), workoutExercise.exerciseId],
    exerciseId: selected.id,
  });

  const handleConfirmReplacement = () => {
    if (selectedExercise) {
      onSelection(createUpdatedWorkoutExercise(selectedExercise));
    }
  };

  const handleExerciseSelection = (alternativeExercise: Exercise) => {
    setSelectedExercise(alternativeExercise);
    if (!withConfirmation) {
      onSelection(createUpdatedWorkoutExercise(alternativeExercise));
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4 pb-24">
        {alternativeExercises.length > 0 ? (
          <View className="gap-4">
            {alternativeExercises.map((alternativeExercise) => {
              const imageUrl = getThumbnail(alternativeExercise);
              return (
                <Pressable
                  key={alternativeExercise.id}
                  onPress={() => {
                    handleExerciseSelection(alternativeExercise);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="active:opacity-70"
                >
                  <View
                    className={`bg-card rounded-xl p-4 ${
                      withConfirmation
                        ? `border ${
                            selectedExercise?.id === alternativeExercise.id ? "border-primary" : "border-border"
                          }`
                        : ""
                    }`}
                  >
                    <View className="flex-row gap-3">
                      <View className="w-16 h-16 bg-muted rounded-lg items-center justify-center overflow-hidden">
                        {imageUrl && (
                          <Image
                            source={{ uri: imageUrl }}
                            alt={alternativeExercise.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium mb-1">{alternativeExercise.name}</Text>
                        <Text className="text-sm text-muted-foreground mb-2">{alternativeExercise.equipment}</Text>
                        <View className="flex-row flex-wrap gap-2">
                          {alternativeExercise.primaryMuscles.map((muscle, index) => (
                            <View key={index} className="bg-primary/10 rounded-full px-2 py-0.5">
                              <Text className="text-xs text-primary">{muscle}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-muted-foreground text-center">
              Keine alternativen Übungen in dieser Kategorie gefunden.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button - Only show when withConfirmation is true */}
      {withConfirmation && alternativeExercises.length > 0 && (
        <View className="absolute bottom-10 left-0 right-0 p-4 bg-background border-t border-border">
          <Button onPress={handleConfirmReplacement} className="w-full" disabled={!selectedExercise}>
            {selectedExercise ? (
              <Text className="text-primary-foreground font-medium">
                {selectedExercise.name} als Alternative festlegen
              </Text>
            ) : (
              <Text className="text-primary-foreground font-medium">Bitte wähle eine Alternative</Text>
            )}
          </Button>
        </View>
      )}
    </View>
  );
};
