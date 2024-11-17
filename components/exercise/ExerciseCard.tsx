// TrainTechApp/components/exercise/ExerciseCard.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "react-native";
import { Exercise } from "~/lib/types";
import { useRouter } from "expo-router";

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => router.push(`/workout/exercise/${exercise.id}`)}
      className="active:opacity-70"
    >
      <View className="bg-card/60 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
        <View className="flex-row gap-4">
          <View className="w-16 h-16 bg-muted rounded-xl items-center justify-center overflow-hidden">
            {exercise.images?.[0] ? (
              <Image
                source={{ uri: exercise.images[0] }}
                alt={exercise.name}
                className="w-full h-full"
              />
            ) : (
              <Image
                source={{ uri: "/api/placeholder/64/64" }}
                alt={exercise.name}
                className="w-full h-full"
              />
            )}
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-semibold text-base mb-1">{exercise.name}</Text>
            <Text className="text-muted-foreground text-sm mb-2">{exercise.equipment}</Text>
            <View className="flex-row flex-wrap gap-2">
              {exercise.primaryMuscles.map((muscle, index) => (
                <View key={index} className="bg-primary/10 rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-medium">{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};