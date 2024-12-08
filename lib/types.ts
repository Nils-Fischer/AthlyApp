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

export interface WorkoutExercise {
  exerciseId: number;
  alternatives: number[];
  sets: number;
  reps: number;
  restPeriod?: number;
  notes?: string;
  isMarked?: boolean;
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
/* 

enum EquipmentType {
  Barbell = "Barbell",
  Dumbbell = "Dumbbell",
  Machine = "Machine",
  Cable = "Cable",
  Bodyweight = "Bodyweight",
  Specialty = "Specialty",
}

enum MuscleGroup {
  Chest = "Chest",
  Back = "Back",
  Shoulders = "Shoulders",
  Biceps = "Biceps",
  Triceps = "Triceps",
  Core = "Core",
  Legs = "Legs",
}

enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

enum Mechanic {
  Compound = "Compound",
  Isolation = "Isolation",
}

interface Exercise {
  id: string;
  name: string;
  equipment: EquipmentType;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  difficulty: Difficulty;
  tag: string; // type of exercise
  mechanic: Mechanic;
  variations?: string[];
  commonMistakes?: string[];
  warmup?: string[];
}

interface ExerciseMetadata {
  id: string;
  instructions: string[];
  description: string;
  media: string[];
}
*/
