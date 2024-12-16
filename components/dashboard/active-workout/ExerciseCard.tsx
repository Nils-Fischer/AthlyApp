//components\dashboard\active-workout\ExerciseCard.tsx
import React, { useState } from "react";
import { View, Pressable, Modal, Image, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Dumbbell, MoreVertical, Timer, ArrowLeftRight, X, Trash2, GripVertical, Check } from "lucide-react-native";
import { Exercise, SetInput, WorkoutExercise } from "~/lib/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useMemo } from "react";

interface ExerciseCardProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  isActive: boolean;
  index: number;
  onPress: () => void;
  currentSet?: number;
  isEditMode?: boolean;
  onDelete?: (index: number) => void;
  onSwapExercise?: (index: number, newExercise: Exercise) => void;
  drag?: () => void;
  isHeld?: boolean;
  completedSets?: SetInput[];
}

export const ExerciseCard = ({
  exercise,
  workoutExercise,
  isActive,
  index,
  onPress,
  currentSet,
  isEditMode,
  onDelete,
  onSwapExercise,
  drag,
  isHeld,
  completedSets,
}: ExerciseCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const exerciseStore = useExerciseStore();

  const similarExercises = useMemo(() => {
    return exerciseStore.exercises
      ?.filter(
        (ex: Exercise) =>
          ex.id !== exercise.id &&
          (ex.primaryMuscles.some(
            (muscle: string) => exercise.primaryMuscles.includes(muscle) || exercise.secondaryMuscles.includes(muscle)
          ) ||
            ex.secondaryMuscles.some((muscle: string) => exercise.primaryMuscles.includes(muscle)))
      )
      .slice(0, 5);
  }, [exercise, exerciseStore.exercises]);

  const handleExerciseSwap = (newExercise: Exercise) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSwapExercise?.(index, newExercise);
    setMenuVisible(false);
    setShowAlternatives(false);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete?.(index);
  };

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMenuVisible(true);
  };

  const defaultImage = "/api/placeholder/400/320";

  return (
    <>
      <Animated.View entering={FadeInDown.delay(index * 100)} className="mb-3">
        <Card
          className={`
            overflow-hidden
            ${isActive ? "" : "border-border/50"}
            ${isHeld ? "opacity-90 scale-105" : ""}
            ${workoutExercise.isCompleted ? "border-green-500 border-2" : ""}
          `}
        >
          <View className="p-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                {isEditMode && (
                  <Pressable onLongPress={drag} className="mr-2 p-2">
                    <GripVertical size={20} className="text-muted-foreground" />
                  </Pressable>
                )}
                <View className={`w-14 h-14 rounded-xl overflow-hidden`}>
                  {exercise.images?.[0] && !imageError ? (
                    <Image
                      source={{ uri: exercise.images[0] }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Image
                      source={{ uri: defaultImage }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  )}
                  <View className={`absolute inset-0 ${isActive ? "bg-primary/5" : "bg-secondary/5"}`} />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-medium text-base mb-0.5">{exercise.name}</Text>
                  {exercise.equipment && (
                    <View className="flex-row items-center">
                      <View className={`px-2 py-0.5 rounded-full ${isActive ? "bg-primary/10" : "bg-secondary/10"}`}>
                        <Text className="text-xs text-muted-foreground">{exercise.equipment}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="items-end mr-2">
                  <View
                    className={`flex-row items-center gap-1 px-2 py-1 rounded-lg ${
                      isActive ? "bg-primary/10" : "bg-secondary/10"
                    }`}
                  >
                    <Text className={`font-medium text-md ${isActive ? "text-primary" : "text-foreground"}`}>
                      {workoutExercise.sets}×{workoutExercise.reps}
                    </Text>
                    {workoutExercise.isCompleted && <Check size={16} className="text-primary ml-1" />}
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">{workoutExercise.weight}kg</Text>
                </View>
                {isEditMode ? (
                  <Pressable onPress={handleDelete} className="p-2 -mr-1">
                    <Trash2 size={18} className="text-destructive" />
                  </Pressable>
                ) : (
                  <Pressable onPress={handleMenuPress} className="p-2 -mr-1">
                    <MoreVertical size={18} className="text-muted-foreground" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Progress Bar for Completed Sets */}
            {isActive && workoutExercise.completedSets && (
              <View className="mt-3">
                <Text className="text-sm text-muted-foreground mb-1">Fortschritt</Text>
                <View className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-400"
                    style={{
                      width: `${
                        (workoutExercise.completedSets.filter((set) => set.isCompleted).length / workoutExercise.sets) *
                        100
                      }%`,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </Card>
      </Animated.View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setMenuVisible(false);
          setShowAlternatives(false);
        }}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => {
            setMenuVisible(false);
            setShowAlternatives(false);
          }}
        >
          <View className="flex-1 justify-end">
            <View className="bg-card rounded-t-3xl">
              {!showAlternatives ? (
                <>
                  <View className="p-4 border-b border-border">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-lg font-semibold">Übungsoptionen</Text>
                      <Pressable onPress={() => setMenuVisible(false)}>
                        <X size={24} className="text-muted-foreground" />
                      </Pressable>
                    </View>
                  </View>

                  <View className="p-4">
                    <Pressable onPress={() => setShowAlternatives(true)} className="flex-row items-center py-4">
                      <ArrowLeftRight size={20} className="text-foreground mr-3" />
                      <View>
                        <Text className="font-medium">Alternative Übungen</Text>
                        <Text className="text-sm text-muted-foreground">
                          {similarExercises.length} verfügbare Alternativen
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      className="flex-row items-center py-4"
                      onPress={() => {
                        setMenuVisible(false);
                      }}
                    >
                      <Timer size={20} className="text-foreground mr-3" />
                      <Text className="font-medium">Timer einstellen</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <View className="p-4 border-b border-border">
                    <View className="flex-row justify-between items-center">
                      <Pressable onPress={() => setShowAlternatives(false)} className="flex-row items-center">
                        <ArrowLeftRight size={20} className="text-foreground mr-2" />
                        <Text className="text-lg font-semibold">Alternative Übungen</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setShowAlternatives(false);
                          setMenuVisible(false);
                        }}
                      >
                        <X size={24} className="text-muted-foreground" />
                      </Pressable>
                    </View>
                  </View>

                  <ScrollView className="max-h-96">
                    {/* Current Exercise */}
                    <View className="p-4 border-b border-border">
                      <Text className="text-sm text-muted-foreground mb-2">Aktuelle Übung</Text>
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl overflow-hidden">
                          {exercise.images?.[0] ? (
                            <Image
                              source={{ uri: exercise.images[0] }}
                              style={{ width: "100%", height: "100%" }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-full h-full bg-primary/10 items-center justify-center">
                              <Dumbbell size={20} className="text-primary" />
                            </View>
                          )}
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="font-medium">{exercise.name}</Text>
                          <View className="flex-row flex-wrap gap-1 mt-1">
                            {exercise.primaryMuscles.map((muscle, index) => (
                              <View
                                key={`muscle-${exercise.id}-${muscle}-${index}`}
                                className="bg-primary/10 rounded-full px-2 py-0.5"
                              >
                                <Text className="text-xs text-primary">{muscle}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Alternative Exercises List */}
                    <View className="p-4">
                      <Text className="text-sm text-muted-foreground mb-2">
                        {similarExercises.length
                          ? `${similarExercises.length} ähnliche Übungen gefunden`
                          : "Keine ähnlichen Übungen gefunden"}
                      </Text>
                      <View className="space-y-3">
                        {similarExercises.map((altExercise, idx) => (
                          <Pressable
                            key={`alt-${exercise.id}-${altExercise.id}-${idx}`}
                            onPress={() => handleExerciseSwap(altExercise)}
                            className="flex-row items-center p-3 rounded-xl bg-secondary/10 active:opacity-70"
                          >
                            <View className="w-12 h-12 rounded-xl overflow-hidden">
                              {altExercise.images?.[0] ? (
                                <Image
                                  source={{ uri: altExercise.images[0] }}
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="w-full h-full bg-secondary/10 items-center justify-center">
                                  <Dumbbell size={20} className="text-muted-foreground" />
                                </View>
                              )}
                            </View>
                            <View className="ml-3 flex-1">
                              <Text className="font-medium">{altExercise.name}</Text>
                              <View className="flex-row flex-wrap gap-1 mt-1">
                                {altExercise.primaryMuscles.map((muscle, index) => (
                                  <View
                                    key={`alt-muscle-${altExercise.id}-${muscle}-${index}`}
                                    className="bg-secondary/10 rounded-full px-2 py-0.5"
                                  >
                                    <Text className="text-xs text-muted-foreground">{muscle}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default ExerciseCard;
