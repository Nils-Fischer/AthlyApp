import React from "react";
import { View } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { P, Lead, CardLabel, Muted } from "~/components/ui/typography";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { WorkoutSession } from "~/lib/types";
import { CheckCircle, Plus } from "~/lib/icons/Icons";
import { Button } from "~/components/ui/button";

interface DailyWorkoutSummaryProps {
  sessions: WorkoutSession[];
  onStartNewWorkout: () => void;
}

export const DailyWorkoutSummary: React.FC<DailyWorkoutSummaryProps> = ({ sessions, onStartNewWorkout }) => {
  const today = format(new Date(), "EEEE", { locale: de });
  const completedWorkouts = sessions.filter(
    (session) => format(new Date(session.date), "EEEE", { locale: de }) === today
  );

  const totalExercises = completedWorkouts.reduce((acc, session) => {
    return acc + session.entries.filter((entry) => entry.isCompleted).length;
  }, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>
          <CardLabel>Heutiges Training</CardLabel>
        </CardTitle>
        <CheckCircle size={24} className="text-green-500" />
      </CardHeader>
      <CardContent className="gap-4">
        {completedWorkouts.length > 0 ? (
          <>
            <View className="flex-row justify-between items-center">
              <P className="text-foreground">Trainingszeit</P>
              <Lead>{completedWorkouts[0].duration}</Lead>
            </View>
            <View className="flex-row justify-between items-center">
              <P className="text-foreground">Übungen</P>
              <Lead>
                {totalExercises} {totalExercises === 1 ? "Übung" : "Übungen"}
              </Lead>
            </View>
            <View className="items-center justify-center pt-2">
              <CardLabel className="text-primary text-sm font-bold">Training erfolgreich abgeschlossen!</CardLabel>
            </View>
            <Button
              variant="ghost"
              className="flex-row gap-2 w-full border border-border/50"
              haptics="light"
              onPress={onStartNewWorkout}
            >
              <Plus size={16} className="text-muted-foreground" />
              <Muted className="text-sm">Neues Training starten</Muted>
            </Button>
          </>
        ) : (
          <View className="items-center py-4">
            <P className="text-muted-foreground text-center">
              Heute noch kein Training absolviert. Zeit für dein Workout! 💪
            </P>
          </View>
        )}
      </CardContent>
    </Card>
  );
};
