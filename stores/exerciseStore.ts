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
      const { data: response, error } = await supabase.from("exercises").select("*");

      if (error) {
        console.error("❌ Error fetching exercises:", error);
        throw new Error("Failed to import Exercises");
      }

      const exercises = (response || []) as Exercise[];
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
