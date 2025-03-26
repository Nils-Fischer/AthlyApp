import React, { useMemo } from "react";
import { View, ScrollView } from "react-native";
import { H4, P, Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { StatCard } from "~/components/stats/stat-card";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { Separator } from "~/components/ui/separator";
import { Dumbbell, Users, Zap } from "~/lib/icons/Icons";
import { MoveUp, Trophy } from "lucide-react-native";
import { Badge } from "~/components/ui/badge";
import { fitnessLightColors } from "~/lib/theme/lightColors";

// Definiere Übungs-Typen
interface Exercise {
  name: string;
  sets: number;
  volume: number;
  category?: string;
  count?: number;
}

// Kategorienamen auf Deutsch
const categoryNames: Record<string, string> = {
  "chest": "Brust",
  "back": "Rücken",
  "legs": "Beine",
  "shoulders": "Schultern",
  "arms": "Arme",
  "core": "Rumpf",
  "other": "Sonstige"
};

export const ExercisesTab: React.FC = () => {
  const workoutStats = useWorkoutStats();
  // Wir nutzen die getTopExercises-Methode aus workoutStats
  const topExercises: Exercise[] = workoutStats.getTopExercises(10);
  
  // Berechne Gesamtanzahl der Sätze aus den Top-Übungen
  const totalSets = useMemo(() => {
    return topExercises.reduce((sum: number, exercise: Exercise) => sum + exercise.sets, 0);
  }, [topExercises]);
  
  // Gruppiere Übungen nach Kategorien
  const exercisesByCategory = useMemo(() => {
    const categories: Record<string, { count: number, volume: number }> = {
      "chest": { count: 0, volume: 0 },
      "back": { count: 0, volume: 0 },
      "legs": { count: 0, volume: 0 },
      "shoulders": { count: 0, volume: 0 },
      "arms": { count: 0, volume: 0 },
      "core": { count: 0, volume: 0 },
      "other": { count: 0, volume: 0 }
    };
    
    topExercises.forEach((exercise: Exercise) => {
      const category = exercise.category || "other";
      if (categories[category]) {
        categories[category].count += 1;
        categories[category].volume += exercise.volume || 0;
      } else {
        categories.other.count += 1;
        categories.other.volume += exercise.volume || 0;
      }
    });
    
    return categories;
  }, [topExercises]);
  
  // Finde die am häufigsten trainierte Kategorie basierend auf Volumen
  const mostFrequentCategory = useMemo(() => {
    let maxCategory = "other";
    let maxVolume = 0;
    
    Object.entries(exercisesByCategory).forEach(([category, data]) => {
      if (data.volume > maxVolume) {
        maxVolume = data.volume;
        maxCategory = category;
      }
    });
    
    return {
      name: categoryNames[maxCategory] || maxCategory,
      count: exercisesByCategory[maxCategory]?.count || 0
    };
  }, [exercisesByCategory]);

  return (
    <View className="space-y-3">
      {/* Übungssummary Karte */}
      <Card 
        className="p-3 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <View className="flex-row items-center mb-2">
          <View 
            className="p-1.5 rounded-full mr-2"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
          >
            <Trophy size={16} color="#F59E0B" />
          </View>
          <Text 
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            Übungszusammenfassung
          </Text>
        </View>

        <View className="flex-row justify-between my-1">
          <View className="flex-1">
            <View 
              className="p-2 rounded-lg mb-1"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
            >
              <View className="flex-row items-center mb-1">
                <Dumbbell size={14} color={fitnessLightColors.primary.default} className="mr-1.5" />
                <Text 
                  className="text-xs font-medium"
                  style={{ color: fitnessLightColors.text.secondary }}
                >
                  Anzahl Übungen
                </Text>
              </View>
              <Text 
                className="text-lg font-medium"
                style={{ color: fitnessLightColors.text.primary }}
              >
                {topExercises.length}
              </Text>
            </View>
          </View>
          
          <View style={{ width: 10 }} />
          
          <View className="flex-1">
            <View 
              className="p-2 rounded-lg mb-1"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
            >
              <View className="flex-row items-center mb-1">
                <Zap size={14} color={fitnessLightColors.tertiary.default} className="mr-1.5" />
                <Text 
                  className="text-xs font-medium"
                  style={{ color: fitnessLightColors.text.secondary }}
                >
                  Gesamtsätze
                </Text>
              </View>
              <Text 
                className="text-lg font-medium"
                style={{ color: fitnessLightColors.text.primary }}
              >
                {totalSets}
              </Text>
            </View>
          </View>
        </View>

        {/* Beliebteste Kategorie */}
        {mostFrequentCategory.count > 0 && (
          <View 
            className="p-2.5 rounded-lg mt-2"
            style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Users size={14} color={fitnessLightColors.secondary.default} className="mr-1.5" />
                <Text 
                  className="text-xs font-medium"
                  style={{ color: fitnessLightColors.text.secondary }}
                >
                  Beliebteste Kategorie
                </Text>
              </View>
              <Badge 
                variant="secondary" 
                className="rounded-full py-0.5 px-2"
              >
                <Text className="text-xs font-medium text-white">
                  {mostFrequentCategory.count} Übungen
                </Text>
              </Badge>
            </View>
            <Text 
              className="text-base font-medium mt-1"
              style={{ color: fitnessLightColors.secondary.default }}
            >
              {mostFrequentCategory.name}
            </Text>
          </View>
        )}
      </Card>

      {/* Top Übungen */}
      <Card 
        className="p-3 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <View className="flex-row items-center mb-2">
          <View 
            className="p-1.5 rounded-full mr-2"
            style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
          >
            <MoveUp size={16} color={fitnessLightColors.secondary.default} />
          </View>
          <Text 
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            Top Übungen
          </Text>
        </View>

        {topExercises.length > 0 ? (
          <View className="mt-1">
            {topExercises.map((exercise: Exercise, index: number) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="my-1.5" />}
                <View className="flex-row justify-between items-center py-1.5">
                  <View className="flex-1 flex-row items-center">
                    <View 
                      className="w-6 h-6 rounded-full items-center justify-center mr-2"
                      style={{ 
                        backgroundColor: index < 3 
                          ? 'rgba(0, 136, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.03)' 
                      }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ 
                          color: index < 3 
                            ? fitnessLightColors.secondary.default 
                            : fitnessLightColors.text.tertiary 
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text 
                        className="font-medium text-sm"
                        style={{ color: fitnessLightColors.text.primary }}
                      >
                        {exercise.name}
                      </Text>
                      <Text 
                        className="text-xs"
                        style={{ color: fitnessLightColors.text.tertiary }}
                      >
                        {categoryNames[exercise.category || "other"] || exercise.category || "Sonstige"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Badge 
                      variant="outline" 
                      className="rounded-full py-0 px-2 mr-1.5"
                    >
                      <Text 
                        className="text-xs"
                        style={{ color: fitnessLightColors.text.tertiary }}
                      >
                        {exercise.sets} Sätze
                      </Text>
                    </Badge>
                    {index < 3 && (
                      <View 
                        className="w-5 h-5 rounded-full items-center justify-center"
                        style={{ backgroundColor: 'rgba(0, 136, 255, 0.08)' }}
                      >
                        <Trophy 
                          size={12} 
                          color={
                            index === 0 ? '#F59E0B' : 
                            index === 1 ? '#94A3B8' : 
                            '#D97706'
                          } 
                        />
                      </View>
                    )}
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View 
            className="p-3 rounded-lg items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          >
            <Text 
              className="text-sm"
              style={{ color: fitnessLightColors.text.tertiary }}
            >
              Noch keine Übungsdaten verfügbar
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
};