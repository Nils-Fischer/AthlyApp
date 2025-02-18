import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, SetConfiguration, SetInput, Workout, WorkoutExercise } from "~/lib/types";

export interface UserRoutineState {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: number) => void;
  toggleRoutineActive: (routineId: number) => void;
  getActiveRoutine: () => Routine | null;
  getRoutineById: (routineId: number) => Routine | null;
  getWorkoutById: (workoutId: number) => Workout | null;
  addExerciseToWorkout: (workoutId: number, exercise: WorkoutExercise) => void;
  updateExerciseInWorkout: (workoutId: number, exerciseId: number, exercise: WorkoutExercise) => void;
  deleteExerciseFromWorkout: (workoutId: number, exerciseId: number) => void;
  updateSetsInExercise: (workoutId: number, exerciseId: number, sets: SetConfiguration[]) => void;
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

      getWorkoutById: (workoutId) => {
        const routine = get().routines.find((r) => r.workouts.some((w) => w.id === workoutId));
        return routine?.workouts.find((w) => w.id === workoutId) || null;
      },

      addExerciseToWorkout: (workoutId, exercise) => {
        set((state) => ({
          routines: state.routines.map((routine) => ({
            ...routine,
            workouts: routine.workouts.map((workout) => {
              if (workout.id !== workoutId) return workout;
              return {
                ...workout,
                exercises: [...workout.exercises, exercise],
              };
            }),
          })),
        }));
      },

      deleteExerciseFromWorkout: (workoutId, exerciseId) => {
        set((state) => ({
          routines: state.routines.map((routine) => ({
            ...routine,
            workouts: routine.workouts.map((workout) => {
              if (workout.id !== workoutId) return workout;
              return {
                ...workout,
                exercises: workout.exercises.filter((ex) => ex.exerciseId !== exerciseId),
              };
            }),
          })),
        }));
      },

      updateSetsInExercise: (workoutId, exerciseId, sets) => {
        set((state) => ({
          routines: state.routines.map((routine) => ({
            ...routine,
            workouts: routine.workouts.map((workout) => {
              if (workout.id !== workoutId) return workout;
              return {
                ...workout,
                exercises: workout.exercises.map((exercise) => {
                  if (exercise.exerciseId !== exerciseId) return exercise;
                  return { ...exercise, sets: sets };
                }),
              };
            }),
          })),
        }));
      },

      updateExerciseInWorkout: (workoutId, exerciseId, exercise) => {
        set((state) => ({
          routines: state.routines.map((routine) => ({
            ...routine,
            workouts: routine.workouts.map((workout) => {
              if (workout.id !== workoutId) return workout;
              return {
                ...workout,
                exercises: workout.exercises.map((ex) => (ex.exerciseId === exerciseId ? { ...exercise } : ex)),
              };
            }),
          })),
        }));
      },
    }),
    {
      name: "user-routines-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
