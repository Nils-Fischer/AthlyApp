import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, Workout } from "~/lib/types";

export interface UserRoutineState {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: number) => void;
  toggleRoutineActive: (routineId: number) => void;
  getActiveRoutine: () => Routine | null;
  getRoutineById: (routineId: number) => Routine | null;
  getWorkoutById: (routineId: number, workoutId: number) => Workout | null;
}

export const useUserRoutineStore = create<UserRoutineState>()(
  persist(
    (set, get) => ({
      routines: [],

      addRoutine: (routine) => {
        if (get().routines.find((r) => r.id === routine.id)) {
          return;
        }
        if (get().routines.length === 0) {
          routine.active = true;
        }
        set((state) => ({
          routines: [...state.routines, routine],
        }));
      },

      updateRoutine: (updatedRoutine) =>
        set((state) => ({
          routines: state.routines.map((routine) => (routine.id === updatedRoutine.id ? updatedRoutine : routine)),
        })),

      deleteRoutine: (routineId) =>
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== routineId),
        })),

      toggleRoutineActive: (routineId) => {
        set((state) => {
          return {
            routines: state.routines.map((r) =>
              r.id === routineId ? { ...r, active: !r.active } : { ...r, active: false }
            ),
          };
        });
      },

      getActiveRoutine: () => {
        return get().routines.find((routine) => routine.active) || null;
      },

      getRoutineById: (routineId) => {
        return get().routines.find((routine) => routine.id === routineId) || null;
      },

      getWorkoutById: (routineId, workoutId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        return routine?.workouts.find((w) => w.id === workoutId) || null;
      },
    }),
    {
      name: "user-routines-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
