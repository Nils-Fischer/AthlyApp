import { create } from "zustand";
import { useUserRoutineStore } from "./userRoutineStore";
import { ExerciseRecord, WorkoutSession } from "~/lib/types";

interface Timer {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
}

interface RestTimer {
  isRunning: boolean;
  duration: number;
  remainingTime: number;
}

interface ActiveWorkoutState {
  // Core workout data
  workoutId: string | null;
  exerciseRecords: Map<number, ExerciseRecord>;

  // Timers
  workoutTimer: Timer;
  restTimer: RestTimer;

  // Actions
  startWorkout: (workoutId: string) => void;
  cancelWorkout: () => void;
  finishWorkout: () => WorkoutSession;

  // Exercise management
  completeExercise: (exerciseId: number, intensity?: number) => void;

  // Set input management
  updateReps: (exerciseId: number, setIndex: number, reps: number) => void;
  updateWeight: (exerciseId: number, setIndex: number, weight: number) => void;

  // Timer controls
  startRestTimer: (duration: number) => void;
  pauseRestTimer: () => void;
  resetRestTimer: () => void;

  // Stats
  getTotalVolume: () => number;
  getCompletedExercises: () => number;
  getRemainingExercises: () => number;
  getCompletedSets: () => number;
  getRemainingSets: () => number;
}

let workoutTimerInterval: NodeJS.Timeout | number | null = null;
let restTimerInterval: NodeJS.Timeout | number | null = null;

export const useActiveWorkoutStore = create<ActiveWorkoutState>()((set, get) => ({
  // Initial state
  workoutId: null,
  exerciseRecords: new Map(),

  workoutTimer: {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
  },

  restTimer: {
    isRunning: false,
    duration: 0,
    remainingTime: 0,
  },

  startWorkout: (workoutId) => {
    console.log(`[Workout] Starting workout - Workout: ${workoutId}`);
    const workout = useUserRoutineStore.getState().getWorkoutById(workoutId);
    if (!workout) {
      console.error(`[Workout] Failed to find workout - Workout: ${workoutId}`);
      console.log(useUserRoutineStore.getState().routines.map((r) => r.id));
      console.log(useUserRoutineStore.getState().routines.map((r) => r.workouts));
      return;
    }

    // Initialize exercise records
    const records = new Map<number, ExerciseRecord>();
    workout.exercises.forEach((exercise) => {
      records.set(exercise.exerciseId, {
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set) => ({
          reps: null,
          weight: null,
          targetReps: set.reps,
          targetWeight: set.weight || 0,
        })),
        isCompleted: false,
        intensity: undefined,
      });
    });

    // Set initial state
    set({
      workoutId,
      exerciseRecords: records,
      workoutTimer: {
        isRunning: true,
        startTime: Date.now(),
        elapsedTime: 0,
      },
    });

    console.log(`[Workout] Initialized with ${workout.exercises.length} exercises`);

    // Start workout timer - clear any previously set interval first
    if (workoutTimerInterval) {
      clearInterval(workoutTimerInterval);
      workoutTimerInterval = null;
    }
    workoutTimerInterval = setInterval(() => {
      set((state) => ({
        workoutTimer: {
          ...state.workoutTimer,
          elapsedTime: Date.now() - (state.workoutTimer.startTime || 0),
        },
      }));
    }, 1000);

    // Subscribe to userRoutineStore changes
    const unsubscribe = useUserRoutineStore.subscribe(() => {
      const currentState = get();
      if (!currentState.workoutId) return;

      const updatedWorkout = useUserRoutineStore.getState().getWorkoutById(currentState.workoutId);

      if (!updatedWorkout) {
        console.warn(`[Workout] Workout deleted - Cancelling active session`);
        get().cancelWorkout();
        return;
      }
      console.log(`[Workout] Received routine store update - Merging changes`);

      // Merge existing records with updated workout data
      const updatedRecords = new Map<number, ExerciseRecord>();

      updatedWorkout.exercises.forEach((exercise) => {
        const existingRecord = currentState.exerciseRecords.get(exercise.exerciseId);

        // Create new record while preserving user inputs
        const newRecord: ExerciseRecord = {
          exerciseId: exercise.exerciseId,
          sets: exercise.sets.map((set, index) => {
            const existingSet = existingRecord?.sets[index];
            return {
              reps: existingSet?.reps ?? null,
              weight: existingSet?.weight ?? null,
              targetReps: set.reps,
              targetWeight: set.weight || 0,
            };
          }),
          isCompleted: existingRecord?.isCompleted ?? false,
          intensity: existingRecord?.intensity,
        };

        updatedRecords.set(exercise.exerciseId, newRecord);
      });

      set({ exerciseRecords: updatedRecords });
    });

    // Return cleanup function (not used in this store setup)
    return () => {
      if (workoutTimerInterval) {
        clearInterval(workoutTimerInterval);
        workoutTimerInterval = null;
      }
      unsubscribe();
    };
  },

  updateReps: (exerciseId, setIndex, reps) => {
    set((state) => {
      const records = new Map(state.exerciseRecords);
      const exercise = records.get(exerciseId);
      if (!exercise) return state;

      const updatedSets = [...exercise.sets];
      updatedSets[setIndex] = { ...updatedSets[setIndex], reps };

      records.set(exerciseId, { ...exercise, sets: updatedSets });
      return { exerciseRecords: records };
    });
  },

  updateWeight: (exerciseId, setIndex, weight) => {
    set((state) => {
      const records = new Map(state.exerciseRecords);
      const exercise = records.get(exerciseId);
      if (!exercise) return state;

      const updatedSets = [...exercise.sets];
      updatedSets[setIndex] = { ...updatedSets[setIndex], weight };

      records.set(exerciseId, { ...exercise, sets: updatedSets });
      return { exerciseRecords: records };
    });
  },

  completeExercise: (exerciseId, intensity) => {
    console.log(`[Workout] Completing exercise ${exerciseId} with intensity ${intensity}`);
    set((state) => {
      const records = new Map(state.exerciseRecords);
      const exercise = records.get(exerciseId);
      if (!exercise) return state;

      records.set(exerciseId, { ...exercise, isCompleted: true, intensity: intensity || undefined });
      return { exerciseRecords: records };
    });
  },

  startRestTimer: (duration) => {
    console.log(`[Timer] Starting rest timer - Duration: ${duration}s`);
    // Clear any existing interval first
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
    }

    const startTime = Date.now();
    set({
      restTimer: {
        isRunning: true,
        duration,
        remainingTime: duration,
      },
    });

    restTimerInterval = setInterval(() => {
      set((state) => {
        if (!state.restTimer.isRunning) return state;

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = Math.max(0, duration - elapsed);

        if (remainingTime === 0) {
          clearInterval(restTimerInterval!);
          restTimerInterval = null;
          return {
            restTimer: {
              ...state.restTimer,
              isRunning: false,
              remainingTime,
            },
          };
        }

        return { restTimer: { ...state.restTimer, remainingTime } };
      });
    }, 1000);

    return () => {
      if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
      }
    };
  },

  pauseRestTimer: () => {
    set((state) => ({
      restTimer: { ...state.restTimer, isRunning: false },
    }));
  },

  resetRestTimer: () => {
    set((state) => ({
      restTimer: { ...state.restTimer, remainingTime: state.restTimer.duration },
    }));
  },

  cancelWorkout: () => {
    console.log(`[Workout] Cancelling current workout`);
    // Clear the timer interval if it exists.
    if (workoutTimerInterval) {
      clearInterval(workoutTimerInterval);
      workoutTimerInterval = null;
    }
    set({
      workoutId: null,
      exerciseRecords: new Map(),
      workoutTimer: { isRunning: false, startTime: null, elapsedTime: 0 },
      restTimer: { isRunning: false, duration: 0, remainingTime: 0 },
    });
  },

  finishWorkout: () => {
    const state = get();
    console.log(`[Workout] Finishing workout - Workout: ${state.workoutId}`);
    const workout = useUserRoutineStore.getState().getWorkoutById(state.workoutId!);

    if (!workout) {
      console.error("[Workout] Failed to finish - No active workout found");
      throw new Error("No active workout");
    }

    const session: WorkoutSession = {
      workoutId: state.workoutId!,
      date: new Date(),
      entries: Array.from(state.exerciseRecords.values()),
      summary: `Completed in ${Math.floor(state.workoutTimer.elapsedTime / 1000 / 60)} minutes`,
    };

    console.log(`[Workout] Session created - Duration: ${session.summary}, Exercises: ${session.entries.length}`);
    state.cancelWorkout();
    return session;
  },

  // Stats calculations
  getTotalVolume: () => {
    const state = get();
    let volume = 0;

    state.exerciseRecords.forEach((record) => {
      record.sets.forEach((set) => {
        if (set.reps && set.weight) {
          volume += set.reps * set.weight;
        }
      });
    });

    return volume;
  },

  getCompletedExercises: () => {
    const state = get();
    return Array.from(state.exerciseRecords.values()).filter((record) => record.isCompleted).length;
  },

  getRemainingExercises: () => {
    const state = get();
    return state.exerciseRecords.size - get().getCompletedExercises();
  },

  getCompletedSets: () => {
    const state = get();
    let completed = 0;

    state.exerciseRecords.forEach((record) => {
      record.sets.forEach((set) => {
        if (set.reps !== null && set.weight !== null) completed++;
      });
    });

    return completed;
  },

  getRemainingSets: () => {
    const state = get();
    let total = 0;

    state.exerciseRecords.forEach((record) => {
      total += record.sets.length;
    });

    return total - get().getCompletedSets();
  },
}));
