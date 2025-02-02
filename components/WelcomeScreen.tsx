import { ScrollView, View } from "react-native";
import { UserProfile } from "~/lib/types";
import { useState } from "react";
import { Info } from "~/components/WelcomeScreen/Info";
import { Formular } from "~/components/WelcomeScreen/Formular";

interface WelcomeScreenProps {
  finish: (profile: UserProfile) => void;
}

export const WelcomeScreen = ({ finish }: WelcomeScreenProps) => {
  const [step, setStep] = useState<'info' | 'form'>('info');

  // Diese handleFinish Funktion wird direkt an Formular weitergegeben
  // und verwendet die finish prop von der übergeordneten Komponente
  const handleFinish = (profile: UserProfile) => {
    finish(profile);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-start p-8 pt-16 mb-8">
        {step === 'info' ? (
          <Info onNext={() => setStep('form')} />
        ) : (
          <Formular 
            onFinish={handleFinish}
          />
        )}
      </View>
    </ScrollView>
  );
};