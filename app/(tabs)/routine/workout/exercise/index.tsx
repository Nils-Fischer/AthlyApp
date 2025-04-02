import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function ExercisePage() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Text className="text-xl font-semibold text-foreground mb-4">Exercise Overview</Text>
      <Text className="text-muted-foreground text-center mb-6">This page is not meant to be accessed directly.</Text>
      <Link href="/routine/workout" className="text-primary">
        Go back to workouts
      </Link>
    </View>
  );
}
