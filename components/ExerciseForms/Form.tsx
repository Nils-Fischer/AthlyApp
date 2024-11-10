// components/WorkoutForm.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ExperienceLevel } from "./ExperienceLevel";
import { Level, LocationType, TrainingGoal } from "~/lib/types";
import { WeeklyFrequency } from "./WeeklyFrequency";
import { TrainingDuration } from "./TrainingDuration";
import { MainGoal } from "./MainGoal";
import { AdditionalGoals } from "./AdditionalGoal";
import { TrainingLocation } from "./TrainingLocation";
import { ChevronLeft } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";
import { TrainingSplitPreview } from "./SplitPreview";

export function WorkoutForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [level, setLevel] = useState<Level | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [goal, setGoal] = useState<TrainingGoal | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<string | null>(null);

  const TOTAL_STEPS = 7;

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((current) =>
      current.includes(goalId)
        ? current.filter((id) => id !== goalId)
        : [...current, goalId]
    );
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return level !== null;
      case 2:
        return frequency !== null;
      case 3:
        return duration !== null;
      case 4:
        return goal !== null;
      case 5:
        return selectedGoals.length > 0;
      case 6:
        return location !== null;
      case 7:
        return selectedSplit !== null;
      default:
        return false;
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

      <View className="px-4 mb-5">
        <Progress value={currentStep} max={TOTAL_STEPS} className="h-2" />
      </View>

      <View className="flex-1">
        {currentStep === 1 && (
          <ExperienceLevel level={level} onLevelChange={setLevel} />
        )}
        {currentStep === 2 && (
          <WeeklyFrequency
            frequency={frequency}
            onFrequencyChange={setFrequency}
          />
        )}
        {currentStep === 3 && (
          <TrainingDuration
            duration={duration}
            onDurationChange={setDuration}
          />
        )}
        {currentStep === 4 && <MainGoal goal={goal} onGoalChange={setGoal} />}
        {currentStep === 5 && (
          <AdditionalGoals
            selectedGoals={selectedGoals}
            onGoalToggle={toggleGoal}
          />
        )}
        {currentStep === 6 && (
          <TrainingLocation
            location={location}
            onLocationChange={setLocation}
          />
        )}
        {currentStep === 7 && (
          <TrainingSplitPreview
            frequency={frequency!}
            selectedSplit={selectedSplit}
            onSplitSelect={setSelectedSplit}
          />
        )}
      </View>

      <View className="flex-row justify-center gap-4 p-4">
        {currentStep > 1 && (
          <Button variant="outline" onPress={handlePreviousStep}>
            <ChevronLeft className={cn("text-foreground")} />
          </Button>
        )}
        <Button
          variant="destructive"
          disabled={!isStepValid(currentStep)}
          onPress={handleNextStep}
        >
          <Text>Weiter</Text>
        </Button>
      </View>
    </View>
  );
}
