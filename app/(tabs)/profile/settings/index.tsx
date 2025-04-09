import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { CardLabel, H1, Large, Muted, P } from "~/components/ui/typography";
import React from "react";
import { router } from "expo-router";
import { SvgXml } from "react-native-svg";
import Constants from "expo-constants";

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 725 750"><path fill="#000" d="M549.579 685 362.5 298 175.421 685H31.428L0 750h217l145-300 145 300h218l-31.428-65H549.579Z"/><path fill="#000" d="M662.65 621 362.5 0 104.4 534h.016l-31.422 65h-.01L62.35 621h71.071l120.61-249.499-.028-.058L362.5 147l76.045 157.31-.27.558L591.095 621h71.555ZM694.067 686h-.011L725 750l-30.933-64ZM0 750l30.944-64h-.01L0 750Z"/><path fill="#000" d="m362 299 .008.017-5.039 10.425-.008-.017L362 299Z"/></svg>
`;

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version;

  return (
    <View className="flex-1 justify-between">
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
      <View className="items-center p-4 gap-2">
        <SvgXml xml={logoSvg} />
        {appVersion && <Muted>Version {appVersion}</Muted>}
      </View>
    </View>
  );
}
