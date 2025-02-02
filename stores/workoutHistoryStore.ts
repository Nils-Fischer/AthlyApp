import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { WorkoutSession, ExerciseRecord } from "~/lib/types";

interface WorkoutHistoryState {
  sessions: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => Promise<void>;
  getLastExerciseRecord: (exerciseId: number) => ExerciseRecord | undefined;
  getLastWorkout: (workoutId: number) => WorkoutSession | undefined;
}

export const useWorkoutHistoryStore = create<WorkoutHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addWorkoutSession: async (session: WorkoutSession) => {
        const newSessions = [...get().sessions, session];
        set({ sessions: newSessions });
      },

      getLastExerciseRecord: (exerciseId: number) => {
        const { sessions } = get();
        // Sort sessions by date in descending order
        const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime());

        // Find the last session containing the exercise
        for (const session of sortedSessions) {
          const exercise = session.entries.find((entry) => entry.exerciseId === exerciseId);
          if (exercise) return exercise;
        }
        return undefined;
      },

      getLastWorkout: (workoutId: number) => {
        const { sessions } = get();
        return sessions.find((session) => session.workoutId === workoutId);
      },
    }),
    {
      name: "workout-history",
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (_key: string, value: any): any => {
          if (value && typeof value === "object" && "type" in value && value.type === "date") {
            return new Date(value.value);
          }
          return value;
        },
        replacer: (_key: string, value: any): any => {
          if (value instanceof Date) {
            return {
              type: "date" as const,
              value: value.toISOString(),
            };
          }
          return value;
        },
      }),
    }
  )
);
