import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Text } from "~/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";
import { Routine, RoutineCreationResult } from "~/lib/types";
import { parseJSON } from "~/lib/utils";
import { Input } from "../ui/input";

const API_URL = "https://api-proxy-worker.nils-fischer7.workers.dev";

interface AIRoutineCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (routine: Routine) => void;
}

export function AIRoutineCreationDialog({ open, onOpenChange, onCreate }: AIRoutineCreationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingStatus, setLoadingStatus] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    mainPrompt: "",
    goals: "",
    equipment: "",
    frequency: "",
    limitations: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Generate AI prompt from form data
      console.log("formData", formData);
      const response: Response = await fetch(`${API_URL}/api/create-routine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
        body: JSON.stringify({
          provider: "google",
          mainPrompt: formData.mainPrompt,
          goals: formData.goals,
          equipment: formData.equipment,
          frequency: formData.frequency,
          limitations: formData.limitations,
        }),
      });
      console.log("API response received:", response);
      const responseBody = await response.text();

      if (!response.ok) {
        console.error("Error creating routine:", response.status, responseBody);
        setLoadingStatus(responseBody || "Fehler beim Erstellen des Trainingsplans");
        setIsLoading(false);
        return;
      }

      setLoadingStatus("Erstelle Trainingsplan...");
      console.log("response", responseBody);

      setLoadingStatus("Verarbeite Antwort...");
      const result = parseJSON<RoutineCreationResult>(responseBody);
      if (!result) {
        throw new Error("Failed to parse routine data");
      }
      const { routine, errorMessage, errorType } = result;

      if (errorType || !routine) {
        setLoadingStatus(errorMessage || "Fehler beim Erstellen des Trainingsplans");
        console.error("Error creating routine:", errorMessage);
        setIsLoading(false);
        return;
      }

      setLoadingStatus("Finalisiere Plan...");

      onCreate(routine);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to generate routine:", error);
      setLoadingStatus("Fehler beim Erstellen des Trainingsplans");
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>KI-Trainingsplan erstellen</DialogTitle>
        </DialogHeader>

        <ScrollView contentContainerStyle={{ gap: 16 }} className={isLoading ? "opacity-50" : ""}>
          <View className="gap-2">
            <Text className="text-lg font-semibold">Beschreibe dein Wunschtraining</Text>
            <Textarea
              value={formData.mainPrompt}
              onChangeText={(text) => setFormData({ ...formData, mainPrompt: text })}
              placeholder='z.B. "Ich möchte einen effektiven Trainingsplan der zu meinem Lifestyle passt. Ich bin Anfänger und hatte bisher wenig Erfahrung mit Krafttraining."'
              numberOfLines={4}
            />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold">
              Trainingsziele <Text className="text-sm font-normal text-muted-foreground">(Optional)</Text>
            </Text>
            <Input
              value={formData.goals}
              onChangeText={(text) => setFormData({ ...formData, goals: text })}
              placeholder='z.B. "Muskelaufbau im Oberkörper, besonders Rücken und Schultern, dabei etwas Körperfett reduzieren"'
              numberOfLines={1}
              textSize="sm"
            />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold">
              Verfügbare Ausrüstung <Text className="text-sm font-normal text-muted-foreground">(Optional)</Text>
            </Text>
            <Input
              value={formData.equipment}
              onChangeText={(text) => setFormData({ ...formData, equipment: text })}
              placeholder='z.B. "Nur Kurzhanteln bis 20kg und eine Klimmzugstange zu Hause"'
              numberOfLines={1}
              textSize="sm"
            />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold">
              Zeit & Häufigkeit <Text className="text-sm font-normal text-muted-foreground">(Optional)</Text>
            </Text>
            <Input
              value={formData.frequency}
              onChangeText={(text) => setFormData({ ...formData, frequency: text })}
              placeholder='z.B. "3-4 mal pro Woche, maximal 45 Minuten pro Einheit"'
              numberOfLines={1}
              textSize="sm"
            />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold">
              Einschränkungen <Text className="text-sm font-normal text-muted-foreground">(Optional)</Text>
            </Text>
            <Input
              value={formData.limitations}
              onChangeText={(text) => setFormData({ ...formData, limitations: text })}
              placeholder='z.B. "Leichte Knieprobleme, möchte Kniebeugen vermeiden"'
              numberOfLines={1}
              textSize="sm"
            />
          </View>
        </ScrollView>

        <DialogFooter>
          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
            className="mr-2"
            disabled={isLoading}
            haptics="light"
          >
            <Text>Abbrechen</Text>
          </Button>
          <Button onPress={handleSubmit} disabled={!formData.mainPrompt.trim() || isLoading} haptics="medium">
            {isLoading ? (
              <View className="flex-row items-center space-x-2">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-background ml-2">Generiere...</Text>
              </View>
            ) : (
              <Text>Erstellen</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*
Main Prompt:
Ich trainiere seit einem Jahr und suche einen Split-Trainingsplan für das Fitnessstudio. Fokus auf Muskelaufbau und Kraft.

Goals:
Muskelaufbau, besonders Oberkörper. Bankdrücken verbessern.

Equipment:
Volles Fitnessstudio mit allen Geräten verfügbar

Frequency:
4 mal pro Woche, 60-90 Minuten pro Einheit

Limitations:
Leichte Schulterprobleme bei Überkopfübungen
*/
