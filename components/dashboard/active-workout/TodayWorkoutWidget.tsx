import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Dumbbell, Clock, CalendarCheck, ChevronRight, Flame, Share2, Play } from "~/lib/icons/Icons";
import { Workout } from "~/lib/types";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useExerciseStore } from "~/stores/exerciseStore";
import * as Haptics from "expo-haptics";

interface TodayWorkoutWidgetProps {
  workout: Workout;
}

export const TodayWorkoutWidget = ({ workout }: TodayWorkoutWidgetProps) => {
  const router = useRouter();
  const exerciseStore = useExerciseStore();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const estimatedCalories = workout.exercises.length * 50; // TODO: calculate calories

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(dashboard)/active-workout/[id]",
      params: { id: workout.id },
    });
  };

  const handleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View entering={FadeInDown.springify().damping(15)} className="px-1 mb-4">
      <Card className="overflow-hidden bg-card/60 backdrop-blur-lg border border-white/10">
        {/* Header Section */}
        <View className="px-4 pt-4 pb-3 border-b border-border/50">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                <Dumbbell className="text-primary" size={18} />
              </View>
              <Text className="font-medium text-base">Heutiges Training</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
                <Text className="text-xs text-primary font-medium">Geplant</Text>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </View>
          </View>
        </View>

        {/* Content Section */}
        <Pressable onPress={handlePress}>
          <View className="p-4">
            <Text className="text-2xl font-bold mb-1">{workout.name}</Text>
            {workout.description && <Text className="text-base text-muted-foreground mb-4">{workout.description}</Text>}

            {/* Quick Actions */}
            <View className="flex-row justify-around mb-6 mt-2">
              <Pressable onPress={handlePress} className="items-center">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-1">
                  <Play size={18} className="text-primary" />
                </View>
                <Text className="text-xs text-muted-foreground">Start</Text>
              </Pressable>
              <View className="items-center">
                <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mb-1">
                  <Flame size={18} className="text-destructive" />
                </View>
                <Text className="text-xs text-muted-foreground">{estimatedCalories} kcal</Text>
              </View>
              <View className="items-center">
                <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mb-1">
                  <Share2 size={18} className="text-foreground" />
                </View>
                <Text className="text-xs text-muted-foreground">Teilen</Text>
              </View>
            </View>

            {/* Exercise Preview Section */}
            <Pressable onPress={handleExpand}>
              <View className="my-4">
                {workout.exercises.slice(0, isExpanded ? workout.exercises.length : 3).map((workoutExercise, index) => {
                  const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
                  if (!exercise) return null;

                  return (
                    <View key={workoutExercise.exerciseId} className="flex-row items-center py-2">
                      <View className="w-10 h-10 bg-muted rounded-lg overflow-hidden mr-3">
                        <View className="w-full h-full bg-secondary/20 items-center justify-center">
                          <Dumbbell size={16} className="text-muted-foreground" />
                        </View>
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium">{exercise.name}</Text>
                        <Text className="text-sm text-muted-foreground">
                          {workoutExercise.sets} Sätze • {workoutExercise.reps} Wdh
                        </Text>
                      </View>
                    </View>
                  );
                })}
                {!isExpanded && workout.exercises.length > 3 && (
                  <View className="mt-2 py-2 border-t border-border/50">
                    <Text className="text-sm text-muted-foreground text-center">
                      + {workout.exercises.length - 3} weitere Übungen
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>

            {/* Stats Section */}
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 bg-secondary/20 p-3 rounded-2xl">
                  <Clock size={18} className="text-foreground" />
                  <View>
                    <Text className="text-xs text-muted-foreground">Dauer</Text>
                    <Text className="text-sm font-medium">{workout.duration || 60} Min</Text>
                  </View>
                </View>
              </View>
              <View className="w-4" />
              <View className="flex-1">
                <View className="flex-row items-center gap-2 bg-secondary/20 p-3 rounded-2xl">
                  <CalendarCheck size={18} className="text-foreground" />
                  <View>
                    <Text className="text-xs text-muted-foreground">Übungen</Text>
                    <Text className="text-sm font-medium">{workout.exercises.length} Übungen</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Card>
    </Animated.View>
  );
};
