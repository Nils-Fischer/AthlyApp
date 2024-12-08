import ActionSheet, { ActionSheetProps, SheetManager } from "react-native-actions-sheet";
import { ExerciseEditPage } from "~/components/Exercise/ExerciseEditPage";
import { ExerciseEditAlternatives } from "~/components/Exercise/ExerciseEditAlternatives";
import { ExerciseEditNotes } from "~/components/Exercise/ExerciseEditNotes";
import { ExerciseProgress } from "~/components/Exercise/ExerciseProgress";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { useState } from "react";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";
import { ExerciseDetail } from "~/components/Exercise/ExerciseDetail";

export interface ExerciseBottomSheetEditorProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  initalRoute?: ActiveSheet;
}

type ActiveSheet =
  | "main-edit-route"
  | "note-edit-route"
  | "alternative-exercise-route"
  | "exercise-stats-route"
  | "exercise-details-route";

function ExerciseBottomSheetEditor(props: ActionSheetProps<"sheet-with-router">) {
  const parameters = props.payload as unknown as ExerciseBottomSheetEditorProps;
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(parameters.initalRoute ?? "main-edit-route");
  const [workoutExercise, setWorkoutExercise] = useState<WorkoutExercise>(parameters.workoutExercise);
  const [exercise, setExercise] = useState<Exercise>(parameters.exercise);

  const save = (newWorkoutExercise: WorkoutExercise) => {
    SheetManager.hide("sheet-with-router", {
      payload: newWorkoutExercise,
    });
  };

  const close = () => {
    SheetManager.hide("sheet-with-router", {
      payload: undefined,
    });
  };

  const navigateTo = (route: ActiveSheet, workoutExercise?: WorkoutExercise, exercise?: Exercise) => {
    workoutExercise && setWorkoutExercise(workoutExercise);
    exercise && setExercise(exercise);
    setActiveSheet(route);
  };

  const navigateToMainEditRoute = (workoutExercise?: WorkoutExercise, exercise?: Exercise) =>
    navigateTo("main-edit-route", workoutExercise, exercise);

  const navigateToNotes = (workoutExercise?: WorkoutExercise, exercise?: Exercise) =>
    navigateTo("note-edit-route", workoutExercise, exercise);

  const navigateToAlternativeExercises = (workoutExercise?: WorkoutExercise, exercise?: Exercise) =>
    navigateTo("alternative-exercise-route", workoutExercise, exercise);

  const navigateToStats = (workoutExercise?: WorkoutExercise, exercise?: Exercise) =>
    navigateTo("exercise-stats-route", workoutExercise, exercise);

  const navigateToExerciseDetails = (workoutExercise?: WorkoutExercise, exercise?: Exercise) =>
    navigateTo("exercise-details-route", workoutExercise, exercise);

  const getActiveSheet = () => {
    switch (activeSheet) {
      case "main-edit-route":
        return (
          <ExerciseEditPage
            exercise={exercise}
            workoutExercise={workoutExercise}
            onSave={save}
            onClose={close}
            navigateToAlternativeExercises={navigateToAlternativeExercises}
            navigateToNotes={navigateToNotes}
            navigateToStats={navigateToStats}
            navigateToExerciseDetails={navigateToExerciseDetails}
          />
        );
      case "note-edit-route":
        return (
          <ExerciseEditNotes workoutExercise={workoutExercise} onSave={save} navigateBack={navigateToMainEditRoute} />
        );
      case "alternative-exercise-route":
        return (
          <ExerciseEditAlternatives
            workoutExercise={workoutExercise}
            exercise={exercise}
            onSave={save}
            navigateBack={navigateToMainEditRoute}
          />
        );
      case "exercise-stats-route":
        return (
          <ExerciseProgress
            workoutExercise={workoutExercise}
            exercise={exercise}
            onSave={save}
            navigateBack={() => navigateToMainEditRoute(workoutExercise, exercise)}
          />
        );
      case "exercise-details-route":
        return (
          <ExerciseBottomSheetHeader
            title="Übungsdetails"
            onClose={() => navigateToMainEditRoute(workoutExercise, exercise)}
            onSave={() => save(workoutExercise)}
            closeMode="back"
          >
            <ExerciseDetail exercise={exercise} navigateToExercise={() => {}} />
          </ExerciseBottomSheetHeader>
        );
    }
  };

  return (
    <ActionSheet
      id={props.id}
      enableRouterBackNavigation={true}
      initialRoute={"main-edit-route"}
      snapPoints={[60, 95]}
      initialSnapIndex={1}
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      onClose={close}
      containerStyle={{
        height: "100%",
      }}
    >
      {getActiveSheet()}
    </ActionSheet>
  );
}

export default ExerciseBottomSheetEditor;
