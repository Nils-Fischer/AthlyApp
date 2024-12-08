import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

interface DeleteExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  trigger?: React.ReactNode;
}

export function ExerciseDeleteConfirmation({ open, onOpenChange, onConfirm, trigger }: DeleteExerciseDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <Text className="text-xl font-semibold mb-2">Übung löschen?</Text>
        <Text className="text-base text-muted-foreground mb-6">
          Möchtest du diese Übung wirklich aus dem Workout entfernen?
        </Text>
        <View className="flex-row items-center gap-3">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="flex-1 h-12">
              <Text className="text-foreground">Abbrechen</Text>
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onPress={onConfirm} className="flex-1 h-12 bg-destructive">
              <Text className="text-destructive-foreground font-medium">Löschen</Text>
            </Button>
          </AlertDialogAction>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
