// TrainTechApp/components/Stats/PersonalRecords.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Medal, Star, Calendar } from "lucide-react-native";

export const PersonalRecords = () => {
  const records = [
    {
      type: "Gewicht",
      achievements: [
        {
          name: "Bankdrücken",
          value: "105kg",
          date: "Letzte Woche",
          previousRecord: "102.5kg",
          improvement: "+2.5kg"
        },
        {
          name: "Clean & Jerk",
          value: "90kg",
          date: "Gestern",
          previousRecord: "87.5kg",
          improvement: "+2.5kg"
        }
      ]
    },
    {
      type: "Volumen",
      achievements: [
        {
          name: "Chest Day",
          value: "15,450kg",
          date: "Diese Woche",
          previousRecord: "14,200kg",
          improvement: "+1,250kg"
        }
      ]
    },
    {
      type: "Ausdauer",
      achievements: [
        {
          name: "Pull-Ups",
          value: "18 Reps",
          date: "Heute",
          previousRecord: "15 Reps",
          improvement: "+3 Reps"
        }
      ]
    }
  ];

  return (
    <View className="bg-card rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-4">
        <Medal className="h-5 w-5 text-primary mr-2" />
        <Text className="font-semibold text-lg">Neue Rekorde</Text>
      </View>

      <View className="gap-4">
        {records.map((category, index) => (
          <View key={index}>
            <Text className="text-sm text-muted-foreground mb-2">{category.type}</Text>
            <View className="gap-3">
              {category.achievements.map((achievement, idx) => (
                <View key={idx} className="bg-muted/50 rounded-xl p-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium">{achievement.name}</Text>
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-xs text-primary font-medium">
                        {achievement.value}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Text className="text-sm text-muted-foreground">
                        {achievement.previousRecord} → {achievement.improvement}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                      <Text className="text-sm text-muted-foreground">
                        {achievement.date}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
