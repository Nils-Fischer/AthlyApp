// stores/workoutHistoryStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutHistoryStore, SetInput, WorkoutHistory } from '~/lib/types';

const STORAGE_KEY = '@workout_history';

export const useWorkoutHistoryStore = create<WorkoutHistoryStore>((set, get) => ({
  history: {},

  init: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ history: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load workout history:', e);
    }
  },

  addWorkoutHistory: async (exerciseId: number, sets: SetInput[]) => {
    try {
      const newHistory: WorkoutHistory = {
        ...get().history,
        [exerciseId]: {
          date: new Date().toISOString(),
          sets,
          volume: sets.reduce((total, set) => 
            total + (set.weight * set.reps), 0
          )
        }
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      set({ history: newHistory });
    } catch (e) {
      console.error('Failed to save workout history:', e);
    }
  },

  getLastWorkout: (exerciseId: number) => {
    return get().history[exerciseId];
  },
}));