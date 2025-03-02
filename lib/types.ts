import { ReactNode } from "react";
import { CoreAssistantMessage, CoreMessage, CoreToolMessage, CoreUserMessage } from "ai";

export enum TrainingGoal {
  Strength,
  Hypertrophy,
  Endurance,
}

export enum LocationType {
  Home,
  Gym,
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface SetConfiguration {
  reps: number;
  weight?: number;
}

export interface WorkoutExercise {
  exerciseId: number;
  alternatives: number[];
  sets: SetConfiguration[];
  restPeriod?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  description?: string;
}

export interface Routine {
  id: string;
  name: string;
  workouts: Workout[];
  description?: string;
  frequency: number;
  active: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  gender: Gender;
  height: number;
  weight: number;
}

enum ExerciseType {
  Weight = "Gewicht",
  Bodyweight = "Körpergewicht",
  Cardio = "Kardio",
  Mobility = "Mobilität",
  Stretching = "Dehnen",
  Balance = "Balance",
}

enum EquipmentType {
  Barbell = "Langhantel",
  Dumbbell = "Kurzhantel",
  Machine = "Maschine",
  Cable = "Kabelzug",
  Bodyweight = "Körpergewicht",
  Specialty = "Spezialgeräte",
}

export enum Difficulty {
  Beginner = "Anfänger",
  Intermediate = "Fortgeschritten",
  Advanced = "Profi",
}

export enum Mechanic {
  Compound = "Grundübung",
  Isolation = "Isolationsübung",
}

export enum MuscleGroup {
  Chest = "Brust",
  Back = "Rücken",
  Shoulders = "Schultern",
  Biceps = "Bizeps",
  Triceps = "Trizeps",
  Forearms = "Unterarme",
  Legs = "Beine",
  Core = "Bauch",
}

export enum Muscle {
  // Chest
  UpperChest = "Obere Brust",
  MiddleChest = "Mittlere Brust",
  LowerChest = "Untere Brust",
  // Back
  Latissimus = "Latissimus",
  UpperTraps = "Oberer Trapezmuskel",
  LowerTraps = "Unterer Trapezmuskel",
  Rhomboids = "Rhomboiden",
  TeresMajor = "Teres Major",
  ErectorSpinae = "Rückenstrecker",
  // Shoulders
  FrontDelts = "Vordere Schulter",
  SideDelts = "Seitliche Schulter",
  RearDelts = "Hintere Schulter",
  RotatorCuff = "Rotatorenmanschette",
  // Biceps
  LongHeadBiceps = "Langer Bizepskopf",
  ShortHeadBiceps = "Kurzer Bizepskopf",
  Brachialis = "Brachialis",
  // Triceps
  LongHeadTriceps = "Langer Trizepskopf",
  LateralHeadTriceps = "Lateraler Trizepskopf",
  ShortHeadTriceps = "Kurzer Trizepskopf",
  // Forearms
  ForearmExtensors = "Unterarmstrecker",
  ForearmFlexors = "Unterarmbeuger",
  Brachioradialis = "Brachioradialis",
  // Legs
  Quadriceps = "Oberschenkel",
  Hamstrings = "Hamstrings",
  Glutes = "Gesäß",
  Calves = "Waden",
  Abductors = "Abduktoren",
  Adductors = "Adduktoren",
  // Core
  Serratus = "Sägemuskel",
  UpperAbs = "Oberer Bauch",
  LowerAbs = "Unterer Bauch",
  Obliques = "Seitlicher Bauch",
  LowerBack = "Unterer Rücken",
}

export interface Exercise {
  id: number;
  name: string;
  type: ExerciseType;
  equipment: EquipmentType;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  stabilizingMuscles: Muscle[];
  difficulty: Difficulty;
  mechanic: Mechanic;
  description: string;
  media: string[];
  instructions: string[];
  variations?: string[];
  commonMistakes?: string[];
  formCues?: string[];
  warmup?: string;
}

export interface SetInput {
  reps: number | null;
  weight: number | null;
  targetWeight: number;
  targetReps: number;
  completed?: boolean;
}

export interface ExerciseRecord {
  exerciseId: number;
  sets: SetInput[];
  intensity?: number;
  isCompleted: boolean;
}

export interface WorkoutSession {
  summary: ReactNode;
  date: Date;
  entries: ExerciseRecord[];
  workoutId: string;
}

export type BaseChatMessage = {
  id: string;
  createdAt: Date;
  status: "sent" | "sending" | "failed";
  message: string;
};

export type UserChatMessage = BaseChatMessage & {
  images: string[];
  technicalMessage: CoreUserMessage;
  role: "user";
};

export type AssistantChatMessage = BaseChatMessage & {
  routine?: Routine;
  technicalMessage: (CoreAssistantMessage | CoreToolMessage)[];
  role: "assistant";
};

export type ChatMessage = UserChatMessage | AssistantChatMessage;

export interface ChatResponse {
  text?: string;
  routine?: Routine;
  errorType?: "inappropriate" | "impossible" | "unclear" | "internal";
  errorMessage?: string;
  completeResponse?: (CoreAssistantMessage | CoreToolMessage)[];
}
