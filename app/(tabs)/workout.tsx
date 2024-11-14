import * as React from "react";
import { View } from "react-native";
import { WorkoutForm } from "~/components/ExerciseForms/WorkoutForm";
import { Program } from "~/lib/types";
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const [programs, setPrograms] = React.useState<Program[]>(userStore.userData?.programs || []);

const handleProgramCreated = (program: Program) => {
  useUserStore.getState().updateUserData([program]);
  setPrograms([...programs, program]);
};

export default function Screen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      {programs.length === 0 ? (
        <WorkoutForm onProgramCreated={handleProgramCreated} />
      ) : (
        <View>{/* TODO: Add program list or preview here */}</View>
      )}
    </View>
  );
}
