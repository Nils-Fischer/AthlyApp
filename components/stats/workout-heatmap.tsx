import React, { useMemo, useState } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";
import { Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, eachWeekOfInterval, addMonths, subMonths } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Clock, Dumbbell, Flame } from "~/lib/icons/Icons";
import { fitnessLightColors } from "~/lib/theme/lightColors";
import Animated, { FadeIn } from "react-native-reanimated";

interface WorkoutPreviewData {
  id: string;
  name: string;
  date: Date;
  duration: number;
  exercises: { name: string; sets: number }[];
  totalVolume: number;
}

interface MonthlyHeatmapProps {
  onDayPress?: (date: Date) => void;
  months?: number;
  openWorkoutDetails?: (date: Date) => void;
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ onDayPress, months = 1, openWorkoutDetails }) => {
  const workoutStats = useWorkoutStats();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [previewWorkout, setPreviewWorkout] = useState<WorkoutPreviewData | null>(null);
  
  // Workout-Daten für die angezeigten Monate abrufen
  const calendarData = useMemo(() => {
    const start = subMonths(startOfMonth(currentDate), Math.floor((months - 1) / 2));
    const end = addMonths(endOfMonth(currentDate), Math.floor(months / 2));
    return workoutStats.getWorkoutCalendarData(start, end);
  }, [workoutStats, currentDate, months]);
  
  // Berechnungen für den aktuellen Monat
  const currentMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    // Funktion zum Erstellen eines strukturierten Wochenarray für den Monat
    function createWeekArray(start: Date, end: Date) {
      // Erstelle ein Array von Wochen
      const firstDayOfMonth = start.getDay();
      
      // Wir beginnen mit dem ersten Tag der Woche, der den ersten des Monats enthält
      const weekStart = addDays(start, -firstDayOfMonth);
      
      const weeks = eachWeekOfInterval({ start: weekStart, end });
      
      return weeks.map(week => {
        const days = [];
        for (let i = 0; i < 7; i++) {
          const day = addDays(week, i);
          const isCurrentMonth = day.getMonth() === start.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          
          // Suche Trainings-Status für diesen Tag
          const dateStr = format(day, "yyyy-MM-dd");
          const dayData = calendarData.find(d => d.date === dateStr);
          
          days.push({
            date: day,
            dayOfMonth: day.getDate(),
            isCurrentMonth,
            isToday,
            workoutCount: dayData ? dayData.count : 0,
            workoutId: dayData?.workoutId
          });
        }
        return days;
      });
    }
    
    // Alle Tage des Monats
    return {
      monthName: format(currentDate, "MMMM", { locale: de }),
      year: format(currentDate, "yyyy"),
      weeks: createWeekArray(start, end),
    };
  }, [calendarData, currentDate]);
  
  // Farbgebung für die Heatmap - sanftere Blautöne für iOS-Stil
  const getIntensityColor = (count: number) => {
    if (count === 0) return fitnessLightColors.background.card;      // Card-Hintergrund für Tage ohne Training
    if (count === 1) return "rgba(0, 136, 255, 0.25)";               // Helles Blau
    if (count === 2) return "rgba(0, 136, 255, 0.5)";                // Mittleres Blau
    return "rgba(0, 136, 255, 0.9)";                                 // Intensives Blau für 3+ Trainings
  };
  
  // Navigationshandler für Monate
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  // Kompaktere Wochentage
  const weekdays = ["S", "M", "D", "M", "D", "F", "S"];
  
  // Handler für Tagesauswahl mit Workout-Vorschau
  const handleDayPress = (day: any) => {
    setSelectedDay(day.date);
    
    if (day.workoutCount > 0) {
      // Workout-Daten abrufen
      const workout = workoutStats.getWorkoutByDate(day.date);
      
      if (workout) {
        // Daten für die Vorschau aufbereiten
        setPreviewWorkout({
          id: workout.id || "unknown",
          name: workout.workoutName || "Training",
          date: day.date,
          duration: typeof workout.duration === 'number' ? workout.duration : 0,
          exercises: workout.entries.map((entry: any) => ({ 
            name: entry.exerciseName, 
            sets: Array.isArray(entry.sets) ? entry.sets.length : 1
          })).slice(0, 3), // Maximal 3 Übungen für die Vorschau
          totalVolume: workout.entries.reduce((sum: number, entry: any) => {
            if (Array.isArray(entry.sets)) {
              return sum + entry.sets.reduce((setSum: number, set: any) => {
                return setSum + (set.weight || 0) * (set.reps || 0);
              }, 0);
            }
            return sum + (entry.weight || 0) * (entry.reps || 0);
          }, 0)
        });
      } else {
        setPreviewWorkout(null);
      }
    } else {
      setPreviewWorkout(null);
    }
    
    // Callback ausführen, falls vorhanden
    if (onDayPress) {
      onDayPress(day.date);
    }
  };

  return (
    <Card className="rounded-xl overflow-hidden">
      <View className="p-4">
        {/* Monatstitel mit Navigation */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View 
              className="bg-primary/5 p-1.5 rounded-full mr-2"
              style={{ backgroundColor: 'rgba(0, 136, 255, 0.05)' }}
            >
              <Calendar size={16} color={fitnessLightColors.secondary.default} />
            </View>
            <Text className="font-medium">{currentMonth.monthName} {currentMonth.year}</Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={goToPreviousMonth}
              className="w-7 h-7 items-center justify-center rounded-full mr-1"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            >
              <ChevronLeft size={16} color={fitnessLightColors.text.secondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={goToNextMonth}
              className="w-7 h-7 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            >
              <ChevronRight size={16} color={fitnessLightColors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tage-Grid mit Wochentagen */}
        <View>
          {/* Wochentage-Header - kompakter */}
          <View className="flex-row mb-2 pl-1">
            {weekdays.map((day, index) => (
              <View key={`day-${index}`} className="flex-1 items-center">
                <Small 
                  className="text-xs"
                  style={{ color: fitnessLightColors.text.tertiary }}
                >
                  {day}
                </Small>
              </View>
            ))}
          </View>
          
          {/* Wochen-Reihen */}
          {currentMonth.weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} className="flex-row my-0.5">
              {week.map((day, dayIndex) => (
                <Pressable
                  key={`day-${weekIndex}-${dayIndex}`}
                  onPress={() => handleDayPress(day)}
                  className="flex-1 aspect-square max-h-7"
                >
                  <View
                    style={{
                      backgroundColor: getIntensityColor(day.workoutCount),
                      opacity: !day.isCurrentMonth ? 0.3 : 1,
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: day.isToday ? 1 : 0,
                      borderColor: fitnessLightColors.ui.border,
                      shadowColor: day.workoutCount > 0 ? fitnessLightColors.ui.shadow : 'transparent',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 1,
                      elevation: day.workoutCount > 0 ? 1 : 0,
                    }}
                  >
                    <Text 
                      className="text-[10px] font-medium"
                      style={{ 
                        color: day.workoutCount > 1 
                          ? 'white' 
                          : fitnessLightColors.text.primary 
                      }}
                    >
                      {day.dayOfMonth}
                    </Text>
                    
                    {/* Workout-Indikator */}
                    {day.workoutCount > 0 && (
                      <View 
                        style={{ 
                          position: 'absolute', 
                          bottom: 2, 
                          width: 3, 
                          height: 3, 
                          borderRadius: 1.5,
                          backgroundColor: day.workoutCount > 1 
                            ? 'white' 
                            : fitnessLightColors.secondary.default
                        }} 
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      
      {/* Workout-Vorschau */}
      {previewWorkout && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          className="px-4 pb-4 mt-1"
        >
          <Separator className="mb-3" />
          
          <View className="rounded-lg overflow-hidden border border-border/20 bg-background/50">
            <View className="p-3">
              {/* Workout-Header */}
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Dumbbell size={14} color={fitnessLightColors.secondary.default} className="mr-1.5" />
                  <Text className="font-medium text-sm">{previewWorkout.name}</Text>
                </View>
                
                <Badge 
                  variant="outline" 
                  className="py-0.5 px-2 h-6"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderColor: fitnessLightColors.ui.border
                  }}
                >
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {format(previewWorkout.date, "dd.MM.yyyy")}
                  </Text>
                </Badge>
              </View>
              
              {/* Workout-Stats */}
              <View className="flex-row mb-2 bg-muted/20 p-2 rounded-lg">
                <View className="flex-1 items-center flex-row justify-center">
                  <Clock size={12} color={fitnessLightColors.text.tertiary} className="mr-1" />
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {previewWorkout.duration} min
                  </Text>
                </View>
                
                <View className="flex-1 items-center flex-row justify-center">
                  <Dumbbell size={12} color={fitnessLightColors.text.tertiary} className="mr-1" />
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {previewWorkout.exercises.length} Übungen
                  </Text>
                </View>
                
                <View className="flex-1 items-center flex-row justify-center">
                  <Flame size={12} color={fitnessLightColors.text.tertiary} className="mr-1" />
                  <Text 
                    className="text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {Math.round(previewWorkout.totalVolume)} kg
                  </Text>
                </View>
              </View>
              
              {/* Übungen Vorschau */}
              {previewWorkout.exercises.length > 0 && (
                <View>
                  {previewWorkout.exercises.map((exercise, index) => (
                    <View 
                      key={index}
                      className="flex-row items-center py-1"
                    >
                      <View 
                        className="w-1.5 h-1.5 rounded-full mr-2"
                        style={{ backgroundColor: fitnessLightColors.secondary.default }}
                      />
                      <Text 
                        className="text-xs flex-1"
                        style={{ color: fitnessLightColors.text.primary }}
                      >
                        {exercise.name}
                      </Text>
                      <Badge 
                        variant="outline" 
                        className="py-0 px-1 h-4"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          borderColor: 'transparent'
                        }}
                      >
                        <Text 
                          className="text-[9px]"
                          style={{ color: fitnessLightColors.text.tertiary }}
                        >
                          {exercise.sets}×
                        </Text>
                      </Badge>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    className="flex-row items-center justify-center py-2 mt-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                    onPress={() => {
                      if (openWorkoutDetails) {
                        openWorkoutDetails(previewWorkout.date);
                      } else if (onDayPress) {
                        onDayPress(previewWorkout.date);
                      }
                    }}
                  >
                    <Text 
                      className="text-xs"
                      style={{ color: fitnessLightColors.secondary.default }}
                    >
                      Details anzeigen
                    </Text>
                    <ChevronRight size={12} color={fitnessLightColors.secondary.default} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </Card>
  );
};