import React, { forwardRef } from "react";
import { View, Pressable, TextInput, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus, Minus, Timer, BarChart2, Repeat, ChevronRight, FileText, Info } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import { ExerciseCard } from "./ExerciseCard";
import { Router } from "react-native-actions-sheet";

export interface ExerciseEditHandle {
  save: () => void;
}

export interface ExerciseEditPageProps {
  exercise: Exercise;
  sets: number;
  setSets: (sets: number) => void;
  reps: number;
  setReps: (reps: number) => void;
  restTime: number;
  setRestTime: (restTime: number) => void;
  router: Router<"sheet-with-router">;
  navigateToExerciseDetails: () => void;
  navigateToNotes: () => void;
  navigateToAlternativeExercises: () => void;
  navigateToStats: () => void;
}

export const ExerciseEditPage: React.FC<ExerciseEditPageProps> = ({
  exercise,
  sets,
  setSets,
  reps,
  setReps,
  restTime,
  setRestTime,
  navigateToExerciseDetails,
  navigateToNotes,
  navigateToAlternativeExercises,
  navigateToStats,
}) => {
  const adjustValue = (type: "sets" | "reps" | "rest", increment: boolean) => {
    switch (type) {
      case "sets":
        setSets(Math.min(Math.max(1, sets + (increment ? 1 : -1)), 10));
        break;
      case "reps":
        setReps(Math.min(Math.max(1, sets + (increment ? 1 : -1)), 30));
        break;
      case "rest":
        setRestTime(Math.min(Math.max(30, sets + (increment ? 15 : -15)), 180));
        break;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Exercise Info Card */}
      <View className="p-4">
        <ExerciseCard exercise={exercise} />
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
                onChangeText={(text) => setSets(parseInt(text) || 0)}
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
                onChangeText={(text) => setReps(parseInt(text) || 0)}
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
            <Pressable className="bg-background/50 px-6 py-2 rounded-lg flex-row items-center gap-2" onPress={() => {}}>
              <Timer size={20} className="text-muted-foreground" />
              <TextInput
                className="text-3xl font-semibold text-center w-16 text-primary"
                value={restTime.toString()}
                onChangeText={(text) => setRestTime(parseInt(text) || 0)}
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
          onPress={navigateToExerciseDetails}
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
          onPress={navigateToStats}
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
          onPress={navigateToAlternativeExercises}
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
          onPress={navigateToNotes}
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
  );
};

// Add display name for debugging
ExerciseEditPage.displayName = "ExerciseEditPage";
