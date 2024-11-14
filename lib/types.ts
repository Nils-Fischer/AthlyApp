export enum Level {
  Beginner = 1,
  Intermediate = 2,
  Expert = 3,
}

export enum TrainingGoal {
  Strength,
  Hypertrophy,
  Endurance,
}

export enum LocationType {
  Home,
  Gym,
}

export interface Exercise {
  id: number;
  name: string;
  level: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  tag: string[];
  priority: number;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

// Exercise specific data for a workout
export interface WorkoutExercise {
  exerciseId: number;
  sets: number;
  reps: number;
  restPeriod?: number;
  notes?: string;
}

export interface Workout {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  description?: string;
}

export interface Program {
  id: number;
  name: string;
  workouts: Workout[];
  description?: string;
  frequency: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
}

export interface UserData {
  programs: Program[];
  created_at: string;
  last_updated: string;
}
