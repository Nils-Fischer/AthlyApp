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
    <View style={{ gap: designSystem.spacing.md }}>
      {/* Streak Karten - Moderner Stil */}
      <View style={{ 
        flexDirection: 'row', 
        gap: designSystem.spacing.md,
      }}>
        <View style={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: designSystem.radii.md,
          padding: designSystem.spacing.lg,
          ...designSystem.shadow.sm
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
            <View style={{ 
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              padding: designSystem.spacing.xs,
              borderRadius: designSystem.radii.sm / 2,
              marginRight: designSystem.spacing.xs
            }}>
              <Flame size={18} color={designSystem.colors.tertiary} />
            </View>
            <Text style={{ 
              fontSize: 14,
              fontWeight: "600",
              color: designSystem.colors.textPrimary
            }}>
              Aktuelle Streak
            </Text>
          </View>
          <Text style={{ 
            fontSize: 28,
            fontWeight: '700',
            color: designSystem.colors.textPrimary,
            marginBottom: 2
          }}>
            {currentStreak}
          </Text>
          <Text style={{ 
            fontSize: 12,
            color: designSystem.colors.textTertiary
          }}>
            aktuelle Serie
          </Text>
        </View>
        
        <View style={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: designSystem.radii.md,
          padding: designSystem.spacing.lg,
          ...designSystem.shadow.sm
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
            <View style={{ 
              backgroundColor: designSystem.colors.secondaryLight,
              padding: designSystem.spacing.xs,
              borderRadius: designSystem.radii.sm / 2,
              marginRight: designSystem.spacing.xs
            }}>
              <Award size={18} color={designSystem.colors.secondary} />
            </View>
            <Text style={{ 
              fontSize: 14,
              fontWeight: "600",
              color: designSystem.colors.textPrimary
            }}>
              Längste Streak
            </Text>
          </View>
          <Text style={{ 
            fontSize: 28,
            fontWeight: '700',
            color: designSystem.colors.textPrimary,
            marginBottom: 2
          }}>
            {longestStreak.days}
          </Text>
          <Text style={{ 
            fontSize: 12,
            color: designSystem.colors.textTertiary
          }}>
            dein Rekord
          </Text>
        </View>
      </View>
      
      {/* Informationen zur Konstanz - Moderner Stil */}
      <View style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
          <View style={{ 
            padding: designSystem.spacing.xs,
            borderRadius: designSystem.radii.sm,
            backgroundColor: designSystem.colors.secondaryLight,
            marginRight: designSystem.spacing.sm
          }}>
            <TrendingUp size={18} color={designSystem.colors.secondary} />
          </View>
          <Text style={{ 
            fontSize: 16,
            fontWeight: "600",
            color: designSystem.colors.textPrimary
          }}>
            Trainingsgewohnheiten
          </Text>
        </View>
        
        <View style={{ 
          borderRadius: designSystem.radii.md,
          padding: designSystem.spacing.md,
          marginBottom: designSystem.spacing.md,
          backgroundColor: 'rgba(248, 250, 252, 0.95)'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
            <Text style={{ 
              fontWeight: "600",
              fontSize: 14,
              color: designSystem.colors.textPrimary
            }}>
              Wöchentliches Training
            </Text>
            <View style={{ 
              paddingHorizontal: designSystem.spacing.sm,
              paddingVertical: 6,
              borderRadius: designSystem.radii.sm,
              backgroundColor: designSystem.colors.secondaryLight
            }}>
              <Text style={{ 
                fontSize: 14,
                fontWeight: "600",
                color: designSystem.colors.secondary
              }}>
                {weeklyAverage.current}
              </Text>
            </View>
          </View>
          <Text style={{ 
            fontSize: 12,
            color: designSystem.colors.textSecondary
          }}>
            Du trainierst durchschnittlich {weeklyAverage.current} mal pro Woche.
            {weeklyAverage.trend !== 0 && (
              <Text style={{ 
                color: weeklyAverage.trend > 0 
                  ? designSystem.colors.success
                  : designSystem.colors.tertiary
              }}>
                {" "}{weeklyAverage.trend > 0 ? "+" : ""}{weeklyAverage.trend}% im Vergleich zum Vormonat.
              </Text>
            )}
          </Text>
        </View>
        
        {/* Beliebte Trainingstage */}
        <Text style={{ 
          fontWeight: "600",
          fontSize: 14,
          color: designSystem.colors.textSecondary,
          marginBottom: designSystem.spacing.sm
        }}>
          Beliebte Trainingstage
        </Text>
        
        <View style={{ 
          flexDirection: 'row',
          marginVertical: designSystem.spacing.sm,
          height: 70
        }}>
          {weekdayData.labels.map((day, index) => {
            const count = weekdayData.counts[index];
            const maxCount = Math.max(...weekdayData.counts);
            const height = maxCount > 0 ? Math.max(16, Math.round((count / maxCount) * 50)) : 16;
            const isBestDay = index === bestDayIndex && count > 0;
            
            return (
              <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', height: 56 }}>
                  <View style={{ 
                    height,
                    width: 6,
                    borderRadius: 3,
                    backgroundColor: isBestDay 
                      ? designSystem.colors.primary
                      : designSystem.colors.primaryLight
                  }} />
                </View>
                <Text style={{ 
                  marginTop: 8,
                  fontSize: 12,
                  color: isBestDay 
                    ? designSystem.colors.textPrimary 
                    : designSystem.colors.textTertiary,
                  fontWeight: isBestDay ? '500' : 'normal'
                }}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View style={{ 
          height: 1, 
          backgroundColor: designSystem.colors.border,
          marginVertical: designSystem.spacing.md
        }} />
        
        {/* Beliebtester Tag Badge */}
        {Math.max(...weekdayData.counts) > 0 && (
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            padding: designSystem.spacing.md,
            borderRadius: designSystem.radii.md,
            backgroundColor: 'rgba(248, 250, 252, 0.95)'
          }}>
            <Calendar size={18} color={designSystem.colors.primary} style={{ marginRight: designSystem.spacing.sm }} />
            <Text style={{ 
              fontSize: 14,
              flex: 1,
              color: designSystem.colors.textSecondary
            }}>
              Dein intensivster Trainingstag ist{" "}
              <Text style={{ fontWeight: "600", color: designSystem.colors.textPrimary }}>
                {bestDay}
              </Text>
            </Text>
          </View>
        )}
      </View>
      
      {/* Streak Achievements */}
      <View style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
          <View style={{ 
            padding: designSystem.spacing.xs,
            borderRadius: designSystem.radii.sm,
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
            marginRight: designSystem.spacing.sm
          }}>
            <Award size={18} color={designSystem.colors.tertiary} />
          </View>
          <Text style={{ 
            fontSize: 16,
            fontWeight: "600",
            color: designSystem.colors.textPrimary
          }}>
            Streak-Auszeichnungen
          </Text>
        </View>
        
        <View style={{ marginTop: designSystem.spacing.xs }}>
          {streakAchievements.map((achievement, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={{ 
                height: 1, 
                backgroundColor: designSystem.colors.border,
                marginVertical: designSystem.spacing.sm
              }} />}
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: designSystem.spacing.sm,
                opacity: achievement.achieved ? 1 : 0.5
              }}>
                <View style={{ 
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: designSystem.spacing.sm,
                  backgroundColor: achievement.achieved 
                    ? designSystem.colors.tertiaryLight
                    : 'rgba(0, 0, 0, 0.03)'
                }}>
                  <Text style={{ 
                    fontSize: 12,
                    fontWeight: "600",
                    color: achievement.achieved 
                      ? designSystem.colors.tertiary
                      : designSystem.colors.textTertiary
                  }}>
                    {achievement.days}
                  </Text>
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontWeight: "600",
                    fontSize: 14,
                    marginBottom: 2,
                    color: achievement.achieved 
                      ? designSystem.colors.textPrimary
                      : designSystem.colors.textTertiary
                  }}>
                    {achievement.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 12,
                    color: designSystem.colors.textTertiary
                  }}>
                    {achievement.description}
                  </Text>
                </View>
                
                {achievement.achieved && (
                  <Award size={18} color={designSystem.colors.tertiary} />
                )}
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};