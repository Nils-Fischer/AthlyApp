import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, Search } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { ClickableCard } from "~/components/ClickableCard";
import { Routine } from "~/lib/types";
import { useRouter } from "expo-router";

interface RoutineLibraryProps {
  routines: Routine[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dropdownItems: Array<{
    name: string;
    icon: any;
    onPress: () => void;
  }>;
}

export const RoutineLibrary = ({ routines, searchQuery, onSearchChange, dropdownItems }: RoutineLibraryProps) => {
  const router = useRouter();

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
          items={dropdownItems}
          trigger={
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full">
              <Plus className="text-foreground" size={24} />
            </Button>
          }
        />
      </View>

      {/* Routines List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {routines.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-muted-foreground text-center">Keine Trainingspläne gefunden</Text>
          </View>
        ) : (
          routines.map((routine) => (
            <ClickableCard
              key={routine.id}
              title={routine.name}
              description={routine.description}
              className="mb-4"
              footer={
                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center space-x-1">
                    <Text className="text-sm font-medium">{routine.workouts.length}</Text>
                    <Text className="text-sm text-muted-foreground">Workouts</Text>
                  </View>
                  <View className="w-1 h-1 rounded-full bg-border" />
                  <View className="flex-row items-center space-x-1">
                    <Text className="text-sm font-medium">{routine.frequency}x</Text>
                    <Text className="text-sm text-muted-foreground">pro Woche</Text>
                  </View>
                </View>
              }
              onPress={() => {
                router.push(`/workout/${routine.id}`);
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};
