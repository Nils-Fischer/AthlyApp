import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Exercise, Muscle, MuscleGroup } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): number {
  return parseInt(
    Date.now().toString() +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
  );
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
