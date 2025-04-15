import { UserProfile } from "~/lib/types";
import { useEffect, useState } from "react";
import { Info } from "~/components/WelcomeScreen/Info";
import { Tutorial } from "~/components/WelcomeScreen/Tutorial";
import { Formular } from "~/components/WelcomeScreen/Formular";
import Animated, { FadeIn } from "react-native-reanimated";
import { Login } from "./WelcomeScreen/Login";
import { User } from "@supabase/supabase-js";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { H1 } from "./ui/typography";
import { Dialog, DialogContent } from "./ui/dialog";
import { SafeAreaView } from "react-native-safe-area-context";
interface WelcomeScreenProps {
  finish: (profile: UserProfile | null) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ finish }) => {
  const [step, setStep] = useState<"info" | "tutorial" | "login" | "form">("info");
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const { isProfileComplete, resetProfile, profile } = useUserProfileStore();

  const handleFinish = async (profile: UserProfile) => {
    profile.id = user?.id ?? profile.id;
    finish(profile);
  };

  const handleLogin = async (user: User, firstName?: string, lastName?: string) => {
    console.log("user", user);
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    setUser(user);
    setFirstName(firstName);
    setLastName(lastName);

    if (!isProfileComplete()) {
      setStep("form");
    } else if (profile.firstName !== firstName || profile.lastName !== lastName) {
      finish({ ...profile, firstName: firstName ?? profile.firstName, lastName: lastName ?? profile.lastName });
    } else {
      finish(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Animated.View className="flex-1 items-center justify-start p-8 pt-4 mb-8" entering={FadeIn.duration(300)}>
        {step === "info" ? (
          <Info onNext={() => setStep("tutorial")} />
        ) : step === "tutorial" ? (
          <Tutorial onNext={() => setStep("login")} />
        ) : step === "login" ? (
          <Login onNext={handleLogin} />
        ) : (
          <Formular
            onFinish={handleFinish}
            profile={{ ...profile, firstName: firstName ?? profile.firstName, lastName: lastName ?? profile.lastName }}
          />
        )}
      </Animated.View>
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <H1>Welcome</H1>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
};
