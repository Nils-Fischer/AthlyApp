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
      <ExerciseTrackingSheet
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

function ExerciseTrackingSheet({ exercise, isVisible, onClose, isWorkoutStarted }: ExerciseDetailsSheetProps) {
  if (!exercise) return null;

  return (
    <BottomSheet isOpen={isVisible} onClose={onClose} title={exercise.name} snapPoints={[85]}>
      <ScrollView className="flex-1 p-4">
        {/* Exercise Info Section */}
        <View className="mb-6">
          <MuscleGroup title="Primary" muscles={exercise.primaryMuscles} />
          <MuscleGroup title="Secondary" muscles={exercise.secondaryMuscles} />
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-2 mb-6">
          <Button variant="outline" className="flex-1" onPress={() => {}} disabled={!isWorkoutStarted}>
            <View className="flex-row items-center">
              <ChevronRight size={16} className="mr-2" />
              <Text>Details</Text>
            </View>
          </Button>
          <Button variant="outline" className="flex-1" onPress={() => {}} disabled={!isWorkoutStarted}>
            <View className="flex-row items-center">
              <Trophy size={16} className="mr-2" />
              <Text>History</Text>
            </View>
          </Button>
        </View>

        {/* Sets Input Section */}
        <Section title="Sets">
          <View className="space-y-4">
            {/* Header */}
            <View className="flex-row px-4">
              <Text className="w-12 font-medium">Set</Text>
              <Text className="flex-1 font-medium text-center">Previous</Text>
              <Text className="w-20 font-medium text-center">Weight</Text>
              <Text className="w-16 font-medium text-center">Reps</Text>
            </View>

            {/* Sample Set Rows (you'll need to implement the actual state management) */}
            {[1, 2, 3].map((setNumber) => (
              <View key={setNumber} className="flex-row items-center bg-muted rounded-lg p-4">
                <Text className="w-12">{setNumber}</Text>
                <View className="flex-1 items-center">
                  <Text className="text-muted-foreground">60kg × 12</Text>
                </View>
                <View className="w-20 items-center">
                  <Text>60</Text>
                </View>
                <View className="w-16 items-center">
                  <Text>12</Text>
                </View>
              </View>
            ))}

            {/* Add Set Button */}
            <Button variant="outline" className="w-full" onPress={() => {}} disabled={!isWorkoutStarted}>
              <Text>Add Set</Text>
            </Button>
          </View>
        </Section>
      </ScrollView>
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
