import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { H3, H4, P, Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { StatCard } from "~/components/stats/stat-card";
import { MonthlyHeatmap } from "~/components/stats/workout-heatmap";
import { Activity, Clock, BarChart, Weight, Dumbbell, Calendar, ChevronRight, Flame } from "~/lib/icons/Icons";
import { Award } from "lucide-react-native";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { fitnessLightColors } from "~/lib/theme/lightColors";
import Animated, { FadeIn } from "react-native-reanimated";

export const OverviewTab: React.FC = () => {
  const workoutStats = useWorkoutStats();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Hole die Statistikdaten aus dem Hook
  const { monthlyWorkouts, averageSessionDuration, weeklyWorkoutsAverage, totalVolume } = workoutStats;
  
  // Top Übungen
  const topExercises = workoutStats.getTopExercises(3);
  const currentStreak = workoutStats.getCurrentStreak();
  
  // Funktion zum Anzeigen der Workout-Details
  const handleDayPress = (date: Date) => {
    setSelectedDay(date);
    const workout = workoutStats.getWorkoutByDate(date);
    if (workout) {
      setDialogOpen(true);
    }
  };
  
  // Funktion zum direkten Öffnen der Workout-Details
  const openWorkoutDetails = (date: Date) => {
    setSelectedDay(date);
    setDialogOpen(true);
  };
  
  // Ausgewähltes Workout
  const selectedWorkout = selectedDay ? workoutStats.getWorkoutByDate(selectedDay) : null;
  
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
  
  return (
    <View className="space-y-4">
      {/* iOS-Style Activity Summary Card */}
      <Card 
        className="p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <View className="flex-row items-center mb-3">
          <View 
            className="p-1.5 rounded-full mr-2"
            style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
          >
            <Activity size={16} color={fitnessLightColors.secondary.default} />
          </View>
          <Text className="font-medium text-base" style={{ color: fitnessLightColors.text.primary }}>
            Aktivitätsübersicht
          </Text>
        </View>
        
        <View className="flex-row space-x-3">
          <StatCard 
            title="Trainings" 
            value={monthlyWorkouts.current}
            subtitle="Diesen Monat" 
            trend={monthlyWorkouts.trend}
            icon={<Activity size={16} color={fitnessLightColors.secondary.default} />}
            variant="primary"
            compact
          />
          <StatCard 
            title="Ø Dauer" 
            value={`${averageSessionDuration.current} min`}
            subtitle="Pro Training" 
            trend={averageSessionDuration.trend}
            icon={<Clock size={16} color={fitnessLightColors.secondary.default} />}
            variant="secondary"
            compact
          />
        </View>
        
        <View className="flex-row space-x-3 mt-3">
          <StatCard 
            title="Wöchentlich" 
            value={weeklyWorkoutsAverage.current}
            subtitle="Trainings im Schnitt" 
            trend={weeklyWorkoutsAverage.trend}
            icon={<BarChart size={16} color={fitnessLightColors.tertiary.default} />}
            variant="success"
            compact
          />
          <StatCard 
            title="Volumen" 
            value={`${totalVolume.current / 1000 > 1 
              ? (totalVolume.current / 1000).toFixed(1) + " t" 
              : totalVolume.current + " kg"}`}
            subtitle="Letzten 30 Tage" 
            trend={totalVolume.trend}
            icon={<Weight size={16} color="#F59E0B" />}
            variant="warning"
            compact
          />
        </View>
      </Card>
      
      {/* Streak Card - neuer iOS-Stil */}
      {currentStreak > 0 && (
        <Animated.View entering={FadeIn.delay(100)}>
          <Card 
            className="p-3 rounded-xl shadow-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View 
                  className="p-1.5 rounded-full mr-2"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                >
                  <Flame size={16} color="#EF4444" />
                </View>
                <View>
                  <Text 
                    className="font-medium text-sm"
                    style={{ color: fitnessLightColors.text.primary }}
                  >
                    Aktuelle Streak
                  </Text>
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Halte deine Serie aufrecht
                  </Text>
                </View>
              </View>
              
              <Badge 
                className="font-medium px-2 py-1"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  borderColor: 'transparent'
                }}
              >
                <View className="flex-row items-center">
                  <Flame size={12} color="#EF4444" className="mr-1" />
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: "#EF4444" }}
                  >
                    {currentStreak} Tage
                  </Text>
                </View>
              </Badge>
            </View>
          </Card>
        </Animated.View>
      )}
      
      {/* iOS-Style Heatmap */}
      <MonthlyHeatmap 
        onDayPress={handleDayPress} 
        months={1} 
        openWorkoutDetails={openWorkoutDetails}
      />
      
      {/* Top Übungen Card - modernisiertes iOS-Design */}
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
              <Dumbbell size={16} color={fitnessLightColors.secondary.default} />
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
            className="text-xs"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              borderColor: fitnessLightColors.ui.border
            }}
          >
            <Text 
              className="text-xs"
              style={{ color: fitnessLightColors.text.tertiary }}
            >
              {topExercises.length}
            </Text>
          </Badge>
        </View>
        
        {topExercises.length > 0 ? (
          <View>
            {topExercises.map((exercise, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="my-2" />}
                <TouchableOpacity className="flex-row items-center py-1.5">
                  {/* Rank Circle - iOS-Style */}
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center mr-2.5"
                    style={{ 
                      backgroundColor: index === 0 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : index === 1 
                          ? 'rgba(107, 114, 128, 0.1)' 
                          : 'rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <Text 
                      className="text-xs font-medium"
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
                      className="font-medium text-sm"
                      style={{ color: fitnessLightColors.text.primary }}
                    >
                      {exercise.name}
                    </Text>
                    <View className="flex-row mt-0.5 items-center">
                      <Badge 
                        className="mr-2 py-0 px-1.5 h-5"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          borderColor: 'transparent'
                        }}
                      >
                        <Text 
                          className="text-xs"
                          style={{ color: fitnessLightColors.text.tertiary }}
                        >
                          {exercise.sets}×
                        </Text>
                      </Badge>
                      <Text 
                        className="text-xs"
                        style={{ color: fitnessLightColors.text.tertiary }}
                      >
                        {(exercise.volume / 1000).toFixed(1)}t
                      </Text>
                    </View>
                  </View>
                  
                  {/* Arrow */}
                  <ChevronRight size={14} color={fitnessLightColors.text.tertiary} />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View 
            className="py-6 items-center rounded-lg"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          >
            <Dumbbell 
              size={24} 
              color={fitnessLightColors.text.tertiary}
              className="mb-2" 
            />
            <Text 
              className="text-center text-sm"
              style={{ color: fitnessLightColors.text.tertiary }}
            >
              Noch keine Trainingsübungen
            </Text>
          </View>
        )}
      </Card>
      
      {/* Workout Details Dialog - iOS-Style */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="rounded-2xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedDay && (
                <Text 
                  className="text-base font-semibold"
                  style={{ color: fitnessLightColors.text.primary }}
                >
                  {format(selectedDay, "EEEE, dd. MMMM", { locale: de })}
                </Text>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout ? (
            <View className="mt-2">
              {/* Workout Title with Icon */}
              <Card 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderWidth: 0.5,
                  borderColor: fitnessLightColors.ui.border
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View 
                      className="p-1.5 rounded-full mr-2"
                      style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
                    >
                      <Dumbbell size={16} color={fitnessLightColors.secondary.default} />
                    </View>
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: fitnessLightColors.text.primary }}
                    >
                      {selectedWorkout.workoutName}
                    </Text>
                  </View>
                  
                  <Badge 
                    variant="outline" 
                    className="text-xs h-6 px-2"
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderColor: 'transparent'
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
              </Card>
              
              {/* Übungen Liste */}
              <Text 
                className="font-medium text-sm ml-1 mt-3 mb-2"
                style={{ color: fitnessLightColors.text.secondary }}
              >
                Übungen
              </Text>
              
              <Card 
                className="rounded-lg overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderWidth: 0.5,
                  borderColor: fitnessLightColors.ui.border
                }}
              >
                {selectedWorkout.entries.map((entry, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Separator />}
                    <View className="p-2.5">
                      <Text 
                        className="font-medium text-sm"
                        style={{ color: fitnessLightColors.text.primary }}
                      >
                        {entry.exerciseName}
                      </Text>
                      <View className="flex-row mt-1.5">
                        <Badge 
                          className="mr-1.5 py-0 px-1.5 h-5"
                          style={{ 
                            backgroundColor: 'rgba(0, 136, 255, 0.1)',
                            borderColor: 'transparent'
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.secondary.default }}
                          >
                            {getSetsDisplay(entry.sets)}×
                          </Text>
                        </Badge>
                        <Badge 
                          className="mr-1.5 py-0 px-1.5 h-5"
                          style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderColor: 'transparent'
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.text.tertiary }}
                          >
                            {entry.reps || 0} Wdh.
                          </Text>
                        </Badge>
                        <Badge 
                          className="py-0 px-1.5 h-5"
                          style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderColor: 'transparent'
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: fitnessLightColors.text.tertiary }}
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
              className="py-10 items-center rounded-lg my-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
            >
              <Calendar 
                size={28} 
                color={fitnessLightColors.text.tertiary}
                className="mb-2" 
              />
              <Text 
                className="text-center"
                style={{ color: fitnessLightColors.text.tertiary }}
              >
                Kein Training an diesem Tag
              </Text>
            </View>
          )}
        </DialogContent>
      </Dialog>
    </View>
  );
};