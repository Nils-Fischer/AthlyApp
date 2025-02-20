import React from "react";
import { View, TextInput, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Target, Dumbbell, AlertCircle, RefreshCw } from "~/lib/icons/Icons";
import { WorkoutExercise } from "~/lib/types";
import { ExerciseBottomSheetHeader } from "~/components/Exercise/ExerciseBottomSheetHeader";
import * as Haptics from "expo-haptics";

export interface ExerciseNoteProps {
  workoutExercise: WorkoutExercise;
  onSave: (exercise: WorkoutExercise) => void;
  navigateBack: (workoutExercise: WorkoutExercise) => void;
}

export const ExerciseEditNotes: React.FC<ExerciseNoteProps> = ({ workoutExercise, onSave, navigateBack }) => {
  const [localNotes, setLocalNotes] = React.useState(workoutExercise.notes || "");

  const getNewWorkoutExercise = (): WorkoutExercise => {
    return {
      ...workoutExercise,
      notes: localNotes,
    };
  };

  const goBack = () => navigateBack(getNewWorkoutExercise());

  const save = () => onSave(getNewWorkoutExercise());

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
    <ExerciseBottomSheetHeader title="Notizen" closeMode={"back"} onClose={goBack} onSave={save}>
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1 p-4">
          <View className="bg-secondary/10 rounded-xl p-4 min-h-[200]">
            <TextInput
              className="text-base leading-relaxed"
              value={localNotes}
              onChangeText={setLocalNotes}
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
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLocalNotes((localNotes || "") + (localNotes ? "\n\n" : "") + tip.prefix);
                  }}
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
    </ExerciseBottomSheetHeader>
  );
};
