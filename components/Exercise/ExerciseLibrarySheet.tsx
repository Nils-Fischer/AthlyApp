import React from "react";
import ActionSheet from "react-native-actions-sheet";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { SheetManager } from "react-native-actions-sheet";

export interface ExerciseLibrarySheetProps {
  onExerciseSelect?: (exerciseId: number) => void;
}

function ExerciseLibrarySheet(props: { sheetId: string; payload?: ExerciseLibrarySheetProps }) {
  const handleExerciseSelect = (exerciseId: number) => {
    // Hide the sheet and return the selected exercise ID
    SheetManager.hide(props.sheetId, {
      payload: exerciseId,
    });
  };

  const close = () => {
    SheetManager.hide(props.sheetId, {
      payload: undefined,
    });
  };

  return (
    <ActionSheet
      id={props.sheetId}
      snapPoints={[85]}
      initialSnapIndex={0}
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      onClose={close}
      containerStyle={{
        height: "100%",
      }}
    >
      <ExerciseLibrary onPress={handleExerciseSelect} />
    </ActionSheet>
  );
}

export default ExerciseLibrarySheet;
