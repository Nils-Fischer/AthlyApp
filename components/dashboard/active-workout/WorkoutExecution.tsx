import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { 
  Timer, 
  StopCircle,
  PauseCircle,
  PlayCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

interface WorkoutExecutionProps {
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isPaused: boolean;
  workoutTimer: number;
  completedExercises: number;
  totalExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  estimatedCalories: number;
}

export const WorkoutExecution = ({
  onPause,
  onResume,
  onStop,
  isPaused,
  workoutTimer,
  completedExercises,
  totalExercises,
  totalSets,
  completedSets,
  totalVolume,
  estimatedCalories,
}: WorkoutExecutionProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View 
      entering={FadeIn}
      className="px-4 py-2"
    >
      <Card className="mb-4 border-primary/10">
        <View className="p-4">
          {/* Timer Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <Timer size={24} className="text-primary mr-2" />
              <Text className="text-2xl font-semibold">{formatTime(workoutTimer)}</Text>
            </View>
            {/* Workout Controls */}
            <View className="flex-row gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  isPaused ? onResume() : onPause();
                }}
              >
                {isPaused ? (
                  <PlayCircle size={24} className="text-primary" />
                ) : (
                  <PauseCircle size={24} className="text-primary" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onStop();
                }}
              >
                <StopCircle size={24} className="text-destructive" />
              </Button>
            </View>
          </View>

          {/* Progress Stats */}
          <View className="grid grid-cols-2 gap-4">
            <Card className="p-3 border-primary/10">
              <Text className="text-sm text-muted-foreground mb-1">Übungen</Text>
              <Text className="text-lg font-semibold">
                {completedExercises} / {totalExercises}
              </Text>
            </Card>
            <Card className="p-3 border-primary/10">
              <Text className="text-sm text-muted-foreground mb-1">Sets</Text>
              <Text className="text-lg font-semibold">
                {completedSets} / {totalSets}
              </Text>
            </Card>
            <Card className="p-3 border-primary/10">
              <Text className="text-sm text-muted-foreground mb-1">Volumen</Text>
              <Text className="text-lg font-semibold">
                {totalVolume} kg
              </Text>
            </Card>
            <Card className="p-3 border-primary/10">
              <Text className="text-sm text-muted-foreground mb-1">Kalorien</Text>
              <Text className="text-lg font-semibold">
                {estimatedCalories} kcal
              </Text>
            </Card>
          </View>

          {/* Progress Bars */}
          <View className="mt-4">
            {/* Exercise Progress */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-muted-foreground">Übungsfortschritt</Text>
                <Text className="text-sm text-muted-foreground">
                  {Math.round((completedExercises / totalExercises) * 100)}%
                </Text>
              </View>
              <View className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary"
                  style={{ width: `${(completedExercises / totalExercises) * 100}%` }} 
                />
              </View>
            </View>

            {/* Sets Progress */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-muted-foreground">Set-Fortschritt</Text>
                <Text className="text-sm text-muted-foreground">
                  {Math.round((completedSets / totalSets) * 100)}%
                </Text>
              </View>
              <View className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary"
                  style={{ width: `${(completedSets / totalSets) * 100}%` }} 
                />
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};