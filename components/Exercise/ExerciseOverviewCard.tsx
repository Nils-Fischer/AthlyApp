import React from "react";
import { View, Pressable, Touchable, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "react-native";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { getRepsRange, getThumbnail, getWeightRange } from "~/lib/utils";
import { Card } from "../ui/card";

interface ExerciseCardProps {
  exercise: Exercise;
  workoutExercise?: WorkoutExercise;
  onPress?: (exercise: Exercise) => void;
  onLongPress?: (exercise: Exercise) => void;
  rightAccessory?: React.ReactNode;
}

export const ExerciseOverviewCard = ({
  exercise,
  workoutExercise,
  onPress,
  onLongPress,
  rightAccessory,
}: ExerciseCardProps) => {
  const image = getThumbnail(exercise);
  return (
    <TouchableOpacity
      onPress={() => onPress?.(exercise)}
      onLongPress={() => onLongPress?.(exercise)}
      className="active:opacity-70 my-1"
    >
      <Card className="p-4 items-center flex-row gap-4 justify-between">
        <View className="w-16 h-16 bg-muted rounded-xl items-center justify-center overflow-hidden">
          {image && <Image source={{ uri: image }} alt={exercise.name} className="w-full h-full" />}
        </View>
        <View className="flex-1 justify-center">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="font-semibold text-base">{exercise.name}</Text>
          </View>
          <Text className="text-muted-foreground text-sm mb-2">{exercise.equipment}</Text>
          <View className="flex-row flex-wrap gap-2">
            {workoutExercise ? (
              <Text className="text-sm text-muted-foreground">
                {workoutExercise.sets.length} Sätze • {getRepsRange(workoutExercise)}
                {getWeightRange(workoutExercise) ? ` • ${getWeightRange(workoutExercise)}` : ""}
              </Text>
            ) : (
              exercise.primaryMuscles.map((muscle, index) => (
                <View key={index} className="bg-primary/10 rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-medium">{muscle}</Text>
                </View>
              ))
            )}
          </View>
        </View>
        {rightAccessory && rightAccessory}
      </Card>
    </TouchableOpacity>
  );
};
