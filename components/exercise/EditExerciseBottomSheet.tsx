import ActionSheet, { ActionSheetProps, Route, RouteScreenProps } from "react-native-actions-sheet";
import { ExerciseEditPage } from "./ExerciseEditPage";
import { AlternativeExercisesSelection } from "./AlternativeExercisesModal";
import { ExerciseNotes } from "./ExerciseNotesModal";
import { ExerciseProgress } from "./ExerciseProgressModal";
import ExerciseDetailScreen from "~/app/(tabs)/workout/exercise/[id]";
import { ReactNode, useState } from "react";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export interface EditExerciseBottomSheetProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onClose: () => void;
  onSave: (exercise: WorkoutExercise) => void;
  initalRoute?: "main-edit-route" | "alternative-exercise-route";
}

function EditExerciseBottomSheet(props: ActionSheetProps<"sheet-with-router">) {
  const properties = props.payload as EditExerciseBottomSheetProps;
  const { exercise, workoutExercise, onClose, onSave, initalRoute } = properties;

  const [reps, setReps] = useState(workoutExercise?.reps ?? 10);
  const [sets, setSets] = useState(workoutExercise?.sets ?? 3);
  const [exerciseId, setExerciseId] = useState(workoutExercise?.exerciseId);
  const [alternatives, setAlternatives] = useState(workoutExercise?.alternatives ?? []);
  const [restPeriod, setRestPeriod] = useState(workoutExercise?.restPeriod ?? 90);
  const [notes, setNotes] = useState<string | undefined>(workoutExercise?.notes ?? "");

  const save = () => {
    const newWorkoutExercise: WorkoutExercise = {
      ...workoutExercise,
      reps,
      sets,
      exerciseId,
      alternatives,
      restPeriod,
      notes,
    };
    onSave(newWorkoutExercise);
    onClose();
  };

  const Header = (title: string, children: ReactNode) => (
    <View className="min-h-full bg-background">
      <View className="px-4 py-2 flex-row items-center justify-between">
        <Button variant="ghost" size="icon" className="w-24" onPress={onClose}>
          <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
        </Button>
        <Text className="text-lg font-semibold flex-1 text-center" numberOfLines={1}>
          {title}
        </Text>
        <Button variant="ghost" size="icon" className="w-24" onPress={save}>
          <Text className="text-lg font-semibold text-destructive">Speichern</Text>
        </Button>
      </View>
      <View className="flex-1">{children}</View>
    </View>
  );

  const MainEdit = ({ router }: RouteScreenProps<"sheet-with-router", "main-edit-route">) => {
    return Header(
      "Übung bearbeiten",
      <ExerciseEditPage
        router={router}
        exercise={exercise}
        sets={sets}
        setSets={setSets}
        reps={reps}
        setReps={setReps}
        restTime={restPeriod}
        setRestTime={setRestPeriod}
        navigateToAlternativeExercises={() => router.navigate("alternative-exercise-route")}
        navigateToNotes={() => router.navigate("note-edit-route")}
        navigateToStats={() => router.navigate("exercise-stats-route")}
        navigateToExerciseDetails={() => router.navigate("exercise-details-route")}
      />
    );
  };

  const EditNotes = ({ router }: RouteScreenProps<"sheet-with-router", "note-edit-route">) => {
    return Header(
      "Notizen",
      <ExerciseNotes onClose={onClose} router={router} notes={notes} setNotes={setNotes} exerciseName={exercise.name} />
    );
  };

  const AlternativeExercises = ({
    router,
  }: RouteScreenProps<"sheet-with-router", "alternative-exercises-route"> & { exercise: Exercise }) => {
    return Header(
      "Alternative Übungen",
      <AlternativeExercisesSelection
        router={router}
        exercise={exercise}
        onClose={onClose}
        exerciseId={exerciseId}
        alternatives={alternatives}
        setExerciseId={setExerciseId}
        setAlternatives={setAlternatives}
      />
    );
  };

  const ExerciseStats = ({ router }: RouteScreenProps<"sheet-with-router", "exercise-stats-route">) => {
    return Header("Übungsstatistiken", <ExerciseProgress router={router} exercise={exercise} onClose={onClose} />);
  };

  const ExerciseDetails = ({ router }: RouteScreenProps<"sheet-with-router", "exercise-details-route">) => {
    const ExerciseDetailWrapper = () => {
      const mockParams = { id: exercise.id.toString() };

      return (
        <View className="flex-1">
          <ExerciseDetailScreen useLocalSearchParams={() => mockParams} />
        </View>
      );
    };

    return <ExerciseDetailWrapper />;
  };

  const routes: Route[] = [
    {
      name: "main-edit-page",
      component: MainEdit,
    },
    {
      name: "note-edit-route",
      component: EditNotes,
    },
    {
      name: "alternative-exercise-route",
      component: AlternativeExercises,
    },
    {
      name: "exercise-stats-route",
      component: ExerciseStats,
    },
    {
      name: "exercise-details-route",
      component: ExerciseDetails,
    },
  ];

  return (
    <ActionSheet
      id={props.id}
      enableRouterBackNavigation={true}
      routes={routes}
      initialRoute={"main-edit-page"}
      snapPoints={[95]}
      initialSnapIndex={0}
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      onClose={onClose}
      containerStyle={{
        height: "100%",
      }}
    />
  );
}

export default EditExerciseBottomSheet;
