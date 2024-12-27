import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Text } from "~/components/ui/text";

interface ActiveWorkoutCancelConfirmationProps {
  showCancelDialog: boolean;
  setShowCancelDialog: (show: boolean) => void;
  confirmCancel: () => void;
}

export const ActiveWorkoutCancelConfirmation = ({
  showCancelDialog,
  setShowCancelDialog,
  confirmCancel,
}: ActiveWorkoutCancelConfirmationProps) => {
  return (
    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent className="w-[90%] max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Workout abbrechen?</AlertDialogTitle>
          <AlertDialogDescription>
            <Text className="text-foreground text-center">
              Wenn du das Workout abbrichst, gehen alle Fortschritte verloren.
            </Text>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center mt-4 gap-3">
          <AlertDialogCancel className="flex-1 max-w-[160px]">
            <Text>Zurück</Text>
          </AlertDialogCancel>
          <AlertDialogAction className="flex-1 max-w-[160px] bg-destructive" onPress={confirmCancel}>
            <Text>Beenden</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
