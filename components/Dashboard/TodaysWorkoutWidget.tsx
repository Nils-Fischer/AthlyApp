import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Dumbbell, Clock, Play, ChevronRight, Flame, SkipForward } from "~/lib/icons/Icons";
import { Workout } from "~/lib/types";
import { router, useRouter } from "expo-router";
import { useExerciseStore } from "~/stores/exerciseStore";
import * as Haptics from "expo-haptics";
import { getRepsRange } from "~/lib/utils";
import { H3, P } from "../ui/typography";
import { Badge } from "../ui/badge";
import { CircleStop, Trash, Trash2 } from "lucide-react-native";
import { AnimatedIconButton } from "../ui/animated-icon-button";

interface TodaysWorkoutWidgetProps {
  workout: Workout;
  isStarted: boolean;
  startWorkout: () => void;
  cancelWorkout: () => void;
  skipWorkout: () => void;
  showCancelDialog: () => void;
  isCustomWorkout?: boolean;
}

export const TodaysWorkoutWidget = ({
  workout,
  skipWorkout,
  isStarted,
  startWorkout,
  showCancelDialog,
  isCustomWorkout,
}: TodaysWorkoutWidgetProps) => {
  const router = useRouter();
  const exerciseStore = useExerciseStore();
  const estimatedCalories = workout.exercises.length * 50;

  const handlePress = () => {
    console.log("handlePress");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(dashboard)/active-workout/[id]",
      params: { id: workout.id },
    });
  };

  const handleStartWorkout = () => {
    startWorkout();
    router.push({
      pathname: "/(tabs)/(dashboard)/active-workout/[id]",
      params: { id: workout.id },
    });
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipWorkout();
  };

  return (
    <Pressable onPress={handlePress} className="active:opacity-80">
      <Card>
        {/* Header Section */}
        <CardHeader className="px-4 py-4 flex-row items-center justify-between">
          <CardTitle className="font-medium text-base">Heutiges Training</CardTitle>
          <View className="flex-row items-center">
            <Badge variant="default">
              <P className="text-xs text-primary-foreground font-medium">{isStarted ? "In Bearbeitung" : "Geplant"}</P>
            </Badge>
            <ChevronRight size={20} className="text-primary" />
          </View>
        </CardHeader>

        {/* Content Section */}
        <CardContent>
          <H3>{workout.name}</H3>
          {workout.description && <CardDescription className="text-base mb-4">{workout.description}</CardDescription>}

          {/* Quick Stats */}
          <View className="flex-row items-center mb-6">
            <View className="flex-row items-center mr-4">
              <Clock size={16} className="text-primary mr-2" />
              <Text className="text-sm">{workout.duration || 60} Min</Text>
            </View>
            <View className="flex-row items-center mr-4">
              <Flame size={16} className="text-primary mr-2" />
              <Text className="text-sm">{estimatedCalories} kcal</Text>
            </View>
            <View className="flex-row items-center">
              <Dumbbell size={16} className="text-primary mr-2" />
              <Text className="text-sm">{workout.exercises.length} Übungen</Text>
            </View>
          </View>

          {/* Exercise Preview */}
          <View className="space-y-3">
            {workout.exercises.slice(0, 3).map((workoutExercise, index) => {
              const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
              if (!exercise) return null;

              return (
                <View
                  key={workoutExercise.exerciseId}
                  className="flex-row items-center border-l-2 border-primary/20 pl-3"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">{exercise.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {workoutExercise.sets.length} Sätze • {getRepsRange(workoutExercise)}
                    </Text>
                  </View>
                  <View className="h-8 w-8 rounded-full border border-primary/20 items-center justify-center">
                    <Text className="text-xs text-primary font-medium">{index + 1}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {workout.exercises.length > 3 && (
            <Pressable onPress={handlePress} className="mt-4 flex-row items-center justify-center">
              <Text className="text-primary font-medium mr-1">Alle Übungen anzeigen</Text>
              <ChevronRight size={16} className="text-primary" />
            </Pressable>
          )}

          {/* Action Buttons */}
          <CardFooter className="px-0 w-full gap-4 flex-row justify-between items-center mt-4">
            {isStarted ? (
              <>
                <AnimatedIconButton
                  onPress={showCancelDialog}
                  icon={<CircleStop className="text-destructive-foreground" />}
                  label="Abbrechen"
                  haptics="heavy"
                  className="bg-destructive text-destructive-foreground flex-1"
                />

                <AnimatedIconButton
                  onPress={handlePress}
                  icon={<Play className="text-primary-foreground" />}
                  label="Fortsetzen"
                  haptics="light"
                  className="flex-1"
                />
              </>
            ) : (
              <>
                {isCustomWorkout ? (
                  <AnimatedIconButton
                    onPress={handleSkip}
                    icon={<Trash2 className="text-destructive-foreground" />}
                    label="Löschen"
                    haptics="light"
                    className="flex-1 bg-destructive"
                  />
                ) : (
                  <AnimatedIconButton
                    onPress={handleSkip}
                    icon={<SkipForward className="text-primary-foreground" />}
                    label="Überspringen"
                    haptics="light"
                    className="flex-1"
                  />
                )}
                <AnimatedIconButton
                  onPress={handleStartWorkout}
                  icon={<Play className="text-primary-foreground" />}
                  label="Starten"
                  haptics="light"
                  className="flex-1"
                />
              </>
            )}
          </CardFooter>
        </CardContent>
      </Card>
    </Pressable>
  );
};
