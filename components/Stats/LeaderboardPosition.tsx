// TrainTechApp/components/Stats/LeaderboardPosition.tsx
import React from "react";
import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Award, Trophy } from "lucide-react-native";

export const LeaderboardPosition = () => {
  const leaderboardStats = {
    globalRank: 1250,
    localRank: 25,
    gym: "McFit Berlin",
    totalUsers: 15000,
    nearbyUsers: 350,
    achievements: [
      { name: "Elite Lifter", description: "Top 5% in deiner Gewichtsklasse" },
      { name: "Consistent", description: "12 Wochen Trainingstreak" },
      { name: "Volume King", description: "Höchstes Trainingsvolumen diese Woche" }
    ]
  };

  return (
    <View className="bg-card rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-4">
        <Trophy className="h-5 w-5 text-primary mr-2" />
        <Text className="font-semibold text-lg">Deine Position</Text>
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-muted/50 p-4 rounded-xl">
          <Text className="text-sm text-muted-foreground mb-1">Global</Text>
          <Text className="text-2xl font-bold">#{leaderboardStats.globalRank}</Text>
          <Text className="text-xs text-muted-foreground">
            von {leaderboardStats.totalUsers} Nutzern
          </Text>
        </View>
        <View className="flex-1 bg-muted/50 p-4 rounded-xl">
          <Text className="text-sm text-muted-foreground mb-1">{leaderboardStats.gym}</Text>
          <Text className="text-2xl font-bold">#{leaderboardStats.localRank}</Text>
          <Text className="text-xs text-muted-foreground">
            von {leaderboardStats.nearbyUsers} Nutzern
          </Text>
        </View>
      </View>

      <View className="gap-3">
        {leaderboardStats.achievements.map((achievement, index) => (
          <View key={index} className="flex-row items-center bg-muted/30 p-3 rounded-xl">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Award className="h-5 w-5 text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-sm">{achievement.name}</Text>
              <Text className="text-xs text-muted-foreground">
                {achievement.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
