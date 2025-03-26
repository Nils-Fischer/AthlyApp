"use client"

import React, { useMemo, useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "~/components/ui/text"
import { Button } from "~/components/ui/button"
import {
  ChevronRight,
  CheckCircle2,
  Dumbbell,
  MoreHorizontal,
  Trash2,
  Edit3,
  Repeat,
  GripVertical,
  Clock,
  Flame,
  Info,
  ArrowLeft,
  Zap,
  Calendar,
} from "~/lib/icons/Icons"
import Animated, { FadeIn, FadeInDown, SlideInRight } from "react-native-reanimated"
import type { Workout, WorkoutExercise, Exercise, ExerciseRecord } from "~/lib/types"
import { Image } from "expo-image"
import { getRepsRange, getThumbnail } from "~/lib/utils"
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu"
import DraggableFlatList, { type RenderItemParams } from "react-native-draggable-flatlist"
import * as Haptics from "expo-haptics"
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore"
import { ActiveWorkoutStats } from "~/components/ActiveWorkout/ActiveWorkoutStats"
import { fitnessLightColors } from "~/lib/theme/lightColors"

interface ActiveWorkoutExerciseListProps {
  workout: Workout
  exerciseRecords: Map<number, ExerciseRecord>
  exercises: Exercise[]
  isStarted: boolean
  onPressExercise: (exercise: WorkoutExercise) => void
  onShowAlternatives: (exercise: WorkoutExercise) => void
  onShowEditSheet: (exercise: WorkoutExercise) => void
  onDelete: (exercise: WorkoutExercise) => void
  onExercisesReorder?: (exercises: WorkoutExercise[]) => void
  onGoBack?: () => void
  onStartWorkout?: () => void
}

export function LightThemeWorkoutList({
  workout,
  exerciseRecords,
  exercises,
  isStarted,
  onPressExercise,
  onShowAlternatives,
  onShowEditSheet,
  onDelete,
  onExercisesReorder,
  onGoBack,
  onStartWorkout,
}: ActiveWorkoutExerciseListProps) {
  // State und Hooks
  const [orderedExercises, setOrderedExercises] = useState<WorkoutExercise[]>([])
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)
  const activeWorkoutStore = useActiveWorkoutStore()

  // Übungsreihenfolge aktualisieren, wenn sich das Workout ändert
  React.useEffect(() => {
    setOrderedExercises(workout.exercises)
  }, [workout])

  // Übungsliste sortieren (abgeschlossene ans Ende, wenn Training gestartet)
  const displayExercises = useMemo(() => {
    if (isStarted) {
      return [...workout.exercises].sort((a, b) => {
        const aCompleted = exerciseRecords.get(a.exerciseId)?.isCompleted || false
        const bCompleted = exerciseRecords.get(b.exerciseId)?.isCompleted || false
        if (aCompleted === bCompleted) return 0
        return aCompleted ? 1 : -1
      })
    } else {
      return orderedExercises
    }
  }, [isStarted, workout.exercises, exerciseRecords, orderedExercises])

  // Haptisches Feedback für Drag-and-Drop
  const handleDragStart = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }, [])

  const handleDragEnd = ({ data }: { data: WorkoutExercise[] }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setOrderedExercises(data)
    requestAnimationFrame(() => {
      if (onExercisesReorder) {
        onExercisesReorder(data)
      }
    })
  }

  // Workout-Statistiken berechnen
  const totalExercises = workout.exercises.length
  const completedExercises = isStarted ? activeWorkoutStore.getCompletedExercises() : 0
  const completedSets = isStarted ? activeWorkoutStore.getCompletedSets() : 0
  const totalSets = useMemo(() => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
  }, [workout.exercises])
  const completionPercentage = isStarted ? Math.round((completedExercises / totalExercises) * 100) : 0
  const totalVolume = isStarted ? activeWorkoutStore.getTotalVolume() : 0
  const estimatedCalories = totalExercises * 50

  return (
    <View className="flex-1" style={{ backgroundColor: fitnessLightColors.background.default }}>
      {/* Kompakter Header mit Workout-Titel */}
      <View 
        className="pt-2 pb-2"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderBottomWidth: 0.5, 
          borderBottomColor: fitnessLightColors.ui.divider
        }}
      >
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity
            onPress={onGoBack}
            className="w-8 h-8 items-center justify-center"
          >
            <ArrowLeft size={16} color={fitnessLightColors.text.primary} />
          </TouchableOpacity>

          <Text className="text-base font-medium" style={{ color: fitnessLightColors.text.primary }}>
            {workout.name}
          </Text>

          <View className="w-8 h-8" />
        </View>
      </View>

      {/* Statistiken und Fortschritt */}
      {isStarted ? (
        <ActiveWorkoutStats
          elapsedTime={activeWorkoutStore.workoutTimer.elapsedTime}
          completedExercises={completedExercises}
          remainingExercises={totalExercises - completedExercises}
          totalVolume={totalVolume}
          isStarted={true}
          workout={workout}
        />
      ) : (
        <ActiveWorkoutStats
          elapsedTime={0}
          completedExercises={0}
          remainingExercises={totalExercises}
          totalVolume={0}
          isStarted={false}
          workout={workout}
          onStartWorkout={onStartWorkout}
        />
      )}

      {/* Übungsbereich Header */}
      <View className="px-4 mt-3 mb-1">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text 
              className="text-sm font-medium"
              style={{ color: fitnessLightColors.text.secondary }}
            >
              {isStarted ? "Übungen" : "Übungen"}
            </Text>
            
            {!isStarted && (
              <View className="flex-row items-center ml-2 px-2 py-0.5 rounded-full" 
                style={{ backgroundColor: 'rgba(0, 136, 255, 0.08)' }}>
                <Info size={10} color={fitnessLightColors.secondary.default} className="mr-1" />
                <Text 
                  className="text-[10px]"
                  style={{ color: fitnessLightColors.secondary.default }}
                >
                  Zum Umordnen gedrückt halten
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Übungsliste */}
      <DraggableFlatList
        data={displayExercises}
        onDragEnd={handleDragEnd}
        onDragBegin={handleDragStart}
        keyExtractor={(item) => item.exerciseId.toString()}
        renderItem={({item, drag, isActive}) => {
          const exercise = exercises.find((e: Exercise) => e.id === item.exerciseId)
          const exerciseRecord = exerciseRecords.get(item.exerciseId)
          const itemIndex = displayExercises.findIndex((e: WorkoutExercise) => e.exerciseId === item.exerciseId)

          if (!exercise) return <View />

          // Berechnungen für Übungsinformationen
          const totalSets = exerciseRecord?.sets.length || item.sets.length
          const completedSets = exerciseRecord?.sets.filter((set: { reps: number | null; weight: number | null }) => 
            set.reps !== null && set.weight !== null
          ).length || 0
          const isCompleted = exerciseRecord?.isCompleted || false
          const imageUrl = getThumbnail(exercise)
          const repsRange = getRepsRange(item)

          // Dropdown-Menü-Optionen
          const dropdownItems = [
            {
              name: "Alternative Übung",
              icon: Repeat,
              onPress: () => onShowAlternatives(item),
            },
            {
              name: "Details bearbeiten",
              icon: Edit3,
              onPress: () => onShowEditSheet(item),
            },
            {
              name: "Übung löschen",
              icon: Trash2,
              onPress: () => onDelete(item),
              destructive: true,
            },
          ]

          // Event-Handler
          const handleLongPress = () => {
            if (!isStarted && drag) {
              drag()
            }
          }

          const handlePress = () => {
            if (!isActive) {
              if (isStarted) {
                onPressExercise(item)
              } else {
                setExpandedExercise(expandedExercise === item.exerciseId ? null : item.exerciseId)
              }
            }
          }

          const isExpanded = expandedExercise === item.exerciseId

          return (
            <Animated.View
              entering={SlideInRight.delay(100 + itemIndex * 50).springify()}
              className="rounded-xl mb-2"
              style={{ 
                backgroundColor: fitnessLightColors.background.elevated,
                borderWidth: isExpanded ? 0.5 : 0,
                borderColor: isExpanded ? fitnessLightColors.ui.border : 'transparent',
                shadowColor: fitnessLightColors.ui.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2
              }}
            >
              <TouchableOpacity
                onPress={handlePress}
                onLongPress={!isStarted ? handleLongPress : undefined}
                delayLongPress={150}
                activeOpacity={0.7}
                className="rounded-xl overflow-hidden"
                style={{
                  opacity: isCompleted ? 0.7 : 1
                }}
              >
                <View className="flex-row py-3 px-3">
                  {/* Drag Handle */}
                  {!isStarted && (
                    <View className="mr-1.5 items-center justify-center">
                      <GripVertical size={16} color={fitnessLightColors.text.tertiary} />
                    </View>
                  )}

                  {/* Übungsbild */}
                  <View className="mr-3 relative">
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-12 h-12 rounded-lg"
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <View 
                        className="w-12 h-12 rounded-lg items-center justify-center"
                        style={{ backgroundColor: fitnessLightColors.background.input }}
                      >
                        <Dumbbell size={20} color={fitnessLightColors.text.tertiary} />
                      </View>
                    )}
                  </View>

                  {/* Übungsinformation */}
                  <View className="flex-1 justify-center">
                    <Text 
                      className="text-sm font-medium mb-1"
                      style={{ 
                        color: isCompleted 
                          ? fitnessLightColors.text.tertiary
                          : fitnessLightColors.text.primary
                      }}
                    >
                      {exercise.name}
                    </Text>

                    {/* Muskelgruppen-Tags */}
                    {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
                      <View className="flex-row flex-wrap">
                        {exercise.primaryMuscles.slice(0, 2).map((muscle: string) => (
                          <View 
                            key={muscle} 
                            className="rounded-full px-1.5 py-0.5 mr-1.5"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                          >
                            <Text 
                              className="text-[10px]"
                              style={{ color: fitnessLightColors.text.secondary }}
                            >
                              {muscle}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Rechter Bereich (Status oder Aktionen) */}
                  <View className="justify-center ml-1">
                    {isStarted ? (
                      // Status-Anzeige (wenn Training gestartet)
                      <View>
                        {isCompleted ? (
                          <View 
                            className="flex-row items-center px-2 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(0, 200, 83, 0.1)' }}
                          >
                            <CheckCircle2 size={12} color={fitnessLightColors.tertiary.default} />
                            <Text 
                              className="text-[10px] font-medium ml-1"
                              style={{ color: fitnessLightColors.tertiary.default }}
                            >
                              Erledigt
                            </Text>
                          </View>
                        ) : (
                          <View 
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ 
                              backgroundColor: 'rgba(0, 0, 0, 0.03)',
                              borderWidth: 0.5,
                              borderColor: fitnessLightColors.ui.border
                            }}
                          >
                            <ChevronRight size={16} color={fitnessLightColors.text.secondary} />
                          </View>
                        )}
                      </View>
                    ) : (
                      // Aktionen (wenn Bearbeitungsmodus)
                      <View className="flex-row items-center">
                        {!isStarted ? (
                          <CustomDropdownMenu
                            items={dropdownItems}
                            side="top"
                            align="start"
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8" haptics="light">
                                <MoreHorizontal size={16} color={fitnessLightColors.text.tertiary} />
                              </Button>
                            }
                          />
                        ) : (
                          <View className="flex-row items-center">
                            <View 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ 
                                backgroundColor: isExpanded 
                                  ? fitnessLightColors.primary.default 
                                  : fitnessLightColors.secondary.default 
                              }}
                            />
                            <ChevronRight
                              size={14}
                              color={fitnessLightColors.text.tertiary}
                              style={{
                                transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
                              }}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )
        }}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 128 }}
        dragHitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
        animationConfig={{ duration: 200 }}
      />
    </View>
  )
}

// Export für Abwärtskompatibilität
export { LightThemeWorkoutList as ActiveWorkoutExerciseList }
export default LightThemeWorkoutList

