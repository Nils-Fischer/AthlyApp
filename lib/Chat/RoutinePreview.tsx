import { View } from "react-native";
import { Routine } from "../types";
import { H1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import React, { useMemo } from "react";
import { RoutineComparisonOverview } from "~/components/RoutineComparison/RoutineComparisonOverview";

export const RoutinePreview = ({
  allRoutines,
  previewRoutine,
  handleAddRoutine,
  handleModifyRoutine,
}: {
  allRoutines: Routine[];
  previewRoutine: Routine;
  handleAddRoutine: (routine: Routine) => void;
  handleModifyRoutine: (routine: Routine) => void;
}) => {
  const state: "added" | "notAdded" | "modified" = useMemo(() => getState(), [allRoutines, previewRoutine]);

  function getState(): "added" | "notAdded" | "modified" {
    const existingRoutine = allRoutines.find((r) => r.id === previewRoutine.id);
    if (existingRoutine)
      return JSON.stringify(existingRoutine) === JSON.stringify(previewRoutine) ? "added" : "modified";
    return "notAdded";
  }
  const addRoutine = () => {
    handleAddRoutine(previewRoutine);
  };

  const modifyRoutine = () => {
    handleModifyRoutine(previewRoutine);
  };

  return (
    <View className="p-4 bg-background min-h-full">
      <View className="flex-row justify-between items-center mb-4 mx-2">
        <View className="flex-1 mr-2">
          <H1 className="text-xl font-semibold text-foreground" numberOfLines={1} ellipsizeMode="tail">
            {previewRoutine.name}
          </H1>
        </View>
        {state === "notAdded" ? (
          <Button variant="ghost" size="icon" className="w-24 flex-shrink-0" onPress={addRoutine}>
            <Text className="text-lg font-semibold text-destructive">Speichern</Text>
          </Button>
        ) : state === "added" ? (
          <Button variant="ghost" size="icon" className="w-24 flex-shrink-0" disabled>
            <Text className="text-green-500 text-center text-lg">Gespeichert</Text>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="w-24 flex-shrink-0" onPress={modifyRoutine}>
            <Text className="text-destructive text-center text-lg">Übernehmen</Text>
          </Button>
        )}
      </View>

      <View className="space-y-4 flex-1">
        <RoutineComparisonOverview
          routine={previewRoutine}
          oldComparisonRoutine={allRoutines.find((r) => r.id === previewRoutine.id)}
        />
      </View>
    </View>
  );
};
