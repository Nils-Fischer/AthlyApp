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
    console.log("🏋️ Fetching exercises data...");
    try {
      set({ isLoading: true, error: null });
      const response = await supabase.from("exercises").select("*");

      if (!response) {
        console.error("❌ No response from Supabase");
        throw new Error("Failed to import Exercises");
      }

      const exercises = (response.data || []) as Exercise[];
      console.log(`✅ Successfully fetched ${exercises.length} exercises`);

      set({ exercises: exercises, error: null, isLoading: false });
    } catch (error) {
      console.error("❌ Error fetching exercises:", error);
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },
}));
