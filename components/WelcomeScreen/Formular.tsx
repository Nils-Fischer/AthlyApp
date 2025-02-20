import { View, TextInput } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Gender, UserProfile } from "~/lib/types";
import { useState } from "react";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { randomUUID } from "expo-crypto";

interface FormularProps {
  onFinish: (profile: UserProfile) => void;
}

type FormState = {
  firstName: string;
  lastName: string;
  age: string;
  gender: Gender | null;
  height: string;
  weight: string;
};

export const Formular: React.FC<FormularProps> = ({ onFinish }) => {
  // State mit expliziten Typen
  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    age: "",
    gender: null,
    height: "",
    weight: "",
  });

  // State für die Fehlermeldung
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animation States
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const animationProgress = useSharedValue(0);
  const contentScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationProgress.value, [0, 1], [1, 0]),
    transform: [{ translateY: interpolate(animationProgress.value, [0, 1], [0, -50]) }, { scale: contentScale.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Animationsstil
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Validierung der numerischen Felder
  const validateNumberField = (value: string): number | null => {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  };

  // Formularabschluss
  const handleSubmit = () => {
    const age = validateNumberField(formState.age);
    const height = validateNumberField(formState.height);
    const weight = validateNumberField(formState.weight);

    if (
      formState.firstName &&
      formState.lastName &&
      age !== null &&
      formState.gender &&
      height !== null &&
      weight !== null
    ) {
      const profile: UserProfile = {
        id: randomUUID(),
        firstName: formState.firstName,
        lastName: formState.lastName,
        age,
        gender: formState.gender,
        height,
        weight,
      };

      // Exit-Animation
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 }, () => {
        runOnJS(onFinish)(profile);
      });
    } else {
      setErrorMessage("Bitte alle Felder ausfüllen"); // Set error message if fields are not filled
    }
  };

  // Felder für TextInputs
  const textFields: {
    key: keyof FormState;
    label: string;
    numeric: boolean;
    placeholder: string;
  }[] = [
    {
      key: "firstName",
      label: "Vorname",
      numeric: false,
      placeholder: "Max",
    },
    {
      key: "lastName",
      label: "Nachname",
      numeric: false,
      placeholder: "Mustermann",
    },
    {
      key: "age",
      label: "Alter",
      numeric: true,
      placeholder: "30",
    },
    {
      key: "height",
      label: "Größe (cm)",
      numeric: true,
      placeholder: "180",
    },
    {
      key: "weight",
      label: "Gewicht (kg)",
      numeric: true,
      placeholder: "75",
    },
  ];

  return (
    <Animated.View className="flex-1 w-full" style={animatedStyle}>
      {/* Error Message */}
      {errorMessage && <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>}
      {/* Header */}
      <Animated.View className="items-center mb-8" entering={FadeInDown.duration(200)}>
        <Text className="text-2xl font-semibold mb-2">Dein Profil</Text>
        <Text className="text-gray-600 text-center px-4">
          Lass uns dein Profil erstellen, damit wir deinen Trainingsplan perfekt auf dich abstimmen können.
        </Text>
      </Animated.View>

      {/* Formularfelder */}
      <View className="space-y-6">
        {textFields.map(({ key, label, numeric, placeholder }, index) => (
          <Animated.View key={key} entering={FadeInDown.duration(400).delay(100 + index * 50)}>
            <Text className="text-lg mb-2">{label}</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-lg p-4 text-base"
              value={formState[key] ?? ""}
              onChangeText={(text) => setFormState((prev) => ({ ...prev, [key]: text }))}
              keyboardType={numeric ? "numeric" : "default"}
              placeholder={`${placeholder} eingeben`}
              placeholderTextColor="#9CA3AF"
            />
          </Animated.View>
        ))}

        {/* Geschlechtsauswahl */}
        <Animated.View entering={FadeInDown.duration(200).delay(250)}>
          <Text className="text-lg mb-2">Geschlecht</Text>
          <View className="flex-row justify-between gap-2">
            {Object.values(Gender).map((gender, index) => (
              <Animated.View key={gender} entering={FadeInDown.duration(400).delay(400 + index * 50)}>
                <Button
                  className={`min-w-[110px] py-4 ${formState.gender === gender ? "bg-black" : "bg-gray-100"}`}
                  onPress={() => setFormState((prev) => ({ ...prev, gender }))}
                  haptics="selection"
                >
                  <Text className={formState.gender === gender ? "text-white" : "text-gray-700"}>
                    {
                      {
                        [Gender.Male]: "Männlich",
                        [Gender.Female]: "Weiblich",
                        [Gender.Other]: "Divers",
                      }[gender]
                    }
                  </Text>
                </Button>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Abschicken-Button */}
      <Animated.View className="mt-8" entering={FadeInDown.duration(200).delay(450)}>
        <Button
          className="w-full bg-black py-4"
          onPress={handleSubmit}
          haptics="heavy"
          disabled={
            !formState.firstName ||
            !formState.lastName ||
            !formState.age ||
            !formState.gender ||
            !formState.height ||
            !formState.weight
          } // Disable button if fields are empty
        >
          <Text className="text-white text-base font-medium">Los geht's! 💪</Text>
        </Button>
      </Animated.View>
    </Animated.View>
  );
};
