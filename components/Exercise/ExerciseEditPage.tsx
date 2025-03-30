import React, { useRef } from "react";
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus, ChevronRight, FileText, Info, Minus, Repeat } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise, SetConfiguration } from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import { ExerciseOverviewCard } from "~/components/Exercise/ExerciseOverviewCard";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";
import * as Haptics from "expo-haptics";
import { Input } from "~/components/ui/input";

export interface ExerciseEditPageProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onSave: (exercise: WorkoutExercise) => void;
  onClose: () => void;
  navigateToExerciseDetails: (workoutExercise: WorkoutExercise) => void;
  navigateToNotes: (workoutExercise: WorkoutExercise) => void;
  navigateToAlternativeExercises: (workoutExercise: WorkoutExercise) => void;
  navigateToStats: (workoutExercise: WorkoutExercise) => void;
}

export const ExerciseEditPage: React.FC<ExerciseEditPageProps> = ({
  exercise,
  workoutExercise,
  onSave,
  onClose,
  navigateToExerciseDetails,
  navigateToNotes,
  navigateToAlternativeExercises,
  navigateToStats,
}) => {
  const [setConfigs, setSetConfigs] = React.useState<SetConfiguration[]>(workoutExercise.sets);
  const [restTime, setRestTime] = React.useState(workoutExercise.restPeriod || 120);
  const [editingSetIndex, setEditingSetIndex] = React.useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const getNewWorkoutExercise = (): WorkoutExercise => ({
    ...workoutExercise,
    sets: setConfigs,
    restPeriod: restTime,
  });

  const addSet = () => {
    if (setConfigs.length >= 10) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const lastSet = setConfigs[setConfigs.length - 1];
    setSetConfigs([...setConfigs, { reps: lastSet?.reps || 12, weight: lastSet?.weight }]);
  };

  const removeSet = () => {
    if (setConfigs.length <= 1) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSetConfigs(setConfigs.slice(0, -1));
  };

  const updateSetReps = (index: number, reps: number) => {
    const newConfigs = [...setConfigs];
    newConfigs[index] = { ...newConfigs[index], reps: Math.min(Math.max(1, reps), 30) };
    setSetConfigs(newConfigs);
  };

  const updateSetWeight = (index: number, weight: number) => {
    const newConfigs = [...setConfigs];
    newConfigs[index] = { ...newConfigs[index], weight };
    setSetConfigs(newConfigs);
  };

  const save = () => onSave(getNewWorkoutExercise());

  const goToExerciseDetails = () => navigateToExerciseDetails(getNewWorkoutExercise());
  const goToNotes = () => navigateToNotes(getNewWorkoutExercise());
  const goToAlternativeExercises = () => navigateToAlternativeExercises(getNewWorkoutExercise());
  const goToStats = () => navigateToStats(getNewWorkoutExercise());

  const adjustRestTime = (seconds: number) => {
    setRestTime(Math.min(Math.max(30, restTime + seconds), 300));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleInputFocus = (y: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: y - 150, animated: true });
    }
  };

  const renderSetEditor = () => {
    if (editingSetIndex === null) return null;

    const set = setConfigs[editingSetIndex];

    return (
      <View className="mb-6 bg-muted p-4 rounded-xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base font-semibold">Satz {editingSetIndex + 1} bearbeiten</Text>
          <Button variant="ghost" size="sm" onPress={() => setEditingSetIndex(null)} haptics="light">
            <Text className="text-primary font-medium">Fertig</Text>
          </Button>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-2">Wiederholungen</Text>
          <View className="flex-row items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onPress={() => updateSetReps(editingSetIndex, set.reps - 1)}
              disabled={set.reps <= 1}
              haptics="light"
            >
              <Minus size={16} className="text-foreground" />
            </Button>
            <Input
              className="text-center text-lg font-semibold flex-1 h-10"
              value={set.reps.toString()}
              onChangeText={(text) => updateSetReps(editingSetIndex, parseInt(text) || set.reps)}
              keyboardType="number-pad"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onPress={() => updateSetReps(editingSetIndex, set.reps + 1)}
              disabled={set.reps >= 30}
              haptics="light"
            >
              <Plus size={16} className="text-foreground" />
            </Button>
          </View>
        </View>

        <View>
          <Text className="text-sm text-muted-foreground mb-2">Gewicht (kg)</Text>
          <Input
            className="text-lg font-semibold h-12"
            value={set.weight?.toString() || ""}
            onChangeText={(text) => updateSetWeight(editingSetIndex, parseFloat(text) || 0)}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>
      </View>
    );
  };

  return (
    <ExerciseBottomSheetHeader title="Übung bearbeiten" onClose={onClose} onSave={save}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-background"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="p-4">
            <ExerciseOverviewCard exercise={exercise} onPress={goToExerciseDetails} />

            {renderSetEditor()}

            <Separator className="my-6" />
            <Text className="text-base font-medium mb-4">Weitere Optionen</Text>
            {/* View Exercise Details */}
            <Pressable
              className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                goToExerciseDetails();
              }}
            >
              <View className="flex-row items-center">
                <Info size={20} className="text-foreground mr-3" />
                <View>
                  <Text className="font-medium">Übung ansehen</Text>
                  <Text className="text-sm text-muted-foreground">Details & Ausführung</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
            {/* Fortschritt & Ziele 
            <Pressable
              className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                goToStats();
              }}
            >
              <View className="flex-row items-center">
                <BarChart2 size={20} className="text-foreground mr-3" />
                <View>
                  <Text className="font-medium">Fortschritt & Ziele</Text>
                  <Text className="text-sm text-muted-foreground">Verlauf und Zielgewichte festlegen</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
            */}
            {/* Alternative Exercise */}
            <Pressable
              className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                goToAlternativeExercises();
              }}
            >
              <View className="flex-row items-center">
                <Repeat size={20} className="text-foreground mr-3" />
                <View>
                  <Text className="font-medium">Alternative Übungen</Text>
                  <Text className="text-sm text-muted-foreground">Ähnliche Übungen verwalten</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
            {/* Exercise Notes Pressable */}
            <Pressable
              className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-6 active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                goToNotes();
              }}
            >
              <View className="flex-row items-center">
                <FileText size={20} className="text-foreground mr-3" />
                <View>
                  <Text className="font-medium">Notizen</Text>
                  <Text className="text-sm text-muted-foreground">Notizen bearbeiten</Text>
                </View>
              </View>
              <View className="h-2 w-2 rounded-full bg-primary mr-2" />
              <ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ExerciseBottomSheetHeader>
  );
};

// Add display name for debugging
ExerciseEditPage.displayName = "ExerciseEditPage";
