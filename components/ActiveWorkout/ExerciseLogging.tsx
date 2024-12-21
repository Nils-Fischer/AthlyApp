import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable, Modal, TextInput, Platform, ImageBackground } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Weight, BarChart3, ChevronRight, Info, Plus, Trash2, Check, Dumbbell, ArrowLeft } from "~/lib/icons/Icons";
import { Exercise, ExerciseRecord, SetInput, WorkoutExercise } from "~/lib/types";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { WorkoutHistoryView } from "../dashboard/active-workout/WorkoutHistoryView";

interface ExerciseLoggingProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  exerciseRecord: ExerciseRecord;
  isWorkoutStarted: boolean;
  updateExerciseRecord: (record: ExerciseRecord) => void;
}

export const ExerciseLogging = ({
  exercise,
  workoutExercise,
  exerciseRecord,
  isWorkoutStarted,
  updateExerciseRecord,
}: ExerciseLoggingProps) => {
  const workoutHistory = useWorkoutHistoryStore();

  const [sets, setSets] = useState<SetInput[]>(exerciseRecord.sets);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [rpe, setRpe] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const totalVolume = useMemo(() => {
    return sets.reduce((total, set) => {
      return total + (set.weight || 0) * (set.reps || 0);
    }, 0);
  }, [sets]);

  const handleAddSet = useCallback(() => {
    const newSet = {
      reps: null,
      weight: null,
      targetWeight: sets[0]?.targetWeight || 0,
      targetReps: workoutExercise.reps,
    };

    const newSets = [...sets, newSet];

    setSets(newSets);
    updateExerciseRecord({
      ...exerciseRecord,
      sets: newSets,
    });

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [sets, exerciseRecord, workoutExercise.reps, updateExerciseRecord]);

  const handleDeleteSet = useCallback(
    (index: number) => {
      // Don't allow deleting if only one set remains
      if (sets.length <= 1) {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return;
      }

      const newSets = sets.filter((_, i) => i !== index);

      setSets(newSets);
      updateExerciseRecord({
        ...exerciseRecord,
        sets: newSets,
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    },
    [sets, exerciseRecord, updateExerciseRecord]
  );

  const updateSet = useCallback(
    (index: number, field: keyof SetInput, value: string) => {
      const numValue = value === "" ? null : parseInt(value) || 0;

      // Create new sets array first
      const newSets = sets.map((set, i) => (i === index ? { ...set, [field]: numValue } : set));

      // Update both local state and store in one go
      setSets(newSets);
      updateExerciseRecord({
        ...exerciseRecord,
        sets: newSets,
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [sets, exerciseRecord, updateExerciseRecord]
  );

  const isSetCompleted = (set: SetInput) => set.reps !== null && set.weight !== null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="w-full h-40">
          <ImageBackground
            source={{
              uri:
                exercise.images?.[0] ||
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
                  <Text className="font-medium mt-1">{exercise.level || "Not specified"}</Text>
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
              onPress={() => {
                // Hier Modal mit WorkoutHistoryView öffnen
                setShowHistory(true);
              }}
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
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                    <Dumbbell size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium">Aufwärmen</Text>
                    <Text className="text-sm text-muted-foreground">Vorbereitung für dein Training</Text>
                  </View>
                </View>
              </View>

              {/* Working Sets Header */}
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <Text className="text-lg font-semibold mr-2">Working Sets</Text>
                  <Text className="text-sm text-muted-foreground">({sets.length} Sets)</Text>
                </View>
                <View className="flex-row gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full ${isDeleteMode ? "bg-destructive/10" : "bg-secondary/10"}`}
                    onPress={() => {
                      setIsDeleteMode(!isDeleteMode);
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                  >
                    <Trash2 size={16} className={isDeleteMode ? "text-destructive" : "text-destructive"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-primary/10"
                    onPress={handleAddSet}
                  >
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
                {sets.map((set, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 50)}
                    className={`
                      rounded-xl overflow-hidden px-4 py-2
                    `}
                  >
                    <View className="flex-row items-center">
                      {/* Set Number */}
                      <View className="w-10 h-10 rounded-full bg-card items-center justify-center">
                        <Text className="text-base font-medium text-foreground">{index + 1}</Text>
                      </View>

                      {/* Weight Input */}
                      <View className="flex-1 mx-2">
                        <TextInput
                          className={`
                            h-10 px-3 rounded-lg text-xl font-medium text-left border border-border
                            ${isWorkoutStarted && isSetCompleted(set) ? "bg-card" : "bg-card"}
                          `}
                          value={set.weight?.toString() || ""}
                          onChangeText={(value) => updateSet(index, "weight", value)}
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
                          className={`
                            h-10 px-3 rounded-lg text-xl font-medium text-left border border-border
                            ${isWorkoutStarted && isSetCompleted(set) ? "bg-card" : "bg-card"}
                          `}
                          value={set.reps?.toString() || ""}
                          onChangeText={(value) => updateSet(index, "reps", value)}
                          keyboardType="numeric"
                          maxLength={2}
                          placeholder={set.targetReps.toString()}
                          placeholderTextColor={"#9CA3AF"}
                          style={{ color: "#000000" }}
                        />
                      </View>

                      {/* Action Button */}
                      {isWorkoutStarted ? (
                        !isDeleteMode ? (
                          <View
                            className={`
                              w-10 h-10 rounded-full items-center justify-center
                              ${isSetCompleted(set) ? "bg-primary" : "bg-card border border-border"}
                            `}
                          >
                            <Check
                              size={16}
                              className={isSetCompleted(set) ? "text-primary-foreground" : "text-primary"}
                            />
                          </View>
                        ) : (
                          <Pressable
                            onPress={() => handleDeleteSet(index)}
                            className="w-10 h-10 rounded-full items-center justify-center bg-destructive"
                          >
                            <Trash2 size={16} className="text-destructive-foreground" />
                          </Pressable>
                        )
                      ) : isDeleteMode ? (
                        <Pressable
                          onPress={() => handleDeleteSet(index)}
                          className="w-10 h-10 rounded-full items-center justify-center bg-destructive"
                        >
                          <Trash2 size={16} className="text-destructive-foreground" />
                        </Pressable>
                      ) : (
                        <View className="w-10" />
                      )}
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>
          </Card>

          {/* RPE Selector Card */}
          <Card className="border-primary/10">
            <View className="p-4">
              <Text className="font-medium mb-4">RPE (Gefühlte Intensität)</Text>
              <View className="flex-row justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setRpe(value)}
                    className={`w-14 h-14 rounded-2xl items-center justify-center ${
                      rpe === value ? "bg-primary" : "bg-secondary/10"
                    }`}
                  >
                    <Text
                      className={`text-lg ${rpe === value ? "text-primary-foreground font-medium" : "text-foreground"}`}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* History Modal - Keep this as a separate modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <View className="flex-1 bg-background">
          <View className="pt-7 px-4 pb-4 border-b border-border">
            <View className="flex-row justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setShowHistory(false)}
                className="bg-background/80 backdrop-blur-lg rounded-full"
              >
                <ArrowLeft size={24} className="text-foreground" />
              </Button>
              <Text className="text-xl font-bold">Trainings-Historie</Text>
              <View style={{ width: 40 }} />
            </View>
          </View>

          <WorkoutHistoryView
            exerciseId={exercise.id}
            history={Object.values(workoutHistory.sessions)
              .filter((entry) => entry.entries?.length > 0)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            exerciseName={exercise.name}
          />
        </View>
      </Modal>

      {/* Footer */}
      <View className="border-t border-border bg-card/95 backdrop-blur-lg mb-6">
        <View className="p-4">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{sets.length.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Sätze</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{sets.filter(isSetCompleted).length.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Abgeschlossen</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm font-medium">{totalVolume.toString()}</Text>
              <Text className="text-xs text-muted-foreground">Volumen (kg)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
