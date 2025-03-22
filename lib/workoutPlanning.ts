import { Exercise, MuscleGroup, Routine, Workout, WorkoutSession } from "./types";
import { getMuscleGroup } from "./utils";

function getExerciseById(exerciseId: number, allExercises: Exercise[]): Exercise | null {
  return allExercises.find((exercise) => exercise.id === exerciseId) || null;
}

function getExercisesFromIds(exerciseIds: number[], allExercises: Exercise[]): Exercise[] {
  return exerciseIds.map((id) => getExerciseById(id, allExercises)).filter((e) => e !== null);
}

function getExercisesFromSession(session: WorkoutSession, allExercises: Exercise[]): Exercise[] {
  return getExercisesFromIds(
    session.entries.map((e) => e.exerciseId),
    allExercises
  );
}

function getExercisesFromWorkout(workout: Workout, allExercises: Exercise[]): Exercise[] {
  return getExercisesFromIds(
    workout.exercises.map((e) => e.exerciseId),
    allExercises
  );
}

export function getMuscleGroupsFromExercise(exercise: Exercise): Set<MuscleGroup> {
  return new Set(exercise.primaryMuscles.map((m) => getMuscleGroup(m)));
}

export function getMuscleGroupsFromExercises(exercises: Exercise[]): Set<MuscleGroup> {
  return new Set(...exercises.flatMap((exercise) => getMuscleGroupsFromExercise(exercise)));
}

export function getNextWorkout(
  activeWorkouts: Workout[],
  lastCoupleSessions: WorkoutSession[],
  allExercises: Exercise[]
): string | null {
  if (!activeWorkouts) return null;
  const lastCoupleSessionsIds = lastCoupleSessions.map((session) => session.workoutId);
  const lastWorkoutFromActiveRoutineIndex = activeWorkouts.findLastIndex((workout) =>
    lastCoupleSessionsIds.includes(workout.id)
  );
  if (lastWorkoutFromActiveRoutineIndex !== -1)
    return activeWorkouts[(lastWorkoutFromActiveRoutineIndex + 1) % activeWorkouts.length].id;
  else return getNextWorkoutByLeastFatiguedMuscleGroup(activeWorkouts, lastCoupleSessions, allExercises);
}

function getNextWorkoutByLeastFatiguedMuscleGroup(
  activeWorkouts: Workout[],
  lastCoupleSessions: WorkoutSession[],
  allExercises: Exercise[]
): string | null {
  const lastCoupleSessionsExercises: Exercise[][] = lastCoupleSessions.map((session) =>
    getExercisesFromSession(session, allExercises)
  );
  const lastCoupleSessionsMuscleGroups: Set<MuscleGroup>[] = lastCoupleSessionsExercises.map((exercises) =>
    getMuscleGroupsFromExercises(exercises)
  );
  const activeWorkoutsExercises: Exercise[][] = activeWorkouts.map((workout) =>
    getExercisesFromWorkout(workout, allExercises)
  );
  const activeWorkoutsMuscleGroups: Set<MuscleGroup>[] = activeWorkoutsExercises.map((exercises) =>
    getMuscleGroupsFromExercises(exercises)
  );
  const leastFatiguedWorkoutIndeces = lastCoupleSessionsMuscleGroups.reduceRight(
    (acc, muscleGroups) =>
      getWorkoutIndecesByLeastFatiguedMuscleGroup(
        muscleGroups,
        activeWorkoutsMuscleGroups.filter((_, index) => acc.includes(index))
      ),
    activeWorkouts.map((_, index) => index)
  );
  return activeWorkouts[leastFatiguedWorkoutIndeces.at(0) || 0].id;
}

function getWorkoutIndecesByLeastFatiguedMuscleGroup(
  lastTrainedMuscleGroups: Set<MuscleGroup>,
  activeRoutineMuscleGroups: Set<MuscleGroup>[]
): number[] {
  const sharedMuscleGroups = activeRoutineMuscleGroups.map(
    (muscleGroups) => new Set([...muscleGroups].filter((x) => lastTrainedMuscleGroups.has(x))).size
  );
  const minSharedMuscles = Math.min(...sharedMuscleGroups);
  const leastFatiguedWorkoutIndexes = sharedMuscleGroups
    .map((count, index) => (count === minSharedMuscles ? index : null))
    .filter((index) => index !== null);
  return leastFatiguedWorkoutIndexes;
}

function getRemainingWorkoutSchedule(
  today: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  sessionsThisWeek: WorkoutSession[],
  workouts: Workout[]
): WeeklySchedule {
  const weeklySchedule: WeeklySchedule = new Map();
  [1, 2, 3, 4, 5, 6, 0].forEach((day) => {
    const sessions = sessionsThisWeek.filter((session) => new Date(session.date).getDay() === day);
    weeklySchedule.set(((day - 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6, {
      activity: sessions.length > 0 ? sessions : null,
    });
  });

  today = today + (weeklySchedule.get(today)?.activity ? 1 : 0);
  const remainingDays = 7 - today;
  const schedule = spreadWorkouts(remainingDays, workouts);
  schedule.forEach((workout, index) => {
    const day = ((today + index) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    weeklySchedule.set(day, {
      activity: workout,
    });
  });
  return weeklySchedule;
}

export function spreadWorkouts(days: number, workouts: Workout[]): (Workout | null)[] {
  if (days === workouts.length) return workouts.map((w) => w);
  if (days === 2) return [workouts[0], null];
  if (days === 3) {
    if (workouts.length === 1) return [workouts[0], null, null];
    if (workouts.length === 2) return [workouts[0], null, workouts[1]];
  }
  if (days === 4) {
    if (workouts.length === 1) return [workouts[0], null, null, null];
    if (workouts.length === 2) return [workouts[0], null, workouts[1], null];
    if (workouts.length === 3) return [workouts[0], workouts[1], null, workouts[2]];
  }
  if (days === 5) {
    if (workouts.length === 1) return [workouts[0], null, null, null, null];
    if (workouts.length === 2) return [workouts[0], null, workouts[1], null, null];
    if (workouts.length === 3) return [workouts[0], workouts[1], null, workouts[2], null];
    if (workouts.length === 4) return [workouts[0], workouts[1], workouts[2], null, workouts[3], workouts[4]];
  }
  if (days === 6) {
    if (workouts.length === 1) return [workouts[0], null, null, null, null, null];
    if (workouts.length === 2) return [workouts[0], null, null, workouts[1], null, null];
    if (workouts.length === 3) return [workouts[0], workouts[1], null, null, workouts[2], null];
    if (workouts.length === 4) return [workouts[0], workouts[1], null, workouts[2], null, workouts[3]];
    if (workouts.length === 5) return [workouts[0], workouts[1], workouts[2], null, workouts[3], workouts[4]];
  }
  if (days === 7) {
    if (workouts.length === 1) return [workouts[0], null, null, null, null, null, null];
    if (workouts.length === 2) return [workouts[0], null, null, workouts[1], null, null, null];
    if (workouts.length === 3) return [workouts[0], null, workouts[1], null, workouts[2], null, null];
    if (workouts.length === 4) return [workouts[0], workouts[1], null, workouts[2], null, workouts[3], null];
    if (workouts.length === 5) return [workouts[0], workouts[1], null, workouts[2], workouts[3], null, workouts[4]];
    if (workouts.length === 6)
      return [workouts[0], workouts[1], workouts[2], null, workouts[3], workouts[4], workouts[5]];
  }
  return Array(days).fill(null);
}

function getSessionsThisWeek(allSessions: WorkoutSession[]): WorkoutSession[] {
  return allSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    const startOfWeek = new Date();
    const diff = (startOfWeek.getDay() + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    return sessionDate >= startOfWeek;
  });
}

function getRemainingWorkouts(
  workouts: Workout[],
  allSessions: WorkoutSession[],
  allExercises: Exercise[],
  frequency: number,
  sessionsThisWeek: WorkoutSession[],
  remainingDays: number
): Workout[] {
  const remainingWorkouts = Math.min(frequency - sessionsThisWeek.length, remainingDays);
  if (remainingWorkouts <= 0) return [];

  const nextWorkoutId = getNextWorkout(workouts, allSessions.slice(-3), allExercises);
  let nextWorkoutIndex = workouts.findIndex((workout) => workout.id === nextWorkoutId);

  const schedule: Workout[] = Array.from(
    { length: remainingWorkouts },
    (_, i) => workouts[(nextWorkoutIndex + i) % workouts.length]
  );

  return schedule;
}

export function getDailyIndex(date: Date): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return ((date.getDay() - 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function getWorkoutSchedule(
  activeRoutine: Routine | null,
  allSessions: WorkoutSession[],
  allExercises: Exercise[]
): WeeklySchedule {
  const workouts = activeRoutine?.workouts || [];

  const sessionsThisWeek = getSessionsThisWeek(allSessions);

  const today = getDailyIndex(new Date());
  const todaysSession = sessionsThisWeek.find((session) => new Date(session.date).getDate() === new Date().getDate());
  console.log("todaysSession", todaysSession);
  const remainingDays = 7 - today - (todaysSession ? 1 : 0);

  const frequency = activeRoutine?.frequency || sessionsThisWeek.length;

  const remainingWorkouts = getRemainingWorkouts(
    workouts,
    allSessions,
    allExercises,
    frequency,
    sessionsThisWeek,
    remainingDays
  );

  const schedule = getRemainingWorkoutSchedule(today, sessionsThisWeek, remainingWorkouts);
  return schedule;
}

export type WeekDay = {
  activity: WorkoutSession[] | Workout | null;
};

export type WeeklySchedule = Map<0 | 1 | 2 | 3 | 4 | 5 | 6, WeekDay>;
