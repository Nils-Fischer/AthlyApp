import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Calendar, Clock, BarChart2, Gauge, Flame, TrendingUp, Heart } from "lucide-react-native";
import { CommunityComparison } from "./CommunityComparison";
import { LeaderboardPosition } from "./LeaderboardPosition";
import { PersonalRecords } from "./PersonalRecords";
export const DetailedStats = () => {
    return (
      <View className="flex-1">
        <CommunityComparison />
        <PersonalRecords />
        <LeaderboardPosition />
      </View>
    );
  };