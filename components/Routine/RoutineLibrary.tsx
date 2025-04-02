import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Plus, Search, Trash2 } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { Routine } from "~/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { RoutineCard } from "./RoutineCard";
import * as Haptics from "expo-haptics";

interface RoutineLibraryProps {
  routines: Routine[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoutinePress: (routineId: string) => void;
  addButtonDropdownItems?: Array<{
    name: string;
    icon: any;
    onPress: () => void;
  }>;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
}

export const RoutineLibrary = ({
  routines,
  searchQuery,
  onSearchChange,
  addButtonDropdownItems,
  onDelete,
  onToggleActive,
  onRoutinePress,
}: RoutineLibraryProps) => {
  const getDropdownItems = (routine: Routine) => [
    {
      name: routine.active ? "Deaktivieren" : "Aktivieren",
      icon: ({ size, className }: { size: number; className: string }) => (
        <Ionicons name={routine.active ? "radio-button-on" : "radio-button-off"} size={size} className={className} />
      ),
      onPress: () => onToggleActive?.(routine.id),
    },
    {
      name: "Routine Löschen",
      icon: ({ size, className }: { size: number; className: string }) => <Trash2 size={size} className={className} />,
      onPress: () => onDelete?.(routine.id),
      destructive: true,
    },
  ];

  const getRightContent = (routine: Routine) => {
    return (
      <CustomDropdownMenu
        items={getDropdownItems(routine)}
        align="start"
        trigger={
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full" haptics="light">
            <MoreHorizontal size={20} className="text-primary" />
          </Button>
        }
      />
    );
  };

  return (
    <View className="flex-1 px-4">
      {/* Search Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1 mr-2">
          <Input
            placeholder="Trainingsplan suchen..."
            value={searchQuery}
            onChangeText={onSearchChange}
            startContent={<Search size={20} className="text-muted-foreground" />}
          />
        </View>

        {addButtonDropdownItems && (
          <CustomDropdownMenu
            items={addButtonDropdownItems}
            trigger={
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full" haptics="light">
                <Plus className="text-foreground" size={24} />
              </Button>
            }
          />
        )}
      </View>

      {/* Routines List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, gap: 12 }}
      >
        {routines.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20 py-20">
            <Text className="text-muted-foreground text-center mb-6">Keine Trainingspläne gefunden</Text>
            {addButtonDropdownItems && (
              <CustomDropdownMenu
                items={addButtonDropdownItems}
                trigger={
                  <Button size="lg" haptics="medium" className="flex-row items-center bg-primary">
                    <Plus className="mr-2 text-primary-foreground" size={20} />
                    <Text className="font-medium text-primary-foreground">Trainingsplan erstellen</Text>
                  </Button>
                }
              />
            )}
          </View>
        ) : (
          routines
            .sort((a, b) => {
              return (b.active ? 1 : 0) - (a.active ? 1 : 0) || a.name.localeCompare(b.name);
            })
            .map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                rightContent={getRightContent(routine)}
                onPress={() => onRoutinePress(routine.id)}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
};
