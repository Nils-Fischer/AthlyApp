import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Pressable, ImageBackground, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BarChart3,
  ChevronRight,
  Info,
  Plus,
  CheckCheck,
  Check,
  HeartPulse,
  TimerOff,
  Trash2,
} from "~/lib/icons/Icons";
import { Exercise, ExerciseRecord, SetInput, WorkoutExercise } from "~/lib/types";
import { router } from "expo-router";
import Animated, { FadeInDown, SharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { AnimatedIconButton } from "../ui/animated-icon-button";
import { cn, getThumbnail } from "~/lib/utils";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { ExerciseHistory } from "../Exercise/ExerciseHistory";
import * as Haptics from "expo-haptics";
import { Lead, P } from "../ui/typography";
import { SetLoggingWheelPicker } from "./Logging/SetLoggingWheelPicker";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

interface ActiveWorkoutExerciseLoggingProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  exerciseRecord: ExerciseRecord;
  onUpdateSet: (setIndex: number, reps: number, weight: number) => void;
  onAddSet: () => void;
  onDeleteSet: (setIndex: number) => void;
  onCompleteExercise: () => void;
  isResting: boolean;
  remainingRestTime: number;
  onStartRest: () => void;
  onStopRest: () => void;
  totalVolume: number;
  completedSets: number;
  onToggleSetCompleted: (setIndex: number, completed: boolean) => void;
}

type SetInputWithIndex = SetInput & { index: number };

export const ActiveWorkoutExerciseLogging = ({
  exercise,
  exerciseRecord,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onCompleteExercise,
  isResting,
  remainingRestTime,
  onStartRest,
  onStopRest,
  totalVolume,
  completedSets,
  onToggleSetCompleted,
}: ActiveWorkoutExerciseLoggingProps) => {
  const workoutHistory = useWorkoutHistoryStore();

  const [isWarmupExpanded, setIsWarmupExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [logSet, setLogSet] = useState<SetInputWithIndex | null>(null);

  // Create an object to store refs for each swipeable
  const swipeableRefs = useRef<{ [key: number]: React.RefObject<any> }>({});

  const isSetLogged = (set: SetInput) => set.reps !== null && set.weight !== null;

  const handleToggleSetCompleted = (set: SetInput, index: number) => {
    if (!set.completed) {
      onUpdateSet(index, set.reps || set.targetReps || 8, set.weight || set.targetWeight || 0);
      onStartRest();
    } else {
      onStopRest();
    }
    onToggleSetCompleted(index, !set.completed);
  };

  const renderRightActions = (index: number) => (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 70 }],
      };
    });

    const handleDelete = () => {
      // Close the swipeable first
      if (swipeableRefs.current[index] && swipeableRefs.current[index].current) {
        swipeableRefs.current[index].current.close();
      }
      setTimeout(() => {
        onDeleteSet(index);
      }, 150);
    };

    return (
      <Animated.View style={styleAnimation} className="w-20 h-full bg-destructive justify-center items-center">
        <Pressable onPress={handleDelete} className="w-full h-full justify-center items-center">
          <Trash2 size={20} className="text-destructive-foreground" />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Image */}
          <ImageBackground
            source={{
              uri:
                getThumbnail(exercise) ||
                "https://media.istockphoto.com/id/542197916/photo/running-on-treadmill.jpg?s=612x612&w=0&k=20&c=CYywmb71uOepSHWa534hG9230AzawSa4i3sA89o4qCQ=",
            }}
            className="w-full h-40"
          >
            <View className="absolute inset-0 bg-background/30" />
          </ImageBackground>

          <View className="px-4 -mt-6">
            {/* Exercise Stats Card */}
            <Card className="backdrop-blur-lg border-primary/10 mb-4">
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
              </CardHeader>
              {/* Quick Actions Grid */}
              <CardContent className="gap-3">
                {/* Übungsdetails Button */}
                <Pressable
                  className="flex-row items-center flex-1 p-2 rounded-lg active:opacity-70"
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/(tabs)/routine/exercise/${exercise.id}`);
                  }}
                >
                  <Info size={20} className="text-foreground mr-2" />
                  <P>Übungsdetails</P>
                  <ChevronRight size={16} className="text-foreground ml-auto" />
                </Pressable>

                <View className="h-px bg-border" />

                {/* Trainings-Historie Button */}
                <Pressable
                  className="flex-row items-center flex-1 p-2 rounded-lg active:opacity-70"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowHistory(true);
                  }}
                >
                  <BarChart3 size={20} className="text-foreground mr-2" />
                  <P>Historie</P>
                  <ChevronRight size={16} className="text-foreground ml-auto" />
                </Pressable>
              </CardContent>
            </Card>

            {/* Sets Management Card */}
            <Card className="mb-4 border-primary/10">
              <View className="p-4">
                {/* Warm-up Toggle */}
                <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-border">
                  <Pressable
                    className="flex-1"
                    onPress={() => {
                      setIsWarmupExpanded(!isWarmupExpanded);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
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
                    haptics="light"
                  >
                    <ChevronRight size={20} className={cn("text-muted-foreground", isWarmupExpanded && "rotate-90")} />
                  </Button>
                </View>

                {isWarmupExpanded && exercise.warmup && (
                  <View className="mb-6 px-4">
                    <Text className="text-sm text-muted-foreground leading-relaxed">{exercise.warmup}</Text>
                  </View>
                )}

                {/* Logged Sets */}
                <View className="mt-4">
                  {/* Table Header */}
                  <View className="flex-row pb-2 border-b border-border items-center">
                    <View className="w-16 pl-2 justify-center items-center">
                      <Text className="font-medium text-muted-foreground">Satz</Text>
                    </View>
                    <View className="flex-1 items-center justify-center">
                      <Text className="font-medium text-muted-foreground">Reps × Gewicht</Text>
                    </View>
                    <View className="w-12 items-center justify-center">
                      <Check size={20} className="text-muted-foreground" />
                    </View>
                  </View>

                  {/* Table Rows */}
                  {exerciseRecord.sets.map((set, index) => {
                    // Create a ref for each swipeable if it doesn't exist
                    if (!swipeableRefs.current[index]) {
                      swipeableRefs.current[index] = React.createRef();
                    }

                    return (
                      <View key={index}>
                        <ReanimatedSwipeable
                          ref={swipeableRefs.current[index]}
                          friction={2}
                          enableTrackpadTwoFingerGesture
                          rightThreshold={40}
                          renderRightActions={(prog, drag) => renderRightActions(index)(prog, drag)}
                        >
                          <Animated.View
                            key={index}
                            entering={FadeInDown.delay(index * 100).springify()}
                            className={cn("flex-row items-center py-2", set.completed && "bg-success-background")}
                          >
                            {/* Set Number */}
                            <View className="w-16 pl-2 justify-center items-center">
                              <Lead className="font-medium text-foreground">{index + 1}</Lead>
                            </View>

                            {/* Combined Reps and Weight */}
                            <View className="flex-1 items-center justify-center">
                              <Pressable
                                className={
                                  "py-2 px-4 bg-transparent rounded-lg gap-3 items-center flex-row justify-center"
                                }
                                onPress={() => {
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                  setLogSet({ ...set, index });
                                }}
                              >
                                <P
                                  className={set.reps && set.weight !== null ? "text-foreground" : "text-foreground/50"}
                                >
                                  {set.reps || set.targetReps || 8}
                                </P>
                                <P
                                  className={set.reps && set.weight !== null ? "text-foreground" : "text-foreground/50"}
                                >
                                  ×
                                </P>
                                <P
                                  className={set.reps && set.weight !== null ? "text-foreground" : "text-foreground/50"}
                                >
                                  {set.weight || set.targetWeight || 0} kg
                                </P>
                              </Pressable>
                            </View>

                            {/* Completed Status */}
                            <View className="w-12 items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 rounded-xl border border-border",
                                  set.completed ? "bg-success" : "bg-muted"
                                )}
                                haptics="success"
                                onPress={() => handleToggleSetCompleted(set, index)}
                              >
                                <Check
                                  size={16}
                                  strokeWidth={3}
                                  className={set.completed ? "text-success-foreground" : "text-muted-foreground"}
                                />
                              </Button>
                            </View>
                          </Animated.View>
                        </ReanimatedSwipeable>
                        <View className="h-px bg-border" />
                      </View>
                    );
                  })}

                  {/* Add Set Button */}
                  <Pressable
                    className="flex-row items-center justify-center mt-4 py-3 rounded-lg border border-dashed border-border active:opacity-70"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onAddSet();
                    }}
                  >
                    <Plus size={18} className="text-primary mr-2" />
                    <P>Satz hinzufügen</P>
                  </Pressable>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {logSet && (
        <SetLoggingWheelPicker
          isOpen={logSet !== null}
          onClose={() => {
            setLogSet(null);
          }}
          onSave={(reps, weight) => {
            onUpdateSet(logSet.index, reps, weight);
            setLogSet(null);
          }}
          exerciseName={exercise.name}
          setInput={logSet}
          currentSet={logSet.index + 1}
          totalSets={exerciseRecord.sets.length}
        />
      )}

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
