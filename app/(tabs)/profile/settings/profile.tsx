import { View, ScrollView, Platform } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { useState, useEffect } from "react";
import { UserProfile, Gender } from "~/lib/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H2 } from "~/components/ui/typography";

export default function ProfileScreen() {
  const { profile, updateProfile, isSyncing } = useUserProfileStore();
  const [formState, setFormState] = useState<Omit<UserProfile, "id">>({
    firstName: "",
    lastName: "",
    birthday: new Date(),
    gender: Gender.Other,
    height: 0,
    weight: 0,
    language: "german",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // Initialize form state with profile data
  useEffect(() => {
    if (profile) {
      setFormState({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        birthday: profile.birthday ? new Date(profile.birthday) : new Date(),
        gender: profile.gender || Gender.Other,
        height: profile.height || 0,
        weight: profile.weight || 0,
        language: profile.language || "german",
      });
    }
  }, [profile]);

  // Validation function
  const validateForm = (): boolean => {
    if (!formState.firstName || !formState.lastName || !formState.gender) {
      setErrorMessage("Bitte fülle alle persönlichen Daten aus.");
      return false;
    }
    if (formState.height <= 0 || formState.weight <= 0) {
      setErrorMessage("Größe und Gewicht müssen größer als 0 sein.");
      return false;
    }
    if (isNaN(formState.height) || isNaN(formState.weight)) {
      setErrorMessage("Größe und Gewicht müssen Zahlen sein.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Handle saving the profile
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    // Construct the full profile update, including the ID
    const updatedProfileData: Partial<UserProfile> = {
      ...formState,
      // Ensure height and weight are numbers
      height: Number(formState.height),
      weight: Number(formState.weight),
    };

    await updateProfile(updatedProfileData);
    // Optionally: Add success feedback or navigation
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("de-DE");
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep picker open on iOS until done
    if (event.type === "dismissed") {
      setShowDatePicker(false); // Hide picker if dismissed
      return;
    }
    if (selectedDate) {
      setFormState((prev) => ({
        ...prev,
        birthday: selectedDate,
      }));
      // Automatically close picker on Android after selection
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    }
  };

  // Helper to update form state for number inputs
  const handleNumberChange = (key: "height" | "weight", value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormState((prev) => ({ ...prev, [key]: value === "" ? "" : parseInt(value, 10) }));
    }
  };

  const languageOptions = [{ value: "german", label: "Deutsch" }];

  return (
    <ScrollView className="flex-1 bg-card px-6 p-4" contentContainerClassName="pb-12">
      <H2 className="mb-6">Profil bearbeiten</H2>

      {errorMessage && <Text className="text-destructive text-center mb-4">{errorMessage}</Text>}

      <View className="gap-4">
        {/* First Name */}
        <View>
          <Text className="text-foreground mb-2">Vorname</Text>
          <Input
            placeholder="Max"
            value={formState.firstName}
            onChangeText={(text) => setFormState((prev) => ({ ...prev, firstName: text }))}
          />
        </View>

        {/* Last Name */}
        <View>
          <Text className="text-foreground mb-2">Nachname</Text>
          <Input
            placeholder="Mustermann"
            value={formState.lastName}
            onChangeText={(text) => setFormState((prev) => ({ ...prev, lastName: text }))}
          />
        </View>

        {/* Birthday */}
        <View>
          <Text className="text-foreground mb-2">Geburtsdatum</Text>
          <Button
            variant="outline"
            className="w-full justify-start"
            onPress={() => setShowDatePicker(true)}
            haptics="light"
          >
            <Text className="text-foreground">{formatDate(formState.birthday)}</Text>
          </Button>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={formState.birthday}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              // themeVariant="light" // Consider matching app theme
            />
          )}
          {/* Add Done button for iOS Date Picker */}
          {Platform.OS === "ios" && showDatePicker && (
            <Button className="mt-2" onPress={() => setShowDatePicker(false)}>
              <Text>Fertig</Text>
            </Button>
          )}
        </View>

        {/* Gender */}
        <View>
          <Text className="text-foreground mb-2">Geschlecht</Text>
          <View className="flex-row justify-between gap-2">
            {Object.values(Gender).map((gender) => (
              <Button
                key={gender}
                variant={formState.gender === gender ? "default" : "outline"}
                className={`flex-1 py-3 ${
                  formState.gender === gender ? "bg-primary" : "bg-background" // Adjusted for better contrast/clarity
                }`}
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
            ))}
          </View>
        </View>

        {/* Height */}
        <View>
          <Text className="text-foreground mb-2">Größe (cm)</Text>
          <Input
            placeholder="180"
            value={formState.height > 0 ? String(formState.height) : ""}
            onChangeText={(text) => handleNumberChange("height", text)}
            keyboardType="numeric"
          />
        </View>

        {/* Weight */}
        <View>
          <Text className="text-foreground mb-2">Gewicht (kg)</Text>
          <Input
            placeholder="75"
            value={formState.weight > 0 ? String(formState.weight) : ""}
            onChangeText={(text) => handleNumberChange("weight", text)}
            keyboardType="numeric"
          />
        </View>

        {/* Language */}
        <View>
          <Text className="text-foreground mb-2">Sprache</Text>
          <Select
            defaultValue={languageOptions.find((opt) => opt.value === formState.language)}
            onValueChange={(option) => {
              if (option) {
                setFormState((prev) => ({ ...prev, language: option.value }));
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sprache auswählen" className="text-foreground" />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-[100%]">
              <SelectGroup>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} label={option.label} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>

      {/* Save Button */}
      <Button className="mt-8 bg-primary py-3" onPress={handleSave} disabled={isSyncing} haptics="heavy">
        <Text className="text-primary-foreground text-base font-medium">
          {isSyncing ? "Speichern..." : "Speichern"}
        </Text>
      </Button>
    </ScrollView>
  );
}
