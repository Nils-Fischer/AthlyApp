import { ScrollView } from "react-native";
import TermsOfService from "~/components/Legal/TermsOfService";

export default function TermsOfServiceScreen() {
  return (
    <ScrollView className="bg-card flex-1 p-4">
      <TermsOfService />
    </ScrollView>
  );
}
