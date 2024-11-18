// TrainTechApp/components/Stats/CommunityComparison.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Users, Trophy, Crown, Target, Award } from "lucide-react-native";

export const CommunityComparison = () => {
  const rankings = [
    {
      exercise: "Bankdrücken",
      weight: "100kg",
      percentile: 92,
      ranking: "Elite",
      betterThan: "92%",
      inGroup: "Männer 20-30, 80-90kg"
    },
    {
      exercise: "Kniebeugen",
      weight: "140kg",
      percentile: 85,
      ranking: "Fortgeschritten",
      betterThan: "85%",
      inGroup: "Männer 20-30, 80-90kg"
    }
  ];

  return (
    <View className="bg-card rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-4">
        <Users className="h-5 w-5 text-primary mr-2" />
        <Text className="font-semibold text-lg">Community Vergleich</Text>
      </View>

      <View className="gap-4">
        {rankings.map((rank, index) => (
          <Pressable key={index}>
            <View className="bg-muted/50 rounded-xl p-4">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="font-medium text-base">{rank.exercise}</Text>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-primary">{rank.weight}</Text>
                </View>
              </View>

              <View className="bg-background/50 rounded-lg p-3 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-muted-foreground">Stärker als</Text>
                  <Text className="font-bold text-lg text-primary">{rank.betterThan}</Text>
                </View>
                <View className="h-2 bg-muted rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary"
                    style={{ width: `${rank.percentile}%` }}
                  />
                </View>
                <Text className="text-xs text-muted-foreground mt-2">
                  in {rank.inGroup}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};