import React from "react";
import { View, TouchableOpacity } from "react-native";
import { H4, P, Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { Dumbbell, BarChart2, TrendingUp, ChevronRight } from "~/lib/icons/Icons";
import { fitnessLightColors } from "~/lib/theme/lightColors";
import Animated, { FadeIn } from "react-native-reanimated";

export const ExercisesTab: React.FC = () => {
  const workoutStats = useWorkoutStats();
  const topExercises = workoutStats.getTopExercises(10);
  
  // Berechne Gesamt-Sätze und Gesamt-Volumen
  const totalSets = topExercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const totalVolume = topExercises.reduce((sum, exercise) => sum + exercise.volume, 0);
  
  // Gruppiere Übungen in verschiedene Kategorien (hier als Beispiel)
  const exerciseCategories = {
    chest: topExercises.filter(ex => ex.name.toLowerCase().includes("brust") || ex.name.toLowerCase().includes("bankdrücken")),
    back: topExercises.filter(ex => ex.name.toLowerCase().includes("rücken") || ex.name.toLowerCase().includes("ziehen")),
    legs: topExercises.filter(ex => 
      ex.name.toLowerCase().includes("bein") || 
      ex.name.toLowerCase().includes("knie") || 
      ex.name.toLowerCase().includes("squat")
    ),
    shoulders: topExercises.filter(ex => ex.name.toLowerCase().includes("schulter")),
    arms: topExercises.filter(ex => 
      ex.name.toLowerCase().includes("arm") || 
      ex.name.toLowerCase().includes("bizeps") || 
      ex.name.toLowerCase().includes("trizeps")
    ),
    core: topExercises.filter(ex => 
      ex.name.toLowerCase().includes("bauch") || 
      ex.name.toLowerCase().includes("core") || 
      ex.name.toLowerCase().includes("abs")
    ),
  };
  
  // Finde die am häufigsten trainierte Kategorie
  const topCategory = Object.entries(exerciseCategories)
    .map(([key, exercises]) => ({ 
      name: key, 
      count: exercises.length,
      volume: exercises.reduce((sum, ex) => sum + ex.volume, 0)
    }))
    .sort((a, b) => b.volume - a.volume)[0];

  return (
    <View className="space-y-5">
      {/* Übungszusammenfassung - iOS-Stil */}
      <Animated.View entering={FadeIn.delay(100)}>
        <Card 
          className="p-4 rounded-xl shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        >
          <View className="flex-row items-center mb-3">
            <View 
              className="p-1.5 rounded-full mr-2"
              style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
            >
              <Dumbbell size={18} color={fitnessLightColors.secondary.default} />
            </View>
            <Text 
              className="font-medium"
              style={{ color: fitnessLightColors.text.primary }}
            >
              Übungsstatistiken
            </Text>
          </View>
          
          {topExercises.length > 0 ? (
            <>
              <View 
                className="flex-row justify-between mb-4 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: fitnessLightColors.text.primary }}
                  >
                    {topExercises.length}
                  </Text>
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Übungen
                  </Text>
                </View>
                
                <View className="w-px h-10" style={{ backgroundColor: fitnessLightColors.ui.divider }} />
                
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: fitnessLightColors.text.primary }}
                  >
                    {totalSets}
                  </Text>
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Sätze
                  </Text>
                </View>
                
                <View className="w-px h-10" style={{ backgroundColor: fitnessLightColors.ui.divider }} />
                
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: fitnessLightColors.text.primary }}
                  >
                    {(totalVolume / 1000).toFixed(1)}
                  </Text>
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Tonnen
                  </Text>
                </View>
              </View>
              
              {topCategory && (
                <View 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
                >
                  <Text 
                    className="text-xs mb-1"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Häufigste Kategorie
                  </Text>
                  <Text 
                    className="font-medium capitalize"
                    style={{ color: fitnessLightColors.secondary.default }}
                  >
                    {topCategory.name}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View 
              className="py-6 items-center rounded-lg"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
            >
              <View 
                className="p-3 rounded-full mb-3"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
              >
                <Dumbbell size={20} color={fitnessLightColors.text.tertiary} />
              </View>
              <Text 
                className="text-center text-sm px-4"
                style={{ color: fitnessLightColors.text.tertiary }}
              >
                Noch keine Trainingsübungen vorhanden. Starte dein Training, um hier Statistiken zu sehen!
              </Text>
            </View>
          )}
        </Card>
      </Animated.View>
      
      {/* Top Übungen - iOS-Stil */}
      {topExercises.length > 0 && (
        <Animated.View entering={FadeIn.delay(200)}>
          <Card 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View 
                  className="p-1.5 rounded-full mr-2"
                  style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
                >
                  <BarChart2 size={18} color={fitnessLightColors.secondary.default} />
                </View>
                <Text 
                  className="font-medium"
                  style={{ color: fitnessLightColors.text.primary }}
                >
                  Top Übungen
                </Text>
              </View>
              
              <Badge 
                variant="outline"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderColor: 'transparent'
                }}
              >
                <Text 
                  className="text-xs"
                  style={{ color: fitnessLightColors.text.tertiary }}
                >
                  nach Volumen
                </Text>
              </Badge>
            </View>
            
            {topExercises.slice(0, 5).map((exercise, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="my-2.5" />}
                <TouchableOpacity className="flex-row items-center py-1.5">
                  {/* Rank */}
                  <View 
                    className="w-7 h-7 rounded-full items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: index === 0 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : index === 1 
                          ? 'rgba(107, 114, 128, 0.1)' 
                          : 'rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <Text 
                      className="font-medium text-sm"
                      style={{ 
                        color: index === 0 
                          ? '#F59E0B' 
                          : index === 1 
                            ? fitnessLightColors.text.secondary 
                            : fitnessLightColors.text.tertiary
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  
                  {/* Info */}
                  <View className="flex-1">
                    <Text 
                      className="font-medium"
                      style={{ color: fitnessLightColors.text.primary }}
                    >
                      {exercise.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View 
                        className="px-2 py-0.5 rounded-full mr-2"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                      >
                        <Text 
                          className="text-xs"
                          style={{ color: fitnessLightColors.text.tertiary }}
                        >
                          {exercise.sets} Sätze
                        </Text>
                      </View>
                      <Text 
                        className="text-xs"
                        style={{ color: fitnessLightColors.text.tertiary }}
                      >
                        {(exercise.volume / 1000).toFixed(1)}t Volumen
                      </Text>
                    </View>
                  </View>
                  
                  {/* Progress Indicator */}
                  <View className="flex-row items-center">
                    <TrendingUp size={16} color={fitnessLightColors.secondary.default} className="mr-1.5" />
                    <ChevronRight size={16} color={fitnessLightColors.text.tertiary} />
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
            
            {topExercises.length > 5 && (
              <View 
                className="mt-4 p-3 rounded-lg items-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <Text 
                  className="text-xs"
                  style={{ color: fitnessLightColors.text.tertiary }}
                >
                  +{topExercises.length - 5} weitere Übungen
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>
      )}
      
      {/* Fortschritts-Hinweis - iOS-Stil */}
      <Card 
        className="p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <TouchableOpacity className="flex-row items-center">
          <View 
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
          >
            <TrendingUp size={18} color={fitnessLightColors.secondary.default} />
          </View>
          <View className="flex-1">
            <Text 
              className="font-medium"
              style={{ color: fitnessLightColors.text.primary }}
            >
              Übungsfortschritt
            </Text>
            <Text 
              className="text-xs mt-0.5"
              style={{ color: fitnessLightColors.text.tertiary }}
            >
              Detaillierte Fortschrittsdaten findest du in der Übungsansicht.
            </Text>
          </View>
          <ChevronRight size={18} color={fitnessLightColors.text.tertiary} />
        </TouchableOpacity>
      </Card>
    </View>
  );
};