// TrainTechApp/app/(tabs)/workout.tsx
import * as React from "react";
import { View } from "react-native";
import { WorkoutForm } from "~/components/ExerciseForms/WorkoutForm";
import { Routine } from "~/lib/types";
import { useUserStore } from "~/stores/userStore";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { ClipboardList, PlusCircle, Sparkles } from "~/lib/icons/Icons";
import { RoutineCreationDialog } from "~/components/Routine/RoutineCreationDialog";
import { RoutineLibrary } from "~/components/Routine/RoutineLibrary";
import { AIRoutineCreationDialog } from "~/components/Routine/AIRoutineCreationDialog";

export default function RoutineScreen() {
  const userStore = useUserStore();
  const router = useRouter();
  const [routines, setRoutines] = React.useState<Routine[]>(userStore.userData?.routines || []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(routines.length === 0);
  const [activeTab, setActiveTab] = React.useState("routines");
  const [showRoutineCreationDialog, setShowRoutineCreationDialog] = React.useState(false);
  const [showAIRoutineDialog, setShowAIRoutineDialog] = React.useState(false);

  const handleRoutineCreation = (routine: Routine) => {
    console.log("🚀 Created routine:", routine);
    userStore.addRoutine(routine);
    setRoutines([...routines, routine]);
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

  const handleDelete = async (id: number) => {
    await userStore.removeRoutine(id);
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const handleToggleActive = async (id: number) => {
    const routineToUpdate = routines.find((routine) => routine.id === id);
    if (!routineToUpdate) return;

    const updatedRoutine = {
      ...routineToUpdate,
      active: !routineToUpdate.active,
    };

    let updatedRoutines = routines.map((routine) => {
      if (updatedRoutine.active) {
        return routine.id === id ? updatedRoutine : { ...routine, active: false };
      } else {
        return routine.id === id ? updatedRoutine : routine;
      }
    });

    await userStore.updateUserData(updatedRoutines);

    setRoutines(updatedRoutines);
  };

  if (showForm) {
    return <WorkoutForm onRoutineCreated={handleRoutineCreation} />;
  }

  return (
    <>
      <View className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <View className="px-4">
            <TabsList className="flex-row h-12 bg-muted rounded-lg p-1 w-full">
              <TabsTrigger value="routines" className="flex-1 rounded-md data-[state=active]:bg-background">
                <Text className="text-sm font-medium">Trainingspläne</Text>
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex-1 rounded-md data-[state=active]:bg-background">
                <Text className="text-sm font-medium">Übungen</Text>
              </TabsTrigger>
            </TabsList>
          </View>

          <View className="flex-1 mt-4">
            <TabsContent value="routines" className="flex-1 h-full">
              <RoutineLibrary
                routines={filteredRoutines}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                addButtonDropdownItems={dropdownItems}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
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
          userStore.addRoutine(routine);
          setRoutines([...routines, routine]);
          setShowRoutineCreationDialog(false);
          router.push(`/workout/${routine.id}`);
        }}
      />

      <AIRoutineCreationDialog
        open={showAIRoutineDialog}
        onOpenChange={setShowAIRoutineDialog}
        onCreate={(routine) => {
          userStore.addRoutine(routine);
          setRoutines([...routines, routine]);
          setShowAIRoutineDialog(false);
          router.push(`/workout/${routine.id}`);
        }}
      />
    </>
  );
}
