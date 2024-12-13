import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Flame, Info } from 'lucide-react-native';

interface WarmupRecommendationsProps {
  workingWeight: number; // Hauptgewicht in kg
  exerciseType: 'compound' | 'isolation';
}

export const WarmupRecommendations = ({ 
  workingWeight,
  exerciseType 
}: WarmupRecommendationsProps) => {
  const calculateWarmupSets = () => {
    if (exerciseType === 'compound') {
      return [
        { percentage: 0, reps: 15, note: 'Mobilisation & Technik' },
        { percentage: 40, reps: 10, weight: Math.round(workingWeight * 0.4) },
        { percentage: 60, reps: 8, weight: Math.round(workingWeight * 0.6) },
        { percentage: 80, reps: 5, weight: Math.round(workingWeight * 0.8) },
      ];
    } else {
      return [
        { percentage: 0, reps: 12, note: 'Mobilisation & Technik' },
        { percentage: 50, reps: 10, weight: Math.round(workingWeight * 0.5) },
        { percentage: 75, reps: 8, weight: Math.round(workingWeight * 0.75) },
      ];
    }
  };

  const warmupSets = calculateWarmupSets();

  return (
    <Card className="mb-4">
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Flame size={20} className="text-primary mr-2" />
          <Text className="text-lg font-semibold">Aufwärm-Empfehlungen</Text>
        </View>

        <View className="bg-secondary/5 p-3 rounded-lg mb-4">
          <View className="flex-row items-center mb-2">
            <Info size={16} className="text-primary mr-2" />
            <Text className="text-sm text-muted-foreground">
              Führe die Aufwärmsätze mit reduziertem Gewicht durch, 
              um deine Muskeln und Gelenke vorzubereiten.
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          {warmupSets.map((set, index) => (
            <View 
              key={index}
              className="flex-row items-center justify-between bg-secondary/5 p-3 rounded-lg"
            >
              <View>
                <Text className="font-medium">Set {index + 1}</Text>
                <Text className="text-sm text-muted-foreground">
                  {set.reps} Wiederholungen
                </Text>
              </View>
              
              <View className="items-end">
                {set.weight ? (
                  <>
                    <Text className="font-medium">{set.weight} kg</Text>
                    <Text className="text-sm text-muted-foreground">
                      {set.percentage}% vom Arbeitsgewicht
                    </Text>
                  </>
                ) : (
                  <Text className="text-sm text-muted-foreground">
                    {set.note}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};