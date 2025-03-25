import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";

interface InfoProps {
  onNext: () => void;
}

export const Info: React.FC<InfoProps> = ({ onNext }) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Optimierte Animations-Sequenz
    translateY.value = withSequence(
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
      withDelay(
        1000,
        withTiming(-200, {
          duration: 800,
          easing: Easing.in(Easing.exp),
        })
      )
    );

    opacity.value = withSequence(withTiming(1, { duration: 800 }), withDelay(1100, withTiming(0, { duration: 800 })));
  }, []);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-start w-full">
      {/* Animierter Titel */}
      <Animated.View className="absolute left-0 right-0 items-center" style={[{ top: "30%" }, animatedTitleStyle]}>
        <Text className="text-4xl font-bold text-accent">Athly</Text>
      </Animated.View>

      {/* Hauptinhalt */}
      <View className="w-full mt-[35%]">
        {/* Header Bereich */}
        <Animated.View className="w-full items-center space-y-6 mb-12" entering={FadeInDown.duration(500).delay(2800)}>
          <View>
            <Text className="text-3xl font-bold text-center">Willkommen bei</Text>
          </View>
          <View>
            <Text className="text-4xl font-bold text-accent">Athly</Text>
          </View>

          <Animated.Text
            className="text-muted-foreground text-center px-4 text-lg leading-relaxed"
            entering={FadeInDown.duration(500).delay(3000)}
          >
            Dein persönlicher KI-Trainer für effektives und nachhaltiges Training
          </Animated.Text>
        </Animated.View>

        {/* MVP Notice */}
        <Animated.View className="w-full bg-card p-6 rounded-2xl mb-8" entering={FadeInDown.duration(600).delay(3000)}>
          <View className="flex-row items-center space-x-2 mb-2">
            <Text className="text-2xl">👋</Text>
            <Text className="text-card-foreground font-semibold text-lg">Early Access</Text>
          </View>
          <Text className="text-card-foreground text-base leading-relaxed">
            Du bist einer der ersten Nutzer unserer App! Wir entwickeln Athly kontinuierlich weiter und dein Feedback
            ist uns sehr wichtig.
          </Text>
        </Animated.View>

        {/* Explanation Box */}
        <Animated.View className="w-full bg-card p-6 rounded-2xl mb-12" entering={FadeInDown.duration(600).delay(3100)}>
          <Text className="text-card-foreground text-base leading-relaxed">
            Um dir den bestmöglichen Trainingsplan erstellen zu können, benötigt dein KI-Trainer einige grundlegende
            Informationen. Diese helfen dabei, dein Training optimal an deine Bedürfnisse anzupassen.
          </Text>
        </Animated.View>

        {/* Button */}
        <Animated.View className="w-full space-y-4" entering={SlideInDown.duration(400).delay(3600)}>
          <Button className="w-full bg-primary py-4" onPress={onNext} haptics="medium">
            <Text className="text-primary-foreground font-semibold text-lg">Weiter</Text>
          </Button>
        </Animated.View>
      </View>
    </View>
  );
};
