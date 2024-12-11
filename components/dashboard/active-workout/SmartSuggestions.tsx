import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  Timer, 
  RotateCcw,
  ChevronRight 
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Exercise, WorkoutExercise } from '~/lib/types';

interface SmartSuggestionsProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onSuggestionPress: (type: string, value: any) => void;
}

export const SmartSuggestions = ({
  exercise,
  workoutExercise,
  onSuggestionPress
}: SmartSuggestionsProps) => {
  // Example AI suggestions (in a real app, these would come from your backend)
  const suggestions = {
    weightProgression: Math.round(workoutExercise.weight * 1.05), // 5% increase
    restPeriod: workoutExercise.weight > 50 ? 90 : 60, // More rest for heavier weights
    alternatives: exercise.alternatives || [],
  };

  return (
    <Card className="bg-card/90 backdrop-blur-lg border-primary/10 overflow-hidden">
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Brain size={20} className="text-primary mr-2" />
          <Text className="text-lg font-semibold">KI Empfehlungen</Text>
        </View>

        {/* Weight Progression */}
        <Pressable
          onPress={() => onSuggestionPress('weight', suggestions.weightProgression)}
          className="mb-3"
        >
          <Animated.View
            entering={FadeInDown.delay(100)}
            className="flex-row items-center p-3 bg-secondary/10 rounded-lg"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <TrendingUp size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Gewichtssteigerung</Text>
              <Text className="text-sm text-muted-foreground">
                Probiere {suggestions.weightProgression}kg für optimalen Fortschritt
              </Text>
            </View>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Animated.View>
        </Pressable>

        {/* Rest Period */}
        <Pressable
          onPress={() => onSuggestionPress('rest', suggestions.restPeriod)}
          className="mb-3"
        >
          <Animated.View
            entering={FadeInDown.delay(200)}
            className="flex-row items-center p-3 bg-secondary/10 rounded-lg"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Timer size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Optimale Pausenzeit</Text>
              <Text className="text-sm text-muted-foreground">
                {suggestions.restPeriod} Sekunden für beste Regeneration
              </Text>
            </View>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Animated.View>
        </Pressable>

        {/* Alternative Exercises */}
        <Pressable
          onPress={() => onSuggestionPress('alternatives', suggestions.alternatives)}
        >
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="flex-row items-center p-3 bg-secondary/10 rounded-lg"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <RotateCcw size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Alternative Übungen</Text>
              <Text className="text-sm text-muted-foreground">
                {suggestions.alternatives.length} passende Alternativen verfügbar
              </Text>
            </View>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Animated.View>
        </Pressable>
      </View>
    </Card>
  );
};