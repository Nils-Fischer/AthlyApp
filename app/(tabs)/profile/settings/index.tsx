import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { CardLabel, H1, Large, P } from "~/components/ui/typography";
import React from "react";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View className="flex-1 p-4 gap-12">
      <H1 className="font-bold">Einstellungen</H1>

      <View className="gap-4">
        <CardLabel>Personalisierung</CardLabel>
        <Pressable
          className="flex-row items-center justify-between border-b border-border pb-4"
          onPress={() => router.push("/profile/settings/profile")}
        >
          <Large>Profil</Large>
          <ChevronRight size={24} className="text-foreground" />
        </Pressable>
      </View>

      <View className="gap-4">
        <CardLabel>Athly</CardLabel>
        <Pressable
          className="flex-row items-center justify-between border-b border-border pb-4"
          onPress={() => router.push("/profile/settings/privacy-policy")}
        >
          <Large>Datenschutzerklärung</Large>
          <ChevronRight size={24} className="text-foreground" />
        </Pressable>
        <Pressable
          className="flex-row items-center justify-between border-b border-border pb-4"
          onPress={() => router.push("/profile/settings/terms-of-service")}
        >
          <Large>Nutzungsbedingungen</Large>
          <ChevronRight size={24} className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}
