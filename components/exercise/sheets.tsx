import { registerSheet, RouteDefinition, SheetDefinition } from "react-native-actions-sheet";
import EditExerciseBottomSheet, { EditExerciseBottomSheetProps } from "./EditExerciseBottomSheet";

registerSheet("sheet-with-router", EditExerciseBottomSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "sheet-with-router": SheetDefinition<{
      payload: EditExerciseBottomSheetProps;
      routes: {
        "main-edit-route": RouteDefinition;
        "note-edit-route": RouteDefinition;
        "alternative-exercises-route": RouteDefinition;
        "exercise-stats-route": RouteDefinition;
        "exercise-details-route": RouteDefinition;
      };
    }>;
  }
}

export {};
