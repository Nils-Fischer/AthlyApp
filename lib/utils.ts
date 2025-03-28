import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Difficulty, Exercise, Muscle, MuscleGroup, WorkoutExercise } from "./types";
import * as Crypto from "expo-crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Crypto.randomUUID();
}

export function parseJSON<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""}`;
};

export function getThumbnail(exercise: Exercise): string | null {
  return exercise.media.find((media) => media.endsWith(".jpg") || media.endsWith(".png")) || null;
}

export function getMuscleGroup(muscle: Muscle): MuscleGroup {
  switch (muscle) {
    case Muscle.UpperChest:
    case Muscle.MiddleChest:
    case Muscle.LowerChest:
      return MuscleGroup.Chest;
    case Muscle.Latissimus:
    case Muscle.UpperTraps:
    case Muscle.LowerTraps:
    case Muscle.Rhomboids:
    case Muscle.TeresMajor:
    case Muscle.ErectorSpinae:
      return MuscleGroup.Back;
    case Muscle.FrontDelts:
    case Muscle.SideDelts:
    case Muscle.RearDelts:
    case Muscle.RotatorCuff:
      return MuscleGroup.Shoulders;
    case Muscle.LongHeadBiceps:
    case Muscle.ShortHeadBiceps:
    case Muscle.Brachialis:
      return MuscleGroup.Biceps;
    case Muscle.LongHeadTriceps:
    case Muscle.LateralHeadTriceps:
    case Muscle.ShortHeadTriceps:
      return MuscleGroup.Triceps;
    case Muscle.ForearmExtensors:
    case Muscle.ForearmFlexors:
    case Muscle.Brachioradialis:
      return MuscleGroup.Forearms;
    case Muscle.Quadriceps:
    case Muscle.Hamstrings:
    case Muscle.Glutes:
    case Muscle.Calves:
    case Muscle.Abductors:
    case Muscle.Adductors:
      return MuscleGroup.Legs;
    case Muscle.Serratus:
    case Muscle.UpperAbs:
    case Muscle.LowerAbs:
    case Muscle.Obliques:
    case Muscle.LowerBack:
      return MuscleGroup.Core;
  }
}

export function difficultyAsNumber(difficulty: Difficulty): number {
  return difficulty === Difficulty.Beginner ? 0 : difficulty === Difficulty.Intermediate ? 1 : 2;
}

export function getRepsRange(exercise: WorkoutExercise): string {
  if (!exercise || !exercise.sets || exercise.sets.length === 0) return "";
  if (exercise.sets.length === 1 || exercise.sets.every((set) => set.reps === exercise.sets[0].reps))
    return `${exercise.sets.at(0)?.reps} Wdh.`;
  return `${Math.min(...exercise.sets.map((set) => set.reps))}-${Math.max(
    ...exercise.sets.map((set) => set.reps)
  )} Wdh.`;
}

export function getWeightRange(exercise: WorkoutExercise): string | null {
  if (!exercise || !exercise.sets || exercise.sets.length === 0) return null;

  if (exercise.sets.every((set) => set?.weight === null || set?.weight === undefined)) return null;

  const definedSets = exercise.sets.filter((set) => set && set.weight !== null && set.weight !== undefined);

  if (definedSets.length === 0) return null;

  if (definedSets.length === 1 || definedSets.every((set) => set.weight === definedSets[0].weight))
    return `${definedSets[0].weight} kg`;

  return `${Math.min(...definedSets.map((set) => set.weight as number))}-${Math.max(
    ...definedSets.map((set) => set.weight as number)
  )} kg`;
}

export function dateToISOString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
