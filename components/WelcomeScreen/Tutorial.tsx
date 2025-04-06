import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { MessageSquare, ArrowRight } from "lucide-react-native";
import { H3, P, Small } from "~/components/ui/typography";

interface TutorialProps {
  onNext: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onNext }) => {
  return (
    <View className="flex-1 w-full">
      <View className="p-6">
        {/* Dev Notice */}
        <Animated.View entering={FadeIn.duration(500)} className="bg-accent p-4 rounded-xl mb-6">
          <Text className="text-background font-semibold mb-2">🚧 Early Access Notice</Text>
          <Text className="text-sm text-accent-foreground">
            Du testest eine frühe kostenlose Version der App. Probiere die KI- und Appfunktionen aus und teile uns deine
            Erfahrungen mit. Dein Feedback ist wertvoll für die Weiterentwicklung
          </Text>
        </Animated.View>

        {/* Main Content */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} className="bg-card p-6 rounded-2xl mb-4">
          <View className="flex-row items-center gap-3 mb-4">
            <MessageSquare size={24} className="text-card-foreground" />
            <H3>So funktioniert's</H3>
          </View>
          <P className="text-card-foreground mb-4">
            Beginne ein Gespräch mit deinem KI-Coach. Teile ihm einfach deine Fitnessziele oder Fragen mit.
          </P>
          <View className="gap-3">
            <P className="text-card-foreground">Zum Beispiel:</P>
            <View className="flex-row items-center gap-2">
              <ArrowRight size={16} className="text-muted-foreground" />
              <P className="text-card-foreground">
                "Erstelle mir einen Trainingsplan für 3 Tage pro Woche, Fokus Muskelaufbau."
              </P>
            </View>
            <View className="flex-row items-center gap-2">
              <ArrowRight size={16} className="text-muted-foreground" />
              <P className="text-card-foreground">"Analysiere meine Kniebeugentechnik anhand eines Videos."</P>
            </View>
          </View>
        </Animated.View>

        {/* Additional Info */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="bg-accent-foreground p-6 rounded-2xl mb-6"
        >
          <Text className="text-card-foreground text-base leading-relaxed">
            Dein Coach passt sich an deine Bedürfnisse an und hilft dir, deine Ziele Schritt für Schritt zu erreichen.
          </Text>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} className="mt-4">
          <Button className="w-full bg-primary py-4" onPress={onNext} haptics="medium">
            <Text className="text-primary-foreground text-lg font-semibold">Erstelle dein Profil</Text>
          </Button>
          <Text className="text-muted-foreground text-center text-sm mt-2 px-4">
            Mit einem Klick auf "Erstelle dein Profil" können wir deinen persönlichen Trainingsplan optimal auf dich
            abstimmen.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};
