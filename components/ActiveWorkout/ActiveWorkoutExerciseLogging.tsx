import React, { useState } from "react";
import { View, ScrollView, Pressable, TextInput, ImageBackground } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Weight,
  BarChart3,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  CheckCheck,
  Check,
  HeartPulse,
  TimerOff,
} from "~/lib/icons/Icons";
import { Exercise, ExerciseRecord, SetInput, WorkoutExercise } from "~/lib/types";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { AnimatedIconButton } from "../ui/animated-icon-button";
import { cn, getThumbnail } from "~/lib/utils";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { ExerciseHistory } from "../Exercise/ExerciseHistory";

interface ActiveWorkoutExerciseLoggingProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  exerciseRecord: ExerciseRecord;
  onUpdateReps: (setIndex: number, reps: number) => void;
  onUpdateWeight: (setIndex: number, weight: number) => void;
  onAddSet: () => void;
  onDeleteSet: (setIndex: number) => void;
  onCompleteExercise: () => void;
  isResting: boolean;
  remainingRestTime: number;
  onStartRest: () => void;
  onStopRest: () => void;
  totalVolume: number;
  completedSets: number;
}

export const ActiveWorkoutExerciseLogging = ({
  exercise,
  exerciseRecord,
  onUpdateReps,
  onUpdateWeight,
  onAddSet,
  onDeleteSet,
  onCompleteExercise,
  isResting,
  remainingRestTime,
  onStartRest,
  onStopRest,
  totalVolume,
  completedSets,
}: ActiveWorkoutExerciseLoggingProps) => {
  const workoutHistory = useWorkoutHistoryStore();

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isWarmupExpanded, setIsWarmupExpanded] = useState(false);
  const [completedSetIndexes, setCompletedSetIndexes] = useState<number[]>([]);

  const isSetLogged = (set: SetInput) => set.reps !== null && set.weight !== null;
  const [showHistory, setShowHistory] = useState(false);

  const handleUpdateSet = (index: number, field: "reps" | "weight", value: string) => {
    const numValue = parseInt(value) || 0;
    if (field === "reps") {
      onUpdateReps(index, numValue);
    } else {
      onUpdateWeight(index, numValue);
    }
  };

  const inputStyle = "h-10 px-3 rounded-lg text-xl font-medium text-left border border-border bg-card";

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="w-full h-40">
          <ImageBackground
            source={{
              uri:
                getThumbnail(exercise) ||
                "https://media.istockphoto.com/id/542197916/photo/running-on-treadmill.jpg?s=612x612&w=0&k=20&c=CYywmb71uOepSHWa534hG9230AzawSa4i3sA89o4qCQ=",
            }}
            className="w-full h-full"
          >
            <View className="absolute inset-0 bg-background/30" />
          </ImageBackground>
        </View>

        <View className="px-4 -mt-6">
          {/* Exercise Stats Card */}
          <Card className="bg-card/95 backdrop-blur-lg border-primary/10 mb-4">
            <View className="p-4">
              <Text className="text-2xl font-bold mb-3">{exercise.name}</Text>
              {/* Quick Stats Grid */}
              <View className="flex-row gap-4">
                <Card className="flex-1 p-3 border-primary/10">
                  <View className="flex-row items-center">
                    <Weight size={16} className="text-primary mr-2" />
                    <Text className="text-sm text-muted-foreground">Equipment</Text>
                  </View>
                  <Text className="font-medium mt-1">{exercise.equipment || "Not specified"}</Text>
                </Card>
                <Card className="flex-1 p-3 ">
                  <View className="flex-row items-center">
                    <BarChart3 size={16} className="text-primary mr-2" />
                    <Text className="text-sm text-muted-foreground">Level</Text>
                  </View>
                  <Text className="font-medium mt-1">{exercise.difficulty || "Not specified"}</Text>
                </Card>
              </View>
            </View>
          </Card>

          {/* Exercise Details & History Links */}
          <Card className="mb-4 border-primary/10">
            <Pressable
              className="p-4 flex-row items-center justify-between active:opacity-70"
              onPress={async () => {
                router.push(`/(tabs)/workout/exercise/${exercise.id}`);
              }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Info size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="font-medium">Übungsdetails</Text>
                  <Text className="text-sm text-muted-foreground">Anleitung & Ausführung</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
            {/* Neuer Button für Workout History */}
            <Pressable
              className="p-4 flex-row items-center justify-between active:opacity-70"
              onPress={() => setShowHistory(true)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                  <BarChart3 size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="font-medium">Trainings-Historie</Text>
                  <Text className="text-sm text-muted-foreground">Vergangene Leistungen</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
          </Card>

          {/* Sets Management Card */}
          <Card className="mb-4 border-primary/10">
            <View className="p-4">
              {/* Warm-up Toggle */}
              <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-border">
                <Pressable className="flex-1" onPress={() => setIsWarmupExpanded(!isWarmupExpanded)}>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                      <HeartPulse size={20} className="text-primary" />
                    </View>
                    <View>
                      <Text className="font-medium">Aufwärmen</Text>
                      <Text className="text-sm text-muted-foreground">Vorbereitung für dein Training</Text>
                    </View>
                  </View>
                </Pressable>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onPress={() => setIsWarmupExpanded(!isWarmupExpanded)}
                >
                  <ChevronRight size={20} className={cn("text-muted-foreground", isWarmupExpanded && "rotate-90")} />
                </Button>
              </View>

              {isWarmupExpanded && exercise.warmup && (
                <View className="mb-6 px-4">
                  <Text className="text-sm text-muted-foreground leading-relaxed">{exercise.warmup}</Text>
                </View>
              )}

              {/* Working Sets Header */}
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <Text className="text-lg font-semibold mr-2">Working Sets</Text>
                  <Text className="text-sm text-muted-foreground">({exerciseRecord.sets.length} Sets)</Text>
                </View>
                <View className="flex-row gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full ${isDeleteMode ? "bg-destructive/10" : "bg-secondary/10"}`}
                    onPress={() => setIsDeleteMode(!isDeleteMode)}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10" onPress={onAddSet}>
                    <Plus size={16} className="text-primary" />
                  </Button>
                </View>
              </View>

              {/* Column Headers */}
              <View className="flex-row items-center px-4 mb-2">
                <View className="w-10" />
                <View className="flex-1 mx-2">
                  <Text className="text-sm text-muted-foreground ml-3">Gewicht (kg)</Text>
                </View>
                <View className="flex-1 mx-2">
                  <Text className="text-sm text-muted-foreground ml-3">Wiederholungen</Text>
                </View>
                <View className="w-10" />
              </View>

              {/* Sets List */}
              <View className="space-y-2">
                {exerciseRecord.sets.map((set, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 50)}
                    className="rounded-xl overflow-hidden px-4 py-2"
                  >
                    <View className="flex-row items-center">
                      {/* Set Number */}
                      <View className="w-10 h-10 rounded-full bg-card items-center justify-center">
                        <Text className="text-base font-medium text-foreground">{index + 1}</Text>
                      </View>

                      {/* Weight Input */}
                      <View className="flex-1 mx-2">
                        <TextInput
                          className={inputStyle}
                          value={set.weight?.toString() || ""}
                          onChangeText={(value) => handleUpdateSet(index, "weight", value)}
                          keyboardType="numeric"
                          maxLength={3}
                          placeholder={set.targetWeight.toString()}
                          placeholderTextColor={"#9CA3AF"}
                          style={{ color: "#000000" }}
                        />
                      </View>

                      {/* Reps Input */}
                      <View className="flex-1 mx-2">
                        <TextInput
                          className={inputStyle}
                          value={set.reps?.toString() || ""}
                          onChangeText={(value) => handleUpdateSet(index, "reps", value)}
                          keyboardType="numeric"
                          maxLength={2}
                          placeholder={set.targetReps.toString()}
                          placeholderTextColor={"#9CA3AF"}
                          style={{ color: "#000000" }}
                        />
                      </View>

                      {/* Action Button */}
                      {!isDeleteMode ? (
                        <Button
                          size="icon"
                          variant="outline"
                          onPress={() => {
                            if (!completedSetIndexes.includes(index) && isSetLogged(set)) {
                              setCompletedSetIndexes((prev) => [...prev, index]);
                              onStartRest();
                            } else if (completedSetIndexes.includes(index)) {
                              setCompletedSetIndexes((prev) => prev.filter((i) => i !== index));
                            }
                          }}
                          disabled={!isSetLogged(set)}
                          haptics="success"
                          className={`w-10 h-10 rounded-full items-center justify-center ${
                            completedSetIndexes.includes(index) ? "bg-primary" : "bg-card border border-border"
                          }`}
                        >
                          <Check
                            size={16}
                            className={completedSetIndexes.includes(index) ? "text-primary-foreground" : "text-primary"}
                          />
                        </Button>
                      ) : (
                        <Pressable
                          onPress={() => onDeleteSet(index)}
                          className="w-10 h-10 rounded-full items-center justify-center bg-destructive"
                        >
                          <Trash2 size={16} className="text-destructive-foreground" />
                        </Pressable>
                      )}
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Footer Stats */}
      <View className="border-t border-border bg-card/95 backdrop-blur-lg mb-24">
        <View className="p-4">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{exerciseRecord.sets.length.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Sätze</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{completedSets.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Abgeschlossen</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{totalVolume.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Volumen (kg)</Text>
            </View>
          </View>
        </View>
      </View>

      {isResting ? (
        <AnimatedIconButton
          onPress={onStopRest}
          icon={<TimerOff size={20} className="text-primary-foreground" />}
          label={`${remainingRestTime}s`}
          className="absolute bottom-10 left-4 right-4"
        />
      ) : (
        <AnimatedIconButton
          onPress={onCompleteExercise}
          icon={<CheckCheck className="mr-2 h-4 w-4 text-primary-foreground" />}
          label="Übung abschließen"
          disabled={!exerciseRecord.sets.every(isSetLogged)}
          className="absolute bottom-10 left-4 right-4"
        />
      )}

      <BottomSheet title="Übungshistorie" isOpen={showHistory} onClose={() => setShowHistory(false)} snapPoints={[95]}>
        <View className="flex-1">
          <ExerciseHistory exercise={exercise} history={workoutHistory.sessions} />
        </View>
      </BottomSheet>
    </View>
  );
};
