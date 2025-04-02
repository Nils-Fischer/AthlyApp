import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Routine } from "~/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { H3, Muted, P } from "../ui/typography";
import { Separator } from "../ui/separator";
import { cn } from "~/lib/utils";

interface RoutineCardProps {
  routine: Routine;
  rightContent?: React.ReactNode;
  showActive?: boolean;
  onPress?: () => void;
}

export const RoutineCard = ({ routine, showActive, rightContent, onPress }: RoutineCardProps) => {
  const active = showActive || routine.active;

  return (
    <Pressable onPress={() => onPress?.()} className="active:opacity-80">
      <Card className={cn("overflow-hidden", active ? "bg-destructive/5 border-l-4 border-l-destructive" : "bg-card")}>
        <CardHeader className="flex-row justify-between items-center justify-between pr-12">
          <View className="flex-row justify-between items-center gap-4">
            <H3 numberOfLines={1} className="text-lg font-semibold text-foreground flex-1">
              {routine.name}
            </H3>
            {active && (
              <View className="bg-destructive/10 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-destructive">Active</Text>
              </View>
            )}
          </View>
          {rightContent && rightContent}
        </CardHeader>
        <CardContent className="gap-4">
          {routine.description && <Muted numberOfLines={2}>{routine.description}</Muted>}

          {/* Stats */}
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-row items-center">
              <Ionicons
                name="barbell-outline"
                size={16}
                className={active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
              />
              <Muted className="text-md">
                <P className="font-medium text-foreground">{routine.workouts.length}</P> Workouts
              </Muted>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="repeat-outline"
                size={16}
                className={active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
              />
              <Muted className="text-md">
                <P className="font-medium text-foreground">{routine.frequency}x</P> per week
              </Muted>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={16}
                className={active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
              />
              <Muted className="text-md">
                <P className="font-medium text-foreground">
                  {routine.workouts.reduce((acc, workout) => acc + (workout.duration || 0), 0)}
                </P>{" "}
                min total
              </Muted>
            </View>
          </View>

          <Separator />

          {/* Workouts Preview */}
          <View className="flex-column gap-2">
            {routine.workouts.slice(0, 2).map((workout, index) => (
              <View key={workout.id} className={`flex-row items-center justify-between ${index !== 0 ? "mt-2" : ""}`}>
                <Text className="text-sm text-foreground">{workout.name}</Text>
                <Text className="text-xs text-muted-foreground">{workout.exercises.length} exercises</Text>
              </View>
            ))}
            {routine.workouts.length > 2 && (
              <Text className="text-sm text-muted-foreground mt-2">+{routine.workouts.length - 2} more workouts</Text>
            )}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
};
