import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, Search } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { Routine } from "~/lib/types";
import { RoutineCard } from "./RoutineCard";
import { router } from "expo-router";

interface RoutineLibraryProps {
  routines: Routine[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  addButtonDropdownItems: Array<{
    name: string;
    icon: any;
    onPress: () => void;
  }>;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const RoutineLibrary = ({
  routines,
  searchQuery,
  onSearchChange,
  addButtonDropdownItems,
  onDelete,
  onToggleActive,
}: RoutineLibraryProps) => {
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
        <CustomDropdownMenu
          items={addButtonDropdownItems}
          trigger={
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full" haptics="light">
              <Plus className="text-foreground" size={24} />
            </Button>
          }
        />
      </View>

      {/* Routines List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {routines.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20 py-20">
            <Text className="text-muted-foreground text-center mb-6">Keine Trainingspläne gefunden</Text>
            <CustomDropdownMenu
              items={addButtonDropdownItems}
              trigger={
                <Button size="lg" haptics="medium" className="flex-row items-center bg-primary">
                  <Plus className="mr-2 text-primary-foreground" size={20} />
                  <Text className="font-medium text-primary-foreground">Trainingsplan erstellen</Text>
                </Button>
              }
            />
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
                onPress={() => router.push(`/workout/${routine.id}`)}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
};
