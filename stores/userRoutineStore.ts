import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, SetConfiguration, Workout, WorkoutExercise } from "~/lib/types";

export interface UserRoutineState {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: string) => void;
  toggleRoutineActive: (routineId: string) => void;
  getActiveRoutine: () => Routine | null;
  getRoutineById: (routineId: string) => Routine | null;
  getWorkoutById: (workoutId: string) => Workout | null;
  addExerciseToWorkout: (workoutId: string, exercise: WorkoutExercise) => void;
  updateExerciseInWorkout: (workoutId: string, exerciseId: number, exercise: WorkoutExercise) => void;
  deleteExerciseFromWorkout: (workoutId: string, exerciseId: number) => void;
  updateSetsInExercise: (workoutId: string, exerciseId: number, sets: SetConfiguration[]) => void;
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
        console.log(
          `[UserRoutine] Updating sets for exercise ${exerciseId} in workout ${workoutId}. New count: ${sets.length}`
        );
        set((state) => {
          // Make a deep copy of the routines to ensure proper updates
          const updatedRoutines = state.routines.map((routine) => {
            // Check if this routine contains our workout
            const containsWorkout = routine.workouts.some((w) => w.id === workoutId);
            if (!containsWorkout) return routine;

            return {
              ...routine,
              workouts: routine.workouts.map((workout) => {
                if (workout.id !== workoutId) return workout;

                return {
                  ...workout,
                  exercises: workout.exercises.map((exercise) => {
                    if (exercise.exerciseId !== exerciseId) return exercise;

                    // Log the update for debugging
                    console.log(
                      `[UserRoutine] Found exercise to update. Old sets: ${exercise.sets.length}, New sets: ${sets.length}`
                    );

                    return {
                      ...exercise,
                      sets: [...sets], // Create a new array to ensure reference changes
                    };
                  }),
                };
              }),
            };
          });

          return { routines: updatedRoutines };
        });
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
