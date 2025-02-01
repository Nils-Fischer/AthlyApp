import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Gender, UserProfile } from "~/lib/types";
import { useState } from "react";

export const WelcomeScreen = ({ finish }: { finish: (profile: UserProfile) => void }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const handleFinish = () => {
    if (firstName && lastName && age && gender && height && weight) {
      finish({
        firstName: firstName!,
        lastName: lastName!,
        age: age!,
        gender: gender!,
        height: height!,
        weight: weight!,
      });
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Welcome to the app</Text>
      <Button disabled={!firstName || !lastName || !age || !gender || !height || !weight} onPress={handleFinish}>
        <Text>Fertig</Text>
      </Button>
    </View>
  );
};
