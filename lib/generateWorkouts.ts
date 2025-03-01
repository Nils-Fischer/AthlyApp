import { useExerciseStore } from "~/stores/exerciseStore";
import { type Exercise, Difficulty, Mechanic, Routine, TrainingGoal, Workout, WorkoutExercise } from "./types";
import { generateId, difficultyAsNumber } from "./utils";

const adjustExerciseForGoal = (exercise: WorkoutExercise, goal: TrainingGoal): WorkoutExercise => {
  const exerciseStore = useExerciseStore.getState();
  const isCompound = exerciseStore.getExerciseById(exercise.exerciseId)?.mechanic === Mechanic.Compound;
  const adjusted = { ...exercise };

  switch (goal) {
    case TrainingGoal.Strength:
      adjusted.sets = exercise.sets.map((set) => ({
        ...set,
        reps: Math.max(4, set.reps - 4),
      }));

      if (isCompound) {
        const newSet = { reps: Math.max(4, exercise.sets[0].reps - 4) };
        adjusted.sets.push(newSet);
      }
      adjusted.restPeriod = exercise.restPeriod! + 60;
      break;

    case TrainingGoal.Hypertrophy:
      break;

    case TrainingGoal.Endurance:
      adjusted.sets = exercise.sets.map((set) => ({
        ...set,
        reps: set.reps + 6,
      }));

      const newSets = Array(isCompound ? 1 : 2).fill({
        reps: exercise.sets[0].reps + 6,
      });
      adjusted.sets.push(...newSets);
      adjusted.restPeriod = Math.max(30, exercise.restPeriod! - 30);
      break;
  }

  return adjusted;
};

const adjustExerciseForDifficulty = (exercise: WorkoutExercise, difficulty: Difficulty): WorkoutExercise => {
  const { getExerciseById } = useExerciseStore.getState();
  const exerciseDifficulty = getExerciseById(exercise.exerciseId)?.difficulty;
  if (!exerciseDifficulty) {
    return exercise;
  }
  const isTooDifficult = difficultyAsNumber(exerciseDifficulty) > difficultyAsNumber(difficulty);
  if (!isTooDifficult) return exercise;
  const easierExercise = exercise.alternatives.find(
    (id) => difficultyAsNumber(getExerciseById(id)?.difficulty || Difficulty.Beginner) < difficultyAsNumber(difficulty)
  );
  if (!easierExercise) return exercise;
  return { ...exercise, exerciseId: easierExercise, alternatives: [...exercise.alternatives, exercise.exerciseId] };
};

const basePushWorkout: WorkoutExercise[] = [
  {
    exerciseId: 1, // Bankdrücken (Barbell)
    alternatives: [5, 12, 14], // Dumbbell bench press, Smith machine bench press, Chest press machine
    sets: Array(4).fill({ reps: 8 }),
    restPeriod: 90,
  },
  {
    exerciseId: 16, // Butterfly (Pec Deck)
    alternatives: [8, 53], // Dumbbell flys, Cable flys
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 2, // Bankdrücken Schrägbank
    alternatives: [6, 13, 15], // Dumbbell incline press, Smith incline press, Incline machine press
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 63, // Militärpress
    alternatives: [66, 74, 75], // Dumbbell shoulder press, Smith machine shoulder press, Shoulder press machine
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 22, // Vertikaler Butterfly
    alternatives: [],
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 28, // Dips (Brustversion)
    alternatives: [21], // Dip machine
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 68, // Seitheben
    alternatives: [71, 76, 80], // Cable lateral raises, Lateral raise machine, Resistance band lateral raises
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 101, // Überkopf Trizepsdrücken
    alternatives: [99, 105, 109, 115], // Skullcrusher, Single-arm dumbbell overhead extension, Cable overhead extension, Band overhead extension
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 100, // Close-Grip Bankdrücken
    alternatives: [103], // Lying triceps extension
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 106, // Trizeps Pushdown
    alternatives: [107, 112, 114], // Rope pushdown, Pushdown machine, Band pushdown
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
];

export const createPushWorkout = (duration: 45 | 60 | 90, goal: TrainingGoal, difficulty: Difficulty): Workout => {
  const idByPriority = [1, 16, 2, 101, 68, 106, 63, 22, 100, 28];
  const filter = duration === 45 ? idByPriority.slice(0, 4) : duration === 60 ? idByPriority.slice(0, 7) : idByPriority;

  const exercises = basePushWorkout
    .filter((exercise) => filter.includes(exercise.exerciseId))
    .map((exercise) => adjustExerciseForGoal(exercise, goal))
    .map((exercise) => adjustExerciseForDifficulty(exercise, difficulty));

  return {
    id: generateId(),
    name: "Push",
    exercises,
    description: "Push workout",
    duration,
  };
};

const basePullWorkout: WorkoutExercise[] = [
  {
    exerciseId: 46, // Latzug (Breiter Griff)
    alternatives: [50, 56, 52], // Latzug Maschine, Klimmzug, Klimzugmaschine
    sets: Array(4).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 42, // Sitzrudern am Kabelzug
    alternatives: [48, 51], // Hammer Strength Rudern, Low Row Machine
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 90,
  },
  {
    exerciseId: 45, // Latziehen mit engem Griff
    alternatives: [47], // Einarmiger Lat Pulldown
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 90,
  },
  {
    exerciseId: 32, // T-Bar Rudern
    alternatives: [31, 49, 166], // Vorgebeugtes Rudern, Smith Machine Rudern
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 44, // Straight Arm Pulldown (Pullover)
    alternatives: [],
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 165, // Reverse Butterfly
    alternatives: [40, 53], // Kurzhantel Reverse Flys, Reverse Cable Flys
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 43, // Face Pull
    alternatives: [70], // Cuban Press
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 82, // Langhantel Curl
    alternatives: [83, 85], // Preacher Curl, Spider Curl
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 86, // Kurzhantel Curl
    alternatives: [88, 89], // Schrägbank Curl, Konzentrationscurl
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 87, // Hammer Curl
    alternatives: [93, 98], // Rope Hammer Curl, Kettlebell-Curl
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
];

export const createPullWorkout = (duration: 45 | 60 | 90, goal: TrainingGoal, difficulty: Difficulty): Workout => {
  const idByPriority = [46, 42, 44, 82, 32, 43, 86, 45, 165, 87];
  const filter = duration === 45 ? idByPriority.slice(0, 4) : duration === 60 ? idByPriority.slice(0, 7) : idByPriority;

  const exercises = basePullWorkout
    .filter((exercise) => filter.includes(exercise.exerciseId))
    .map((exercise) => adjustExerciseForGoal(exercise, goal))
    .map((exercise) => adjustExerciseForDifficulty(exercise, difficulty));

  return {
    id: generateId(),
    name: "Pull",
    exercises,
    description: "Pull workout",
    duration,
  };
};

const baseLegsExercises = [
  {
    exerciseId: 143, // Kniebeuge
    alternatives: [154, 144, 155], // Hackenschmidt-Kniebeuge, Frontkniebeuge, Smith Machine Kniebeuge
    sets: Array(4).fill({ reps: 10 }),
    restPeriod: 120,
  },
  {
    exerciseId: 153, // Beinpresse
    alternatives: [],
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 145, // Romanian Deadlift
    alternatives: [149], // Rumänisches Kreuzheben mit Kurzhanteln
    sets: Array(4).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 150, // Bulgarian Split Squat
    alternatives: [151, 152], // Ausfallschritte im Gehen, Step-Up
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 156, // Beinstrecker
    alternatives: [],
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 157, // Beincurls
    alternatives: [],
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 147, // Wadenheben
    alternatives: [158], // Wadenheben an der Maschine
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 45,
  },
  {
    exerciseId: 167, // Beinheben
    alternatives: [130, 126], // V-Ups
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 45,
  },
  {
    exerciseId: 131, // Crunch
    alternatives: [132, 133], // Decline Crunch, Kabelzug Crunch
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 45,
  },
];

export const createLegsWorkout = (duration: 45 | 60 | 90, goal: TrainingGoal, difficulty: Difficulty): Workout => {
  const idByPriority = [143, 145, 156, 157, 150, 147, 167, 131, 153];
  const filter = duration === 45 ? idByPriority.slice(0, 4) : duration === 60 ? idByPriority.slice(0, 7) : idByPriority;

  const exercises = baseLegsExercises
    .filter((exercise) => filter.includes(exercise.exerciseId))
    .map((exercise) => adjustExerciseForGoal(exercise, goal))
    .map((exercise) => adjustExerciseForDifficulty(exercise, difficulty));

  return {
    id: generateId(),
    name: "Beine",
    exercises,
    description: "Beine workout",
    duration,
  };
};

const baseUpperBodyExercises = [
  {
    exerciseId: 1, // Bankdrücken
    alternatives: [5, 14, 2], // Kurzhantel Bankdrücken (Flach), Brustpresse, Bankdrücken Schrägbank
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 56, // Klimmzug
    alternatives: [46, 50], // Latziehen (Breiter Griff), Latzug Maschine
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 63, // Militärpresse
    alternatives: [66, 75, 67], // Kurzhantel Schulterdrücken, Schulterpresse (Maschine), Arnold Press
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 32, // T-Bar Rudern
    alternatives: [31, 48, 166], // Vorgebeugtes Rudern, Hammer Strength Rudern, Sitzendes Rudern (Breit)
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 18, // Kabelkreuzen
    alternatives: [16, 8, 20], // Butterfly (Pec Deck), Kurzhantel Flys (Flach), Hoher Kabelzug
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 90,
  },
  {
    exerciseId: 68, // Seitheben
    alternatives: [71, 76, 69], // Kabelzug Seitheben, Seitheben-Maschine, Frontheben
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 43, // Face Pull
    alternatives: [165, 70], // Reverse Butterfly, Cuban Press
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 82, // Langhantel Curl
    alternatives: [86, 91, 83], // Kurzhantel Curl, Cable Curl, Preacher Curl
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 90,
  },
  {
    exerciseId: 106, // Trizeps Pushdown
    alternatives: [107, 112, 101, 99], // Trizeps-Seildrücken, Trizeps-Pushdown-Maschine, Überkopf Trizepsdrücken, Skullcrusher
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 90,
  },
];

export const createUpperBodyWorkout = (duration: 45 | 60 | 90, goal: TrainingGoal, difficulty: Difficulty): Workout => {
  const idByPriority = [1, 56, 63, 32, 68, 43, 106, 18, 82];
  const filter = duration === 45 ? idByPriority.slice(0, 4) : duration === 60 ? idByPriority.slice(0, 7) : idByPriority;

  const exercises = baseUpperBodyExercises
    .filter((exercise) => filter.includes(exercise.exerciseId))
    .map((exercise) => adjustExerciseForGoal(exercise, goal))
    .map((exercise) => adjustExerciseForDifficulty(exercise, difficulty));

  return {
    id: generateId(),
    name: "Oberkörper",
    exercises,
    description: "Oberkörper workout",
    duration,
  };
};

const baseFullBodyExercises = [
  {
    exerciseId: 143, // Kniebeuge
    alternatives: [148, 153, 154], // Goblet Squat, Beinpresse, Hackenschmidt-Kniebeuge
    sets: Array(4).fill({ reps: 8 }),
    restPeriod: 120,
  },
  {
    exerciseId: 1, // Bankdrücken
    alternatives: [5, 14, 2], // Kurzhantel Bankdrücken (Flach), Brustpresse, Bankdrücken Schrägbank
    sets: Array(4).fill({ reps: 8 }),
    restPeriod: 120,
  },
  {
    exerciseId: 56, // Klimmzug
    alternatives: [46, 50, 52], // Latziehen (Breiter Griff), Latzug Maschine, Klimmzug Maschine
    sets: Array(4).fill({ reps: 8 }),
    restPeriod: 120,
  },
  {
    exerciseId: 145, // Romanian Deadlift
    alternatives: [149, 146], // Rumänisches Kreuzheben mit Kurzhanteln, Hip Thrust
    sets: Array(4).fill({ reps: 10 }),
    restPeriod: 120,
  },
  {
    exerciseId: 63, // Militärpresse
    alternatives: [66, 75, 67], // Kurzhantel Schulterdrücken, Schulterpresse (Maschine), Arnold Press
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 166, // Sitzendes Rudern
    alternatives: [31, 48, 32], // Vorgebeugtes Rudern, Hammer Strength Rudern, T-Bar Rudern
    sets: Array(3).fill({ reps: 10 }),
    restPeriod: 90,
  },
  {
    exerciseId: 68, // Seitheben
    alternatives: [71, 76, 69], // Kabelzug Seitheben, Seitheben-Maschine, Frontheben
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
  {
    exerciseId: 106, // Trizeps Pushdown
    alternatives: [107, 112, 101], // Trizeps-Seildrücken, Trizeps-Pushdown-Maschine, Überkopf Trizepsdrücken
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 82, // Langhantel Curl
    alternatives: [86, 91, 83], // Kurzhantel Curl, Cable Curl, Preacher Curl
    sets: Array(3).fill({ reps: 12 }),
    restPeriod: 60,
  },
  {
    exerciseId: 43, // Face Pull
    alternatives: [70], // Cuban Press
    sets: Array(3).fill({ reps: 15 }),
    restPeriod: 60,
  },
];

export const createFullBodyWorkout = (duration: 45 | 60 | 90, goal: TrainingGoal, difficulty: Difficulty): Workout => {
  const idByPriority = [143, 1, 56, 145, 63, 166, 68, 106, 82, 43];
  const filter = duration === 45 ? idByPriority.slice(0, 4) : duration === 60 ? idByPriority.slice(0, 7) : idByPriority;

  const exercises = baseFullBodyExercises
    .filter((exercise) => filter.includes(exercise.exerciseId))
    .map((exercise) => adjustExerciseForGoal(exercise, goal))
    .map((exercise) => adjustExerciseForDifficulty(exercise, difficulty));

  return {
    id: generateId(),
    name: "Ganzkörper",
    exercises,
    description: "Ganzkörper workout",
    duration,
  };
};
