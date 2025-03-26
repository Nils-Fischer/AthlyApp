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
  
  // Farbgebung für die Heatmap mit Neon-Farben
  const getIntensityColor = (count: number) => {
    if (count === 0) return fitnessLightColors.background.card;      // Card-Hintergrund für Tage ohne Training
    if (count === 1) return "rgba(0, 178, 255, 0.25)";               // Neon-Blau mit niedriger Intensität
    if (count === 2) return "rgba(0, 178, 255, 0.55)";               // Mittleres Neon-Blau
    return "rgba(0, 178, 255, 0.85)";                               // Intensives Neon-Blau für 3+ Trainings
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
      <View className="p-6">
        {/* Monatstitel mit Navigation */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View 
              className="p-2 rounded-full mr-3"
              style={{ backgroundColor: 'rgba(0, 178, 255, 0.08)' }}
            >
              <Calendar size={18} color={fitnessLightColors.primary.default} />
            </View>
            <Text className="font-medium text-base">{currentMonth.monthName} {currentMonth.year}</Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={goToPreviousMonth}
              className="w-8 h-8 items-center justify-center rounded-full mr-2"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            >
              <ChevronLeft size={16} color={fitnessLightColors.text.secondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={goToNextMonth}
              className="w-8 h-8 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            >
              <ChevronRight size={16} color={fitnessLightColors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tage-Grid mit Wochentagen */}
        <View>
          {/* Wochentage-Header - moderner, mit mehr Whitespace */}
          <View className="flex-row mb-3 pl-1.5">
            {weekdays.map((day, index) => (
              <View key={`day-${index}`} className="flex-1 items-center">
                <Small 
                  className="text-xs font-medium"
                  style={{ color: fitnessLightColors.text.tertiary }}
                >
                  {day}
                </Small>
              </View>
            ))}
          </View>
          
          {/* Wochen-Reihen mit mehr Abstand */}
          {currentMonth.weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} className="flex-row my-1">
              {week.map((day, dayIndex) => (
                <Pressable
                  key={`day-${weekIndex}-${dayIndex}`}
                  onPress={() => handleDayPress(day)}
                  className="flex-1 aspect-square max-h-8"
                >
                  <View
                    style={{
                      backgroundColor: getIntensityColor(day.workoutCount),
                      opacity: !day.isCurrentMonth ? 0.25 : 1,
                      width: '90%',
                      height: '90%',
                      margin: '5%',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: day.isToday ? 1.5 : 0,
                      borderColor: fitnessLightColors.primary.default,
                      shadowColor: day.workoutCount > 0 ? fitnessLightColors.primary.default : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 4,
                      elevation: day.workoutCount > 0 ? 2 : 0,
                    }}
                  >
                    <Text 
                      className="text-[11px] font-medium"
                      style={{ 
                        color: day.workoutCount > 1 
                          ? 'white' 
                          : fitnessLightColors.text.primary 
                      }}
                    >
                      {day.dayOfMonth}
                    </Text>
                    
                    {/* Workout-Indikator - kleiner Punkt */}
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
                            : fitnessLightColors.primary.default
                        }}
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
        
        {/* Workout-Vorschau, wenn ein Tag mit Training ausgewählt ist */}
        {previewWorkout && (
          <View 
            className="mt-6 pt-4 border-t"
            style={{ borderTopColor: 'rgba(0, 0, 0, 0.04)' }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-medium text-base">
                {format(previewWorkout.date, "dd. MMMM", { locale: de })}
              </Text>
              
              {openWorkoutDetails && (
                <TouchableOpacity
                  onPress={() => openWorkoutDetails(previewWorkout.date)}
                  className="px-3 py-1 rounded-full flex-row items-center"
                  style={{ backgroundColor: fitnessLightColors.primary.faded }}
                >
                  <Text 
                    className="text-xs font-medium mr-1"
                    style={{ color: fitnessLightColors.primary.default }}
                  >
                    Details
                  </Text>
                  <ChevronRight size={12} color={fitnessLightColors.primary.default} />
                </TouchableOpacity>
              )}
            </View>
            
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Dumbbell size={16} color={fitnessLightColors.primary.default} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: fitnessLightColors.text.primary }}
                >
                  {previewWorkout.name}
                </Text>
              </View>
              
              <View className="flex-row mb-3">
                <View className="flex-row items-center mr-4">
                  <Clock size={14} color={fitnessLightColors.text.secondary} />
                  <Text 
                    className="ml-1 text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {previewWorkout.duration} Min.
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <Flame size={14} color={fitnessLightColors.text.secondary} />
                  <Text 
                    className="ml-1 text-xs"
                    style={{ color: fitnessLightColors.text.secondary }}
                  >
                    {Math.round(previewWorkout.totalVolume / 100)} kg Volumen
                  </Text>
                </View>
              </View>
              
              {previewWorkout.exercises.length > 0 && (
                <View>
                  <Small 
                    className="mb-1.5"
                    style={{ color: fitnessLightColors.text.tertiary }}
                  >
                    Übungen:
                  </Small>
                  
                  {previewWorkout.exercises.map((exercise, index) => (
                    <View 
                      key={`exercise-${index}`} 
                      className="flex-row items-center py-1"
                      style={{
                        borderTopWidth: index > 0 ? 1 : 0,
                        borderTopColor: 'rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <Text 
                        className="flex-1 text-xs"
                        style={{ color: fitnessLightColors.text.secondary }}
                      >
                        {exercise.name}
                      </Text>
                      
                      <Badge 
                        variant="outline"
                        className="text-[10px] px-1.5"
                      >
                        {exercise.sets} {exercise.sets === 1 ? 'Satz' : 'Sätze'}
                      </Badge>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};