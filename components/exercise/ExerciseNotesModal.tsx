// ExerciseNotesModal.tsx
import React from "react";
import { View, TextInput, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Target, Dumbbell, AlertCircle, RefreshCw } from "lucide-react-native";
import { Router } from "react-native-actions-sheet";

export interface ExerciseNoteProps {
  notes: string | undefined;
  setNotes: (notes: string) => void;
  onClose: () => void;
  exerciseName: string;
  router: Router<"sheet-with-router">;
}

export const ExerciseNotes: React.FC<ExerciseNoteProps> = ({ notes, setNotes, onClose, exerciseName }) => {
  const quickTips = [
    {
      icon: <Target size={20} className="text-foreground" />,
      text: "Persönliche Ziele für diese Übung",
      prefix: "Persönliche Ziele: ",
    },
    {
      icon: <Dumbbell size={20} className="text-foreground" />,
      text: "Beste Ausführungstechnik",
      prefix: "Ausführungstechnik: ",
    },
    {
      icon: <AlertCircle size={20} className="text-foreground" />,
      text: "Worauf besonders achten",
      prefix: "Wichtig: ",
    },
    {
      icon: <RefreshCw size={20} className="text-foreground" />,
      text: "Bevorzugte Variationen",
      prefix: "Variationen: ",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-14 px-4 py-2 flex-row items-center justify-between border-b border-border">
        <View className="flex-row items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onPress={onClose}>
            <ChevronLeft size={24} />
          </Button>
          <View>
            <Text className="text-lg font-semibold">Notizen</Text>
            <Text className="text-sm text-muted-foreground">{exerciseName}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <View className="bg-secondary/10 rounded-xl p-4 min-h-[200]">
          <TextInput
            className="text-base leading-relaxed"
            value={notes || ""}
            onChangeText={setNotes}
            multiline
            placeholder="Füge hier deine Notizen zur Übung hinzu... (z.B. Ausführungstipps, Erinnerungen, persönliche Anpassungen)"
            placeholderTextColor="gray"
            textAlignVertical="top"
            style={{ minHeight: 200 }}
          />
        </View>

        {/* Quick Tips */}
        <View className="mt-6">
          <Text className="font-medium mb-3">Vorschläge für Notizen:</Text>
          <View className="gap-2">
            {quickTips.map((tip, index) => (
              <Pressable
                key={index}
                onPress={() => setNotes((notes || "") + (notes ? "\n\n" : "") + tip.prefix)}
                className="bg-secondary/10 p-3 rounded-lg active:opacity-70"
              >
                <View className="flex-row items-center gap-3">
                  {tip.icon}
                  <Text>{tip.text}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
