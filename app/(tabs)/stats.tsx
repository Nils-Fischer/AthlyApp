// TrainTechApp/app/(tabs)/stats.tsx
import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// AI Tab components
import { AIInsights } from "~/components/Stats/AIInsights";
import { AIPredictions } from "~/components/Stats/AIPredictions";
import { AITrainingOptimizer } from "~/components/Stats/AITrainingOptimizer";

// Stats Tab components
import { DetailedStats } from "~/components/Stats/DetailedStats";
import { CommunityComparison } from "~/components/Stats/CommunityComparison";
import { PersonalRecords } from "~/components/Stats/PersonalRecords";
import { LeaderboardPosition } from "~/components/Stats/LeaderboardPosition";

export default function Screen() {
  const [activeTab, setActiveTab] = React.useState("analysis");

  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Training Analytics</Text>
        
        {/* Tab Navigation */}
        <View className="flex-row bg-muted rounded-lg p-1 mb-4">
          <Pressable
            className={`flex-1 rounded-md h-10 ${
              activeTab === "analysis" ? "bg-background" : ""
            }`}
            onPress={() => setActiveTab("analysis")}
          >
            <Text className="font-medium text-center py-2">KI Analyse</Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-md h-10 ${
              activeTab === "stats" ? "bg-background" : ""
            }`}
            onPress={() => setActiveTab("stats")}
          >
            <Text className="font-medium text-center py-2">Statistiken</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {activeTab === "analysis" ? (
            // AI Analysis Tab
            <View className="gap-4">
              <AIInsights />
              <AIPredictions />
              <AITrainingOptimizer />
            </View>
          ) : (
            // Statistics Tab
            <View className="gap-4">
              <CommunityComparison />
              <PersonalRecords />
              <LeaderboardPosition />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}