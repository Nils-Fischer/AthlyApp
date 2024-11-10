import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { Exercise } from "~/lib/types";

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  error: Error | null;
  fetchInitialData: () => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  isLoading: true,
  error: null,
  fetchInitialData: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await supabase.from("exercises").select("*");
      if (!response) console.error("Failed to import Exercises");
      const exercises = (response.data || []) as Exercise[];
      const error = response ? null : Error("Failed to import Exercises");
      set({ exercises: exercises, error: error, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },
}));
