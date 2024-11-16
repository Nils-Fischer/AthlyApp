import * as React from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { ClickableCard } from "~/components/ClickableCard";
import { WorkoutForm } from "~/components/ExerciseForms/WorkoutForm";
import { Routine } from "~/lib/types";
import { useUserStore } from "~/stores/userStore";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Plus, Search } from "lucide-react-native";

export default function RoutineScreen() {
  const userStore = useUserStore();
  const [routines, setRoutines] = React.useState<Routine[]>(userStore.userData?.programs || []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(routines.length === 0);

  const handleProgramCreated = (program: Routine) => {
    useUserStore.getState().updateUserData([program]);
    setRoutines([...routines, program]);
    setShowForm(false);
  };

  const filteredRoutines = React.useMemo(() => {
    return routines.filter((routine) => routine.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [routines, searchQuery]);

  if (showForm) {
    return <WorkoutForm onProgramCreated={handleProgramCreated} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 flex-row justify-between items-center border-b border-border">
          <Text className="text-2xl font-bold">Trainingspläne</Text>
          <Button size="icon" variant="ghost" onPress={() => setShowForm(true)} className="h-10 w-10">
            <Plus className="text-foreground" size={24} />
          </Button>
        </View>

        {/* Search Bar */}
        <View className="p-4">
          <Input
            placeholder="Trainingsplan suchen..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            startContent={<Search size={20} className="text-muted-foreground" />}
          />
        </View>

        {/* Routines List */}
        <ScrollView
          className="flex-1 px-4"
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
                  console.log("Navigate to routine:", routine.id);
                }}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
