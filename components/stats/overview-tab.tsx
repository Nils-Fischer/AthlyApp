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
import { Activity, Clock, BarChart, Dumbbell, Calendar, ChevronRight, Flame } from "~/lib/icons/Icons";
import { Award } from "lucide-react-native";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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
    primary: '#22C55E',  // Primäre Akzentfarbe - Kräftiges Grün
    primaryLight: 'rgba(34, 197, 94, 0.08)',
    secondary: '#7A86E8', // Sekundäre Akzentfarbe - Helles Lila-Blau
    secondaryLight: 'rgba(122, 134, 232, 0.08)',
    tertiary: '#F97316',  // Tertiäre Akzentfarbe - Warmes Orange
    tertiaryLight: 'rgba(249, 115, 22, 0.08)',
    success: '#22C55E',   // Grün für Erfolge und Fortschritt
    successLight: 'rgba(34, 197, 94, 0.08)',
    warning: '#FBBF24',   // Warnung - Gelb
    warningLight: 'rgba(251, 191, 36, 0.08)',
    error: '#EF4444',     // Fehler/Wichtig - Rot
    errorLight: 'rgba(239, 68, 68, 0.08)',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#9CA3AF',
    border: 'rgba(229, 231, 235, 0.8)'
  }
};

export const OverviewTab: React.FC = () => {
  const workoutStats = useWorkoutStats();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Hole die Statistikdaten aus dem Hook
  const { monthlyWorkouts, averageSessionDuration, weeklyWorkoutsAverage } = workoutStats;
  
  // Top Übungen
  const topExercises = workoutStats.getTopExercises(3);
  const currentStreak = workoutStats.getCurrentStreak();
  
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
    <View style={{ gap: designSystem.spacing.md }}>
      {/* Activity Summary Card */}
      <View style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: designSystem.spacing.md 
        }}>
          <View style={{ 
            padding: designSystem.spacing.xs,
            borderRadius: designSystem.radii.sm / 2,
            marginRight: designSystem.spacing.sm,
            backgroundColor: designSystem.colors.primaryLight
          }}>
            <Activity size={18} color={designSystem.colors.primary} />
          </View>
          <Text style={{ 
            fontSize: 16,
            fontWeight: "600",
            color: designSystem.colors.textPrimary
          }}>
            Aktivitätsübersicht
          </Text>
        </View>
        
        <View style={{ 
          flexDirection: 'row',
          gap: designSystem.spacing.md,
          marginBottom: designSystem.spacing.md
        }}>
          <StatCard 
            title="Trainings" 
            value={monthlyWorkouts.current}
            subtitle="Diesen Monat" 
            trend={monthlyWorkouts.trend}
            icon={<Activity size={16} color={designSystem.colors.primary} />}
            variant="primary"
            compact
          />
          <StatCard 
            title="Ø Dauer" 
            value={averageSessionDuration.current}
            valueSuffix=" min"
            subtitle="Pro Training" 
            trend={averageSessionDuration.trend}
            icon={<Clock size={16} color={designSystem.colors.secondary} />}
            variant="secondary"
            compact
          />
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <StatCard 
              title="Wöchentlich" 
              value={weeklyWorkoutsAverage.current}
              subtitle="Trainings im Ø" 
              trend={weeklyWorkoutsAverage.trend}
              icon={<BarChart size={16} color={designSystem.colors.tertiary} />}
              variant="success"
              compact
            />
          </View>
          <View style={{ flex: 1 }}></View> {/* Spacer for layout balance */}
        </View>
      </View>
      
      {/* Streak Card */}
      {currentStreak > 0 && (
        <View style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: designSystem.radii.lg,
          padding: designSystem.spacing.lg,
          ...designSystem.shadow.sm
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                padding: designSystem.spacing.xs,
                borderRadius: designSystem.radii.sm / 2,
                marginRight: designSystem.spacing.sm,
                backgroundColor: designSystem.colors.tertiaryLight
              }}>
                <Flame size={18} color={designSystem.colors.tertiary} />
              </View>
              <View>
                <Text style={{ 
                  fontSize: 16,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary,
                  marginBottom: 2
                }}>
                  Aktuelle Streak
                </Text>
                <Text style={{ 
                  fontSize: 12,
                  color: designSystem.colors.textTertiary
                }}>
                  Halte deine Serie aufrecht
                </Text>
              </View>
            </View>
            
            <View style={{ 
              paddingHorizontal: designSystem.spacing.md,
              paddingVertical: 8,
              borderRadius: designSystem.radii.sm,
              backgroundColor: designSystem.colors.tertiaryLight,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Flame size={14} color={designSystem.colors.tertiary} style={{ marginRight: 4 }} />
              <Text style={{ 
                fontSize: 14,
                fontWeight: "600",
                color: designSystem.colors.tertiary
              }}>
                {currentStreak} Tage
              </Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Top Übungen Card */}
      <View style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: designSystem.spacing.md
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ 
              padding: designSystem.spacing.xs,
              borderRadius: designSystem.radii.sm / 2,
              marginRight: designSystem.spacing.sm,
              backgroundColor: designSystem.colors.secondaryLight
            }}>
              <Dumbbell size={18} color={designSystem.colors.secondary} />
            </View>
            <Text style={{ 
              fontSize: 16,
              fontWeight: "600",
              color: designSystem.colors.textPrimary
            }}>
              Top Übungen
            </Text>
          </View>
          
          <View style={{ 
            paddingHorizontal: designSystem.spacing.sm,
            paddingVertical: 4,
            borderRadius: designSystem.radii.sm,
            backgroundColor: designSystem.colors.backgroundSecondary,
            borderWidth: 0.5,
            borderColor: designSystem.colors.border
          }}>
            <Text style={{ 
              fontSize: 12,
              fontWeight: "500",
              color: designSystem.colors.textTertiary
            }}>
              {topExercises.length}
            </Text>
          </View>
        </View>
        
        {topExercises.length > 0 ? (
          <View>
            {topExercises.map((exercise, index) => (
              <React.Fragment key={index}>
                {index > 0 && <View style={{ 
                  height: 1,
                  backgroundColor: designSystem.colors.border,
                  marginVertical: designSystem.spacing.sm
                }} />}
                <TouchableOpacity style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  paddingVertical: designSystem.spacing.xs
                }}>
                  {/* Rank Circle */}
                  <View style={{ 
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: designSystem.spacing.sm,
                    backgroundColor: index === 0 
                      ? designSystem.colors.warningLight
                      : index === 1 
                        ? 'rgba(209, 213, 219, 0.2)' 
                        : 'rgba(229, 231, 235, 0.3)'
                  }}>
                    <Text style={{ 
                      fontSize: 12,
                      fontWeight: "600",
                      color: index === 0 
                        ? designSystem.colors.warning
                        : index === 1 
                          ? designSystem.colors.textSecondary
                          : designSystem.colors.textTertiary
                    }}>
                      {index + 1}
                    </Text>
                  </View>
                  
                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 14,
                      fontWeight: "600",
                      color: designSystem.colors.textPrimary,
                      marginBottom: 2
                    }}>
                      {exercise.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ 
                        paddingHorizontal: designSystem.spacing.sm,
                        paddingVertical: 4,
                        borderRadius: designSystem.radii.sm / 2,
                        marginRight: designSystem.spacing.sm,
                        backgroundColor: designSystem.colors.primaryLight
                      }}>
                        <Text style={{ 
                          fontSize: 12,
                          fontWeight: "500",
                          color: designSystem.colors.primary
                        }}>
                          {exercise.sets}×
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Arrow */}
                  <ChevronRight size={16} color={designSystem.colors.textTertiary} />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={{ 
            padding: designSystem.spacing.xl,
            alignItems: 'center',
            borderRadius: designSystem.radii.md,
            backgroundColor: designSystem.colors.backgroundSecondary
          }}>
            <Dumbbell size={24} color={designSystem.colors.textTertiary} style={{ marginBottom: designSystem.spacing.sm }} />
            <Text style={{ 
              textAlign: 'center',
              fontSize: 14,
              color: designSystem.colors.textTertiary
            }}>
              Noch keine Trainingsübungen
            </Text>
          </View>
        )}
      </View>
      
      {/* Workout Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: designSystem.radii.lg,
          borderWidth: 1,
          borderColor: designSystem.colors.border,
          ...designSystem.shadow.md
        }}>
          <DialogHeader style={{ marginBottom: designSystem.spacing.sm }}>
            <DialogTitle style={{ textAlign: 'center' }}>
              {selectedDay && (
                <Text style={{ 
                  fontSize: 16,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  {format(selectedDay, "EEEE, dd. MMMM", { locale: de })}
                </Text>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout ? (
            <View style={{ marginTop: designSystem.spacing.sm }}>
              {/* Workout Title with Icon */}
              <View style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: designSystem.radii.md,
                padding: designSystem.spacing.md,
                borderWidth: 0.5,
                borderColor: designSystem.colors.border,
                marginBottom: designSystem.spacing.md
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      padding: designSystem.spacing.xs,
                      borderRadius: designSystem.radii.sm / 2,
                      marginRight: designSystem.spacing.sm,
                      backgroundColor: designSystem.colors.primaryLight
                    }}>
                      <Dumbbell size={18} color={designSystem.colors.primary} />
                    </View>
                    <Text style={{ 
                      fontSize: 16,
                      fontWeight: "600",
                      color: designSystem.colors.textPrimary
                    }}>
                      {selectedWorkout.workoutName}
                    </Text>
                  </View>
                  
                  <View style={{ 
                    paddingHorizontal: designSystem.spacing.sm,
                    paddingVertical: 6,
                    borderRadius: designSystem.radii.sm,
                    backgroundColor: designSystem.colors.backgroundSecondary,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Clock size={14} color={designSystem.colors.textTertiary} style={{ marginRight: 4 }} />
                    <Text style={{ 
                      fontSize: 12,
                      color: designSystem.colors.textSecondary
                    }}>
                      {formatDuration(selectedWorkout.duration)}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Übungen Liste */}
              <Text style={{ 
                fontSize: 14,
                fontWeight: "600",
                marginLeft: 4,
                marginBottom: designSystem.spacing.sm,
                color: designSystem.colors.textSecondary
              }}>
                Übungen
              </Text>
              
              <View style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: designSystem.radii.md,
                overflow: 'hidden',
                borderWidth: 0.5,
                borderColor: designSystem.colors.border
              }}>
                {selectedWorkout.entries.map((entry, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <View style={{ 
                      height: 1,
                      backgroundColor: designSystem.colors.border
                    }} />}
                    <View style={{ padding: designSystem.spacing.md }}>
                      <Text style={{ 
                        fontSize: 14,
                        fontWeight: "600",
                        color: designSystem.colors.textPrimary,
                        marginBottom: designSystem.spacing.xs
                      }}>
                        {entry.exerciseName}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ 
                          paddingHorizontal: designSystem.spacing.sm,
                          paddingVertical: 4,
                          borderRadius: designSystem.radii.sm / 2,
                          marginRight: designSystem.spacing.sm,
                          backgroundColor: designSystem.colors.primaryLight
                        }}>
                          <Text style={{ 
                            fontSize: 12,
                            fontWeight: "500",
                            color: designSystem.colors.primary
                          }}>
                            {getSetsDisplay(entry.sets)}×
                          </Text>
                        </View>
                        <View style={{ 
                          paddingHorizontal: designSystem.spacing.sm,
                          paddingVertical: 4,
                          borderRadius: designSystem.radii.sm / 2,
                          marginRight: designSystem.spacing.sm,
                          backgroundColor: designSystem.colors.backgroundSecondary
                        }}>
                          <Text style={{ 
                            fontSize: 12,
                            color: designSystem.colors.textSecondary
                          }}>
                            {entry.reps || 0} Wdh.
                          </Text>
                        </View>
                        <View style={{ 
                          paddingHorizontal: designSystem.spacing.sm,
                          paddingVertical: 4,
                          borderRadius: designSystem.radii.sm / 2,
                          backgroundColor: designSystem.colors.backgroundSecondary
                        }}>
                          <Text style={{ 
                            fontSize: 12,
                            color: designSystem.colors.textSecondary
                          }}>
                            {entry.weight || 0} kg
                          </Text>
                        </View>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ 
              padding: designSystem.spacing.xxl,
              alignItems: 'center',
              borderRadius: designSystem.radii.md,
              backgroundColor: designSystem.colors.backgroundSecondary,
              margin: designSystem.spacing.md
            }}>
              <Calendar size={32} color={designSystem.colors.textTertiary} style={{ marginBottom: designSystem.spacing.md }} />
              <Text style={{ 
                textAlign: 'center',
                fontSize: 16,
                fontWeight: "500",
                color: designSystem.colors.textSecondary
              }}>
                Kein Training an diesem Tag
              </Text>
            </View>
          )}
        </DialogContent>
      </Dialog>
    </View>
  );
};