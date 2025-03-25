import React from "react";
import { ScrollView, View } from "react-native";
import { H1, P } from "../ui/typography";
import { Text } from "../ui/text";

const PrivacyPolicy = () => {
  return (
    <ScrollView className="flex-1 p-4 bg-background">
      <View className="mb-8">
        <H1>Datenschutzerklärung</H1>
        <P>Gültig ab: 25. März 2025</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>1. Einleitung</Text>
        </P>
        <P>
          Der Schutz deiner personenbezogenen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung
          informieren wir dich über die Erhebung, Verarbeitung und Nutzung deiner Daten bei der Verwendung unserer Athly
          App.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>2. Verantwortliche Stelle</Text>
        </P>
        <P>Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</P>
        <P>Athly</P>
        <P>Glasstraße 7a</P>
        <P>50823 Köln</P>
        <P>Deutschland</P>
        <P>E-Mail: info@athly.de</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>3. Erhobene Daten</Text>
        </P>
        <P>
          <Text className="font-semibold">Bei der Registrierung:</Text>
        </P>
        <P>- E-Mail-Adresse</P>
        <P>- Name (optional)</P>
        <P>
          <Text className="font-semibold">Bei der Nutzung der App:</Text>
        </P>
        <P>- Trainingsdaten (Übungen, Gewichte, Wiederholungen, etc.)</P>
        <P>- Profilinformationen (Alter, Geschlecht, Fitnesslevel, Trainingsziele)</P>
        <P>- Geräteidentifikation und Betriebssystem</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>4. Zweck der Datenverarbeitung</Text>
        </P>
        <P>Wir verarbeiten deine Daten, um:</P>
        <P>- Dir die Nutzung unserer App zu ermöglichen</P>
        <P>- Personalisierte Trainingspläne zu erstellen</P>
        <P>- Die App zu verbessern und weiterzuentwickeln</P>
        <P>- Technische Probleme zu beheben</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>5. Weitergabe von Daten</Text>
        </P>
        <P>Eine Weitergabe deiner personenbezogenen Daten erfolgt nur in folgenden Fällen:</P>
        <P>- An Dienstleister, die uns bei der Bereitstellung unserer Services unterstützen (z.B. Cloud-Anbieter)</P>
        <P>- Wenn wir gesetzlich dazu verpflichtet sind</P>
        <P>- Mit deiner ausdrücklichen Einwilligung</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>6. Deine Rechte</Text>
        </P>
        <P>Du hast das Recht auf:</P>
        <P>- Auskunft über deine gespeicherten Daten</P>
        <P>- Berichtigung unrichtiger Daten</P>
        <P>- Löschung deiner Daten</P>
        <P>- Einschränkung der Datenverarbeitung</P>
        <P>- Datenübertragbarkeit</P>
        <P>- Widerruf erteilter Einwilligungen</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>7. Speicherdauer</Text>
        </P>
        <P>
          Wir speichern deine Daten, solange dein Konto bei uns besteht oder solange es für die Erfüllung unserer
          Dienstleistungen notwendig ist.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>8. Änderungen dieser Datenschutzerklärung</Text>
        </P>
        <P>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets in der
          App verfügbar.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>9. Kontakt</Text>
        </P>
        <P>Bei Fragen zum Datenschutz kannst du dich jederzeit an uns wenden:</P>
        <P>E-Mail: info@athly.de</P>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
