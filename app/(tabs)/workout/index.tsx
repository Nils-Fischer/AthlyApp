// TrainTechApp/app/(tabs)/workout.tsx
import * as React from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { ClickableCard } from "~/components/ClickableCard";
import { WorkoutForm } from "~/components/ExerciseForms/WorkoutForm";
import { Routine } from "~/lib/types";
import { useUserStore } from "~/stores/userStore";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { Plus, Search } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { ClipboardList, PlusCircle, Sparkles } from "lucide-react-native";

export default function RoutineScreen() {
  const userStore = useUserStore();
  const router = useRouter();
  const [routines, setRoutines] = React.useState<Routine[]>(userStore.userData?.routines || []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(routines.length === 0);
  const [activeTab, setActiveTab] = React.useState("routines");

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
      onPress: () => setShowForm(true),
    },
    {
      name: "Fragebogen",
      icon: ClipboardList,
      onPress: () => {
        // Handle questionnaire
      },
    },
    {
      name: "AI-Erstellung",
      icon: Sparkles,
      onPress: () => {
        // Handle AI creation
      },
    },
  ];

  if (showForm) {
    return <WorkoutForm onRoutineCreated={handleRoutineCreation} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
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
              <View className="flex-1 px-4">
                {/* Search Bar */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1 mr-2">
                    <Input
                      placeholder="Trainingsplan suchen..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
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
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {filteredRoutines.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                      <Text className="text-muted-foreground text-center">Keine Trainingspläne gefunden</Text>
                    </View>
                  ) : (
                    filteredRoutines.map((routine) => (
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
            </TabsContent>

            <TabsContent value="exercises" className="flex-1 h-full">
              <ExerciseLibrary onPress={(exerciseId) => router.push(`/workout/exercise/${exerciseId}`)} />
            </TabsContent>
          </View>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
