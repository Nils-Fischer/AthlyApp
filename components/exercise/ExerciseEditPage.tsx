import React, { useState } from "react";
import { View, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus, Minus, Timer, BarChart2, Repeat, ChevronRight, FileText, Info } from "~/lib/icons/Icons";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import { AlternativeExercisesModal } from "./AlternativeExercisesModal";
import { ExerciseNotesModal } from "./ExerciseNotesModal";
import { ExerciseProgressModal } from "./ExerciseProgressModal";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseEditPageProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onClose: () => void;
  onUpdate: (exercise: WorkoutExercise) => void;
  onExercisePress?: (exerciseId: number) => void;
}

export const ExerciseEditPage: React.FC<ExerciseEditPageProps> = ({
  exercise,
  workoutExercise,
  onClose,
  onUpdate,
  onExercisePress,
}) => {
  const [sets, setSets] = useState(workoutExercise.sets);
  const [reps, setReps] = useState(
    typeof workoutExercise.reps === "number" ? workoutExercise.reps : workoutExercise.reps[0]
  );
  const [restTime, setRestTime] = useState(workoutExercise.restPeriod || 90);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(workoutExercise.notes || "");
  const [showProgress, setShowProgress] = useState(false);

  const handleViewExercise = () => {
    if (onExercisePress) {
      onExercisePress(exercise.id);
    }
  };

  const handleSave = () => {
    console.log("ExerciseEditPage - Saving changes:", { sets, reps, restPeriod: restTime });
    onUpdate({
      ...workoutExercise,
      sets,
      reps,
      restPeriod: restTime,
    });
    onClose();
  };

  const adjustValue = (type: "sets" | "reps" | "rest", increment: boolean) => {
    switch (type) {
      case "sets":
        setSets((prev) => Math.min(Math.max(1, prev + (increment ? 1 : -1)), 10));
        break;
      case "reps":
        setReps((prev) => Math.min(Math.max(1, prev + (increment ? 1 : -1)), 30));
        break;
      case "rest":
        setRestTime((prev) => Math.min(Math.max(30, prev + (increment ? 15 : -15)), 180));
        break;
    }
  };

  const handleAlternativeExercises = () => {
    setShowAlternatives(true);
  };

  const handleSelectAlternative = (selectedExercise: Exercise) => {
    // Erstelle neue Übung mit den aktuellen Parametern
    const newExercise: WorkoutExercise = {
      exerciseId: selectedExercise.id,
      sets: workoutExercise.sets,
      reps: workoutExercise.reps,
      weight: workoutExercise.weight,
      restPeriod: workoutExercise.restPeriod,
      alternatives: [],
    };

    // Übergebe die neue Übung und die zu ersetzende ID
    onUpdate(newExercise);
    setShowAlternatives(false);
    onClose();
  };

  const handleProgressAndGoals = () => {
    setShowProgress(true);
  };

  const handleNotes = () => {
    setShowNotes(true);
  };

  const handleSaveNotes = (updatedNotes: string) => {
    setNotes(updatedNotes);
    onUpdate({
      ...workoutExercise,
      notes: updatedNotes,
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Exercise Info Card */}
      <View className="p-4">
        <ExerciseCard exercise={exercise} />
        {/* Sets */}
        <View className="mb-6">
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
        <Separator className="my-6" />: {/* Additional Options */}
        <Text className="text-base font-medium mb-4">Weitere Optionen</Text>
        {/* View Exercise Details */}
        <Pressable
          className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-3 active:opacity-70"
          onPress={handleViewExercise}
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
          onPress={handleProgressAndGoals}
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
          onPress={handleAlternativeExercises} // Hier den neuen Handler verwenden
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
        {/* Alternative Exercises Modal */}
        <Modal visible={showAlternatives} animationType="slide" onRequestClose={() => setShowAlternatives(false)}>
          <AlternativeExercisesModal
            exercise={exercise}
            onClose={() => setShowAlternatives(false)}
            onSelectAlternative={handleSelectAlternative}
          />
        </Modal>
        {/* Progress Modal */}
        <Modal visible={showProgress} animationType="slide" onRequestClose={() => setShowProgress(false)}>
          <ExerciseProgressModal exercise={exercise} onClose={() => setShowProgress(false)} />
        </Modal>
        {/* Notes Modal */}
        <Modal visible={showNotes} animationType="slide" onRequestClose={() => setShowNotes(false)}>
          <ExerciseNotesModal
            initialNotes={notes}
            onClose={() => setShowNotes(false)}
            onSave={handleSaveNotes}
            exerciseName={exercise.name}
          />
        </Modal>
        {/* Exercise Notes Pressable */}
        <Pressable
          className="flex-row items-center justify-between p-4 bg-secondary/10 rounded-lg mb-6 active:opacity-70"
          onPress={handleNotes}
        >
          <View className="flex-row items-center">
            <FileText size={20} className="text-foreground mr-3" />
            <View>
              <Text className="font-medium">Notizen</Text>
              <Text className="text-sm text-muted-foreground">
                {notes ? "Notizen bearbeiten" : "Persönliche Anmerkungen"}
              </Text>
            </View>
          </View>
          {notes && <View className="h-2 w-2 rounded-full bg-primary mr-2" />}
          <ChevronRight size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
    </View>
  );
};
