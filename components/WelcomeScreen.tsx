import { ScrollView, View } from "react-native";
import { UserProfile } from "~/lib/types";
import { useState } from "react";
import { Info } from "~/components/WelcomeScreen/Info";
import { Tutorial } from "~/components/WelcomeScreen/Tutorial";
import { Formular } from "~/components/WelcomeScreen/Formular";

interface WelcomeScreenProps {
  finish: (profile: UserProfile) => void;
}

export const WelcomeScreen = ({ finish }: WelcomeScreenProps) => {
  // Neuer Schritt 'tutorial' wird eingefügt
  const [step, setStep] = useState<'info' | 'tutorial' | 'form'>('info');

  const handleFinish = (profile: UserProfile) => {
    finish(profile);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-start p-8 pt-16 mb-8">
        {step === 'info' ? (
          <Info onNext={() => setStep('tutorial')} />
        ) : step === 'tutorial' ? (
          <Tutorial onNext={() => setStep('form')} />
        ) : (
          <Formular onFinish={handleFinish} />
        )}
      </View>
    </ScrollView>
  );
};
