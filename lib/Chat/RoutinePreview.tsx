import { View } from "react-native";
import { Routine } from "../types";
import { H1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import React from "react";

export const RoutinePreview = ({
  isAlreadyAdded,
  routine,
  handleAddRoutine,
}: {
  isAlreadyAdded: boolean;
  routine: Routine;
  handleAddRoutine: (routine: Routine) => void;
}) => {
  const [isAdded, setIsAdded] = React.useState(isAlreadyAdded);

  const addRoutine = () => {
    setIsAdded(true);
    handleAddRoutine(routine);
  };

  return (
    <View className="p-4 bg-background min-h-full">
      <View className="flex-row justify-between items-center mb-4 mx-2">
        <H1 className="text-xl font-semibold text-foreground">Trainingsplan Vorschau</H1>
        {routine && !isAdded ? (
          <Button variant="ghost" size="icon" className="w-24" onPress={addRoutine}>
            <Text className="text-lg font-semibold text-destructive">Speichern</Text>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="w-24" disabled>
            <Text className="text-green-500 text-center text-lg">Gespeichert</Text>
          </Button>
        )}
      </View>

      {routine ? (
        <View className="space-y-4 flex-1">
          <RoutineOverview routine={routine} />
        </View>
      ) : (
        <View className="p-4 items-center justify-center">
          <Text className="text-muted-foreground text-center">
            Keine Routine ausgewählt. Frag mich nach einem Trainingsplan!
          </Text>
        </View>
      )}
    </View>
  );
};
