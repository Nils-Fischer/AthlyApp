import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Trash2, Edit3, Repeat } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { ExerciseDeleteConfirmation } from "../Exercise/ExerciseDeleteConfirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScaleDecorator } from "react-native-draggable-flatlist";

interface WorkoutExerciseItemProps {
  workoutExercise: WorkoutExercise;
  exercise: Exercise;
  isEditMode: boolean;
  isActive?: boolean;
  deleteExerciseId: number | null;
  onPress: () => void;
  onLongPress?: () => void;
  onDeleteConfirm: () => void;
  onDeleteChange: (open: boolean) => void;
  onShowAlternatives: () => void;
  onShowEditSheet: () => void;
  onDelete: () => void;
}

const getRepsRange = (exercise: WorkoutExercise) => {
  if (exercise.reps === 10) return "10 Wdh.";
  if (Array.isArray(exercise.reps)) return `${exercise.reps[0]}-${exercise.reps[1]} Wdh.`;
  return `${exercise.reps} Wdh.`;
};

export function WorkoutExerciseItem({
  workoutExercise,
  exercise,
  isEditMode,
  isActive,
  deleteExerciseId,
  onPress,
  onLongPress,
  onDeleteConfirm,
  onDeleteChange,
  onShowAlternatives,
  onShowEditSheet,
  onDelete,
}: WorkoutExerciseItemProps) {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        className={`mb-3 ${isActive ? "bg-muted" : ""}`}
        style={{
          transform: [{ scale: isActive ? 1.02 : 1 }],
          shadowOpacity: isActive ? 0.2 : 0,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: isActive ? 5 : 0,
        }}
      >
        <View className="bg-card rounded-xl p-4 border border-border">
          <View className="flex-row justify-between items-start">
            <View className="flex-row gap-3 flex-1">
              <View className="w-12 h-12 bg-muted rounded-lg items-center justify-center overflow-hidden">
                {exercise.images?.[0] && (
                  <Image
                    source={{ uri: exercise.images[0] }}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-medium mb-1">{exercise.name}</Text>
                <Text className="text-muted-foreground text-sm">{exercise.equipment}</Text>
              </View>
            </View>
            {isEditMode ? (
              <ExerciseDeleteConfirmation
                open={deleteExerciseId === workoutExercise.exerciseId}
                onOpenChange={onDeleteChange}
                onConfirm={onDeleteConfirm}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 size={18} className="text-destructive" />
                  </Button>
                }
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" avoidCollisions={true} align="start" side="top">
                  <DropdownMenuItem onPress={onShowAlternatives} className="flex-row gap-2 justify-between">
                    <Text className="font-medium">Alternative Übung</Text>
                    <Repeat size={20} className="text-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onPress={onShowEditSheet} className="flex-row gap-2 justify-between">
                    <Text className="font-medium">Details bearbeiten</Text>
                    <Edit3 size={20} className="text-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onPress={onDelete} className="flex-row gap-2 justify-between">
                    <Text className="font-medium text-destructive">Übung löschen</Text>
                    <Trash2 size={20} className="text-destructive" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </View>
          <Text className="mt-3 text-sm text-muted-foreground">
            {workoutExercise.sets} Sätze • {getRepsRange(workoutExercise)}
          </Text>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
}
