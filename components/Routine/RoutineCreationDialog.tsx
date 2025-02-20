import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Routine } from "~/lib/types";
import { generateId } from "~/lib/utils";

interface RoutineCreationDialogProps {
  onCreate: (routine: Routine) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RoutineCreationDialog({ onCreate, trigger, open, onOpenChange }: RoutineCreationDialogProps) {
  const [newRoutineName, setNewRoutineName] = React.useState("Neue Routine");
  const [newRoutineDescription, setNewRoutineDescription] = React.useState("");

  const getNewRoutine: () => Routine = () => ({
    id: generateId(),
    name: newRoutineName,
    description: newRoutineDescription,
    workouts: [{ id: generateId(), name: "New Workout", exercises: [] }],
    frequency: 1,
    active: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Routine erstellen</DialogTitle>
          <DialogDescription>Erstelle eine leere Routine, der du später Übungen hinzufügen kannst.</DialogDescription>
        </DialogHeader>

        <View className="gap-4 py-4">
          <Input placeholder="Name der Routine" value={newRoutineName} onChangeText={setNewRoutineName} />
          <Input
            placeholder="Beschreibung (optional)"
            value={newRoutineDescription}
            onChangeText={setNewRoutineDescription}
          />
        </View>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" haptics="light">
              <Text>Abbrechen</Text>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!newRoutineName.trim()} onPress={() => onCreate(getNewRoutine())} haptics="medium">
              <Text>Erstellen</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
