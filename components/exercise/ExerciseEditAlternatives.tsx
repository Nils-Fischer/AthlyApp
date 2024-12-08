import React, { useState } from "react";
import { View, ScrollView, Image, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";

export interface AlternativeExercisesSelectionProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onSave: (workoutExercise: WorkoutExercise, exercise: Exercise) => void;
  navigateBack: (workoutExercise: WorkoutExercise, exercise: Exercise) => void;
}

export const ExerciseEditAlternatives: React.FC<AlternativeExercisesSelectionProps> = ({
  exercise,
  workoutExercise,
  onSave,
  navigateBack,
}) => {
  const exerciseStore = useExerciseStore();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseId, setExerciseId] = useState(workoutExercise.exerciseId);
  const [alternatives, setAlternatives] = useState(workoutExercise.alternatives);

  const getNewWorkoutExercise = (): WorkoutExercise => {
    return {
      ...workoutExercise,
      alternatives: alternatives,
    };
  };

  const goBack = () => navigateBack(getNewWorkoutExercise(), selectedExercise || exercise);

  const save = () => onSave(getNewWorkoutExercise(), selectedExercise || exercise);

  const alternativeExercises: Exercise[] = exerciseStore.exercises.filter(
    (ex) =>
      ex.id !== exercise.id &&
      ex.category === exercise.category &&
      ex.primaryMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle))
  );

  const handleConfirmReplacement = () => {
    if (selectedExercise) {
      const newAlternatives = [...alternatives.filter((id) => id !== selectedExercise.id), exerciseId];
      setAlternatives(newAlternatives);
      setExerciseId(selectedExercise.id);
      goBack();
    }
  };

  return (
    <ExerciseBottomSheetHeader title="Alternative Übungen" closeMode={"back"} onClose={goBack} onSave={save}>
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1 p-4 pb-32">
          {alternativeExercises.length > 0 ? (
            <View className="gap-4">
              {alternativeExercises.map((alternativeExercise) => (
                <Pressable
                  key={alternativeExercise.id}
                  onPress={() => setSelectedExercise(alternativeExercise)}
                  className="active:opacity-70"
                >
                  <View
                    className={`bg-card rounded-xl p-4 border ${
                      selectedExercise?.id === alternativeExercise.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <View className="flex-row gap-3">
                      <View className="w-16 h-16 bg-muted rounded-lg items-center justify-center overflow-hidden">
                        {alternativeExercise.images?.[0] ? (
                          <Image
                            source={{ uri: alternativeExercise.images[0] }}
                            alt={alternativeExercise.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            source={{ uri: "/api/placeholder/64/64" }}
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
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted-foreground text-center">
                Keine alternativen Übungen in dieser Kategorie gefunden.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Button - Positioned above navbar */}
        <View className="absolute bottom-16 left-0 right-0 p-4 bg-background">
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
      </View>
    </ExerciseBottomSheetHeader>
  );
};
