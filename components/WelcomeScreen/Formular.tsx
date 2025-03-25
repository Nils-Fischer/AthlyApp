import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Gender, UserProfile } from "~/lib/types";
import { useState } from "react";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Input } from "~/components/ui/input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface FormularProps {
  onFinish: (profile: UserProfile) => void;
}

type FormState = {
  firstName: string;
  lastName: string;
  birthday: Date;
  gender: Gender | null;
  height: string;
  weight: string;
  showDatePicker: boolean;
};

export const Formular: React.FC<FormularProps> = ({ onFinish }) => {
  // State mit expliziten Typen
  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    birthday: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 20), // Default to 20 years ago
    gender: null,
    height: "",
    weight: "",
    showDatePicker: false,
  });

  // State für Fehlermeldungen
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
    const height = validateNumberField(formState.height);
    const weight = validateNumberField(formState.weight);

    if (
      formState.firstName &&
      formState.lastName &&
      formState.birthday &&
      formState.gender &&
      height !== null &&
      weight !== null
    ) {
      const profile: UserProfile = {
        id: "",
        firstName: formState.firstName,
        lastName: formState.lastName,
        birthday: formState.birthday,
        gender: formState.gender,
        language: "german",
        height,
        weight,
      };

      // Exit-Animation
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 });
      onFinish(profile);
    } else {
      setErrorMessage("Bitte alle Felder ausfüllen");
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("de-DE");
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    // Hide the picker on iOS after selection
    if (Platform.OS === "ios") {
      setFormState((prev) => ({ ...prev, showDatePicker: false }));
    }

    if (event.type === "dismissed") {
      return; // User canceled, don't update date
    }

    if (selectedDate) {
      setFormState((prev) => ({
        ...prev,
        showDatePicker: Platform.OS === "android" ? false : prev.showDatePicker,
        birthday: selectedDate,
      }));
    }
  };

  // Define a more specific type for text input fields
  const textFields: {
    key: Extract<keyof FormState, "firstName" | "lastName" | "height" | "weight">;
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
    <Animated.View className="flex-1 w-full mt-10" style={animatedStyle}>
      {/* Error Message */}
      {errorMessage && <Text className="text-destructive text-center mb-4">{errorMessage}</Text>}
      {/* Header */}
      <Animated.View className="items-center mb-8" entering={FadeInDown.duration(200)}>
        <Text className="text-2xl font-semibold mb-2">Dein Profil</Text>
        <Text className="text-foreground text-center px-4">
          Lass uns dein Profil erstellen, damit wir deinen Trainingsplan perfekt auf dich abstimmen können.
        </Text>
      </Animated.View>

      {/* Formularfelder */}
      <View className="gap-2">
        {textFields.map(({ key, label, numeric, placeholder }, index) => (
          <Animated.View key={key} entering={FadeInDown.duration(400).delay(100 + index * 50)}>
            <Text className="text-lg mb-2">{label}</Text>
            <Input
              className=""
              value={formState[key]}
              onChangeText={(text) => setFormState((prev) => ({ ...prev, [key]: text }))}
              keyboardType={numeric ? "numeric" : "default"}
              placeholder={placeholder}
            />
          </Animated.View>
        ))}

        {/* Birthday Field */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)}>
          <Text className="text-lg mb-2">Geburtsdatum</Text>
          <Button
            className="w-full bg-muted rounded-lg p-4 justify-start"
            onPress={() => setFormState((prev) => ({ ...prev, showDatePicker: true }))}
          >
            <Text className="text-base text-foreground">{formatDate(formState.birthday)}</Text>
          </Button>

          {formState.showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={formState.birthday}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              themeVariant="light"
            />
          )}
        </Animated.View>

        {/* Geschlechtsauswahl */}
        <Animated.View entering={FadeInDown.duration(200).delay(300)}>
          <Text className="text-lg mb-2">Geschlecht</Text>
          <View className="flex-row justify-between gap-2">
            {Object.values(Gender).map((gender, index) => (
              <Animated.View key={gender} entering={FadeInDown.duration(400).delay(400 + index * 50)}>
                <Button
                  className={`min-w-[110px] py-4 ${formState.gender === gender ? "bg-primary" : "bg-muted"}`}
                  onPress={() => setFormState((prev) => ({ ...prev, gender }))}
                  haptics="selection"
                >
                  <Text className={formState.gender === gender ? "text-primary-foreground" : "text-foreground"}>
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
          className="w-full bg-primary py-4"
          onPress={handleSubmit}
          haptics="heavy"
          disabled={
            !formState.firstName || !formState.lastName || !formState.gender || !formState.height || !formState.weight
          }
        >
          <Text className="text-primary-foreground text-base font-medium">Los geht's! 💪</Text>
        </Button>
      </Animated.View>
    </Animated.View>
  );
};
