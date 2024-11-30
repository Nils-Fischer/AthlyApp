import React, { useState } from 'react';
import { View, ScrollView, Image, Pressable, Modal } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ChevronLeft } from 'lucide-react-native';
import { Exercise } from '~/lib/types';
import { useExerciseStore } from '~/stores/exerciseStore';

interface AlternativeExercisesModalProps {
  exercise: Exercise;
  onClose: () => void;
  onSelectAlternative: (exercise: Exercise) => void;
}

export const AlternativeExercisesModal: React.FC<AlternativeExercisesModalProps> = ({
  exercise,
  onClose,
  onSelectAlternative,
}) => {
  const exerciseStore = useExerciseStore();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  const alternativeExercises = exerciseStore.exercises.filter(
    (ex) =>
      ex.id !== exercise.id && 
      ex.category === exercise.category &&
      ex.primaryMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle))
  );

  const handleSelectExercise = (alternativeExercise: Exercise) => {
    setSelectedExercise(alternativeExercise);
  };

  const handleConfirmReplacement = () => {
    if (selectedExercise) {
      onSelectAlternative(selectedExercise);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-14 px-4 py-2 flex-row items-center border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mr-2"
          onPress={onClose}
        >
          <ChevronLeft size={24} />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-semibold">Alternative Übungen</Text>
          <Text className="text-sm text-muted-foreground">
            Kategorie: {exercise.category}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {alternativeExercises.length > 0 ? (
          <View className="gap-4">
            {alternativeExercises.map((alternativeExercise) => (
              <Pressable
                key={alternativeExercise.id}
                onPress={() => handleSelectExercise(alternativeExercise)}
                className="active:opacity-70"
              >
                <View className={`bg-card rounded-xl p-4 border ${
                  selectedExercise?.id === alternativeExercise.id 
                    ? 'border-primary' 
                    : 'border-border'
                }`}>
                  <View className="flex-row gap-3">
                    <View className="w-16 h-16 bg-muted rounded-lg items-center justify-center overflow-hidden">
                      {alternativeExercise.images?.[0] ? (
                        <Image
                          source={{ uri: alternativeExercise.images[0] }}
                          alt={alternativeExercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          source={{ uri: "/api/placeholder/64/64" }}
                          alt={alternativeExercise.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium mb-1">{alternativeExercise.name}</Text>
                      <Text className="text-sm text-muted-foreground mb-2">
                        {alternativeExercise.equipment}
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {alternativeExercise.primaryMuscles.map((muscle, index) => (
                          <View key={index} className="bg-primary/10 rounded-full px-2 py-0.5">
                            <Text className="text-xs text-primary">{muscle}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-muted-foreground text-center">
              Keine alternativen Übungen in dieser Kategorie gefunden.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Replace Button */}
      {selectedExercise && (
        <View className="p-4 border-t border-border">
          <Button 
            onPress={handleConfirmReplacement}
            className="w-full"
          >
            <Text className="text-primary-foreground font-medium">
              {selectedExercise.name} als Alternative festlegen
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};