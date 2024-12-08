import React from "react";
import { View, Pressable, TextInput, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus, Minus, Timer, BarChart2, Repeat, ChevronRight, FileText, Info } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import { ExerciseOverviewCard } from "~/components/Exercise/ExerciseOverviewCard";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";

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
  const [sets, setSets] = React.useState(workoutExercise.sets);
  const [reps, setReps] = React.useState(workoutExercise.reps);
  const [restTime, setRestTime] = React.useState(workoutExercise.restPeriod || 120);

  const getNewWorkoutExercise = (): WorkoutExercise => {
    return {
      ...workoutExercise,
      sets: sets,
      reps: reps,
      restPeriod: restTime,
    };
  };

  const save = () => onSave(getNewWorkoutExercise());

  const goToExerciseDetails = () => navigateToExerciseDetails(getNewWorkoutExercise());
  const goToNotes = () => navigateToNotes(getNewWorkoutExercise());
  const goToAlternativeExercises = () => navigateToAlternativeExercises(getNewWorkoutExercise());
  const goToStats = () => navigateToStats(getNewWorkoutExercise());

  const adjustValue = (type: "sets" | "reps" | "rest", increment: boolean) => {
    switch (type) {
      case "sets":
        setSets(Math.min(Math.max(1, sets + (increment ? 1 : -1)), 10));
        break;
      case "reps":
        setReps(Math.min(Math.max(1, reps + (increment ? 1 : -1)), 30));
        break;
      case "rest":
        setRestTime(Math.min(Math.max(30, restTime + (increment ? 15 : -15)), 180));
        break;
    }
  };

  return (
    <ExerciseBottomSheetHeader title="Übung bearbeiten" onClose={onClose} onSave={save}>
      <ScrollView className="flex-1 bg-background">
        {/* Exercise Info Card */}
        <View className="p-4">
          <ExerciseOverviewCard exercise={exercise} />
          {/* Sets */}
          <View className="my-6">
            <Text className="text-base font-medium text-muted-foreground mb-2">Sätze</Text>
            <View className="flex-row items-center justify-between bg-secondary/10 p-4 rounded-xl shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("sets", false)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Minus size={20} className="text-foreground" />
              </Button>
              <Pressable className="bg-background/50 px-6 py-2 rounded-lg" onPress={() => {}}>
                <TextInput
                  className="text-3xl font-semibold text-center w-16 text-primary"
                  value={sets.toString()}
                  onChangeText={(text) => setSets(parseInt(text) || sets)}
                  keyboardType="number-pad"
                />
              </Pressable>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("sets", true)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Plus size={20} className="text-foreground" />
              </Button>
            </View>
          </View>
          {/* Reps */}
          <View className="mb-6">
            <Text className="text-base font-medium text-muted-foreground mb-2">Wiederholungen</Text>
            <View className="flex-row items-center justify-between bg-secondary/10 p-4 rounded-xl shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("reps", false)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Minus size={20} className="text-foreground" />
              </Button>
              <Pressable className="bg-background/50 px-6 py-2 rounded-lg" onPress={() => {}}>
                <TextInput
                  className="text-3xl font-semibold text-center w-16 text-primary"
                  value={reps.toString()}
                  onChangeText={(text) => setReps(parseInt(text) || reps)}
                  keyboardType="number-pad"
                />
              </Pressable>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("reps", true)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Plus size={20} className="text-foreground" />
              </Button>
            </View>
          </View>
          {/* Rest Time */}
          <View className="mb-6">
            <Text className="text-base font-medium text-muted-foreground mb-2">Pausenzeit</Text>
            <View className="flex-row items-center justify-between bg-secondary/10 p-4 rounded-xl shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("rest", false)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Minus size={20} className="text-foreground" />
              </Button>
              <Pressable
                className="bg-background/50 px-6 py-2 rounded-lg flex-row items-center gap-2"
                onPress={() => {}}
              >
                <Timer size={20} className="text-muted-foreground" />
                <TextInput
                  className="text-3xl font-semibold text-center w-16 text-primary"
                  value={restTime.toString()}
                  onChangeText={(text) => setRestTime(parseInt(text) || restTime)}
                  keyboardType="number-pad"
                />
                <Text className="text-lg text-muted-foreground">s</Text>
              </Pressable>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => adjustValue("rest", true)}
                className="h-11 w-11 bg-background/50 rounded-lg"
              >
                <Plus size={20} className="text-foreground" />
              </Button>
            </View>
          </View>
          <Separator className="my-6" />
          <Text className="text-base font-medium mb-4">Weitere Optionen</Text>
          {/* View Exercise Details */}
          <Pressable
            className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
            onPress={goToExerciseDetails}
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
          {/* Fortschritt & Ziele */}
          <Pressable
            className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
            onPress={goToStats}
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
          {/* Alternative Exercise */}
          <Pressable
            className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
            onPress={goToAlternativeExercises}
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
            onPress={goToNotes}
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
    </ExerciseBottomSheetHeader>
  );
};

// Add display name for debugging
ExerciseEditPage.displayName = "ExerciseEditPage";
