// TrainTechApp/app/(tabs)/workout.tsx
import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { WorkoutForm } from "~/components/ExerciseForms/WorkoutForm";
import { Routine } from "~/lib/types";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { ClipboardList, PlusCircle, Sparkles } from "~/lib/icons/Icons";
import { RoutineCreationDialog } from "~/components/Routine/RoutineCreationDialog";
import { RoutineLibrary } from "~/components/Routine/RoutineLibrary";
import { AIRoutineCreationDialog } from "~/components/Routine/AIRoutineCreationDialog";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { MoreHorizontal, Trash2 } from "~/lib/icons/Icons";
import { Button } from "~/components/ui/button";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";

export default function RoutineScreen() {
  const { routines, addRoutine, deleteRoutine, toggleRoutineActive } = useUserRoutineStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("routines");
  const [showRoutineCreationDialog, setShowRoutineCreationDialog] = React.useState(false);
  const [showAIRoutineDialog, setShowAIRoutineDialog] = React.useState(false);

  const handleRoutineCreation = (routine: Routine) => {
    console.log("🚀 Created routine:", routine);
    addRoutine(routine);
    setShowForm(false);
  };

  const filteredRoutines = React.useMemo(() => {
    return routines.filter((routine) => routine.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [routines, searchQuery]);

  const dropdownItems = [
    {
      name: "Leere Routine",
      icon: PlusCircle,
      onPress: () => setShowRoutineCreationDialog(true),
    },
    {
      name: "Fragebogen",
      icon: ClipboardList,
      onPress: () => setShowForm(true),
    },
    {
      name: "AI-Erstellung",
      icon: Sparkles,
      onPress: () => setShowAIRoutineDialog(true),
    },
  ];

  const handleDelete = async (id: string) => {
    deleteRoutine(id);
  };

  const handleToggleActive = async (id: string) => {
    toggleRoutineActive(id);
  };

  if (showForm) {
    return <WorkoutForm onRoutineCreated={handleRoutineCreation} />;
  }

  const getDropdownItems = (routine: Routine) => [
    {
      name: routine.active ? "Deaktivieren" : "Aktivieren",
      icon: ({ size, className }: { size: number; className: string }) => (
        <Ionicons name={routine.active ? "radio-button-on" : "radio-button-off"} size={size} className={className} />
      ),
      onPress: () => handleToggleActive(routine.id),
    },
    {
      name: "Routine Löschen",
      icon: ({ size, className }: { size: number; className: string }) => <Trash2 size={size} className={className} />,
      onPress: () => handleDelete(routine.id),
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
    <>
      <View className="flex-1 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 bg-background p-0">
          <TabsList className="flex-row h-12 bg-muted rounded-lg w-full ">
            <TabsTrigger value="routines" className="flex-1 rounded-md data-[state=active]:bg-card">
              <Text className="text-sm font-medium">Trainingspläne</Text>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex-1 rounded-md data-[state=active]:bg-background">
              <Text className="text-sm font-medium">Übungen</Text>
            </TabsTrigger>
          </TabsList>

          <View className="flex-1 mt-4">
            <TabsContent value="routines" className="flex-1 h-full">
              <RoutineLibrary
                routines={filteredRoutines}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                addButtonDropdownItems={dropdownItems}
                onRoutinePress={(routineId) => router.push(`/workout/${routineId}`)}
                rightContent={getRightContent}
              />
            </TabsContent>

            <TabsContent value="exercises" className="flex-1 h-full">
              <ExerciseLibrary onPress={(exerciseId) => router.push(`/workout/exercise/${exerciseId}`)} />
            </TabsContent>
          </View>
        </Tabs>
      </View>

      <RoutineCreationDialog
        open={showRoutineCreationDialog}
        onOpenChange={setShowRoutineCreationDialog}
        onCreate={(routine) => {
          addRoutine(routine);
          setShowRoutineCreationDialog(false);
          router.push(`/workout/${routine.id}`);
        }}
      />

      <AIRoutineCreationDialog
        open={showAIRoutineDialog}
        onOpenChange={setShowAIRoutineDialog}
        onCreate={(routine) => {
          addRoutine(routine);
          setShowAIRoutineDialog(false);
          router.push(`/workout/${routine.id}`);
        }}
      />
    </>
  );
}
