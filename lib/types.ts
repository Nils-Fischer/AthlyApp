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
export interface Message {
  id: number;
  isAI: boolean;
  message: string;
  time: string;
}
export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
}

export interface NutritionProgress {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: NutritionGoals;
}

export interface Exercise {
  alternatives: never[];
  timesUsed: string;
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
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

// Exercise specific data for a workout
export interface WorkoutExercise {
  isCompleted: boolean;
  weight: number;
  exerciseId: number;
  alternatives: number[];
  sets: number;
  reps: number;
  restPeriod?: number;
  notes?: string;
  isMarked?: boolean
  completedSets?: SetInput[];
}

export interface Workout {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  description?: string;
}

export interface Routine {
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
  routines: Routine[];
  created_at: string;
  last_updated: string;
}
export interface SetInput {
  reps: number;
  weight: number;
  isCompleted?: boolean;
}

export interface WarmUpSet {
  percentage: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface PreviousWorkout {
  date: string;
  sets: SetInput[];
  volume: number;
}
export interface ExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  isWorkoutStarted: boolean;
  onSave: (sets: SetInput[]) => void;
  previousWorkout?: PreviousWorkout;
}