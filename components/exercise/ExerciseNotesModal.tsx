// ExerciseNotesModal.tsx
import React, { useState } from 'react';
import { View, TextInput, ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react-native';

interface ExerciseNotesModalProps {
  initialNotes: string;
  onClose: () => void;
  onSave: (notes: string) => void;
  exerciseName: string;
}

export const ExerciseNotesModal: React.FC<ExerciseNotesModalProps> = ({
  initialNotes,
  onClose,
  onSave,
  exerciseName,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-14 px-4 py-2 flex-row items-center justify-between border-b border-border">
        <View className="flex-row items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-2"
            onPress={onClose}
          >
            <ChevronLeft size={24} />
          </Button>
          <View>
            <Text className="text-lg font-semibold">Notizen</Text>
            <Text className="text-sm text-muted-foreground">{exerciseName}</Text>
          </View>
        </View>
        <Button size="sm" onPress={handleSave}>
          <Save size={18} className="mr-2" />
          <Text className="text-primary-foreground font-medium">Speichern</Text>
        </Button>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <View className="bg-secondary/10 rounded-xl p-4 min-h-[200]">
          <TextInput
            className="text-base leading-relaxed"
            value={notes}
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
            {[
              "🎯 Persönliche Ziele für diese Übung",
              "💪 Beste Ausführungstechnik",
              "⚠️ Worauf besonders achten",
              "🔄 Bevorzugte Variationen",
            ].map((tip, index) => (
              <Pressable
                key={index}
                onPress={() => setNotes(notes => notes + (notes ? "\n\n" : "") + tip.split(" ").slice(1).join(" "))}
                className="bg-secondary/10 p-3 rounded-lg active:opacity-70"
              >
                <Text>{tip}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};