import { View } from "react-native";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { H1, Large, Small } from "~/components/ui/typography";
import { Barbell, Flame, Gear, Smile, Weight } from "~/lib/icons/Icons";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { cn, weightToString } from "~/lib/utils";
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Separator } from "~/components/ui/separator";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";

export default function ProfileScreen() {
  const { profile } = useUserProfileStore();
  const userName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "User";
  const { sessions, getTotalNumberOffFinishedSessions, getTotalWeightLifted, getActiveStreak } =
    useWorkoutHistoryStore();
  const totalNumberOfSessions = getTotalNumberOffFinishedSessions();
  const totalWeightLifted = getTotalWeightLifted();
  const activityStreak = getActiveStreak();

  useEffect(() => {
    console.log("totalNumberOfSessions", totalNumberOfSessions);
    console.log("totalWeightLifted", totalWeightLifted);
    console.log("activityStreak", activityStreak);
    console.log("sessions", sessions);
  }, [totalNumberOfSessions, totalWeightLifted, activityStreak]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profil",
          headerRight: () => (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onPress={() => router.push("/profile/settings")}
            >
              <Gear className="text-foreground" size={28} />
            </Button>
          ),
        }}
      />

      <View className="flex-1 items-center pt-10 gap-8">
        {/* Avatar */}
        <Avatar alt="User Avatar" className={cn("h-24 w-24 bg-muted")}>
          {/* <AvatarImage source={{ uri: "avatar-url" }} /> */}
          <AvatarFallback className="bg-muted">
            <Smile size={40} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {/* User Name */}
        <H1 className="text-center">{userName}</H1>

        {/* Stats Section */}
        <View className="w-full flex-row justify-around px-4">
          {/* Stat Item 1: Activity Streak */}
          <View className="items-center w-1/3 gap-2 ">
            <Flame size={32} className="text-rose-500" />
            <Large className="text-2xl">{activityStreak}</Large>
            <Small className="text-center text-muted-foreground">Aktivitätsserie</Small>
          </View>

          <Separator orientation="vertical" className="opacity-50" />

          {/* Stat Item 3: Completed Workouts */}
          <View className="items-center w-1/3 gap-2">
            <Barbell size={32} className="text-amber-500" />
            <Large className="text-2xl">{totalNumberOfSessions}</Large>
            <Small className="text-center text-muted-foreground">Fertige Workouts</Small>
          </View>

          <Separator orientation="vertical" className="opacity-50" />

          {/* Stat Item 2: Workout Minutes */}
          <View className="items-center w-1/3 gap-2">
            <Weight size={32} className="text-sky-500" />
            <Large className="text-2xl">{weightToString(totalWeightLifted)}</Large>
            <Small className="text-center text-muted-foreground">Gesamtes Gewicht</Small>
          </View>
        </View>
      </View>
    </>
  );
}
