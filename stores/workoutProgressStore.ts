import { create } from 'zustand';
import { WorkoutPerformance, WorkoutTrend, RecoveryRecommendation, WorkoutProgressStore } from '~/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@workout_progress';

const calculateConsistency = (performances: WorkoutPerformance[]) => {
  if (performances.length === 0) return 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentWorkouts = performances.filter(
    p => new Date(p.date) > thirtyDaysAgo
  ).length;
  return (recentWorkouts / 12) * 100;
};

const calculateStreak = (performances: WorkoutPerformance[]) => {
  if (performances.length === 0) return 0;
  const sortedPerformances = [...performances].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 1;
  for (let i = 1; i < sortedPerformances.length; i++) {
    const curr = new Date(sortedPerformances[i].date);
    const prev = new Date(sortedPerformances[i - 1].date);
    const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const useWorkoutProgressStore = create<WorkoutProgressStore>((set, get) => ({
  performances: [],

  addPerformance: async (performance: WorkoutPerformance) => {
    const newPerformances = [...get().performances, performance];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPerformances));
    set({ performances: newPerformances });
  },

  getTrend: () => {
    const performances = get().performances;
    const lastFive = performances.slice(-5);
    
    const average = lastFive.reduce((acc, curr) => ({
      volume: acc.volume + curr.volume,
      intensity: acc.intensity + curr.intensity,
      completion: acc.completion + (curr.completedSets / curr.totalSets * 100)
    }), { volume: 0, intensity: 0, completion: 0 });

    const avgCount = lastFive.length || 1;
    average.volume /= avgCount;
    average.intensity /= avgCount;
    average.completion /= avgCount;

    const defaultPerformance: WorkoutPerformance = {
      date: new Date().toISOString(),
      volume: 0,
      intensity: 0,
      completedSets: 0,
      totalSets: 0,
      duration: 0,
      exercises: []
    };

    const bestPerformance = performances.length > 0 
      ? performances.reduce((best, curr) => curr.volume > best.volume ? curr : best, defaultPerformance)
      : defaultPerformance;

    return {
      lastFive,
      average,
      bestPerformance,
      consistency: calculateConsistency(performances),
      currentStreak: calculateStreak(performances)
    };
  },

  getRecoveryRecommendation: () => {
    const performances = get().performances;
    const lastWorkout = performances[performances.length - 1];
    
    if (!lastWorkout) {
      return {
        nextWorkoutIn: 1,
        recommendedIntensity: 70,
        tips: [
          {
            type: 'activity',
            message: 'Starte mit moderater Intensität',
            priority: 'medium'
          }
        ]
      };
    }

    const intensity = lastWorkout.intensity;
    const volume = lastWorkout.volume;
    
    const recommendation: RecoveryRecommendation = {
      nextWorkoutIn: intensity > 85 ? 2 : 1,
      recommendedIntensity: intensity > 85 ? 70 : 85,
      tips: []
    };

    if (intensity > 85) {
      recommendation.tips.push({
        type: 'sleep',
        message: '8+ Stunden Schlaf empfohlen',
        priority: 'high'
      });
    }

    if (volume > 5000) {
      recommendation.tips.push({
        type: 'nutrition',
        message: 'Erhöhte Protein-Aufnahme empfohlen',
        priority: 'high'
      });
    }

    return recommendation;
  }
}));
