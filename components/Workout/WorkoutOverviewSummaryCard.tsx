import { CardLabel, Muted, P } from "../ui/typography";
import { View } from "react-native";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Small } from "../ui/typography";
import { Exercise, Muscle, MuscleGroup, Workout } from "~/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Lead } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Clock, Dumbbell, Pencil, BarChart3 } from "~/lib/icons/Icons";
import { CardLabelInput, PInput } from "../ui/typography-inputs";
import { getMuscleGroup } from "~/lib/utils";

export interface WorkoutOverviewSummaryCardProps {
  workout: Workout;
  isEditMode: boolean;
  getExerciseById: (id: number) => Exercise | null;
  onUpdateWorkout: (updatedWorkout: Workout) => void;
}

export function WorkoutOverviewSummaryCard({
  workout,
  isEditMode,
  getExerciseById,
  onUpdateWorkout,
}: WorkoutOverviewSummaryCardProps) {
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [workoutDescription, setWorkoutDescription] = useState(workout.description);

  useEffect(() => {
    if (workout && !isEditMode && (workout?.name !== workoutName || workout?.description !== workoutDescription)) {
      const updatedWorkout: Workout = {
        ...workout,
        name: workoutName,
        description: workoutDescription,
      };
      onUpdateWorkout(updatedWorkout);
    }
  }, [isEditMode]);

  const getWorkoutStats = () => {
    if (!workout) return { totalExercises: 0, totalSets: 0, estimatedDuration: 0, muscleGroups: [] as MuscleGroup[] };

    const totalExercises = workout.exercises.length;
    const totalSets = workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    const estimatedDuration = workout.duration || totalSets * 2; // Estimate 2 minutes per set if duration not provided

    // Extract primary muscle groups from exercises using the utility function
    const muscleGroupsSet = new Set<MuscleGroup>();
    workout.exercises.forEach((ex) => {
      const exercise = getExerciseById(ex.exerciseId);
      if (exercise?.primaryMuscles) {
        exercise.primaryMuscles.forEach((muscle: Muscle) => {
          const muscleGroup = getMuscleGroup(muscle);
          muscleGroupsSet.add(muscleGroup);
        });
      }
    });

    return {
      totalExercises,
      totalSets,
      estimatedDuration,
      muscleGroups: Array.from(muscleGroupsSet),
    };
  };

  const workoutStats = useMemo(() => getWorkoutStats(), [workout]);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>
          {isEditMode ? (
            <View className="flex-row gap-2 items-center">
              <CardLabelInput
                className="text-lg text-foreground"
                onChangeText={setWorkoutName}
                value={workoutName || "Workout"}
              />
              <Pencil className="text-muted-foreground/80" size={12} />
            </View>
          ) : (
            <CardLabel className="text-lg text-foreground">{workoutName}</CardLabel>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditMode ? (
          <PInput
            className="text-md"
            defaultValue={workoutDescription}
            onChangeText={setWorkoutDescription}
            autoFocus={true}
          />
        ) : (
          <View className="flex-column gap-6">
            <P className="text-md">{workoutDescription || "Keine Beschreibung vorhanden."}</P>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Dumbbell size={16} className="text-primary mr-2" />
                <Small>Übungen: {workoutStats.totalExercises}</Small>
              </View>
              <View className="flex-row items-center">
                <BarChart3 size={16} className="text-primary mr-2" />
                <Small>Sätze: {workoutStats.totalSets}</Small>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} className="text-primary mr-2" />
                <Small>~{workoutStats.estimatedDuration} Min.</Small>
              </View>
            </View>

            {workoutStats.muscleGroups.length > 0 && (
              <View>
                <Muted className="mb-1">Muskelgruppen:</Muted>
                <View className="flex-row flex-wrap gap-1">
                  {workoutStats.muscleGroups.map((muscleGroup, index) => (
                    <Badge key={index} className="bg-primary text-primary-foreground">
                      <P className="font-bold text-primary-foreground">{muscleGroup}</P>
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            <Lead className="text-sm text-muted-foreground">Drücke auf eine Übung um mehr Details zu sehen</Lead>
          </View>
        )}
      </CardContent>
    </Card>
  );
}
