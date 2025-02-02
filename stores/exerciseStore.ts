import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "~/lib/supabase";
import { Exercise } from "~/lib/types";

interface ExerciseState {
  exercises: Exercise[] | null;
  isLoading: boolean;
  error: Error | null;
  fetchInitialData: () => Promise<void>;
  getExerciseById: (exerciseId: number) => Exercise | null;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: [],
      isLoading: false,
      error: null,
      fetchInitialData: async () => {
        console.log("🏋️ Fetching exercises data...");
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.from("exercises").select("*").throwOnError();

          if (error) throw error;
          if (!data) throw new Error("No data received from database");

          const exercises = Array.isArray(data) ? data : [];
          console.log(`✅ Successfully fetched ${exercises.length} exercises`);

          set({ exercises, error: null, isLoading: false });
        } catch (error) {
          console.error("❌ Error fetching exercises:", error);
          set({
            exercises: [],
            error: error instanceof Error ? error : new Error("Unknown error"),
            isLoading: false,
          });
        }
      },
      getExerciseById: (exerciseId: number) => {
        const exercises = get().exercises;
        if (!exercises) return null;
        return exercises.find((exercise) => exercise.id === exerciseId) || null;
      },
    }),
    {
      name: "exercise-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
