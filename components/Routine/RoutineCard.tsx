import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Routine } from "~/lib/types";
import { CustomDropdownMenu, DropdownItem } from "../ui/custom-dropdown-menu";
import { MoreHorizontal, Trash2 } from "~/lib/icons/Icons";

interface RoutineCardProps {
  routine: Routine;
  onPress?: () => void;
  onDelete?: (id: number) => void;
  onToggleActive?: (id: number) => void;
  showDropdown?: boolean;
}

export const RoutineCard = ({ routine, onPress, onDelete, onToggleActive, showDropdown = true }: RoutineCardProps) => {
  const dropdownItems: DropdownItem[] = [
    {
      name: routine.active ? "Deaktivieren" : "Aktivieren",
      icon: ({ size, className }) => (
        <Ionicons name={routine.active ? "radio-button-on" : "radio-button-off"} size={size} className={className} />
      ),
      onPress: () => onToggleActive?.(routine.id),
    },
    {
      name: "Routine Löschen",
      icon: ({ size, className }) => <Trash2 size={size} className={className} />,
      onPress: () => onDelete?.(routine.id),
      destructive: true,
    },
  ];

  return (
    <Pressable
      onPress={onPress}
      className={`
        mb-4 overflow-hidden rounded-lg border border-border
        ${routine.active ? "bg-destructive/5 border-l-4 border-l-destructive" : "bg-card"}
      `}
    >
      <View className="p-6">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg font-semibold text-foreground">{routine.name}</Text>
              {routine.active && (
                <View className="bg-destructive/10 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-destructive">Active</Text>
                </View>
              )}
            </View>
            {routine.description && (
              <Text numberOfLines={2} className="text-sm text-muted-foreground">
                {routine.description}
              </Text>
            )}
          </View>
          {showDropdown && (
            <CustomDropdownMenu
              items={dropdownItems}
              align="start"
              trigger={
                <Pressable
                  className={`
                  h-8 w-8 items-center justify-center rounded-full
                  ${routine.active ? "hover:bg-primary/10" : "hover:bg-muted"}
                `}
                >
                  <MoreHorizontal size={20} className={routine.active ? "text-primary" : "text-muted-foreground"} />
                </Pressable>
              }
            />
          )}
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center">
            <Ionicons
              name="barbell-outline"
              size={16}
              className={routine.active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
            />
            <Text className="text-sm text-muted-foreground">
              <Text className="font-medium text-foreground">{routine.workouts.length}</Text> Workouts
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="repeat-outline"
              size={16}
              className={routine.active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
            />
            <Text className="text-sm text-muted-foreground">
              <Text className="font-medium text-foreground">{routine.frequency}x</Text> per week
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={16}
              className={routine.active ? "text-primary mr-2" : "text-muted-foreground mr-2"}
            />
            <Text className="text-sm text-muted-foreground">
              <Text className="font-medium text-foreground">
                {routine.workouts.reduce((acc, workout) => acc + (workout.duration || 0), 0)}
              </Text>{" "}
              min total
            </Text>
          </View>
        </View>

        {/* Workouts Preview */}
        <View className="mt-4 pt-4 border-t border-border">
          {routine.workouts.slice(0, 2).map((workout, index) => (
            <View key={workout.id} className={`flex-row items-center justify-between ${index !== 0 ? "mt-2" : ""}`}>
              <Text className="text-sm text-foreground">{workout.name}</Text>
              <Text className="text-xs text-muted-foreground">{workout.exercises.length} exercises</Text>
            </View>
          ))}
          {routine.workouts.length > 2 && (
            <Text className="text-xs text-muted-foreground mt-2">+{routine.workouts.length - 2} more workouts</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};
