"use client"

import React, { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Modal, Alert, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { useWorkoutStats } from "~/hooks/use-workout-stats"
import { WorkoutSession } from "~/lib/types"
import {
  Activity,
  Calendar as CalendarIcon,
  BarChart2,
  Flame,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Dumbbell,
  X,
  Calendar
} from "lucide-react-native"

// Type definitions
interface BlurBackgroundProps {
  intensity?: number;
  children: React.ReactNode;
  style?: any;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend: number;
  unit?: string;
  gradient?: string[];
}

interface HeatmapCellProps {
  date: Date;
  intensity: number;
  isSelected: boolean;
  onPress: (date: Date) => void;
}

interface DayData {
  date: Date;
  count: number;
  intensity: number;
  workoutId?: string;
}

// iOS-style blur component
const BlurBackground: React.FC<BlurBackgroundProps> = ({ intensity = 80, children, style }) => {
  return (
    <BlurView intensity={intensity} tint="light" style={style}>
      {children}
    </BlurView>
  );
};

// Trend indicator
const renderTrend = (trend: number) => {
  if (trend > 0) {
    return (
      <View className="flex-row items-center">
        <TrendingUp size={13} color="#34C759" />
        <Text className="text-[#34C759] text-xs font-medium ml-0.5">{trend}%</Text>
      </View>
    );
  } else if (trend < 0) {
    const absTrend = Math.abs(trend);
    return (
      <View className="flex-row items-center">
        <TrendingUp size={13} color="#FF3B30" style={{ transform: [{ rotate: '180deg' }] }} />
        <Text className="text-[#FF3B30] text-xs font-medium ml-0.5">{absTrend}%</Text>
      </View>
    );
  }
  return <Text className="text-gray-400 text-xs">Keine Änderung</Text>;
};

// Stat card with gradient background
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, unit = "", gradient = ["#F0F5FF", "#E6F0FF"] }) => (
  <View className="rounded-2xl overflow-hidden mb-4 w-[47%]">
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-4">
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className="text-gray-700 font-medium text-xs ml-2">{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-1">
        {value}
        <Text className="text-xl">{unit}</Text>
      </Text>
      {renderTrend(trend)}
    </LinearGradient>
  </View>
);

  // Heatmap cell component
const HeatmapCell: React.FC<HeatmapCellProps> = ({ date, intensity, isSelected, onPress }) => {
  // Vereinfachter Ansatz: 0 = kein Training, 1 = ein Training, 2+ = zwei oder mehr Trainings
  const getBackgroundColor = () => {
    if (intensity === 0) return "bg-gray-100";
    if (intensity === 1) return "bg-blue-200"; // Hellblau für ein Training
    return "bg-blue-500"; // Dunkelblau für zwei oder mehr Trainings
  };

  const today = new Date();
  const isToday = isSameDay(date, today);
  
  const cellClasses = [
    'w-10 h-10 rounded-full justify-center items-center m-0.5',
    getBackgroundColor(),
    isSelected ? "border-2 border-blue-600" : "",
    isToday && intensity === 0 ? "border border-gray-300" : ""
  ].filter(Boolean).join(" ");
  
  const textClasses = [
    'text-xs font-medium',
    intensity >= 2 ? "text-white" : "text-gray-800"
  ].filter(Boolean).join(" ");
  
  const handlePress = () => {
    console.log("Zelle geklickt für Datum:", date);
    onPress(date);
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={cellClasses}
    >
      <Text className={textClasses}>
        {format(date, "d")}
      </Text>
    </TouchableOpacity>
  );
};

export default function StatsScreen() {
  // Stelle sicher, dass useWorkoutStats importiert ist
  console.log("StatsScreen wird initialisiert...");
  
  const stats = useWorkoutStats();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const scrollY = new Animated.Value(0);
  
  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Current streak and longest streak
  const currentStreak = stats.getCurrentStreak();
  const longestStreak = stats.getLongestStreak();

  // Generate calendar data for heatmap
  const calendarData = useMemo(() => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    
    // Include days from previous and next month to complete weeks
    const adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Start on Monday
    const adjustedEndDate = endOfWeek(endDate, { weekStartsOn: 1 }); // End on Sunday
    
    const data = stats.getWorkoutCalendarData(adjustedStartDate, adjustedEndDate);
    
    // Debug-Logging
    console.log("Kalenderdaten generiert:", data.length, "Tage");
    console.log("Beispiel-Tage mit Workouts:", data.filter(day => day.count > 0).length);
    
    return data;
  }, [currentMonth, stats]);

  // Group calendar data into weeks
  const calendarWeeks = useMemo(() => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    calendarData.forEach((day, index) => {
      const dayDate = parseISO(day.date);
      
      // First day or start of week (Monday)
      if (index === 0 || dayDate.getDay() === 1) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }
      
      currentWeek.push({
        ...day,
        date: dayDate,
        // Vereinfacht auf maximal 2 Trainings
        intensity: Math.min(day.count, 2)
      });
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [calendarData]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const workout = stats.getWorkoutByDate(date);
    // Debug-Log hinzufügen
    console.log("Datum ausgewählt:", date, "Workout gefunden:", workout ? "Ja" : "Nein");
    setSelectedWorkout(workout || null);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Top exercises
  const topExercises = stats.getTopExercises(3);
  
  // Testdaten für Entwicklung - ENTFERNEN FÜR PRODUKTION
  const handleTestModal = () => {
    // Testdaten für ein Workout
    const testWorkout = {
      id: "test-123",
      date: new Date(),
      duration: 45,
      entries: [
        {
          exerciseId: 1,
          exerciseName: "Bankdrücken",
          sets: 3,
          reps: 10,
          weight: 80
        },
        {
          exerciseId: 2,
          exerciseName: "Kniebeugen",
          sets: 4,
          reps: 8,
          weight: 100
        },
        {
          exerciseId: 3,
          exerciseName: "Schulterdrücken",
          sets: 3,
          reps: 12,
          weight: 40
        }
      ]
    };
    
    setSelectedWorkout(testWorkout as unknown as WorkoutSession);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={["top"]}>
      {/* Animated header */}
      <Animated.View
        style={{
          opacity: headerOpacity,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <Text className="text-2xl font-bold text-gray-800 mb-1">Dein Fortschritt</Text>
        <Text className="text-gray-500 mb-6">Verfolge deine Fitness-Reise</Text>

        {/* Statistics cards */}
        <View className="flex-row justify-between flex-wrap mb-5">
          <StatCard
            icon={<Activity size={18} color="#007AFF" />}
            title="Trainings im Monat"
            value={stats.monthlyWorkouts.current}
            trend={stats.monthlyWorkouts.trend}
            gradient={["#F0F7FF", "#E6F0FF"]}
          />
          <StatCard
            icon={<Clock size={18} color="#5856D6" />}
            title="Ø Dauer"
            value={stats.averageSessionDuration.current}
            trend={stats.averageSessionDuration.trend}
            unit=" min"
            gradient={["#F5F0FF", "#EFE6FF"]}
          />
          <StatCard
            icon={<Calendar size={18} color="#FF2D55" />}
            title="Trainings pro Woche"
            value={stats.weeklyWorkoutsAverage.current}
            trend={stats.weeklyWorkoutsAverage.trend}
            gradient={["#FFF0F5", "#FFE6EE"]}
          />
          <StatCard
            icon={<BarChart2 size={18} color="#FF9500" />}
            title="Gesamtvolumen"
            value={stats.totalVolume.current}
            trend={stats.totalVolume.trend}
            unit=" kg"
            gradient={["#FFF8F0", "#FFF2E6"]}
          />
        </View>

        {/* Streaks card */}
        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <LinearGradient colors={["#F0F9FF", "#E6F6FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5">
            <Text className="text-base font-semibold text-gray-800 mb-4">Trainings-Streaks</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <LinearGradient
                  colors={["#007AFF", "#5AC8FA"]}
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                >
                  <Flame size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text className="text-2xl font-bold text-gray-800">{currentStreak}</Text>
                <Text className="text-gray-500 text-sm">Aktueller Streak</Text>
              </View>
              <View className="items-center">
                <LinearGradient
                  colors={["#5856D6", "#AF52DE"]}
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                >
                  <Award size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text className="text-2xl font-bold text-gray-800">{longestStreak.days}</Text>
                <Text className="text-gray-500 text-sm">Bester Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Heatmap Calendar */}
        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <LinearGradient colors={["#FFFFFF", "#F9FAFC"]} className="p-5">
            {/* Month selector */}
            <View className="flex-row justify-between items-center mb-5">
              <TouchableOpacity
                onPress={goToPreviousMonth}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <ChevronLeft size={20} color="#007AFF" />
              </TouchableOpacity>
              <Text className="text-base font-semibold text-gray-800">
                {format(currentMonth, "MMMM yyyy", { locale: de })}
              </Text>
              <TouchableOpacity
                onPress={goToNextMonth}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <ChevronRight size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {/* Weekday headers */}
            <View className="flex-row justify-around mb-2">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                <Text key={day} className="text-xs text-gray-500 w-10 text-center">
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View className="mb-4">
              {calendarWeeks.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} className="flex-row justify-around">
                  {week.map((day) => (
                    <HeatmapCell
                      key={day.date.toISOString()}
                      date={day.date}
                      intensity={day.intensity}
                      isSelected={selectedDate && isSameDay(day.date, selectedDate)}
                      onPress={handleDateSelect}
                    />
                  ))}
                  
                  {/* Fill remaining cells if week is not complete */}
                  {Array.from({ length: 7 - week.length }).map((_, i) => (
                    <View key={`empty-${i}`} className="w-10 h-10 m-0.5" />
                  ))}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View className="flex-row justify-between mt-2 pt-4 border-t border-gray-100">
              <Text className="text-gray-500 text-xs">Trainingsintensität:</Text>
              <View className="flex-row">
                <View className="flex-row items-center mr-3">
                  <View className="w-3 h-3 rounded-full bg-gray-100 mr-1" />
                  <Text className="text-gray-500 text-xs">Kein Training</Text>
                </View>
                <View className="flex-row items-center mr-3">
                  <View className="w-3 h-3 rounded-full bg-blue-200 mr-1" />
                  <Text className="text-gray-500 text-xs">1 Training</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                  <Text className="text-gray-500 text-xs">2+ Trainings</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Selected workout card (conditionally rendered) */}
        {selectedWorkout && (
          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <LinearGradient colors={["#FFFFFF", "#F9FAFC"]} className="p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-semibold text-gray-800">
                  Training am {format(selectedDate, "dd.MM.yyyy")}
                </Text>
                <TouchableOpacity 
                  onPress={() => setSelectedWorkout(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                >
                  <X size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              
              <View className="flex-row justify-between mb-4">
                <View className="bg-gray-50 rounded-xl p-3 flex-1 mr-2">
                  <Text className="text-gray-400 text-xs mb-1">ÜBUNGEN</Text>
                  <Text className="text-gray-800 font-medium">{selectedWorkout.entries.length}</Text>
                </View>
                <View className="bg-gray-50 rounded-xl p-3 flex-1 mr-2">
                  <Text className="text-gray-400 text-xs mb-1">DAUER</Text>
                  <Text className="text-gray-800 font-medium">{selectedWorkout.duration || "?"} min</Text>
                </View>
                                    <View className="bg-gray-50 rounded-xl p-3 flex-1">
                  <Text className="text-gray-400 text-xs mb-1">VOLUMEN</Text>
                  <Text className="text-gray-800 font-medium">
                    {selectedWorkout.entries.reduce((total, entry) => {
                      const weight = entry.weight || 0;
                      const reps = entry.reps || 0;
                      const sets = Array.isArray(entry.sets) ? entry.sets.length : (typeof entry.sets === 'number' ? entry.sets : 1);
                      return total + (weight * sets * reps);
                    }, 0)} kg
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity className="flex-row items-center justify-center bg-blue-50 p-3 rounded-xl">
                <Text className="text-blue-600 font-medium mr-2">Details anzeigen</Text>
                <ArrowRight size={16} color="#007AFF" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Top exercises card */}
        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <LinearGradient colors={["#FFFFFF", "#F9FAFC"]} className="p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-gray-800">Top Übungen</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-blue-500 text-sm mr-1">Alle anzeigen</Text>
                <ArrowRight size={14} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {topExercises.map((exercise, index) => (
              <View key={exercise.exerciseId} className={`mb-4 ${index < topExercises.length - 1 ? "pb-4 border-b border-gray-100" : ""}`}>
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <LinearGradient
                      colors={
                        index === 0
                          ? ["#FF9500", "#FFCC00"]
                          : index === 1
                            ? ["#5AC8FA", "#007AFF"]
                            : ["#5856D6", "#AF52DE"]
                      }
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    >
                      <Dumbbell size={16} color="#FFFFFF" />
                    </LinearGradient>
                    <Text className="text-gray-800 font-medium">{exercise.name}</Text>
                  </View>
                  <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-gray-600 text-xs font-medium">{exercise.count}x trainiert</Text>
                  </View>
                </View>
                
                <View className="ml-11">
                  <Text className="text-gray-500 text-xs mb-1">
                    Gesamtvolumen: <Text className="font-medium text-gray-700">{exercise.volume.toLocaleString()} kg</Text> | 
                    Sätze: <Text className="font-medium text-gray-700">{exercise.sets}</Text>
                  </Text>
                </View>
              </View>
            ))}
            
            {topExercises.length === 0 && (
              <View className="items-center py-6">
                <Dumbbell size={32} color="#E5E5EA" />
                <Text className="text-gray-400 mt-3">Noch keine Übungsdaten vorhanden</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}