import React from "react";
import { View } from "react-native";
import { Avatar } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { CardLabel, H1 } from "~/components/ui/typography";
import { User } from "~/lib/icons/Icons";
import { supabase } from "~/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useChatStore } from "~/stores/chatStore";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { reloadAppAsync } from "expo";

export default function AccountScreen() {
  const { profile, resetProfile } = useUserProfileStore();
  const { clearMessages } = useChatStore();
  const { clearWorkoutHistory } = useWorkoutHistoryStore();
  const { clearRoutines } = useUserRoutineStore();
  const { cancelWorkout } = useActiveWorkoutStore();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [profile]);

  const deleteAccount = async () => {
    // Invoke the Edge Function to securely delete the user
    const { error: functionError } = await supabase.functions.invoke("delete-user", {
      body: { name: "Functions" },
    });

    if (functionError) {
      console.error("Error calling delete-user function:", functionError);
      await reloadAppAsync();
    } else {
      await supabase.auth.signOut();
      console.log("User deleted and signed out successfully.");
      cancelWorkout();
      clearMessages();
      clearWorkoutHistory();
      resetProfile();
      clearRoutines();

      await AsyncStorage.removeItem("FIRST_LAUNCH");
      await reloadAppAsync();
    }
  };

  return (
    <View className="bg-card flex-1 justify-between p-8">
      <View>
        <View className="flex-row items-center justify-between">
          <H1>Mein Konto</H1>
          <Avatar alt="Avatar" className="bg-muted items-center justify-center w-12 h-12">
            <User size={28} className="text-foreground" />
          </Avatar>
        </View>

        <View className="mt-6 gap-4">
          <View className="flex-column gap-1">
            <CardLabel className="font-medium text-muted-foreground">Email:</CardLabel>
            <Text>{user?.email}</Text>
          </View>
          <View className="flex-column gap-1">
            <CardLabel className="font-medium text-muted-foreground">Erstellt am:</CardLabel>
            <Text>{user?.created_at ? new Date(user.created_at).toLocaleDateString("de-DE") : ""}</Text>
          </View>
        </View>
      </View>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="bg-destructive-background">
            <Text className="text-destructive">Konto löschen</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Dein Konto wird dauerhaft gelöscht und deine Daten
              werden von unseren Servern entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel haptics="light">
              <Text>Abbrechen</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={deleteAccount} haptics="error" className="bg-destructive">
              <Text className="text-destructive-foreground">Löschen</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
