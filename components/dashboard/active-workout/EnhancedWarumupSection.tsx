import React, { useState } from 'react';
import { View, Switch, TextInput, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Dumbbell, Info, Check, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface WarmupSet {
  percentage: number;
  reps: number;
  weight: number;
  isCompleted: boolean;
}

interface EnhancedWarmupSectionProps {
  workingWeight: number;
  exerciseType: 'compound' | 'isolation';
  onWarmupComplete?: (sets: WarmupSet[]) => void;
}

export const EnhancedWarmupSection = ({
  workingWeight,
  exerciseType,
  onWarmupComplete
}: EnhancedWarmupSectionProps) => {
  const [showWarmup, setShowWarmup] = useState(false);
  const [warmupSets, setWarmupSets] = useState<WarmupSet[]>(() => {
    if (exerciseType === 'compound') {
      return [
        { percentage: 40, reps: 10, weight: Math.round(workingWeight * 0.4), isCompleted: false },
        { percentage: 60, reps: 8, weight: Math.round(workingWeight * 0.6), isCompleted: false },
        { percentage: 80, reps: 6, weight: Math.round(workingWeight * 0.8), isCompleted: false }
      ];
    } else {
      return [
        { percentage: 50, reps: 10, weight: Math.round(workingWeight * 0.5), isCompleted: false },
        { percentage: 75, reps: 8, weight: Math.round(workingWeight * 0.75), isCompleted: false }
      ];
    }
  });

  const handleSetComplete = (index: number) => {
    const newSets = [...warmupSets];
    newSets[index] = { ...newSets[index], isCompleted: !newSets[index].isCompleted };
    setWarmupSets(newSets);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateSet = (index: number, field: keyof WarmupSet, value: string) => {
    const newSets = [...warmupSets];
    const numValue = parseInt(value) || 0;
    newSets[index] = { ...newSets[index], [field]: numValue };
    setWarmupSets(newSets);
  };

  return (
    <Card className="mb-6 border-primary/10">
      <View className="p-4">
        {/* Warm-up Toggle */}
        <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-border">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Dumbbell size={20} className="text-primary" />
            </View>
            <View>
              <Text className="font-medium">Aufwärmen</Text>
              <Text className="text-sm text-muted-foreground">Vorbereitung für dein Training</Text>
            </View>
          </View>
          <Switch
            value={showWarmup}
            onValueChange={(value) => {
              setShowWarmup(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </View>

        {showWarmup && (
          <Animated.View entering={FadeInDown}>
            {/* Empfehlungstext */}
            <View className="bg-secondary/5 p-3 rounded-lg mb-4">
              <View className="flex-row items-center">
                <Info size={16} className="text-primary mr-2" />
                <Text className="text-sm text-muted-foreground flex-1">
                  {exerciseType === 'compound' 
                    ? 'Für diese Übung werden 3 Aufwärmsätze mit steigender Intensität empfohlen.'
                    : 'Für diese Isolationsübung werden 2 moderate Aufwärmsätze empfohlen.'}
                </Text>
              </View>
            </View>

            {/* Warm-up Sets */}
            <View className="space-y-2">
              {warmupSets.map((set, index) => (
                <View key={index} className="flex-row items-center py-4">
                  <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mx-3">
                    <Text className="text-base font-medium text-foreground">W{index + 1}</Text>
                  </View>

                  <View className="flex-1 px-2">
                    <Text className="text-xs text-muted-foreground mb-1">Gewicht ({set.percentage}%)</Text>
                    <View className="flex-row items-center">
                      <TextInput
                        className="flex-1 h-9 px-3 rounded-lg bg-secondary/10 text-base"
                        value={set.weight.toString()}
                        onChangeText={(value) => updateSet(index, 'weight', value)}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholder="0"
                      />
                      <Text className="ml-1 text-sm text-muted-foreground">kg</Text>
                    </View>
                  </View>

                  <View className="flex-1 px-2">
                    <Text className="text-xs text-muted-foreground mb-1">Wdh</Text>
                    <TextInput
                      className="h-9 px-3 rounded-lg bg-secondary/10 text-base"
                      value={set.reps.toString()}
                      onChangeText={(value) => updateSet(index, 'reps', value)}
                      keyboardType="numeric"
                      maxLength={2}
                      placeholder="0"
                    />
                  </View>

                  <Pressable
                    onPress={() => handleSetComplete(index)}
                    className={`w-10 h-10 rounded-full items-center justify-center mx-2 ${
                      set.isCompleted ? 'bg-primary' : 'bg-secondary/10'
                    }`}
                  >
                    <Check 
                      size={16} 
                      className={set.isCompleted ? 'text-white' : 'text-muted-foreground'} 
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </Card>
  );
};