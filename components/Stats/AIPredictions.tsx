// TrainTechApp/components/Stats/AIPredictions.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Target, Trophy, ChevronRight, Calendar, ArrowRight } from "lucide-react-native";
import { Button } from "~/components/ui/button";

export const AIPredictions = () => {
  const predictions = [
    {
      exercise: "Bankdrücken",
      currentMax: 100,
      predictedMax: 120,
      timeframe: "6 Wochen",
      confidence: 92,
      requirements: [
        "2x pro Woche trainieren",
        "Progressive Overload von 2.5kg/Woche",
        "Mindestens 7h Schlaf/Nacht"
      ]
    },
    {
      exercise: "Kniebeugen",
      currentMax: 140,
      predictedMax: 160,
      timeframe: "8 Wochen",
      confidence: 88,
      requirements: [
        "2x pro Woche trainieren",
        "Progressive Overload von 2.5kg/Woche",
        "Ausreichende Kalorienzufuhr"
      ]
    }
  ];

  return (
    <View className="bg-card rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Trophy className="h-5 w-5 text-primary mr-2" />
          <Text className="font-semibold text-lg">KI Vorhersagen</Text>
        </View>
        <Button variant="ghost" size="sm">
          <Text className="text-xs text-primary">Details</Text>
          <ChevronRight className="h-4 w-4 text-primary ml-1" />
        </Button>
      </View>

      <View className="gap-4">
        {predictions.map((pred, index) => (
          <Pressable 
            key={index}
            className="bg-muted/50 rounded-xl p-4 active:opacity-80"
          >
            <View className="flex-row justify-between items-start mb-3">
              <Text className="font-medium text-base">{pred.exercise}</Text>
              <View className="bg-primary/10 px-2 py-1 rounded-full">
                <Text className="text-xs text-primary">{pred.confidence}% sicher</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <Text className="text-2xl font-bold">{pred.currentMax}kg</Text>
              <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
              <Text className="text-2xl font-bold text-primary">{pred.predictedMax}kg</Text>
              <View className="ml-auto flex-row items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground">{pred.timeframe}</Text>
              </View>
            </View>

            <View className="gap-2">
              {pred.requirements.map((req, idx) => (
                <View key={idx} className="flex-row items-center">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                  <Text className="text-sm text-muted-foreground">{req}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
