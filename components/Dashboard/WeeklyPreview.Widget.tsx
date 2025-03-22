import { Pressable } from "react-native";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, BicepsFlexed, BedDouble } from "~/lib/icons/Icons";
import { P } from "../ui/typography";
import { Exercise, Routine, Workout, WorkoutSession } from "~/lib/types";
import { getNextWorkout, getRemainingWorkoutSchedule } from "~/lib/workoutPlanning";
import { memo, useMemo } from "react";

export type WeeklyPreviewWidgetProps = {
  activeRoutine: Routine | null;
  allSessions: WorkoutSession[];
  allExercises: Exercise[];
};

export type WeekDay = {
  // 0 = Monday, 6 = Sunday
  dayInTheWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  activity: WorkoutSession[] | Workout | null;
};

export const WeeklyPreviewWidget = memo(
  ({ activeRoutine, allSessions, allExercises }: WeeklyPreviewWidgetProps) => {
    const workouts = activeRoutine?.workouts || [];

    // Get sessions from this week
    const sessionsThisWeek = useMemo(() => {
      return allSessions.filter((session) => {
        const sessionDate = new Date(session.date);
        const startOfWeek = new Date();
        const diff = (startOfWeek.getDay() + 6) % 7;
        startOfWeek.setDate(startOfWeek.getDate() - diff);
        return sessionDate >= startOfWeek;
      });
    }, [allSessions]);

    const today = ((new Date().getDay() - 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const remainingDays = 7 - today;

    const frequency = activeRoutine?.frequency || sessionsThisWeek.length;

    const getRemainingWorkouts = useMemo(() => {
      const remainingWorkouts = Math.min(frequency - sessionsThisWeek.length, remainingDays);
      if (remainingWorkouts <= 0) return [];

      const nextWorkoutId = getNextWorkout(workouts, allSessions.slice(-3), allExercises);
      let nextWorkoutIndex = workouts.findIndex((workout) => workout.id === nextWorkoutId);

      const schedule: Workout[] = Array.from(
        { length: remainingWorkouts },
        (_, i) => workouts[(nextWorkoutIndex + i) % workouts.length]
      );

      return schedule;
    }, [workouts, allSessions, allExercises, frequency, sessionsThisWeek.length, remainingDays]);

    const schedule = useMemo(() => {
      return getRemainingWorkoutSchedule(today, sessionsThisWeek, getRemainingWorkouts);
    }, [today, sessionsThisWeek, getRemainingWorkouts]);

    console.log("schedule", schedule);

    // Helper function to get day abbreviation
    const getDayAbbreviation = (day: number) => {
      const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
      return days[day];
    };

    // Helper function to render the correct icon based on activity
    const renderDayIcon = (dayInfo: WeekDay) => {
      if (Array.isArray(dayInfo.activity)) {
        // Completed session
        return (
          <Pressable className="rounded-full bg-green-500 p-2 shadow-sm">
            <Check size={24} className="text-white" />
          </Pressable>
        );
      } else if (dayInfo.activity) {
        // Planned workout
        return (
          <Pressable className="rounded-full bg-secondary p-2 shadow-sm">
            <BicepsFlexed size={24} className="text-secondary-foreground" />
          </Pressable>
        );
      } else {
        // Rest day
        return (
          <Pressable className="rounded-full bg-muted p-2 shadow-sm">
            <BedDouble size={24} className="text-muted-foreground" />
          </Pressable>
        );
      }
    };

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Deine Woche</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const dayInfo = schedule.find((day) => day.dayInTheWeek === dayIndex);

              return (
                <View key={dayIndex} className="flex-column items-center gap-2">
                  {dayInfo ? (
                    renderDayIcon(dayInfo)
                  ) : (
                    <Pressable className="rounded-full bg-muted p-2 shadow-sm">
                      <BedDouble size={24} className="text-muted-foreground" />
                    </Pressable>
                  )}
                  <P>{getDayAbbreviation(dayIndex)}</P>
                </View>
              );
            })}
          </View>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if activeRoutine or allSessions change
    return (
      prevProps.activeRoutine?.id === nextProps.activeRoutine?.id &&
      prevProps.allSessions.length === nextProps.allSessions.length &&
      prevProps.allSessions.every((session, index) => session.workoutId === nextProps.allSessions[index].workoutId)
    );
  }
);
