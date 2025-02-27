import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor, {
  ExerciseBottomSheetEditorProps,
} from "~/components/Exercise/ExerciseBottomSheetEditor";
import { WorkoutExercise } from "~/lib/types";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "sheet-with-router": SheetDefinition<{
      payload: ExerciseBottomSheetEditorProps;
      returnValue: WorkoutExercise | undefined;
    }>;
  }
}

export {};
