import { ScrollView } from "react-native";
import PrivacyPolicy from "~/components/Legal/PrivacyPolicy";

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView className="bg-card flex-1 p-4">
      <PrivacyPolicy />
    </ScrollView>
  );
}
