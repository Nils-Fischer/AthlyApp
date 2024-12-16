import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { Dialog } from "~/components/ui/dialog";
import { Clock, Dumbbell, Flame, Trophy, ChevronRight } from "lucide-react-native";
import type { Workout, Exercise } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";

interface ActiveWorkoutModalsProps {
  workout: Workout;
  selectedExerciseId: number | null;
  onExerciseClose: () => void;
  isStarted: boolean;
  finalStats?: {
    duration: number;
    totalVolume: number;
    calories: number;
  };
}

export function ActiveWorkoutModals({
  workout,
  selectedExerciseId,
  onExerciseClose,
  isStarted,
  finalStats,
}: ActiveWorkoutModalsProps) {
  const { getExerciseById } = useExerciseStore();
  const selectedExercise = selectedExerciseId ? getExerciseById(selectedExerciseId) : null;

  return (
    <>
      <ExerciseDetailsSheet
        exercise={selectedExercise}
        isVisible={!!selectedExerciseId}
        onClose={onExerciseClose}
        isWorkoutStarted={isStarted}
      />

      <WorkoutCompleteDialog isVisible={!!finalStats} stats={finalStats} workout={workout} />
    </>
  );
}

interface ExerciseDetailsSheetProps {
  exercise: Exercise | null;
  isVisible: boolean;
  onClose: () => void;
  isWorkoutStarted: boolean;
}

function ExerciseDetailsSheet({ exercise, isVisible, onClose, isWorkoutStarted }: ExerciseDetailsSheetProps) {
  if (!exercise) return null;

  return (
    <BottomSheet isOpen={isVisible} onClose={onClose} title={exercise.name} snapPoints={[85]}>
      <View className="px-4">
        <View className="flex-row flex-wrap gap-2 mb-4">
          {exercise.tag.map((tag) => (
            <View key={tag} className="bg-muted px-2 py-1 rounded-full">
              <Text className="text-xs text-muted-foreground">{tag}</Text>
            </View>
          ))}
        </View>

        <ScrollView className="space-y-4">
          <Section title="Target Muscles">
            <View className="space-y-1">
              <MuscleGroup title="Primary" muscles={exercise.primaryMuscles} />
              {exercise.secondaryMuscles.length > 0 && (
                <MuscleGroup title="Secondary" muscles={exercise.secondaryMuscles} />
              )}
            </View>
          </Section>

          <Section title="Instructions">
            <View className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <View key={index} className="flex-row">
                  <Text className="text-muted-foreground mr-2">{index + 1}.</Text>
                  <Text className="flex-1 text-foreground">{instruction}</Text>
                </View>
              ))}
            </View>
          </Section>

          <View className="h-32" />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

interface WorkoutCompleteDialogProps {
  isVisible: boolean;
  stats?: {
    duration: number;
    totalVolume: number;
    calories: number;
  };
  workout: Workout;
}

function WorkoutCompleteDialog({ isVisible, stats, workout }: WorkoutCompleteDialogProps) {
  if (!stats) return null;

  return (
    <Dialog open={isVisible}>
      <View className="p-4 items-center">
        <View className="mb-6">
          <Trophy size={48} className="text-primary" />
        </View>

        <Text className="text-2xl font-bold text-center mb-2">Workout Complete!</Text>
        <Text className="text-muted-foreground text-center mb-6">Great job completing {workout.name}</Text>

        <View className="w-full space-y-4 mb-6">
          <StatItem icon={<Clock size={20} />} label="Duration" value={`${Math.round(stats.duration / 60)} min`} />
          <StatItem icon={<Dumbbell size={20} />} label="Total Volume" value={`${stats.totalVolume} kg`} />
          <StatItem icon={<Flame size={20} />} label="Calories Burned" value={`${stats.calories} kcal`} />
        </View>

        <Button
          onPress={() => {}} // Handle navigation to workout summary
          className="w-full"
        >
          View Summary
        </Button>
      </View>
    </Dialog>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="space-y-2">
      <Text className="text-lg font-semibold">{title}</Text>
      {children}
    </View>
  );
}

function MuscleGroup({ title, muscles }: { title: string; muscles: string[] }) {
  return (
    <View className="flex-row items-center">
      <Text className="text-muted-foreground w-20">{title}:</Text>
      <Text className="flex-1">{muscles.join(", ")}</Text>
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-muted rounded-lg">
      <View className="flex-row items-center">
        <View className="mr-3 text-muted-foreground">{icon}</View>
        <Text className="text-muted-foreground">{label}</Text>
      </View>
      <Text className="font-medium">{value}</Text>
    </View>
  );
}
