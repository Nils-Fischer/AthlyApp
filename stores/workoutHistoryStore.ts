import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { WorkoutSession, ExerciseRecord } from "~/lib/types";

interface WorkoutHistoryState {
  sessions: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => Promise<void>;
  getLastExerciseRecord: (exerciseId: number) => ExerciseRecord | undefined;
  getLastWorkout: (workoutId: string) => WorkoutSession | undefined;
  getLastSession: () => WorkoutSession | undefined;
  getExerciseRecords: (exerciseId: number) => ExerciseRecord[];
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
        const lastEntry = sessions
          .findLast((session) => session.entries.some((entry) => entry.exerciseId === exerciseId))
          ?.entries.find((entry) => entry.exerciseId === exerciseId);
        return lastEntry;
      },

      getLastWorkout: (workoutId: string) => {
        const { sessions } = get();
        return sessions.findLast((session) => session.workoutId === workoutId);
      },

      getLastSession: () => {
        return get().sessions.at(-1);
      },

      getExerciseRecords: (exerciseId: number) => {
        const { sessions } = get();
        return sessions.flatMap((session) => session.entries.filter((entry) => entry.exerciseId === exerciseId));
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
