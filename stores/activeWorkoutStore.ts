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
  routineId: number | null;
  workoutId: number | null;
  exerciseRecords: Map<number, ExerciseRecord>;

  // Timers
  workoutTimer: Timer;
  restTimer: RestTimer;

  // Actions
  startWorkout: (routineId: number, workoutId: number) => void;
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

export const useActiveWorkoutStore = create<ActiveWorkoutState>()((set, get) => ({
  // Initial state
  routineId: null,
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

  startWorkout: (routineId, workoutId) => {
    const workout = useUserRoutineStore.getState().getWorkoutById(routineId, workoutId);
    if (!workout) return;

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
      routineId,
      workoutId,
      exerciseRecords: records,
      workoutTimer: {
        isRunning: true,
        startTime: Date.now(),
        elapsedTime: 0,
      },
    });

    // Start workout timer
    const timerInterval = setInterval(() => {
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
      if (!currentState.routineId || !currentState.workoutId) return;

      const updatedWorkout = useUserRoutineStore
        .getState()
        .getWorkoutById(currentState.routineId, currentState.workoutId);

      if (!updatedWorkout) {
        // Workout was deleted, cancel the active workout
        get().cancelWorkout();
        return;
      }

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

    // Return cleanup function
    return () => {
      clearInterval(timerInterval);
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
    set((state) => {
      const records = new Map(state.exerciseRecords);
      const exercise = records.get(exerciseId);
      if (!exercise) return state;

      records.set(exerciseId, { ...exercise, isCompleted: true, intensity: intensity || undefined });
      return { exerciseRecords: records };
    });
  },

  startRestTimer: (duration) => {
    set({ restTimer: { isRunning: true, duration, remainingTime: duration } });

    const timerInterval = setInterval(() => {
      set((state) => {
        if (!state.restTimer.isRunning) return state;
        const remainingTime = Math.max(0, state.restTimer.remainingTime - 1);

        if (remainingTime === 0) {
          clearInterval(timerInterval);
          return { restTimer: { ...state.restTimer, isRunning: false, remainingTime } };
        }

        return { restTimer: { ...state.restTimer, remainingTime } };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
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
    set({
      routineId: null,
      workoutId: null,
      exerciseRecords: new Map(),
      workoutTimer: { isRunning: false, startTime: null, elapsedTime: 0 },
      restTimer: { isRunning: false, duration: 0, remainingTime: 0 },
    });
  },

  finishWorkout: () => {
    const state = get();
    const workout = useUserRoutineStore.getState().getWorkoutById(state.routineId!, state.workoutId!);

    if (!workout) throw new Error("No active workout");

    const session: WorkoutSession = {
      workoutId: state.workoutId!,
      date: new Date(),
      entries: Array.from(state.exerciseRecords.values()),
      summary: `Completed in ${Math.floor(state.workoutTimer.elapsedTime / 1000 / 60)} minutes`,
    };

    // Reset the store
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

  // Added method to retrieve the active routineId and workoutId
  getActiveRoutineAndWorkoutId: () => {
    const state = get();
    return { routineId: state.routineId, workoutId: state.workoutId };
  },

  getExerciseRecord: (exerciseId: number) => {
    return get().exerciseRecords.get(exerciseId);
  },
}));
