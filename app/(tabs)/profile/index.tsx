import { View } from "react-native";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { H1, Large, Small } from "~/components/ui/typography";
import { Clock, Barbell, Flame, Gear, Smile } from "~/lib/icons/Icons";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { cn } from "~/lib/utils";
import { router, Stack } from "expo-router";
import React from "react";
import { Separator } from "~/components/ui/separator";

export default function ProfileScreen() {
  const { profile } = useUserProfileStore();
  const userName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "User";

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
            <Flame size={32} className="text-red-500" />
            <Large className="text-2xl">0</Large>
            <Small className="text-center text-muted-foreground">Aktivitätsserie</Small>
          </View>

          <Separator orientation="vertical" className="opacity-50" />

          {/* Stat Item 3: Completed Workouts */}
          <View className="items-center w-1/3 gap-2">
            <Barbell size={32} className="text-zinc-500" />
            <Large className="text-2xl">0</Large>
            <Small className="text-center text-muted-foreground">Abgeschlossene Workouts</Small>
          </View>

          <Separator orientation="vertical" className="opacity-50" />

          {/* Stat Item 2: Workout Minutes */}
          <View className="items-center w-1/3 gap-2">
            <Clock size={32} className="text-blue-500" />
            <Large className="text-2xl">0</Large>
            <Small className="text-center text-muted-foreground">Workout Minuten</Small>
          </View>
        </View>
      </View>
    </>
  );
}
