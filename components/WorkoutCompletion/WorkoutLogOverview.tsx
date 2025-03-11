import React from "react";
import { ScrollView, View } from "react-native";
import { WorkoutSession } from "../../lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { H3, P, Small, Muted } from "../ui/typography";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CheckCircle, AlertCircle, CircleX } from "~/lib/icons/Icons";

interface WorkoutSessionLogProps {
  workout: WorkoutSession;
}

export const WorkoutSessionLog: React.FC<WorkoutSessionLogProps> = ({ workout }) => {
  // Format the date in German
  const formattedDate = format(workout.date, "dd. MMMM yyyy", { locale: de });

  return (
    <ScrollView className="bg-background">
      <View className="px-4 py-2 pb-28">
        {/* Workout Header */}
        <View className="mb-4 justify-center items-center">
          <H3 className="mb-2">{workout.workoutName}</H3>
          <Small className="text-muted-foreground">
            {formattedDate} • Dauer: {workout.duration}
          </Small>
        </View>

        {/* Exercise Cards */}
        {workout.entries.map((exercise, index) => {
          // Count completed sets
          const completedSets = exercise.sets.filter((set) => set.completed).length;
          const totalSets = exercise.sets.length;
          const allCompleted = completedSets === totalSets && totalSets > 0;
          const noneCompleted = completedSets === 0;

          return (
            <Card key={`${exercise.exerciseId}-${index}`} className="mb-3">
              <CardHeader className="flex-row justify-between items-center pb-2">
                <CardTitle>{exercise.exerciseName}</CardTitle>
                <View className="flex-row justify-between items-center gap-2">
                  {!allCompleted && !noneCompleted && (
                    <CardDescription>
                      {completedSets}/{totalSets}
                    </CardDescription>
                  )}
                  {/* Status Icons using Lucide */}
                  <View className="flex items-center justify-center w-6 h-6">
                    {allCompleted && <CheckCircle size={24} className="text-green-500" />}
                    {!allCompleted && !noneCompleted && <AlertCircle size={24} className="text-amber-500" />}
                    {noneCompleted && <CircleX size={24} className="text-destructive" />}
                  </View>
                </View>
              </CardHeader>

              <CardContent>
                {noneCompleted ? (
                  <Muted>Keine Sätze absolviert</Muted>
                ) : (
                  <View className="space-y-3">
                    {/* Table Rows */}
                    {exercise.sets.map(
                      (set, setIndex) =>
                        set.completed && (
                          <View key={`set-${setIndex}`} className="flex-row px-1">
                            <P className="w-12 font-bold">{setIndex + 1}</P>
                            <P>
                              {set.weight || 0} kg x {set.reps || 0}
                            </P>
                          </View>
                        )
                    )}
                  </View>
                )}
              </CardContent>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default WorkoutSessionLog;
