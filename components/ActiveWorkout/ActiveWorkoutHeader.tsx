// components/dashboard/active-workout/WorkoutHeader.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronLeft, Edit2, X } from "lucide-react-native";
import type { Workout } from "~/lib/types";

interface ActiveWorkoutHeaderProps {
  workout: Workout;
  isEditMode: boolean;
  onEditToggle: () => void;
  onBack: () => void;
}

export function ActiveWorkoutHeader({ workout, isEditMode, onEditToggle, onBack }: ActiveWorkoutHeaderProps) {
  return (
    <View className="px-4 py-3 bg-background border-b border-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={onBack} className="mr-3 p-2 rounded-full active:bg-muted">
            <ChevronLeft size={24} className="text-foreground" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{workout.name}</Text>
            {workout.description && <Text className="text-sm text-muted-foreground">{workout.description}</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={onEditToggle} className="p-2 rounded-full active:bg-muted">
          {isEditMode ? <X size={20} className="text-foreground" /> : <Edit2 size={20} className="text-foreground" />}
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-2">
        <View className="flex-row items-center mr-4">
          <Text className="text-sm text-muted-foreground">{workout.exercises.length} Exercises</Text>
        </View>
        {workout.duration && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground">~{workout.duration} min</Text>
          </View>
        )}
      </View>
    </View>
  );
}
