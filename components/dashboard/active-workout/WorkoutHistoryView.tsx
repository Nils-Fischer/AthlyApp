import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Calendar, ChevronRight, BarChart3, Weight } from 'lucide-react-native';
import { WorkoutHistoryEntry } from '~/lib/types';

interface WorkoutHistoryViewProps {
  exerciseId: number;
  history: WorkoutHistoryEntry[];
  exerciseName: string;
}

export const WorkoutHistoryView = ({ 
  exerciseId,
  history,
  exerciseName
}: WorkoutHistoryViewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  const calculateVolume = (entry: WorkoutHistoryEntry) => {
    return entry.sets.reduce((total, set) => 
      total + (set.weight * set.reps), 0
    );
  };

  return (
    <Card className="flex-1">
      <View className="p-4 border-b border-border">
        <Text className="text-xl font-semibold">{exerciseName}</Text>
        <Text className="text-sm text-muted-foreground">Trainings-Historie</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {history.map((entry, index) => (
          <Card key={index} className="mb-4 overflow-hidden border border-border">
            <View className="p-4">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Calendar size={20} className="text-primary mr-2" />
                  <Text className="font-medium">{formatDate(entry.date)}</Text>
                </View>
                <View className="flex-row items-center">
                  <Weight size={20} className="text-primary mr-2" />
                  <Text className="font-medium">{calculateVolume(entry)}kg</Text>
                </View>
              </View>
              
              {/* Sets */}
              <View className="space-y-2">
                {entry.sets.map((set, setIndex) => (
                  <View key={setIndex} className="flex-row items-center justify-between bg-secondary/5 p-3 rounded-lg">
                    <Text className="text-sm text-muted-foreground">Set {setIndex + 1}</Text>
                    <View className="flex-row space-x-6">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-medium">{set.weight}kg</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-sm font-medium">{set.reps} Wdh</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Progress Indicators */}
              {index > 0 && (
                <View className="mt-4 p-3 bg-secondary/5 rounded-lg">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Volumen vs. letztes Training</Text>
                    <Text className={`text-sm font-medium ${
                      calculateVolume(entry) > calculateVolume(history[index - 1])
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {Math.round(
                        ((calculateVolume(entry) - calculateVolume(history[index - 1])) /
                        calculateVolume(history[index - 1])) * 100
                      )}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </Card>
  );
};