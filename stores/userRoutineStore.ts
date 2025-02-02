import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine } from "~/lib/types";

export interface UserRoutineState {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: number) => void;
  toggleRoutineActive: (routineId: number) => void;
  getActiveRoutine: () => Routine | null;
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
    }),
    {
      name: "user-routines-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
