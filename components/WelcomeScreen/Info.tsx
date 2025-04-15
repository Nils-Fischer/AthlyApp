import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Image } from "expo-image";
import Animated, {
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
    <View className="flex-1 items-center flex-column justify-between w-full">
      {/* Animierter Titel */}
      <Animated.View className="absolute left-0 right-0 items-center" style={[{ top: "30%" }, animatedTitleStyle]}>
        <Text className="text-4xl font-bold text-accent">Athly</Text>
      </Animated.View>

      {/* Hauptinhalt */}
      <View className="flex-1 flex-column justify-between w-full mt-[35%]">
        {/* Header Bereich */}
        <Animated.View className="w-full items-center gap-4 mb-12" entering={FadeInDown.duration(500).delay(2800)}>
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

        {/* Explanation Box */}
        <Animated.View
          className="flex-1 w-full p-6 rounded-2xl mb-12 items-center justify-center"
          entering={FadeInDown.duration(1000).delay(4100)}
        >
          <Image
            source={require("~/assets/images/icon.svg.png")}
            style={{ width: "100%", height: "100%" }}
            className="rounded-2xl"
            contentFit="contain"
          />
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
