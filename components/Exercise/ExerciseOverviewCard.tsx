import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "react-native";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { getRepsRange, getThumbnail } from "~/lib/utils";

interface ExerciseCardProps {
  exercise: Exercise;
  workoutExercise?: WorkoutExercise;
  onPress?: (exerciseId: number) => void;
}

export const ExerciseOverviewCard = ({ exercise, workoutExercise, onPress }: ExerciseCardProps) => {
  const image = getThumbnail(exercise);
  return (
    <Pressable onPress={() => onPress?.(exercise.id)} className="active:opacity-70">
      <View className="bg-card/60 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
        <View className="flex-row gap-4">
          <View className="w-16 h-16 bg-muted rounded-xl items-center justify-center overflow-hidden">
            {image && <Image source={{ uri: image }} alt={exercise.name} className="w-full h-full" />}
          </View>
          <View className="flex-1 justify-center">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="font-semibold text-base">{exercise.name}</Text>
            </View>
            <Text className="text-muted-foreground text-sm mb-2">{exercise.equipment}</Text>
            <View className="flex-row flex-wrap gap-2">
              {exercise.primaryMuscles.map((muscle, index) => (
                <View key={index} className="bg-primary/10 rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-medium">{muscle}</Text>
                </View>
              ))}
            </View>
            {workoutExercise && (
              <View className="mt-2 pt-2 border-t border-border/50">
                <Text className="text-sm text-muted-foreground">
                  {workoutExercise.sets.length} Sätze • {getRepsRange(workoutExercise)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
