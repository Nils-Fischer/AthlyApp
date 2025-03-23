import React from "react";
import { Exercise, Routine, Workout } from "~/lib/types";
import { BottomSheet } from "../ui/bottom-sheet";
import { RoutineLibrary } from "../Routine/RoutineLibrary";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pressable, ScrollView, View } from "react-native";
import { CardLabel, P, Small } from "../ui/typography";
import { ChevronDown } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";

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
                <Pressable key={workout.id} onPress={() => handleSelectWorkout(workout)} className="active:opacity-50">
                  <Card className={isSelected ? "border-2 border-green-500/50 bg-green-100/10" : ""}>
                    <CardHeader>
                      <CardTitle>
                        <View className="flex-row items-center justify-between">
                          <CardLabel className={cn("text-foreground font-bold", isSelected && "text-primary")}>
                            {workout.name}
                          </CardLabel>
                        </View>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                          <P className="text-muted-foreground">
                            {workout.exercises.length} {workout.exercises.length === 1 ? "Übung" : "Übungen"}
                          </P>
                          {workout.duration && (
                            <>
                              <P className="text-muted-foreground">•</P>
                              <P className="text-muted-foreground">{workout.duration} min</P>
                            </>
                          )}
                        </View>
                      </View>
                      <Pressable
                        className="border-t border-border mt-3 items-center flex-row justify-between pt-2"
                        onPress={() => showDetails(workout.id)}
                      >
                        <CardLabel className="text-muted-foreground">Details</CardLabel>
                        <ChevronDown
                          className={cn("text-muted-foreground", expandedWorkouts.includes(workout.id) && "rotate-180")}
                          size={24}
                        />
                      </Pressable>
                      {expandedWorkouts.includes(workout.id) && (
                        <View className="gap-3 p-1 pt-3 mt-1 ">
                          {workout.exercises.map((exercise, index) => (
                            <React.Fragment key={exercise.exerciseId}>
                              {index > 0 && <Separator className="my-1" />}
                              <View className="flex-row items-center">
                                <View className="w-7 h-7 rounded-full bg-muted shadow-xs items-center justify-center mr-3">
                                  <Small className="text-primary font-semibold">{index + 1}</Small>
                                </View>
                                <View className="flex-1 gap-1">
                                  <Small className="text-foreground font-medium">
                                    {exercises.find((e) => e.id === exercise.exerciseId)?.name}
                                  </Small>
                                  <Small className="text-muted-foreground">
                                    {exercise.sets.length} {exercise.sets.length === 1 ? "Satz" : "Sätze"}
                                    {exercise.restPeriod && ` • ${exercise.restPeriod}s Pause`}
                                  </Small>
                                </View>
                              </View>
                            </React.Fragment>
                          ))}
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </Pressable>
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
