import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Trash2, Edit3, Repeat, X } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { getThumbnail } from "~/lib/utils";

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
  const dropdownItems = [
    {
      name: "Alternative Übung",
      icon: Repeat,
      onPress: onShowAlternatives,
    },
    {
      name: "Details bearbeiten",
      icon: Edit3,
      onPress: onShowEditSheet,
    },
    {
      name: "Übung löschen",
      icon: Trash2,
      onPress: onDelete,
      destructive: true,
    },
  ];

  const image = getThumbnail(exercise);

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} className={`mb-3 ${isActive ? "bg-muted" : ""}`}>
      <View className="bg-card rounded-xl p-4 border border-border">
        <View className="flex-row justify-between items-start">
          <View className="flex-row gap-3 flex-1">
            <View className="w-12 h-12 bg-muted rounded-lg items-center justify-center overflow-hidden">
              {image && <Image source={{ uri: image }} alt={exercise.name} className="w-full h-full object-cover" />}
            </View>
            <View className="flex-1">
              <Text className="font-medium mb-1">{exercise.name}</Text>
              <Text className="text-muted-foreground text-sm">{exercise.equipment}</Text>
            </View>
          </View>
          {isEditMode ? (
            <DeleteConfirmation
              open={deleteExerciseId === workoutExercise.exerciseId}
              onOpenChange={onDeleteChange}
              onConfirm={onDeleteConfirm}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X size={18} className="text-destructive" />
                </Button>
              }
              title="Übung löschen?"
              description="Möchtest du diese Übung wirklich aus dem Workout entfernen?"
            />
          ) : (
            <CustomDropdownMenu
              items={dropdownItems}
              side="top"
              align="start"
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="text-muted-foreground" />
                </Button>
              }
            />
          )}
        </View>
        <Text className="mt-3 text-sm text-muted-foreground">
          {workoutExercise.sets} Sätze • {getRepsRange(workoutExercise)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
