import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor, {
  ExerciseBottomSheetEditorProps,
} from "~/components/Exercise/ExerciseBottomSheetEditor";
import ExerciseLibrarySheet, { ExerciseLibrarySheetProps } from "~/components/Exercise/ExerciseLibrarySheet";
import { WorkoutExercise } from "~/lib/types";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);
registerSheet("exercise-library-sheet", ExerciseLibrarySheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "sheet-with-router": SheetDefinition<{
      payload: ExerciseBottomSheetEditorProps;
      returnValue: WorkoutExercise | undefined;
    }>;
    "exercise-library-sheet": SheetDefinition<{
      payload: ExerciseLibrarySheetProps;
      returnValue: number | undefined;
    }>;
  }
}

export {};
