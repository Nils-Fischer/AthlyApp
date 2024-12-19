import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutSession, ExerciseRecord } from "~/lib/types";

interface WorkoutHistoryState {
  sessions: WorkoutSession[];
  init: () => Promise<void>;
  addWorkoutSession: (session: WorkoutSession) => Promise<void>;
  getLastWorkout: (exerciseId: number) => ExerciseRecord | undefined;
}

const STORAGE_KEY = "@workout_history";

export const useWorkoutHistoryStore = create<WorkoutHistoryState>((set, get) => ({
  sessions: [],

  init: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const sessions = JSON.parse(stored) || [];
        // Only run forEach if sessions exists and is an array
        if (Array.isArray(sessions)) {
          sessions.forEach((session: WorkoutSession) => {
            session.date = new Date(session.date);
          });
          set({ sessions });
        } else {
          set({ sessions: [] });
        }
      }
    } catch (e) {
      console.error("Failed to load workout history:", e);
      set({ sessions: [] });
    }
  },

  addWorkoutSession: async (session: WorkoutSession) => {
    try {
      const newSessions = [...get().sessions, session];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
      set({ sessions: newSessions });
    } catch (e) {
      console.error("Failed to save workout session:", e);
    }
  },

  getLastWorkout: (exerciseId: number) => {
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
}));
