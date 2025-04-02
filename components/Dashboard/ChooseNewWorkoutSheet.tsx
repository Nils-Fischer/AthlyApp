import React from "react";
import { Exercise, Routine, Workout } from "~/lib/types";
import { BottomSheet } from "../ui/bottom-sheet";
import { RoutineLibrary } from "../Routine/RoutineLibrary";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { WorkoutCard } from "../Workout/WorkoutCard";
import { P } from "../ui/typography";

export type ChooseNewWorkoutSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workout: Workout) => void;
  routines: Routine[];
  exercises: Exercise[];
};

export const ChooseNewWorkoutSheet = ({
  isOpen,
  onClose,
  onSelect,
  routines,
  exercises,
}: ChooseNewWorkoutSheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRoutines = useMemo(() => {
    return routines.filter((routine) => routine.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [routines, searchQuery]);

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const showDetails = (workoutId: string) => {
    expandedWorkouts.includes(workoutId)
      ? setExpandedWorkouts((prev) => prev.filter((id) => id !== workoutId))
      : setExpandedWorkouts((prev) => [...prev, workoutId]);
  };

  const handleClose = () => {
    onClose();
    setSelectedRoutine(null);
    setSelectedWorkout(null);
  };

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const confirmSelection = () => {
    if (selectedWorkout) {
      onSelect(selectedWorkout);
    }
  };

  if (!selectedRoutine) {
    return (
      <BottomSheet title="Workout auswählen" isOpen={isOpen} onClose={onClose}>
        <RoutineLibrary
          routines={filteredRoutines}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRoutinePress={(routineId) => {
            const routine = routines.find((r) => r.id === routineId);
            if (routine) {
              setSelectedWorkout(null);
              setSelectedRoutine(routine);
            }
          }}
        />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      title="Workout auswählen"
      isOpen={isOpen}
      onClose={handleClose}
      onSave={selectedWorkout ? confirmSelection : undefined}
      onBack={() => setSelectedRoutine(null)}
    >
      <ScrollView className="p-4 mb-20 pb-20">
        <View className="gap-2">
          {selectedRoutine &&
            selectedRoutine.workouts.map((workout) => {
              const isSelected = selectedWorkout?.id === workout.id;
              return (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  isSelected={isSelected}
                  onPress={handleSelectWorkout}
                  exercises={exercises}
                />
              );
            })}
        </View>

        {selectedWorkout && (
          <View className="mt-6">
            <Pressable onPress={confirmSelection} className="bg-primary py-3 rounded-md items-center active:opacity-70">
              <P className="text-primary-foreground font-semibold">Workout starten</P>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
};
