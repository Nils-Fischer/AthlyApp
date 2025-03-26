"use client"

import React, { useState, useEffect } from "react"
import { View, TouchableOpacity, ScrollView, useWindowDimensions, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { useWorkoutStats } from "~/hooks/use-workout-stats"
import { MonthlyHeatmap } from "~/components/stats/workout-heatmap"
import { StatCard } from "~/components/stats/stat-card"
import { H2, P, Small } from "~/components/ui/typography"
import { Card } from "~/components/ui/card"
import { Text } from "~/components/ui/text"
import { Separator } from "~/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import {
  Activity,
  BarChart2,
  Flame,
  Trophy,
  TrendingUp,
  Clock,
  Dumbbell,
  Calendar,
  Heart,
  Zap,
  ChevronRight
} from "~/lib/icons/Icons"
import { fitnessLightColors } from "~/lib/theme/lightColors"

export default function StatsScreen() {
  const stats = useWorkoutStats();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollY = new Animated.Value(0);
  const { width } = useWindowDimensions();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Header-Animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  
  // Statistik-Daten
  const currentStreak = stats.getCurrentStreak();
  const longestStreak = stats.getLongestStreak();
  const totalWorkouts = stats.monthlyWorkouts.current;
  const monthlyProgress = stats.monthlyWorkouts.trend;
  const avgSessionDuration = stats.averageSessionDuration.current;
  const weeklyWorkouts = stats.weeklyWorkoutsAverage.current;
  
  // Motivierender Tagesspruch basierend auf Streak
  const getMotivationalMessage = () => {
    if (currentStreak >= 10) return "Beeindruckend! Deine Konstanz zahlt sich aus.";
    if (currentStreak >= 5) return "Tolle Serie! Bleib weiter dran.";
    if (currentStreak >= 3) return "Guter Start! Dein Körper dankt es dir.";
    if (currentStreak >= 1) return "Jeder Tag zählt. Mach weiter so!";
    return "Heute ist ein guter Tag, um zu trainieren!";
  };
  
  // Handle Datumsauswahl mit Modal-Öffnung
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const workout = stats.getWorkoutByDate(date);
    if (workout) {
      setDialogOpen(true);
    }
  };
  
  // Hilfsfunktion zum Extrahieren der Anzahl der Sätze
  const getSetsDisplay = (sets: any): string => {
    if (typeof sets === 'number') {
      return String(sets);
    }
    // Falls sets ein Array ist, nutze die Länge
    if (Array.isArray(sets)) {
      return String(sets.length);
    }
    return "1"; // Fallback
  };
  
  // Funktion zur Anzeige der Dauer
  const formatDuration = (duration: any): string => {
    let durationNum = 0;
    
    if (typeof duration === 'number') {
      durationNum = duration;
    } else if (duration) {
      // Versuche zu konvertieren
      const parsed = Number(duration);
      if (!isNaN(parsed)) {
        durationNum = parsed;
      }
    }
    
    const hours = Math.floor(durationNum / 60);
    const minutes = durationNum % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Ausgewähltes Workout
  const selectedWorkout = stats.getWorkoutByDate(selectedDate);
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Animierter Header für Scrolling */}
      <Animated.View 
        style={{ 
          opacity: headerOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderBottomWidth: 0.5,
          borderBottomColor: 'rgba(0, 0, 0, 0.05)',
          paddingTop: 16,
          paddingBottom: 12,
          paddingHorizontal: 20
        }}
      >
        <H2>Deine Statistiken</H2>
      </Animated.View>
      
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View className="px-6 py-8">
          {/* Motivations-Karte */}
          <View>
            <Card 
              className="mb-7 p-5 rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: fitnessLightColors.primary.faded,
                borderWidth: 0,
              }}
            >
              <View className="flex-row items-center mb-2">
                <View 
                  className="p-2 rounded-full mr-3"
                  style={{ backgroundColor: 'rgba(0, 178, 255, 0.15)' }}
                >
                  <Flame size={18} color={fitnessLightColors.primary.default} />
                </View>
                <Text className="font-medium text-base" style={{ color: fitnessLightColors.primary.default }}>
                  {currentStreak > 0 ? `${currentStreak} Tage Streak!` : `Fitness-Tracker`}
                </Text>
              </View>
              <Text className="text-sm" style={{ color: fitnessLightColors.text.secondary }}>
                {getMotivationalMessage()}
              </Text>
            </Card>
          </View>
          
          {/* Highlights Karten */}
          <View className="mb-8">
            <View>
              <View className="flex-row items-center mb-4">
                <Zap size={16} color={fitnessLightColors.text.secondary} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: fitnessLightColors.text.secondary }}
                >
                  TRAININGS-HIGHLIGHTS
                </Text>
              </View>
            </View>
            
            <View>
              <View className="flex-row mb-3">
                <StatCard
                  icon={<Flame size={18} color={fitnessLightColors.primary.default} />}
                  title="Aktuelle Serie"
                  value={currentStreak}
                  subtitle="Aufeinanderfolgende Tage"
                  variant="primary"
                  trend={typeof longestStreak !== 'object' ? 0 : Math.round((currentStreak / Math.max(longestStreak.days, 1)) * 100) - 100}
                />
                
                <View className="w-4" />
                
                <StatCard
                  icon={<Trophy size={18} color={fitnessLightColors.secondary.default} />}
                  title="Längste Serie"
                  value={typeof longestStreak !== 'object' ? 0 : longestStreak.days}
                  subtitle="Tage in Folge"
                  variant="secondary"
                  compact
                />
              </View>
            </View>
            
            <View>
              <View className="flex-row mb-3">
                <StatCard
                  icon={<Clock size={18} color={fitnessLightColors.accent.default} />}
                  title="Trainingszeit"
                  value={avgSessionDuration}
                  valueSuffix=" min"
                  subtitle="Ø pro Training"
                  variant="warning"
                  trend={stats.averageSessionDuration.trend}
                  compact
                />
                
                <View className="w-4" />
                
                <StatCard
                  icon={<Activity size={18} color={fitnessLightColors.tertiary.default} />}
                  title="Wöchentlich"
                  value={weeklyWorkouts}
                  subtitle="Trainings im Schnitt"
                  variant="success"
                  trend={stats.weeklyWorkoutsAverage.trend}
                  compact
                />
              </View>
            </View>
            
            <View>
              <StatCard
                icon={<Activity size={20} color={fitnessLightColors.secondary.default} />}
                title="Aktivitätsübersicht"
                value={totalWorkouts}
                subtitle={`Trainingseinheiten ${monthlyProgress > 0 ? `(+${monthlyProgress}% diesen Monat)` : ''}`}
                variant="secondary"
                trend={monthlyProgress}
              />
            </View>
          </View>
          
          {/* Workout-Kalender-Heatmap */}
          <View>
            <View className="flex-row items-center mb-4">
              <Calendar size={16} color={fitnessLightColors.text.secondary} />
              <Text 
                className="ml-2 font-medium"
                style={{ color: fitnessLightColors.text.secondary }}
              >
                TRAININGSKALENDER
              </Text>
            </View>
            
            <View>
              <MonthlyHeatmap onDayPress={handleDateSelect} months={1} />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Workout Details Dialog - iOS-Style */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="rounded-3xl max-w-md mx-auto"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            borderWidth: 1,
            borderColor: 'rgba(230, 230, 230, 0.7)',
            shadowColor: fitnessLightColors.primary.default,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <DialogHeader className="mb-2">
            <DialogTitle className="text-center pb-2">
              {selectedDate && (
                <View>
                  <Text 
                    className="text-lg font-semibold"
                    style={{ color: fitnessLightColors.text.primary }}
                  >
                    {format(selectedDate, "EEEE", { locale: de })}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {format(selectedDate, "dd. MMMM yyyy", { locale: de })}
                  </Text>
                </View>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout ? (
            <View className="mt-1">
              {/* Workout Title with Icon */}
              <Card 
                className="p-4 rounded-xl mb-4"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderColor: 'rgba(230, 230, 230, 0.7)',
                  shadowColor: fitnessLightColors.primary.faded,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 2
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="p-2.5 rounded-full mr-3"
                      style={{ 
                        backgroundColor: 'rgba(0, 136, 255, 0.08)',
                        shadowColor: fitnessLightColors.primary.default,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 4
                      }}
                    >
                      <Dumbbell size={18} color={fitnessLightColors.primary.default} />
                    </View>
                    <View className="flex-1">
                      <Text 
                        className="font-medium text-base"
                        style={{ color: fitnessLightColors.text.primary }}
                      >
                        {selectedWorkout.workoutName}
                      </Text>
                      <Badge 
                        variant="outline" 
                        className="mt-1 py-0.5 h-6 px-2 self-start"
                        style={{ 
                          backgroundColor: 'rgba(245, 247, 250, 1)',
                          borderColor: 'rgba(230, 230, 235, 1)'
                        }}
                      >
                        <View className="flex-row items-center">
                          <Clock size={12} color={fitnessLightColors.text.tertiary} className="mr-1" />
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.text.secondary }}
                          >
                            {formatDuration(selectedWorkout.duration)}
                          </Text>
                        </View>
                      </Badge>
                    </View>
                  </View>
                </View>
              </Card>
              
              {/* Übungen Liste */}
              <View className="flex-row items-center mb-3">
                <Text 
                  className="font-medium text-sm"
                  style={{ color: fitnessLightColors.text.secondary }}
                >
                  Übungen
                </Text>
                <View className="h-[1px] flex-1 ml-3" style={{ backgroundColor: 'rgba(230, 230, 235, 0.6)' }} />
              </View>
              
              <Card 
                className="rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderColor: 'rgba(230, 230, 230, 0.7)',
                  shadowColor: fitnessLightColors.primary.faded,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 1
                }}
              >
                {selectedWorkout.entries.map((entry, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Separator style={{ backgroundColor: 'rgba(230, 230, 235, 0.6)' }} />}
                    <View className="p-3.5">
                      <View className="flex-row items-center">
                        <View 
                          className="w-7 h-7 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
                        >
                          <Text className="text-xs font-medium" style={{ color: fitnessLightColors.primary.default }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text 
                          className="font-medium text-base flex-1"
                          style={{ color: fitnessLightColors.text.primary }}
                        >
                          {entry.exerciseName}
                        </Text>
                      </View>
                      <View className="flex-row mt-2 ml-10">
                        <Badge 
                          className="mr-2 py-0.5 px-2 h-6"
                          style={{ 
                            backgroundColor: 'rgba(0, 136, 255, 0.08)',
                            borderColor: 'transparent'
                          }}
                        >
                          <Text 
                            className="text-xs font-medium"
                            style={{ color: fitnessLightColors.primary.default }}
                          >
                            {getSetsDisplay(entry.sets)}× Sätze
                          </Text>
                        </Badge>
                        <Badge 
                          className="mr-2 py-0.5 px-2 h-6"
                          style={{ 
                            backgroundColor: 'rgba(245, 247, 250, 1)',
                            borderColor: 'rgba(230, 230, 235, 0.8)'
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.text.secondary }}
                          >
                            {entry.reps || 0} Wdh.
                          </Text>
                        </Badge>
                        <Badge 
                          className="py-0.5 px-2 h-6"
                          style={{ 
                            backgroundColor: 'rgba(245, 247, 250, 1)',
                            borderColor: 'rgba(230, 230, 235, 0.8)'
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.text.secondary }}
                          >
                            {entry.weight || 0} kg
                          </Text>
                        </Badge>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </Card>
            </View>
          ) : (
            <View 
              className="py-10 items-center rounded-xl my-4"
              style={{ 
                backgroundColor: 'rgba(245, 247, 250, 1)',
                borderWidth: 1,
                borderColor: 'rgba(230, 230, 235, 0.7)',
              }}
            >
              <View className="bg-white p-4 rounded-full mb-3 shadow-sm"
                style={{
                  shadowColor: fitnessLightColors.primary.faded,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1
                }}>
                <Calendar 
                  size={28} 
                  color={fitnessLightColors.primary.default}
                />
              </View>
              <Text 
                className="text-center font-medium mb-1"
                style={{ color: fitnessLightColors.text.secondary }}
              >
                Kein Training an diesem Tag
              </Text>
              <Text
                className="text-center text-xs px-6"
                style={{ color: fitnessLightColors.text.tertiary }}
              >
                Plane dein nächstes Training, um deinen Fortschritt zu verfolgen.
              </Text>
            </View>
          )}
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}