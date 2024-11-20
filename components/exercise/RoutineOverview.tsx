import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine } from "~/lib/types";
import { WorkoutPage } from "./WorkoutPage";

export function RoutineOverview({
  routine,
  handleExercisePress,
}: {
  routine: Routine;
  handleExercisePress?: (exerciseId: number) => void;
}) {
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");

  return (
    <ScrollView className="flex-1">
      <View className="px-4 pt-2 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col gap-1.5">
          <TabsList className="flex-row w-full mb-4">
            {routine.workouts.map((workout) => (
              <TabsTrigger key={workout.id} value={workout.id.toString()} className="flex-1">
                <Text>{workout.name}</Text>
              </TabsTrigger>
            ))}
          </TabsList>
          {routine.workouts.map((workout) => (
            <TabsContent key={workout.id} value={workout.id.toString()} className="w-full px-0">
              <WorkoutPage workout={workout} routineName={routine.name} onExercisePress={handleExercisePress} />
            </TabsContent>
          ))}
        </Tabs>
      </View>
    </ScrollView>
  );
}
