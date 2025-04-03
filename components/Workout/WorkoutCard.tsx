import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pressable, View } from "react-native";
import { CardLabel, Muted, P, Small } from "../ui/typography";
import { ChevronDown } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { Exercise, Workout } from "~/lib/types";
import React, { useState } from "react";

export type WorkoutCardProps = {
  workout: Workout;
  exercises: Exercise[];
  rightAccessory?: React.ReactNode;
  onPress?: (workout: Workout) => void;
  isSelected?: boolean;
};

export const WorkoutCard = ({ workout, isSelected, onPress, exercises, rightAccessory }: WorkoutCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <Pressable key={workout.id} onPress={() => onPress?.(workout)} className="active:opacity-50">
      <Card className={isSelected ? "border-2 border-success/50 bg-success/10" : ""}>
        <CardHeader className="flex-row items-center justify-between">
          <CardLabel className={cn("text-foreground font-bold text-md", isSelected && "text-primary")}>
            {workout.name}
          </CardLabel>
          {rightAccessory}
        </CardHeader>
        <CardContent className="gap-2">
          <P numberOfLines={3}>{workout.description}</P>
          <View className="flex-row items-center gap-2">
            <Muted className="text-muted-foreground">
              {workout.exercises.length} {workout.exercises.length === 1 ? "Übung" : "Übungen"}
            </Muted>
            {workout.duration && (
              <>
                <P className="text-muted-foreground">•</P>
                <P className="text-muted-foreground">{workout.duration} min</P>
              </>
            )}
          </View>
          <Pressable
            className="border-t border-border mt-3 items-center flex-row justify-between pt-2"
            onPress={() => setShowDetails(!showDetails)}
          >
            <CardLabel className="text-muted-foreground">Details</CardLabel>
            <ChevronDown className={cn("text-muted-foreground", showDetails && "rotate-180")} size={24} />
          </Pressable>
          {showDetails && (
            <View className="gap-3 p-1 pt-3 mt-1 ">
              {workout.exercises.map((exercise, index) => (
                <React.Fragment key={exercise.exerciseId}>
                  {index > 0 && <Separator className="my-1" />}
                  <View className="flex-row items-center justify-center">
                    <View className="w-7 h-7 rounded-full bg-background shadow-sm items-center justify-center mr-3">
                      <Small className="text-primary font-semibold">{index + 1}</Small>
                    </View>
                    <View className="flex-1 gap-1">
                      <Small className="text-foreground font-medium">
                        {exercises.find((e) => e.id === exercise.exerciseId)?.name}
                      </Small>
                      <Small className="text-muted-foreground">
                        {exercise.sets.length} {exercise.sets.length === 1 ? "Satz" : "Sätze"}
                        {exercise.restPeriod && ` • ${exercise.restPeriod}s Pause`}
                      </Small>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
};
