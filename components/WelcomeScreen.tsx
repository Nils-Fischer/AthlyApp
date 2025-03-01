import { ScrollView } from "react-native";
import { UserProfile } from "~/lib/types";
import { useState } from "react";
import { Info } from "~/components/WelcomeScreen/Info";
import { Tutorial } from "~/components/WelcomeScreen/Tutorial";
import { Formular } from "~/components/WelcomeScreen/Formular";
import { supabase } from "~/lib/supabase";
import Animated, { FadeIn } from "react-native-reanimated";
import { dateToISOString } from "~/lib/utils";

interface WelcomeScreenProps {
  finish: (profile: UserProfile) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ finish }) => {
  const [step, setStep] = useState<"info" | "tutorial" | "form">("info");

  const handleFinish = async (profile: UserProfile) => {
    try {
      console.log("birthday", profile);
      const { error } = await supabase.from("profiles").insert({
        id: profile.id,
        first_name: profile.firstName,
        last_name: profile.lastName,
        birthday: dateToISOString(profile.birthday),
        gender: profile.gender,
      });

      if (error) {
        console.error("Profilfehler:", error);
      }

      finish(profile);
    } catch (e) {
      console.error("Unerwarteter Fehler:", e);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Animated.View className="flex-1 items-center justify-start p-8 pt-16 mb-8" entering={FadeIn.duration(300)}>
        {step === "info" ? (
          <Info onNext={() => setStep("tutorial")} />
        ) : step === "tutorial" ? (
          <Tutorial onNext={() => setStep("form")} />
        ) : (
          <Formular onFinish={handleFinish} />
        )}
      </Animated.View>
    </ScrollView>
  );
};
