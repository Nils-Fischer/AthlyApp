import { type Exercise, Routine, TrainingGoal, WorkoutExercise } from "./types";
import { Level } from "./types";

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface ExerciseDescription {
  priority: number;
  tags: string[];
  sets: number;
  reps: [number, number];
  warmup: boolean;
  optional: boolean;
}

export const PUSH: ExerciseDescription[] = [
  { priority: 1, tags: ["brust", "mittlere", "push"], sets: 4, reps: [8, 10], warmup: true, optional: false },
  { priority: 8, tags: ["brust", "mittlere", "abduktion"], sets: 3, reps: [8, 12], warmup: false, optional: true },
  { priority: 3, tags: ["brust", "obere", "push"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 7, tags: ["schulter", "vordere", "push"], sets: 3, reps: [8, 10], warmup: false, optional: true },
  { priority: 4, tags: ["brust", "untere", "abduktion"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 9, tags: ["brust", "untere", "push"], sets: 3, reps: [8, 10], warmup: false, optional: false },
  { priority: 5, tags: ["schulter", "seitliche", "abduktion"], sets: 4, reps: [10, 12], warmup: true, optional: false },
  { priority: 2, tags: ["trizeps", "groß"], sets: 3, reps: [10, 12], warmup: true, optional: false },
  { priority: 6, tags: ["trizeps", "klein"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 10, tags: ["trizeps", "klein"], sets: 2, reps: [10, 12], warmup: false, optional: true },
];

export const PULL: ExerciseDescription[] = [
  { priority: 1, tags: ["rücken", "vertikal", "wide"], sets: 4, reps: [8, 10], warmup: true, optional: false },
  { priority: 3, tags: ["rücken", "horizontal", "close"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 7, tags: ["rücken", "vertikal", "close"], sets: 2, reps: [10, 12], warmup: false, optional: true },
  { priority: 8, tags: ["rücken", "horizontal", "wide"], sets: 2, reps: [10, 12], warmup: false, optional: true },
  { priority: 6, tags: ["rücken", "adduktion"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 4, tags: ["schulter", "hintere", "abduktion"], sets: 4, reps: [10, 12], warmup: true, optional: false },
  { priority: 2, tags: ["bizeps", "breit"], sets: 3, reps: [8, 12], warmup: true, optional: false },
  { priority: 5, tags: ["bizeps", "eng"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 9, tags: ["bizeps", "eng"], sets: 2, reps: [10, 12], warmup: false, optional: true },
];

export const BEINE: ExerciseDescription[] = [
  { priority: 1, tags: ["beine", "push"], sets: 4, reps: [8, 10], warmup: true, optional: false },
  { priority: 5, tags: ["beine", "pull"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 2, tags: ["beine", "hamstrings"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 3, tags: ["beine", "quadrizeps"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 4, tags: ["beine", "waden"], sets: 4, reps: [10, 15], warmup: true, optional: false },
  { priority: 8, tags: ["beine", "push"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 6, tags: ["bauch", "unterer"], sets: 4, reps: [10, 15], warmup: false, optional: false },
  { priority: 7, tags: ["bauch", "oberer"], sets: 4, reps: [10, 15], warmup: false, optional: false },
];

export const OBERKOERPER: ExerciseDescription[] = [
  { priority: 1, tags: ["brust", "mittlere", "push"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 2, tags: ["rücken", "vertikal", "wide"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 4, tags: ["brust", "obere", "push"], sets: 3, reps: [8, 12], warmup: true, optional: false },
  { priority: 8, tags: ["rücken", "horizontal", "close"], sets: 3, reps: [8, 12], warmup: false, optional: false },
  { priority: 9, tags: ["brust", "untere", "abduktion"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 12, tags: ["rücken", "adduktion"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 13, tags: ["schulter", "vordere", "push"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  {
    priority: 3,
    tags: ["schulter", "seitliche", "abduktion"],
    sets: 4,
    reps: [10, 12],
    warmup: false,
    optional: false,
  },
  { priority: 5, tags: ["schulter", "hintere", "abduktion"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 6, tags: ["bizeps", "breit"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 7, tags: ["trizeps", "groß"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 10, tags: ["bizeps", "eng"], sets: 2, reps: [10, 12], warmup: false, optional: false },
  { priority: 11, tags: ["trizeps", "klein"], sets: 2, reps: [10, 12], warmup: false, optional: true },
];

export const UNTERKOERPER: ExerciseDescription[] = [
  { priority: 1, tags: ["beine", "push"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 2, tags: ["beine", "pull"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 3, tags: ["beine", "hamstrings"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 4, tags: ["beine", "quadrizeps"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 5, tags: ["waden"], sets: 4, reps: [10, 12], warmup: false, optional: false },
  { priority: 9, tags: ["beine", "hamstrings"], sets: 2, reps: [10, 12], warmup: false, optional: true },
  { priority: 10, tags: ["beine", "quadrizeps"], sets: 2, reps: [10, 12], warmup: false, optional: true },
  { priority: 7, tags: ["beine", "push"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 6, tags: ["bauch", "unterer"], sets: 3, reps: [10, 15], warmup: false, optional: false },
  { priority: 8, tags: ["bauch", "oberer"], sets: 3, reps: [10, 15], warmup: false, optional: false },
];

export const GANZKOERPER: ExerciseDescription[] = [
  { priority: 1, tags: ["beine", "push"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 11, tags: ["beine", "pull"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 13, tags: ["beine", "quadrizeps"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 14, tags: ["beine", "hamstrings"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 15, tags: ["waden"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 2, tags: ["brust", "mittlere", "push"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 4, tags: ["brust", "obere", "brust"], sets: 3, reps: [10, 12], warmup: true, optional: false },
  { priority: 3, tags: ["rücken", "vertikal", "wide"], sets: 3, reps: [8, 10], warmup: true, optional: false },
  { priority: 6, tags: ["rücken", "horizontal", "close"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 10, tags: ["brust", "untere", "abduktion"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 16, tags: ["rücken", "adduktion"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 17, tags: ["schulter", "vordere", "push"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  {
    priority: 5,
    tags: ["schulter", "seitliche", "abduktion"],
    sets: 3,
    reps: [10, 12],
    warmup: false,
    optional: false,
  },
  { priority: 9, tags: ["schulter", "hintere", "abduktion"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 7, tags: ["bizeps", "breit"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 8, tags: ["trizeps", "groß"], sets: 3, reps: [10, 12], warmup: false, optional: false },
  { priority: 19, tags: ["bizeps", "eng"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 20, tags: ["trizeps", "klein"], sets: 3, reps: [10, 12], warmup: false, optional: true },
  { priority: 18, tags: ["bauch", "unterer"], sets: 3, reps: [10, 12], warmup: false, optional: false },
];

interface ExercisePlan {
  name: string;
  frequency: number;
  exercises: WorkoutExercise[];
}

export function createProgram(
  exercises: Exercise[],
  daysAWeek: number,
  availableTime: number,
  level: Level,
  goal: TrainingGoal
): Routine {
  const plans = selectSplitPlan(exercises, daysAWeek, availableTime, level, goal);
  return {
    id: Math.floor(Math.random() * 1000000), // or use a proper ID generation method
    name: `${daysAWeek}-Day Split`,
    workouts: plans.map((plan) => ({
      id: Math.floor(Math.random() * 1000000),
      name: plan.name,
      exercises: plan.exercises,
      duration: availableTime,
      description: `${plan.frequency}x per week`,
    })),
    description: `${daysAWeek} day split for ${Level[level]} level`,
    frequency: daysAWeek,
  };
}

function selectSplitPlan(
  exercises: Exercise[],
  daysAWeek: number,
  availableTime: number,
  level: Level,
  goal: TrainingGoal
): ExercisePlan[] {
  switch (daysAWeek) {
    case 1:
      return oneDaySplit(exercises, availableTime, level, goal);
    case 2:
      return twoDaySplit(exercises, availableTime, level, goal);
    case 3:
      return threeDaySplit(exercises, availableTime, level, goal);
    case 4:
      return fourDaySplit(exercises, availableTime, level, goal);
    case 5:
      return fiveDaySplit(exercises, availableTime, level, goal);
    case 6:
      return sixDaySplit(exercises, availableTime, level, goal);
    default:
      return sevenDaySplit(exercises, availableTime, level, goal);
  }
}

function oneDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const fullBody = selectExercises(exercises, GANZKOERPER, time, level, goal);
  return [{ name: "Ganzkörper", frequency: 1, exercises: fullBody }];
}

function twoDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const lowerBody = selectExercises(exercises, UNTERKOERPER, time, level, goal);
  const upperBody = selectExercises(exercises, OBERKOERPER, time, level, goal);
  return [
    { name: "Unterkörper", frequency: 2, exercises: lowerBody },
    { name: "Oberkörper", frequency: 2, exercises: upperBody },
  ];
}

function threeDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const push = selectExercises(exercises, PUSH, time, level, goal);
  const pull = selectExercises(exercises, PULL, time, level, goal);
  const beine = selectExercises(exercises, BEINE, time, level, goal);
  return [
    { name: "Push", frequency: 1, exercises: push },
    { name: "Pull", frequency: 1, exercises: pull },
    { name: "Beine", frequency: 1, exercises: beine },
  ];
}

function fourDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const lowerBody = selectExercises(exercises, UNTERKOERPER, time, level, goal);
  const upperBody = selectExercises(exercises, OBERKOERPER, time, level, goal);
  return [
    { name: "Unterkörper", frequency: 2, exercises: lowerBody },
    { name: "Oberkörper", frequency: 2, exercises: upperBody },
  ];
}

function fiveDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const lowerBody = selectExercises(exercises, UNTERKOERPER, time, level, goal);
  const upperBody = selectExercises(exercises, OBERKOERPER, time, level, goal);
  const push = selectExercises(exercises, PUSH, time, level, goal);
  const pull = selectExercises(exercises, PULL, time, level, goal);
  const beine = selectExercises(exercises, BEINE, time, level, goal);
  return [
    { name: "Push", frequency: 1, exercises: push },
    { name: "Pull", frequency: 1, exercises: pull },
    { name: "Beine", frequency: 1, exercises: beine },
    { name: "Unterkörper", frequency: 1, exercises: lowerBody },
    { name: "Oberkörper", frequency: 1, exercises: upperBody },
  ];
}

function sixDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const push = selectExercises(exercises, PUSH, time, level, goal);
  const pull = selectExercises(exercises, PULL, time, level, goal);
  const beine = selectExercises(exercises, BEINE, time, level, goal);
  return [
    { name: "Push", frequency: 2, exercises: push },
    { name: "Pull", frequency: 2, exercises: pull },
    { name: "Beine", frequency: 2, exercises: beine },
  ];
}

function sevenDaySplit(exercises: Exercise[], time: number, level: Level, goal: TrainingGoal): ExercisePlan[] {
  const push = selectExercises(exercises, PUSH, time, level, goal);
  const pull = selectExercises(exercises, PULL, time, level, goal);
  const beine = selectExercises(exercises, BEINE, time, level, goal);
  const fullBody = selectExercises(exercises, GANZKOERPER, time, level, goal);
  return [
    { name: "Push", frequency: 2, exercises: push },
    { name: "Pull", frequency: 2, exercises: pull },
    { name: "Beine", frequency: 2, exercises: beine },
    { name: "Ganzkörper", frequency: 1, exercises: fullBody },
  ];
}

function selectExercises(
  exercises: Exercise[],
  split: ExerciseDescription[],
  availableTime: number,
  level: Level,
  goal: TrainingGoal
): WorkoutExercise[] {
  const results: [number, WorkoutExercise][] = split.map((description) => {
    const tags = description.tags;
    const matches = exercises
      .filter((exercise) => tags.every((tag) => exercise.tag.includes(tag)) && levelFromString(exercise.level) <= level)
      .sort((a, b) => a.priority - b.priority);

    const mainExercise = matches[0];
    const alternatives = matches.slice(1).map((ex) => ex.id);

    const exercise: WorkoutExercise = {
      exerciseId: mainExercise.id,
      alternatives: alternatives,
      sets: determineNumSets(mainExercise, level, goal, description.sets),
      reps: determineNumReps(mainExercise, goal)[1], // Using the upper range
      restPeriod: determineRestTime(mainExercise, goal),
      notes: description.warmup ? "Include warmup set" : undefined,
    };

    return [description.priority, exercise];
  });

  let numExercises = 0;
  let timeInGym = 0;

  for (const [_, exercise] of [...results].sort((a, b) => a[0] - b[0])) {
    if (!exercise) continue;
    const exerciseTime = (exercise.sets + (exercise.notes?.includes("warmup") ? 1 : 0)) * 3;
    timeInGym += exerciseTime;
    if (timeInGym <= Math.ceil(availableTime)) numExercises++;
    else break;
  }

  return results
    .filter(([prio, exercise]) => prio <= numExercises && exercise !== null)
    .map(([_, exercise]) => exercise);
}

function levelFromString(level: string): Level {
  switch (level.toLowerCase()) {
    case "beginner":
    case "anfänger":
      return Level.Beginner;
    case "intermediate":
    case "fortgeschritten":
      return Level.Intermediate;
    case "expert":
    case "experte":
      return Level.Expert;
    default:
      throw new Error(`level: ${level}, is not defined`);
  }
}

function determineNumSets(exercise: Exercise, level: Level, goal: TrainingGoal, sets: number): number {
  if (level === Level.Beginner) {
    return Math.max(sets, 3);
  } else if (level === Level.Intermediate) {
    return Math.max(sets, 4);
  } else {
    return goal === TrainingGoal.Strength && exercise.mechanic == "compound" ? sets + 1 : sets;
  }
}

function determineNumReps(exercise: Exercise, goal: TrainingGoal): [number, number] {
  const isCompound = exercise.mechanic.toLowerCase() === "compound";
  if (goal === TrainingGoal.Hypertrophy) {
    return isCompound ? [8, 10] : [10, 12];
  } else if (goal === TrainingGoal.Strength) {
    return isCompound ? [4, 6] : [8, 10];
  } else return [10, 15];
}

function determineRestTime(exercise: Exercise, goal: TrainingGoal): number {
  const isCompound = exercise.mechanic.toLowerCase() === "compound";
  if (goal === TrainingGoal.Hypertrophy) {
    return isCompound ? 3 : 2.5;
  } else if (goal === TrainingGoal.Strength) {
    return isCompound ? 3.5 : 3;
  } else return isCompound ? 2.5 : 2;
}
