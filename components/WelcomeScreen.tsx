import { ScrollView } from "react-native";
import { UserProfile } from "~/lib/types";
import { useState } from "react";
import { Info } from "~/components/WelcomeScreen/Info";
import { Tutorial } from "~/components/WelcomeScreen/Tutorial";
import { Formular } from "~/components/WelcomeScreen/Formular";
import Animated, { FadeIn } from "react-native-reanimated";
import { Login } from "./WelcomeScreen/Login";
import { User } from "@supabase/supabase-js";
import { useUserProfileStore } from "~/stores/userProfileStore";

interface WelcomeScreenProps {
  finish: (profile: UserProfile | null) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ finish }) => {
  const [step, setStep] = useState<"info" | "tutorial" | "login" | "form">("info");
  const [user, setUser] = useState<User | null>(null);
  const { isProfileComplete } = useUserProfileStore();

  const handleFinish = async (profile: UserProfile) => {
    profile.id = user?.id ?? profile.id;
    finish(profile);
  };

  const handleLogin = async (user: User) => {
    console.log("user", user);
    setUser(user);
    if (!isProfileComplete()) {
      setStep("form");
    } else {
      finish(null);
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
          <Tutorial onNext={() => setStep("login")} />
        ) : step === "login" ? (
          <Login onNext={handleLogin} />
        ) : (
          <Formular onFinish={handleFinish} />
        )}
      </Animated.View>
    </ScrollView>
  );
};
