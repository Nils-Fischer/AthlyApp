import { create } from "zustand";
import type { ExerciseRecord, SetInput, WorkoutExercise, WorkoutSession } from "~/lib/types";

interface ActiveWorkoutState {
  // Workout Status
  isStarted: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number;

  // Workout Data
  currentWorkout: {
    exercises: ExerciseRecord[];
    workoutId?: number;
  } | null;

  // Timer Interval
  timerInterval: NodeJS.Timeout | null;

  // Actions
  startWorkout: (workoutId: number | undefined, exercises: WorkoutExercise[]) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: () => WorkoutSession | null;

  // Exercise Progress
  updateExerciseRecord: (exerciseId: number, sets: SetInput[]) => void;
  getExerciseRecord: (exerciseId: number) => ExerciseRecord | null;

  // Stats
  getCurrentStats: () => {
    duration: number;
    totalVolume: number;
    completedExercises: number;
    remainingExercises: number;
  };
  getCompletedSets: (exerciseId: number) => SetInput[] | undefined;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  isStarted: false,
  isPaused: false,
  startTime: null,
  elapsedTime: 0,
  currentWorkout: null,
  timerInterval: null,

  startWorkout: (workoutId, exercises) => {
    // Transform WorkoutExercises into ExerciseRecords
    const exerciseRecords: ExerciseRecord[] = exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: [],
      intensity: 0,
      isCompleted: false,
    }));

    // Clear any existing interval
    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);

    // Start new timer
    const interval = setInterval(() => {
      set((state) => ({
        elapsedTime: state.startTime ? Date.now() - state.startTime : 0,
      }));
    }, 1000);

    set({
      isStarted: true,
      isPaused: false,
      startTime: Date.now(),
      elapsedTime: 0,
      currentWorkout: {
        exercises: exerciseRecords,
        workoutId,
      },
      timerInterval: interval,
    });
  },

  pauseWorkout: () => {
    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);
    set({ isPaused: true, timerInterval: null });
  },

  resumeWorkout: () => {
    const interval = setInterval(() => {
      set((state) => ({
        elapsedTime: state.startTime ? Date.now() - state.startTime : 0,
      }));
    }, 1000);
    set({ isPaused: false, timerInterval: interval });
  },

  endWorkout: () => {
    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);

    const currentWorkout = get().currentWorkout;
    if (!currentWorkout) return null;

    const workoutSession: WorkoutSession = {
      date: new Date(),
      entries: currentWorkout.exercises,
      workoutId: currentWorkout.workoutId,
    };

    set({
      isStarted: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      currentWorkout: null,
      timerInterval: null,
    });

    return workoutSession;
  },

  updateExerciseRecord: (exerciseId, sets) => {
    set((state) => ({
      currentWorkout: state.currentWorkout
        ? {
            ...state.currentWorkout,
            exercises: state.currentWorkout.exercises.map((exercise) =>
              exercise.exerciseId === exerciseId ? { ...exercise, sets, isCompleted: true } : exercise
            ),
          }
        : null,
    }));
  },

  getExerciseRecord: (exerciseId) => {
    return get().currentWorkout?.exercises.find((exercise) => exercise.exerciseId === exerciseId) || null;
  },

  getCurrentStats: () => {
    const currentWorkout = get().currentWorkout;
    if (!currentWorkout) {
      return {
        duration: 0,
        totalVolume: 0,
        completedExercises: 0,
        remainingExercises: 0,
      };
    }

    const totalVolume = currentWorkout.exercises.reduce((acc, exercise) => {
      return acc + exercise.sets.reduce((setAcc, set) => setAcc + (set.weight || 0) * (set.reps || 0), 0);
    }, 0);

    return {
      duration: get().elapsedTime,
      totalVolume,
      completedExercises: currentWorkout.exercises.filter((e) => e.isCompleted).length,
      remainingExercises: currentWorkout.exercises.filter((e) => !e.isCompleted).length,
    };
  },
  getCompletedSets: (exerciseId: number) => {
    const exerciseRecord = get().currentWorkout?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
    return exerciseRecord?.sets;
  },
}));
