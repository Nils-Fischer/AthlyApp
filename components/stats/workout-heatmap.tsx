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

// Design System Definition
const designSystem = {
  // Abstände
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  // Radien
  radii: {
    sm: 16,
    md: 20,
    lg: 24
  },
  // Schatten
  shadow: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 2
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3
    }
  },
  // Farben - basierend auf neuen UI-Vorgaben
  colors: {
    background: '#FFFFFF',
    backgroundSecondary: 'rgba(248, 250, 252, 0.95)',
    primary: '#22C55E',  // Primäre Akzentfarbe - Kräftiges Grün für Aktionen und Fortschritt
    primaryLight: 'rgba(34, 197, 94, 0.08)',
    primaryMedium: 'rgba(34, 197, 94, 0.25)',
    primaryStrong: 'rgba(34, 197, 94, 0.55)',
    primaryIntense: 'rgba(34, 197, 94, 0.85)',
    secondary: '#7A86E8', // Sekundäre Akzentfarbe - Helles Lila-Blau
    secondaryLight: 'rgba(122, 134, 232, 0.08)',
    tertiary: '#F97316',  // Tertiäre Akzentfarbe - Warmes Orange
    tertiaryLight: 'rgba(249, 115, 22, 0.08)',
    success: '#22C55E',   // Grün für Erfolge und Fortschritt
    successLight: 'rgba(34, 197, 94, 0.08)',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#9CA3AF',
    border: 'rgba(229, 231, 235, 0.8)'
  }
};

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
  
  // Farbgebung für die Heatmap basierend auf neuem Farbschema
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.95)';   // Leicht transparent für Tiefenwirkung
    if (count === 1) return designSystem.colors.primaryMedium;
    if (count === 2) return designSystem.colors.primaryStrong;
    return designSystem.colors.primaryIntense;
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
    <View style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: designSystem.radii.lg,
      overflow: 'hidden',
      ...designSystem.shadow.sm
    }}>
      <View style={{ padding: designSystem.spacing.xl }}>
        {/* Monatstitel mit Navigation */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: designSystem.spacing.xl 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ 
              padding: designSystem.spacing.sm,
              borderRadius: designSystem.radii.sm,
              marginRight: designSystem.spacing.md,
              backgroundColor: designSystem.colors.primaryLight
            }}>
              <Calendar size={18} color={designSystem.colors.primary} />
            </View>
            <Text style={{ 
              fontSize: 16,
              fontWeight: "600",
              color: designSystem.colors.textPrimary
            }}>
              {currentMonth.monthName} {currentMonth.year}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={{ 
                width: 36, 
                height: 36, 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 18,
                marginRight: designSystem.spacing.sm,
                backgroundColor: designSystem.colors.backgroundSecondary
              }}
            >
              <ChevronLeft size={18} color={designSystem.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={goToNextMonth}
              style={{ 
                width: 36, 
                height: 36, 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 18,
                backgroundColor: designSystem.colors.backgroundSecondary
              }}
            >
              <ChevronRight size={18} color={designSystem.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tage-Grid mit Wochentagen */}
        <View>
          {/* Wochentage-Header - moderner, mit mehr Whitespace */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: designSystem.spacing.md,
            paddingHorizontal: 4
          }}>
            {weekdays.map((day, index) => (
              <View key={`day-${index}`} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: "500",
                  color: designSystem.colors.textTertiary
                }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Wochen-Reihen mit mehr Abstand */}
          {currentMonth.weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={{ 
              flexDirection: 'row', 
              marginVertical: 4 
            }}>
              {week.map((day, dayIndex) => (
                <Pressable
                  key={`day-${weekIndex}-${dayIndex}`}
                  onPress={() => handleDayPress(day)}
                  style={{ flex: 1, aspectRatio: 1, maxHeight: 36 }}
                >
                  <View
                    style={{
                      backgroundColor: getIntensityColor(day.workoutCount),
                      opacity: !day.isCurrentMonth ? 0.3 : 1,
                      width: '85%',
                      height: '85%',
                      margin: '7.5%',
                      borderRadius: designSystem.radii.sm / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: day.isToday ? 1.5 : 0,
                      borderColor: designSystem.colors.primary,
                      ...designSystem.shadow.sm,
                      shadowOpacity: day.workoutCount > 0 ? 0.1 : 0
                    }}
                  >
                    <Text style={{ 
                      fontSize: 12,
                      fontWeight: "500",
                      color: day.workoutCount > 1 
                        ? 'white' 
                        : designSystem.colors.textPrimary 
                    }}>
                      {day.dayOfMonth}
                    </Text>
                    
                    {/* Workout-Indikator - kleiner Punkt */}
                    {day.workoutCount > 0 && (
                      <View style={{ 
                        position: 'absolute', 
                        bottom: 3, 
                        width: 4, 
                        height: 4, 
                        borderRadius: 2,
                        backgroundColor: day.workoutCount > 1 
                          ? 'white' 
                          : designSystem.colors.primary
                      }} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
        
        {/* Workout-Vorschau, wenn ein Tag mit Training ausgewählt ist */}
        {previewWorkout && (
          <View style={{ 
            marginTop: designSystem.spacing.xl,
            paddingTop: designSystem.spacing.lg,
            borderTopWidth: 1,
            borderTopColor: designSystem.colors.border
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: designSystem.spacing.md 
            }}>
              <Text style={{ 
                fontSize: 16,
                fontWeight: "600",
                color: designSystem.colors.textPrimary
              }}>
                {format(previewWorkout.date, "dd. MMMM", { locale: de })}
              </Text>
              
              {openWorkoutDetails && (
                <TouchableOpacity
                  onPress={() => openWorkoutDetails(previewWorkout.date)}
                  style={{ 
                    paddingHorizontal: designSystem.spacing.md,
                    paddingVertical: 8,
                    borderRadius: designSystem.radii.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: designSystem.colors.primaryLight
                  }}
                >
                  <Text style={{ 
                    fontSize: 12,
                    fontWeight: "600",
                    marginRight: 4,
                    color: designSystem.colors.primary
                  }}>
                    Details
                  </Text>
                  <ChevronRight size={14} color={designSystem.colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={{ 
              backgroundColor: designSystem.colors.backgroundSecondary,
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
                <Dumbbell size={18} color={designSystem.colors.primary} />
                <Text style={{ 
                  marginLeft: designSystem.spacing.sm,
                  fontSize: 16,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  {previewWorkout.name}
                </Text>
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                marginBottom: designSystem.spacing.md,
                borderRadius: designSystem.radii.sm,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                padding: designSystem.spacing.sm
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: designSystem.spacing.lg }}>
                  <Clock size={16} color={designSystem.colors.textSecondary} />
                  <Text style={{ 
                    marginLeft: 6,
                    fontSize: 14,
                    color: designSystem.colors.textSecondary
                  }}>
                    {previewWorkout.duration} Min.
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Flame size={16} color={designSystem.colors.tertiary} />
                  <Text style={{ 
                    marginLeft: 6,
                    fontSize: 14,
                    color: designSystem.colors.textSecondary
                  }}>
                    {Math.round(previewWorkout.totalVolume / 100)} kg Volumen
                  </Text>
                </View>
              </View>
              
              {previewWorkout.exercises.length > 0 && (
                <View>
                  <Text style={{ 
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: designSystem.spacing.sm,
                    color: designSystem.colors.textSecondary
                  }}>
                    Übungen:
                  </Text>
                  
                  {previewWorkout.exercises.map((exercise, index) => (
                    <View 
                      key={`exercise-${index}`} 
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: designSystem.spacing.sm,
                        borderTopWidth: index > 0 ? 1 : 0,
                        borderTopColor: designSystem.colors.border
                      }}
                    >
                      <Text style={{ 
                        flex: 1,
                        fontSize: 14,
                        color: designSystem.colors.textPrimary
                      }}>
                        {exercise.name}
                      </Text>
                      
                      <View style={{
                        backgroundColor: designSystem.colors.primaryLight,
                        paddingHorizontal: designSystem.spacing.sm,
                        paddingVertical: 4,
                        borderRadius: designSystem.radii.sm / 2
                      }}>
                        <Text style={{ 
                          fontSize: 12,
                          fontWeight: "500",
                          color: designSystem.colors.primary
                        }}>
                          {exercise.sets} {exercise.sets === 1 ? 'Satz' : 'Sätze'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};