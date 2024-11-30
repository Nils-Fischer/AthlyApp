import { Pencil, Plus, Trash2, X, ChevronLeft, AlertOctagon, Edit3, Repeat } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Image, Modal, Pressable, View } from "react-native";
import { Workout, WorkoutExercise, Exercise } from "~/lib/types";
import { Text } from "~/components/ui/text";
import { MoreHorizontal } from "~/lib/icons/Icons";
import React, { useState } from "react";
import { Card } from "~/components/ui/card";
import { ExerciseLibrary } from "~/components/exercise/ExerciseLibrary";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ExerciseEditPage } from "./ExerciseEditPage";
import { AlternativeExercisesModal } from "./AlternativeExercisesModal";

export function WorkoutPage({
  workout,
  routineName,
  onExercisePress,
  onUpdateWorkout,
}: {
  workout: Workout;
  routineName: string;
  onExercisePress?: (exerciseId: number) => void;
  onUpdateWorkout?: (workout: Workout) => void;
}) {
  const exerciseStore = useExerciseStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);




  const findFullExercise = (workoutExercise: WorkoutExercise) => {
    return exerciseStore.exercises.find((ex) => ex.id === workoutExercise.exerciseId);
  };

  const getRepsRange = (exercise: WorkoutExercise) => {
    if (exercise.reps === 10) return "10 Wdh.";
    if (Array.isArray(exercise.reps)) return `${exercise.reps[0]}-${exercise.reps[1]} Wdh.`;
    return `${exercise.reps} Wdh.`;
  };

  const handleUpdateExercise = (updatedExercise: WorkoutExercise) => {
    console.log("WorkoutPage - Updating exercise:", updatedExercise);
    
    // Finde den Index der alten Übung
    const exerciseIndex = workout.exercises.findIndex(
      ex => ex.exerciseId === selectedExercise?.exerciseId
    );
  
    if (exerciseIndex === -1) return;
  
    // Erstelle eine neue Liste mit der ersetzten Übung
    const newExercises = [...workout.exercises];
  newExercises[exerciseIndex] = {
    ...newExercises[exerciseIndex],
    ...updatedExercise,
  };

  const updatedWorkout = {
    ...workout,
    exercises: newExercises
  };

  console.log("WorkoutPage - Updated workout:", updatedWorkout);
  onUpdateWorkout?.(updatedWorkout);

  setShowEditPage(false);
  setSelectedExercise(null);
};

  const handleRemoveExercise = (exerciseId: number) => {
    setExerciseToDelete(exerciseId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (exerciseToDelete) {
      const updatedWorkout = {
        ...workout,
        exercises: workout.exercises.filter((ex) => ex.exerciseId !== exerciseToDelete),
      };
      onUpdateWorkout?.(updatedWorkout);
      setShowDeleteConfirm(false);
      setExerciseToDelete(null);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      alternatives: [],
      sets: 3,
      reps: 10,
      weight: 0,
      isMarked: false    };

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };
    onUpdateWorkout?.(updatedWorkout);
    setShowAddExercise(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (showAddExercise) setShowAddExercise(false);
  };
  
  const ExerciseOptionsMenu = ({ 
    exercise, 
    workoutExercise,
    onClose,
    onUpdate 
  }: { 
    exercise: Exercise;
    workoutExercise: WorkoutExercise;
    onClose: () => void;
    onUpdate: (exercise: WorkoutExercise) => void;
  }) => {
    const handleMarkExercise = () => {
      onUpdate({
        ...workoutExercise,
        isMarked: !workoutExercise.isMarked
      });
      onClose();
    };
  
    const handleShowAlternatives = () => {
      setSelectedExercise(workoutExercise);
      setShowAlternatives(true);
      onClose();
    };
  
    const handleEditDetails = () => {
      setSelectedExercise(workoutExercise);
      setShowEditPage(true);
      onClose();
    };

    return (
      <View className="p-4">
        <View className="gap-4">
          <Pressable 
            className="flex-row items-center p-3 active:opacity-70"
            onPress={handleShowAlternatives}
          >
            <Repeat size={20} className="text-foreground mr-3" />
            <View>
              <Text className="font-medium">Alternative Übung</Text>
              <Text className="text-sm text-muted-foreground">Ähnliche Übung auswählen</Text>
            </View>
          </Pressable>
          
          <Pressable 
            className="flex-row items-center justify-between p-3 active:opacity-70"
            onPress={handleMarkExercise}
          >
            <View className="flex-row items-center">
              <AlertOctagon size={20} className={`mr-3 ${workoutExercise.isMarked ? 'text-primary' : 'text-foreground'}`} />
              <View>
                <Text className="font-medium">Übung markieren</Text>
                <Text className="text-sm text-muted-foreground">Übung hervorheben</Text>
              </View>
            </View>
            {workoutExercise.isMarked && (
              <View className="h-2 w-2 rounded-full bg-primary" />
            )}
          </Pressable>
  
          <Pressable 
            className="flex-row items-center p-3 active:opacity-70"
            onPress={handleEditDetails}
          >
            <Edit3 size={20} className="text-foreground mr-3" />
            <View>
              <Text className="font-medium">Details bearbeiten</Text>
              <Text className="text-sm text-muted-foreground">Parameter & Optionen anpassen</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-muted-foreground">{routineName}</Text>
        <Button 
          variant="ghost" 
          className="h-8 px-3 flex-row items-center" 
          onPress={toggleEditMode}
        >
          {isEditMode ? (
            <>
              <X size={16} className="text-destructive mr-2" />
              <Text className="text-destructive text-sm font-medium">Abbrechen</Text>
            </>
          ) : (
            <>
              <Pencil size={16} className="text-primary mr-2" />
              <Text className="text-primary text-sm font-medium">Bearbeiten</Text>
            </>
          )}
        </Button>
      </View>

      {isEditMode && (
        <Pressable onPress={() => setShowAddExercise(true)}>
          <Card className="mb-4 p-4 flex-row justify-between items-center bg-secondary/10">
            <Text className="text-sm font-medium">Übung hinzufügen</Text>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Plus size={20} className="text-primary" />
            </Button>
          </Card>
        </Pressable>
      )}

      <View className="gap-3">
        {workout.exercises.map((workoutExercise) => {
          const exercise = findFullExercise(workoutExercise);
          if (!exercise) return null;


          return (
            <Pressable
              key={workoutExercise.exerciseId}
              onPress={() => {
                if (isEditMode) {
                  setSelectedExercise(workoutExercise);
                  setShowEditPage(true);
                } else {
                  onExercisePress?.(exercise.id);
                }
              }}
              className="active:opacity-70"
            >
              <View className="bg-card rounded-xl p-4 border border-border">
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-3 flex-1">
                    <View className="w-12 h-12 bg-muted rounded-lg items-center justify-center overflow-hidden">
                      {exercise.images?.[0] ? (
                        <Image
                          source={{ uri: exercise.images[0] }}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          source={{ uri: "/api/placeholder/48/48" }}
                          alt={exercise.name}
                          className="w-8 h-8 object-cover"
                        />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium mb-1">{exercise.name}</Text>
                      <Text className="text-muted-foreground text-sm">{exercise.equipment}</Text>
                    </View>
                  </View>
                  {isEditMode ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onPress={() => handleRemoveExercise(workoutExercise.exerciseId)}
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </Button>
                  ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button variant="ghost" className="h-8 w-8 p-0">
      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
    </Button>
  </DialogTrigger>
  <DialogContent>
    <ExerciseOptionsMenu
      exercise={exercise}
      workoutExercise={workoutExercise} 
      onClose={() => setIsDialogOpen(false)}
      onUpdate={handleUpdateExercise}
    />
  </DialogContent>
</Dialog>
                  )}
                </View>
                <Text className="mt-3 text-sm text-muted-foreground">
                  {workoutExercise.sets} Sätze • {getRepsRange(workoutExercise)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        onRequestClose={() => setShowDeleteConfirm(false)}
        animationType="fade"
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50 px-4"
          onPress={() => setShowDeleteConfirm(false)}
        >
          <Pressable className="w-full" onPress={e => e.stopPropagation()}>
            <View className="bg-background rounded-xl p-6 mx-4">
              <Text className="text-xl font-semibold mb-2">Übung löschen?</Text>
              <Text className="text-base text-muted-foreground mb-6">
                Möchtest du diese Übung wirklich aus dem Workout entfernen?
              </Text>
              <View className="flex-row items-center gap-3">
                <Pressable 
                  onPress={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-12 rounded-lg bg-muted justify-center items-center"
                >
                  <Text className="text-base font-medium">Abbrechen</Text>
                </Pressable>
                <Pressable 
                  onPress={confirmDelete}
                  className="flex-1 h-12 rounded-lg bg-destructive justify-center items-center"
                >
                  <Text className="text-base font-medium text-white">Löschen</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddExercise}
        animationType="slide"
        onRequestClose={() => setShowAddExercise(false)}
      >
        <View className="flex-1 bg-background">
          <View className="pt-14 px-4 py-2 flex-row items-center border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-2"
              onPress={() => setShowAddExercise(false)}
            >
              <ChevronLeft size={24} />
            </Button>
            <Text className="text-lg font-semibold">Übung hinzufügen</Text>
          </View>
          <View className="flex-1">
            <ExerciseLibrary 
              onSelectExercise={handleAddExercise}
            />
          </View>
        </View>
      </Modal>
      {/* Alternative Exercises Modal */}
      <Modal
        visible={showAlternatives}
        animationType="slide"
        onRequestClose={() => setShowAlternatives(false)}
      >
        {selectedExercise && (
          <AlternativeExercisesModal
            exercise={findFullExercise(selectedExercise)!}
            onClose={() => setShowAlternatives(false)}
            onSelectAlternative={(exercise) => {
              handleUpdateExercise({
                ...selectedExercise,
                exerciseId: exercise.id,
              });
              setShowAlternatives(false);
            }}
          />
        )}
      </Modal>

      {/* Exercise Edit Modal */}
      <Modal
  visible={showEditPage}
  animationType="slide"
  onRequestClose={() => setShowEditPage(false)}
>
  {selectedExercise && (
    <ExerciseEditPage
      exercise={findFullExercise(selectedExercise)!}
      workoutExercise={selectedExercise}
      onClose={() => {
        setShowEditPage(false);
        setSelectedExercise(null);
      }}
      onUpdate={handleUpdateExercise}
    />
  )}
</Modal>
    </View>
  );
}