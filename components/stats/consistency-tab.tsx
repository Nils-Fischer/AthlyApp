import React from "react";
import { View } from "react-native";
import { H4, P, Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { StatCard } from "~/components/stats/stat-card";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { Separator } from "~/components/ui/separator";
import { Activity, Calendar, Flame, TrendingUp } from "~/lib/icons/Icons";
import { Award } from "lucide-react-native";
import { fitnessLightColors } from "~/lib/theme/lightColors";
import Animated, { FadeIn } from "react-native-reanimated";

export const ConsistencyTab: React.FC = () => {
  const workoutStats = useWorkoutStats();
  const currentStreak = workoutStats.getCurrentStreak();
  const longestStreak = workoutStats.getLongestStreak();
  const weeklyAverage = workoutStats.weeklyWorkoutsAverage;
  const weekdayData = workoutStats.getWorkoutsByWeekday();
  
  // Berechne den besten Trainingstag
  const bestDayIndex = weekdayData.counts.indexOf(Math.max(...weekdayData.counts));
  const bestDay = weekdayData.labels[bestDayIndex];
  
  const streakAchievements = [
    { days: 3, title: "Guter Start", description: "Trainiere 3 Tage in Folge", achieved: currentStreak >= 3 },
    { days: 7, title: "Erste Woche", description: "Trainiere eine ganze Woche ohne Pause", achieved: currentStreak >= 7 },
    { days: 14, title: "Zwei Wochen Serie", description: "Bleib 14 Tage am Ball", achieved: currentStreak >= 14 },
    { days: 30, title: "Monatlicher Profi", description: "Schaffe einen ganzen Monat Training", achieved: currentStreak >= 30 },
  ];

  return (
    <View className="space-y-5">
      {/* Streak Karten - iOS-Stil */}
      <View className="flex-row space-x-3">
        <StatCard 
          title="Aktuelle Streak" 
          value={currentStreak}
          valueSuffix=" Tage" 
          subtitle="aktuelle Serie"
          icon={<Flame size={18} color="#EF4444" />}
          variant="destructive"
          compact
        />
        <StatCard 
          title="Längste Streak" 
          value={longestStreak.days}
          valueSuffix=" Tage" 
          subtitle="dein Rekord"
          icon={<Award size={18} color="#F59E0B" />}
          variant="warning"
          compact
        />
      </View>
      
      {/* Informationen zur Konstanz - iOS-Stil */}
      <Card 
        className="p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <View className="flex-row items-center mb-3">
          <View 
            className="p-1.5 rounded-full mr-2"
            style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
          >
            <TrendingUp size={18} color={fitnessLightColors.secondary.default} />
          </View>
          <Text 
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            Trainingsgewohnheiten
          </Text>
        </View>
        
        <View 
          className="rounded-xl p-4 mb-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
        >
          <View className="flex-row justify-between items-center mb-1">
            <Text 
              className="font-medium text-sm"
              style={{ color: fitnessLightColors.text.primary }}
            >
              Wöchentliches Training
            </Text>
            <View 
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: 'rgba(0, 136, 255, 0.08)' }}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: fitnessLightColors.secondary.default }}
              >
                {weeklyAverage.current}
              </Text>
            </View>
          </View>
          <Text 
            className="text-xs"
            style={{ color: fitnessLightColors.text.tertiary }}
          >
            Du trainierst durchschnittlich {weeklyAverage.current} mal pro Woche.
            {weeklyAverage.trend !== 0 && (
              <Text
                style={{ 
                  color: weeklyAverage.trend > 0 
                    ? fitnessLightColors.tertiary.default 
                    : '#EF4444' 
                }}
              >
                {" "}{weeklyAverage.trend > 0 ? "+" : ""}{weeklyAverage.trend}% im Vergleich zum Vormonat.
              </Text>
            )}
          </Text>
        </View>
        
        {/* Beliebte Trainingstage - iOS-Stil */}
        <Text 
          className="font-medium text-sm mb-2"
          style={{ color: fitnessLightColors.text.secondary }}
        >
          Beliebte Trainingstage
        </Text>
        
        <Animated.View 
          entering={FadeIn.duration(400)}
          className="flex-row my-3"
        >
          {weekdayData.labels.map((day, index) => {
            const count = weekdayData.counts[index];
            const maxCount = Math.max(...weekdayData.counts);
            const height = maxCount > 0 ? Math.max(20, Math.round((count / maxCount) * 60)) : 20;
            const isBestDay = index === bestDayIndex && count > 0;
            
            return (
              <View key={index} className="flex-1 items-center">
                <View className="flex-1 justify-end h-16">
                  <View 
                    style={{ 
                      height,
                      width: 6,
                      borderRadius: 3,
                      backgroundColor: isBestDay 
                        ? fitnessLightColors.secondary.default 
                        : 'rgba(0, 136, 255, 0.2)'
                    }} 
                  />
                </View>
                <Text 
                  className="mt-1 text-xs"
                  style={{ 
                    color: isBestDay 
                      ? fitnessLightColors.text.primary 
                      : fitnessLightColors.text.tertiary,
                    fontWeight: isBestDay ? '500' : 'normal'
                  }}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </Animated.View>
        
        <Separator className="my-4" />
        
        {/* Beliebtester Tag Badge - iOS-Stil */}
        {Math.max(...weekdayData.counts) > 0 && (
          <View 
            className="flex-row items-center p-3 rounded-xl"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          >
            <Calendar size={16} color={fitnessLightColors.secondary.default} className="mr-2" />
            <Text 
              className="text-sm"
              style={{ color: fitnessLightColors.text.secondary }}
            >
              Dein intensivster Trainingstag ist <Text className="font-medium">{bestDay}</Text>
            </Text>
          </View>
        )}
      </Card>
      
      {/* Streak Achievements - iOS-Stil */}
      <Card 
        className="p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <View className="flex-row items-center mb-3">
          <View 
            className="p-1.5 rounded-full mr-2"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
          >
            <Award size={18} color="#F59E0B" />
          </View>
          <Text 
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            Streak Achievements
          </Text>
        </View>
        
        {streakAchievements.map((achievement, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Separator className="my-3" />}
            <View className="flex-row items-center">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ 
                  backgroundColor: achievement.achieved 
                    ? 'rgba(239, 68, 68, 0.08)' 
                    : 'rgba(0, 0, 0, 0.03)'
                }}
              >
                {achievement.achieved ? (
                  <Flame size={18} color="#EF4444" />
                ) : (
                  <Activity size={18} color={fitnessLightColors.text.tertiary} />
                )}
              </View>
              <View className="flex-1">
                <Text 
                  className="font-medium"
                  style={{ 
                    color: achievement.achieved 
                      ? fitnessLightColors.text.primary 
                      : fitnessLightColors.text.tertiary
                  }}
                >
                  {achievement.title}
                </Text>
                <Text 
                  className="text-xs"
                  style={{ color: fitnessLightColors.text.tertiary }}
                >
                  {achievement.description}
                </Text>
              </View>
              <Text 
                className="text-sm font-medium mr-1"
                style={{ 
                  color: achievement.achieved 
                    ? "#EF4444"
                    : fitnessLightColors.text.tertiary
                }}
              >
                {achievement.days}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </Card>
    </View>
  );
};