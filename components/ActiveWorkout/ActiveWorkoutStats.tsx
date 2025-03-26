import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Dumbbell, CheckSquare, Clock, Flame, ChevronRight } from "~/lib/icons/Icons";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Workout } from "~/lib/types";
import { fitnessLightColors } from "~/lib/theme/lightColors";
import { formatTime } from "~/lib/utils";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatItem = ({ icon, value, label }: StatItemProps) => (
  <View className="items-center flex-1">
    <View 
      className="flex-row items-center justify-center mb-1"
    >
      {icon}
      <Text 
        className="text-sm font-medium ml-1.5" 
        style={{ color: fitnessLightColors.text.primary }}
      >
        {value}
      </Text>
    </View>
    <Text 
      className="text-[10px]" 
      style={{ color: fitnessLightColors.text.tertiary }}
    >
      {label}
    </Text>
  </View>
);

interface ActiveWorkoutStatsProps {
  elapsedTime: number;
  completedExercises: number;
  remainingExercises: number;
  totalVolume: number;
  isStarted: boolean;
  workout?: Workout;
  onStartWorkout?: () => void;
}

export function ActiveWorkoutStats({
  elapsedTime,
  completedExercises,
  remainingExercises,
  totalVolume,
  isStarted,
  workout,
  onStartWorkout,
}: ActiveWorkoutStatsProps) {
  const totalExercises = completedExercises + remainingExercises;
  
  // Geschätzte Kalorien basierend auf Übungsanzahl
  const estimatedCalories = totalExercises * 25;
  
  // Geschätzte Dauer in Minuten
  const workoutMinutes = workout?.duration || Math.round(elapsedTime / 60000).toString() || '0';

  return (
    <Animated.View
      entering={FadeIn.delay(300)}
      className="mx-4 mt-1 mb-2"
    >
      {!isStarted && workout ? (
        // Trainingsvorschau vor dem Start
        <View 
          className="rounded-xl overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}
        >
          {/* Fortschrittsbalken am oberen Rand (nicht sichtbar vor Start) */}
          <View className="h-1 w-full" style={{ backgroundColor: 'transparent' }} />
          
          <View className="px-4 py-3">
            {workout.description ? (
              <Text 
                className="text-xs italic text-center mb-2"
                style={{ color: fitnessLightColors.text.secondary }}
              >
                {workout.description}
              </Text>
            ) : null}
            
            <View className="flex-row justify-between">
              <StatItem
                icon={<Clock size={14} color={fitnessLightColors.text.secondary} />}
                value={`${workoutMinutes} min`}
                label="Dauer"
              />
              
              <StatItem
                icon={<Dumbbell size={14} color={fitnessLightColors.text.secondary} />}
                value={totalExercises}
                label="Übungen"
              />
              
              <StatItem
                icon={<Flame size={14} color={fitnessLightColors.text.secondary} />}
                value={estimatedCalories}
                label="kcal"
              />
            </View>
          </View>
        </View>
      ) : (
        // Aktive Trainingsstatistiken
        <View 
          className="rounded-xl overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}
        >
          {/* Fortschrittsbalken am oberen Rand */}
          <View 
            className="h-1 w-full"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
          >
            <View 
              className="h-full rounded-r-full" 
              style={{ 
                width: `${Math.round((completedExercises / totalExercises) * 100)}%`,
                backgroundColor: fitnessLightColors.primary.default
              }} 
            />
          </View>
          
          <View className="p-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-baseline">
                <Text 
                  className="text-sm font-medium mr-1" 
                  style={{ color: fitnessLightColors.text.primary }}
                >
                  {Math.round((completedExercises / totalExercises) * 100)}%
                </Text>
                <Text style={{ color: fitnessLightColors.text.secondary, fontSize: 12 }}>
                  fertig
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <StatItem
                icon={<Clock size={14} color={fitnessLightColors.text.secondary} />}
                value={formatTime(elapsedTime / 1000)}
                label="Zeit"
              />
              
              <StatItem
                icon={<CheckSquare size={14} color={fitnessLightColors.text.secondary} />}
                value={`${completedExercises}/${totalExercises}`}
                label="Übungen"
              />
              
              <StatItem
                icon={<Dumbbell size={14} color={fitnessLightColors.text.secondary} />}
                value={totalVolume}
                label="kg Volumen"
              />
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

export default ActiveWorkoutStats;