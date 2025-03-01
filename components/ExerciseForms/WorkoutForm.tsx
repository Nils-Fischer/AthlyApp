import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ExperienceLevel } from "./ExperienceLevel";
import { Difficulty, Routine, TrainingGoal } from "~/lib/types";
import { WeeklyFrequency } from "./WeeklyFrequency";
import { TrainingDuration } from "./TrainingDuration";
import { MainGoal } from "./MainGoal";
import { AdditionalGoals } from "./AdditionalGoal";
import { ChevronLeft } from "~/lib/icons/Icons";
import { createPreviewRoutines, RoutinePreview } from "./RoutinePreview";

interface WorkoutFormProps {
  onRoutineCreated?: (routine: Routine) => void;
}

export function WorkoutForm({ onRoutineCreated }: WorkoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [frequency, setFrequency] = useState<1 | 2 | 3 | null>(null);
  const [duration, setDuration] = useState<45 | 60 | 90 | null>(null);
  const [goal, setGoal] = useState<TrainingGoal | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  const [availableRoutines, setAvailableRoutines] = useState<Routine[]>([]);

  const TOTAL_STEPS = 6;

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      if (currentStep === 5 && frequency && duration && goal && difficulty) {
        console.log("creating preview routines");
        const newAvailableRoutines = createPreviewRoutines(frequency, duration, goal, difficulty);
        console.log(newAvailableRoutines.length);
        setAvailableRoutines(newAvailableRoutines);
        setCurrentStep((prev) => prev + 1);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else if (currentStep === TOTAL_STEPS) {
      finishCustomRoutine();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((current) =>
      current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId]
    );
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return difficulty !== null;
      case 2:
        return frequency !== null;
      case 3:
        return duration !== null;
      case 4:
        return goal !== null;
      case 5:
        return selectedGoals.length > 0;
      case 6:
        return selectedRoutine !== null;
      default:
        return false;
    }
  };

  const finishCustomRoutine = () => {
    if (selectedRoutine) {
      onRoutineCreated?.(selectedRoutine);
    }
  };

  return (
    <View className="flex-1">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-xl font-bold">Workout Planner</Text>
        <Text className="text-sm text-muted-foreground">
          Step {currentStep} of {TOTAL_STEPS}
        </Text>
      </View>

      <View className="px-4 mb-5 -mt-2">
        <Progress value={currentStep} max={TOTAL_STEPS} className="h-1" />
      </View>

      <View className="flex-1">
        {currentStep === 1 && <ExperienceLevel difficulty={difficulty} onDifficultyChange={setDifficulty} />}
        {currentStep === 2 && <WeeklyFrequency frequency={frequency} onFrequencyChange={setFrequency} />}
        {currentStep === 3 && <TrainingDuration duration={duration} onDurationChange={setDuration} />}
        {currentStep === 4 && <MainGoal goal={goal} onGoalChange={setGoal} />}
        {currentStep === 5 && <AdditionalGoals selectedGoals={selectedGoals} onGoalToggle={toggleGoal} />}
        {currentStep === 6 && (
          <RoutinePreview
            availableRoutines={availableRoutines}
            selectedRoutine={selectedRoutine}
            onRoutineSelect={setSelectedRoutine}
          />
        )}
      </View>

      <View className="flex-row justify-center gap-4 p-4">
        {currentStep > 1 && (
          <Button variant="outline" onPress={handlePreviousStep} haptics="light">
            <ChevronLeft className="text-foreground" />
          </Button>
        )}
        <Button variant="destructive" disabled={!isStepValid(currentStep)} onPress={handleNextStep} haptics="medium">
          <Text>Weiter</Text>
        </Button>
      </View>
    </View>
  );
}
