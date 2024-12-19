import { create } from "zustand";
import type { SetInput, Workout, WorkoutSession } from "~/lib/types";

interface ActiveWorkoutState {
  isStarted: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number;

  currentWorkout: Workout | null;
  currentSession: WorkoutSession | null;

  timerInterval: NodeJS.Timeout | null;

  setWorkout: (workout: Workout) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  cancelWorkout: () => void;
  finishWorkout: () => WorkoutSession | null;

  addSet: (exerciseId: number, newSet: SetInput) => void;
  finishExercise: (exerciseId: number, intensity?: number) => void;

  // Stats
  getCurrentStats: () => {
    duration: number;
    totalVolume: number;
    completedExercises: number;
    remainingExercises: number;
    completedSets: number;
    remainingSets: number;
  };
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  isStarted: false,
  isPaused: false,
  startTime: null,
  elapsedTime: 0,
  currentWorkout: null,
  timerInterval: null,
  currentSession: null,

  setWorkout: (workout: Workout) => {
    set({ currentWorkout: workout });
  },

  startWorkout: () => {
    const workout = get().currentWorkout;
    if (!workout) {
      console.error("No workout set");
      return;
    }
    const session: WorkoutSession = {
      date: new Date(),
      entries: workout.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: [],
        intensity: undefined,
        isCompleted: false,
      })),
      workoutId: workout.id,
    };

    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);

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
      currentSession: session,
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

  cancelWorkout: () => {
    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);
    set({
      isStarted: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      currentSession: null,
      timerInterval: null,
    });
  },

  finishWorkout: () => {
    const timerInterval = get().timerInterval;
    timerInterval && clearInterval(timerInterval);

    const currentWorkout = get().currentWorkout;
    if (!currentWorkout) return null;

    const currentSession = get().currentSession;

    set({
      isStarted: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      currentWorkout: null,
      timerInterval: null,
      currentSession: null,
    });

    return currentSession;
  },

  addSet: (exerciseId: number, newSet: SetInput) => {
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            entries: state.currentSession.entries.map((entry) =>
              entry.exerciseId === exerciseId ? { ...entry, sets: [...entry.sets, newSet] } : entry
            ),
          }
        : null,
    }));
  },

  finishExercise: (exerciseId: number, intensity = undefined) => {
    set((state) => ({
      currentWorkout: state.currentWorkout
        ? {
            ...state.currentWorkout,
            exercises: state.currentWorkout.exercises.map((exercise) =>
              exercise.exerciseId === exerciseId ? { ...exercise, isCompleted: true, intensity } : exercise
            ),
          }
        : null,
    }));
  },

  getCurrentStats: () => {
    const currentSession = get().currentSession;
    if (!currentSession) {
      return {
        duration: 0,
        totalVolume: 0,
        completedExercises: 0,
        remainingExercises: 0,
        completedSets: 0,
        remainingSets: 0,
      };
    }

    const totalVolume = currentSession.entries.reduce((acc, entry) => {
      return acc + entry.sets.reduce((setAcc, set) => setAcc + (set.weight || 0) * (set.reps || 0), 0);
    }, 0);

    const completedSets = currentSession.entries.reduce((acc, entry) => acc + entry.sets.length, 0);

    const totalTargetSets = currentSession.entries.reduce((acc, entry) => acc + (entry.sets?.length || 0), 0);

    return {
      duration: get().elapsedTime,
      totalVolume,
      completedExercises: currentSession.entries.filter((e) => e.isCompleted).length,
      remainingExercises: currentSession.entries.filter((e) => !e.isCompleted).length,
      completedSets,
      remainingSets: totalTargetSets - completedSets,
    };
  },
}));
