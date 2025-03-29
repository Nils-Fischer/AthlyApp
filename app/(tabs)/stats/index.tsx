"use client"

import React, { useState, useEffect } from "react"
import { View, TouchableOpacity, ScrollView, useWindowDimensions, Animated, Modal, TextInput } from "react-native"
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
import { ExerciseProgression } from "~/components/stats/exerciseprogression" 
import { useNavigation } from '@react-navigation/native'
import { useExerciseStore } from "~/stores/exerciseStore"
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore"
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
  ChevronRight,
  Search,
  ChevronLeft
} from "~/lib/icons/Icons"
import { X } from "lucide-react-native"

export default function StatsScreen() {
  const stats = useWorkoutStats();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollY = new Animated.Value(0);
  const { width } = useWindowDimensions();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Modal and Exercise states
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [modalView, setModalView] = useState<'list' | 'detail'>('list');
  
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

  // Create a modal navigation object
  const modalNavigation = {
    navigate: (screenName: string, params: any) => {
      if (screenName === 'ExerciseDetail') {
        setSelectedExerciseId(params?.exerciseId);
        setModalView('detail');
      } else if (screenName === 'ExerciseList') {
        setModalView('list');
      }
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
  
  // UI Konstanten gemäß Designvorgaben
  const designSystem = {
    // Abstände
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      xxxl: 40
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
    // Typografie
    typography: {
      heading1: {
        fontSize: 28,
        fontWeight: "700",
        lineHeight: 34
      },
      heading2: {
        fontSize: 22,
        fontWeight: "700",
        lineHeight: 28
      },
      heading3: {
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 24
      },
      body: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 22
      },
      caption: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18
      },
      small: {
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16
      }
    },
    // Farben - basierend auf neuen UI-Vorgaben
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: 'rgba(248, 250, 252, 0.95)',
      primary: '#22C55E',  // Primäre Akzentfarbe - Kräftiges Grün für Aktionen und Fortschritt
      primaryLight: 'rgba(34, 197, 94, 0.1)',
      secondary: '#7A86E8', // Sekundäre Akzentfarbe - Helles Lila-Blau
      tertiary: '#F97316',  // Tertiäre Akzentfarbe - Warmes Orange
      success: '#22C55E',   // Grün für Erfolge und Fortschritt
      successLight: 'rgba(34, 197, 94, 0.08)',
      textPrimary: '#111827',
      textSecondary: '#4B5563',
      textTertiary: '#9CA3AF',
      border: 'rgba(229, 231, 235, 0.8)'
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designSystem.colors.background }}>
      {/* Animierter Header für Scrolling */}
      <Animated.View 
        style={{ 
          opacity: headerOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          borderBottomWidth: 1,
          borderBottomColor: designSystem.colors.border,
          paddingTop: designSystem.spacing.lg,
          paddingBottom: designSystem.spacing.md,
          paddingHorizontal: designSystem.spacing.xl
        }}
      >
        <Text style={{ 
          fontSize: designSystem.typography.heading2.fontSize,
          fontWeight: "700",
          color: designSystem.colors.textPrimary
        }}>
          Statistiken
        </Text>
      </Animated.View>
      
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingTop: designSystem.spacing.xxxl,
          paddingBottom: 100, 
          paddingHorizontal: designSystem.spacing.xl 
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Motivations-Karte */}
        <View style={{ 
          marginBottom: designSystem.spacing.xl,
          borderRadius: designSystem.radii.lg,
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          padding: designSystem.spacing.xl,
          ...designSystem.shadow.sm
        }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: designSystem.spacing.sm 
          }}>
            <View style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              padding: designSystem.spacing.sm,
              borderRadius: designSystem.radii.sm,
              marginRight: designSystem.spacing.sm
            }}>
              <Flame size={22} color={designSystem.colors.primary} />
            </View>
            <Text style={{ 
              fontSize: designSystem.typography.heading3.fontSize,
              fontWeight: designSystem.typography.heading3.fontWeight,
              color: designSystem.colors.primary
            }}>
              {currentStreak > 0 ? `${currentStreak} Tage Streak!` : `Fitness-Tracker`}
            </Text>
          </View>
          <Text style={{ 
            fontSize: designSystem.typography.body.fontSize,
            color: designSystem.colors.textSecondary,
            lineHeight: designSystem.typography.body.lineHeight
          }}>
            {getMotivationalMessage()}
          </Text>
        </View>
        
        {/* Highlights Karten */}
        <View style={{ marginBottom: designSystem.spacing.xxl }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: designSystem.spacing.md 
          }}>
            <Zap size={16} color={designSystem.colors.textSecondary} />
            <Text style={{ 
              marginLeft: designSystem.spacing.xs,
              fontSize: designSystem.typography.caption.fontSize,
              fontWeight: "600",
              letterSpacing: 0.5,
              color: designSystem.colors.textSecondary
            }}>
              TRAININGS-HIGHLIGHTS
            </Text>
          </View>
          
          {/* Streak Cards Row */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: designSystem.spacing.md 
          }}>
            <View style={{ 
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg,
              marginRight: designSystem.spacing.md,
              ...designSystem.shadow.sm
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
                <Flame size={20} color={designSystem.colors.primary} />
                <Text style={{ 
                  marginLeft: designSystem.spacing.xs,
                  fontSize: designSystem.typography.caption.fontSize,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  Aktuelle Serie
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
                fontSize: designSystem.typography.small.fontSize,
                color: designSystem.colors.textTertiary
              }}>
                Aufeinanderfolgende Tage
              </Text>
              {monthlyProgress > 0 && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  marginTop: designSystem.spacing.xs
                }}>
                  <TrendingUp size={12} color={designSystem.colors.success} />
                  <Text style={{ 
                    marginLeft: 2,
                    fontSize: designSystem.typography.small.fontSize,
                    color: designSystem.colors.success
                  }}>
                    {monthlyProgress}%
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ 
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg,
              ...designSystem.shadow.sm
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
                <Trophy size={18} color={designSystem.colors.secondary} />
                <Text style={{ 
                  marginLeft: designSystem.spacing.xs,
                  fontSize: designSystem.typography.caption.fontSize,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  Längste Serie
                </Text>
              </View>
              <Text style={{ 
                fontSize: 28,
                fontWeight: '700',
                color: designSystem.colors.textPrimary,
                marginBottom: 2
              }}>
                {typeof longestStreak !== 'object' ? 0 : longestStreak.days}
              </Text>
              <Text style={{ 
                fontSize: designSystem.typography.small.fontSize,
                color: designSystem.colors.textTertiary
              }}>
                Tage in Folge
              </Text>
            </View>
          </View>
          
          {/* Time & Weekly Cards Row */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: designSystem.spacing.md 
          }}>
            <View style={{ 
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg,
              marginRight: designSystem.spacing.md,
              ...designSystem.shadow.sm
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
                <Clock size={18} color={designSystem.colors.tertiary} />
                <Text style={{ 
                  marginLeft: designSystem.spacing.xs,
                  fontSize: designSystem.typography.caption.fontSize,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  Trainingszeit
                </Text>
              </View>
              <Text style={{ 
                fontSize: 28,
                fontWeight: '700',
                color: designSystem.colors.textPrimary,
                marginBottom: 2
              }}>
                {avgSessionDuration}<Text style={{ fontSize: 16 }}> min</Text>
              </Text>
              <Text style={{ 
                fontSize: designSystem.typography.small.fontSize,
                color: designSystem.colors.textTertiary
              }}>
                Ø pro Training
              </Text>
              {stats.averageSessionDuration.trend !== 0 && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  marginTop: designSystem.spacing.xs
                }}>
                  {stats.averageSessionDuration.trend > 0 ? (
                    <TrendingUp size={12} color={designSystem.colors.success} />
                  ) : (
                    <TrendingUp size={12} color={designSystem.colors.textTertiary} 
                      style={{ transform: [{ rotate: '180deg' }] }} />
                  )}
                  <Text style={{ 
                    marginLeft: 2,
                    fontSize: designSystem.typography.small.fontSize,
                    color: stats.averageSessionDuration.trend > 0 ? 
                      designSystem.colors.success : designSystem.colors.textTertiary
                  }}>
                    {Math.abs(stats.averageSessionDuration.trend)}%
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ 
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg,
              ...designSystem.shadow.sm
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
                <Activity size={18} color={designSystem.colors.success} />
                <Text style={{ 
                  marginLeft: designSystem.spacing.xs,
                  fontSize: designSystem.typography.caption.fontSize,
                  fontWeight: "600",
                  color: designSystem.colors.textPrimary
                }}>
                  Wöchentlich
                </Text>
              </View>
              <Text style={{ 
                fontSize: 28,
                fontWeight: '700',
                color: designSystem.colors.textPrimary,
                marginBottom: 2
              }}>
                {weeklyWorkouts}
              </Text>
              <Text style={{ 
                fontSize: designSystem.typography.small.fontSize,
                color: designSystem.colors.textTertiary
              }}>
                Trainings im Schnitt
              </Text>
              {stats.weeklyWorkoutsAverage.trend !== 0 && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  marginTop: designSystem.spacing.xs
                }}>
                  {stats.weeklyWorkoutsAverage.trend > 0 ? (
                    <TrendingUp size={12} color={designSystem.colors.success} />
                  ) : (
                    <TrendingUp size={12} color={designSystem.colors.textTertiary} 
                      style={{ transform: [{ rotate: '180deg' }] }} />
                  )}
                  <Text style={{ 
                    marginLeft: 2,
                    fontSize: designSystem.typography.small.fontSize,
                    color: stats.weeklyWorkoutsAverage.trend > 0 ? 
                      designSystem.colors.success : designSystem.colors.textTertiary
                  }}>
                    {Math.abs(stats.weeklyWorkoutsAverage.trend)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Monthly Activity Card */}
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: designSystem.radii.md,
            padding: designSystem.spacing.lg,
            ...designSystem.shadow.sm
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.xs }}>
              <Activity size={20} color={designSystem.colors.secondary} />
              <Text style={{ 
                marginLeft: designSystem.spacing.xs,
                fontSize: designSystem.typography.caption.fontSize,
                fontWeight: "600",
                color: designSystem.colors.textPrimary
              }}>
                Aktivitätsübersicht
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ 
                  fontSize: 28,
                  fontWeight: '700',
                  color: designSystem.colors.textPrimary,
                  marginBottom: 2
                }}>
                  {totalWorkouts}
                </Text>
                <Text style={{ 
                  fontSize: designSystem.typography.small.fontSize,
                  color: designSystem.colors.textTertiary
                }}>
                  Trainingseinheiten
                </Text>
              </View>
              
              {monthlyProgress > 0 && (
                <View style={{ 
                  backgroundColor: designSystem.colors.successLight,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: designSystem.radii.sm
                }}>
                  <TrendingUp size={12} color={designSystem.colors.success} />
                  <Text style={{ 
                    marginLeft: 4, 
                    fontSize: designSystem.typography.small.fontSize,
                    fontWeight: '500',
                    color: designSystem.colors.success
                  }}>
                    +{monthlyProgress}% diesen Monat
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {/* Workout-Kalender-Heatmap */}
        <View style={{ marginBottom: designSystem.spacing.xxl }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: designSystem.spacing.md 
          }}>
            <Calendar size={16} color={designSystem.colors.textSecondary} />
            <Text style={{ 
              marginLeft: designSystem.spacing.xs,
              fontSize: designSystem.typography.caption.fontSize,
              fontWeight: "600",
              letterSpacing: 0.5,
              color: designSystem.colors.textSecondary
            }}>
              TRAININGSKALENDER
            </Text>
          </View>
          
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: designSystem.radii.lg,
            padding: designSystem.spacing.lg,
            ...designSystem.shadow.sm
          }}>
            <MonthlyHeatmap onDayPress={handleDateSelect} months={1} />
          </View>
        </View>
        
        {/* Exercise Progression Widget */}
        <View style={{ marginBottom: designSystem.spacing.xxl }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: designSystem.spacing.md 
          }}>
            <Dumbbell size={16} color={designSystem.colors.textSecondary} />
            <Text style={{ 
              marginLeft: designSystem.spacing.xs,
              fontSize: designSystem.typography.caption.fontSize,
              fontWeight: "600",
              letterSpacing: 0.5,
              color: designSystem.colors.textSecondary
            }}>
              ÜBUNGSFORTSCHRITT
            </Text>
            
            {/* Show back button when showing exercise detail */}
            {showExerciseDetail && (
              <TouchableOpacity
                onPress={() => setShowExerciseDetail(false)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 'auto'
                }}
              >
                <Text style={{ 
                  fontSize: 12, 
                  color: designSystem.colors.primary, 
                  marginRight: 4 
                }}>
                  Zurück
                </Text>
                <ChevronRight size={14} color={designSystem.colors.primary} style={{transform: [{rotate: '180deg'}]}} />
              </TouchableOpacity>
            )}
          </View>
          
          {!showExerciseDetail ? (
            // Show top progression widget
            <ExerciseProgression 
              route={{ name: 'TopProgress' }} 
              navigation={{ 
                navigate: () => setModalVisible(true) 
              }} 
            />
          ) : (
            // Show exercise detail
            <ExerciseProgression 
              route={{ 
                name: 'ExerciseDetail', 
                params: { exerciseId: selectedExerciseId } 
              }} 
              navigation={modalNavigation}
            />
          )}
        </View>
      </Animated.ScrollView>
      
      {/* Exercise List Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (modalView === 'detail') {
            setModalView('list');
          } else {
            setModalVisible(false);
          }
        }}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{ 
            backgroundColor: 'white',
            borderTopLeftRadius: designSystem.radii.lg,
            borderTopRightRadius: designSystem.radii.lg,
            height: '80%',
          }}>
            {/* Modal Header */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: designSystem.spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: designSystem.colors.border
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {modalView === 'detail' && (
                  <TouchableOpacity 
                    onPress={() => setModalView('list')}
                    style={{ marginRight: designSystem.spacing.sm }}
                  >
                    <ChevronLeft size={20} color={designSystem.colors.primary} />
                  </TouchableOpacity>
                )}
              
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: designSystem.colors.textPrimary 
                }}>
                  {modalView === 'list' ? 'Alle Übungen' : 'Übungsdetails'}
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={designSystem.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {modalView === 'list' ? (
              <>
                {/* Suchfeld - nur in der Listenansicht */}
                <View style={{ 
                  padding: designSystem.spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: designSystem.colors.border
                }}>
                  <View style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: designSystem.colors.backgroundSecondary,
                    borderRadius: designSystem.radii.sm,
                    paddingHorizontal: designSystem.spacing.sm,
                    paddingVertical: 8
                  }}>
                    <Search size={18} color={designSystem.colors.textTertiary} style={{ marginRight: 8 }} />
                    <TextInput 
                      placeholder="Übung suchen..."
                      placeholderTextColor={designSystem.colors.textTertiary}
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      style={{ 
                        flex: 1,
                        fontSize: 16,
                        color: designSystem.colors.textPrimary
                      }}
                    />
                    {searchTerm ? (
                      <TouchableOpacity onPress={() => setSearchTerm('')}>
                        <X size={16} color={designSystem.colors.textTertiary} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                
                {/* Übungsliste */}
                <View style={{ flex: 1 }}>
                  <ExerciseListWithSearch 
                    searchTerm={searchTerm} 
                    navigation={modalNavigation} 
                  />
                </View>
              </>
            ) : (
              /* Übungsdetails */
              <View style={{ flex: 1 }}>
                <ExerciseProgression 
                  route={{ 
                    name: 'ExerciseDetail', 
                    params: { exerciseId: selectedExerciseId } 
                  }} 
                  navigation={modalNavigation}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Workout Details Dialog - iOS-Style */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="rounded-3xl max-w-md mx-auto overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderWidth: 1,
            borderColor: designSystem.colors.border,
            shadowColor: designSystem.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <DialogHeader className="mb-2">
            <DialogTitle className="text-center pb-2">
              {selectedDate && (
                <View>
                  <Text style={{ 
                    fontSize: designSystem.typography.heading3.fontSize,
                    fontWeight: "600",
                    color: designSystem.colors.textPrimary
                  }}>
                    {format(selectedDate, "EEEE", { locale: de })}
                  </Text>
                  <Text style={{ 
                    fontSize: designSystem.typography.caption.fontSize,
                    color: designSystem.colors.textSecondary
                  }}>
                    {format(selectedDate, "dd. MMMM yyyy", { locale: de })}
                  </Text>
                </View>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout ? (
            <View style={{ paddingTop: designSystem.spacing.xs }}>
              {/* Workout Title with Icon */}
              <View style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: designSystem.radii.lg,
                padding: designSystem.spacing.lg,
                marginBottom: designSystem.spacing.md,
                ...designSystem.shadow.sm
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ 
                    padding: designSystem.spacing.sm,
                    borderRadius: designSystem.radii.sm,
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    marginRight: designSystem.spacing.sm,
                    ...designSystem.shadow.sm
                  }}>
                    <Dumbbell size={20} color={designSystem.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: designSystem.typography.heading3.fontSize,
                      fontWeight: "600",
                      color: designSystem.colors.textPrimary,
                      marginBottom: 4
                    }}>
                      {selectedWorkout.workoutName}
                    </Text>
                    <View style={{ 
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(245, 247, 250, 0.95)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: designSystem.radii.sm,
                      alignSelf: 'flex-start',
                      borderWidth: 0.5,
                      borderColor: designSystem.colors.border
                    }}>
                      <Clock size={14} color={designSystem.colors.textTertiary} style={{ marginRight: 4 }} />
                      <Text style={{ 
                        fontSize: designSystem.typography.small.fontSize,
                        color: designSystem.colors.textSecondary
                      }}>
                        {formatDuration(selectedWorkout.duration)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Übungen Liste */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: designSystem.spacing.sm,
                paddingHorizontal: 4
              }}>
                <Text style={{ 
                  fontSize: designSystem.typography.caption.fontSize,
                  fontWeight: "600",
                  color: designSystem.colors.textSecondary
                }}>
                  Übungen
                </Text>
                <View style={{ 
                  height: 1, 
                  flex: 1, 
                  marginLeft: designSystem.spacing.sm,
                  backgroundColor: 'rgba(230, 230, 235, 0.6)' 
                }} />
              </View>
              
              <View style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: designSystem.radii.lg,
                overflow: 'hidden',
                ...designSystem.shadow.sm
              }}>
                {selectedWorkout.entries.map((entry, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <View style={{ 
                        height: 1, 
                        backgroundColor: 'rgba(230, 230, 235, 0.6)'
                      }} />
                    )}
                    <View style={{ padding: designSystem.spacing.lg }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 16, 
                          backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: designSystem.spacing.sm
                        }}>
                          <Text style={{ 
                            fontSize: designSystem.typography.small.fontSize,
                            fontWeight: "600",
                            color: designSystem.colors.primary
                          }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={{ 
                          flex: 1,
                          fontSize: designSystem.typography.body.fontSize,
                          fontWeight: "600",
                          color: designSystem.colors.textPrimary
                        }}>
                          {entry.exerciseName}
                        </Text>
                      </View>
                      <View style={{ 
                        flexDirection: 'row', 
                        marginTop: designSystem.spacing.md, 
                        marginLeft: 40
                      }}>
                        <View style={{ 
                          backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: designSystem.radii.sm,
                          marginRight: 8
                        }}>
                          <Text style={{ 
                            fontSize: designSystem.typography.small.fontSize,
                            fontWeight: "600",
                            color: designSystem.colors.primary
                          }}>
                            {getSetsDisplay(entry.sets)}× Sätze
                          </Text>
                        </View>
                        <View style={{ 
                          backgroundColor: designSystem.colors.backgroundSecondary,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: designSystem.radii.sm,
                          marginRight: 8,
                          borderWidth: 0.5,
                          borderColor: designSystem.colors.border
                        }}>
                          <Text style={{ 
                            fontSize: designSystem.typography.small.fontSize,
                            color: designSystem.colors.textSecondary
                          }}>
                            {entry.reps || 0} Wdh.
                          </Text>
                        </View>
                        <View style={{ 
                          backgroundColor: designSystem.colors.backgroundSecondary,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: designSystem.radii.sm,
                          borderWidth: 0.5,
                          borderColor: designSystem.colors.border
                        }}>
                          <Text style={{ 
                            fontSize: designSystem.typography.small.fontSize,
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
              backgroundColor: 'rgba(248, 250, 252, 0.95)',
              padding: designSystem.spacing.xl,
              alignItems: 'center',
              borderRadius: designSystem.radii.lg,
              marginVertical: designSystem.spacing.md,
              borderWidth: 1,
              borderColor: designSystem.colors.border
            }}>
              <View style={{ 
                backgroundColor: designSystem.colors.background,
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: designSystem.spacing.md,
                ...designSystem.shadow.sm
              }}>
                <Calendar size={28} color={designSystem.colors.primary} />
              </View>
              <Text style={{ 
                fontSize: designSystem.typography.body.fontSize,
                fontWeight: '600',
                color: designSystem.colors.textSecondary,
                marginBottom: 8
              }}>
                Kein Training an diesem Tag
              </Text>
              <Text style={{ 
                fontSize: designSystem.typography.small.fontSize,
                color: designSystem.colors.textTertiary,
                textAlign: 'center',
                paddingHorizontal: designSystem.spacing.lg
              }}>
                Plane dein nächstes Training, um deinen Fortschritt zu verfolgen.
              </Text>
            </View>
          )}
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}

// Zusätzliche Komponente für die Übungsliste mit Suchfunktion
const ExerciseListWithSearch = ({ 
  searchTerm, 
  navigation 
}: { 
  searchTerm: string;
  navigation: { navigate: (screen: string, params: any) => void } 
}) => {
  const { getExerciseRecords } = useWorkoutHistoryStore();
  const { exercises } = useExerciseStore();
  
  // Design System for consistent styling
  const designSystem = {
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32
    },
    radii: {
      sm: 16,
      md: 20,
      lg: 24
    },
    shadow: {
      sm: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2
      }
    },
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: 'rgba(248, 250, 252, 0.95)',
      primary: '#22C55E',
      primaryLight: 'rgba(34, 197, 94, 0.08)',
      primaryMedium: 'rgba(34, 197, 94, 0.15)',
      secondary: '#7A86E8',
      secondaryLight: 'rgba(122, 134, 232, 0.08)',
      textPrimary: '#111827',
      textSecondary: '#4B5563',
      textTertiary: '#9CA3AF',
      border: 'rgba(229, 231, 235, 0.8)'
    }
  };
  
  // Filter exercises based on search term
  const filteredExercises = React.useMemo(() => {
    if (!exercises) return [];
    
    if (!searchTerm) return exercises;
    
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, searchTerm]);
  
  // Use ExerciseProgressionList's calculation for progress
  const exercisesWithProgress = React.useMemo(() => {
    if (!filteredExercises || filteredExercises.length === 0) return [];
    
    const progressList = filteredExercises.map(exercise => {
      const records = getExerciseRecords(exercise.id);
      if (records.length < 1) return { exercise, progress: 0, hasData: false };
      
      // Get all non-zero weights from all records
      const allWeights: number[] = [];
      records.forEach(record => {
        record.sets.forEach(set => {
          const weight = set.weight !== null && set.weight !== undefined 
            ? (typeof set.weight === 'number' ? set.weight : parseFloat(String(set.weight)) || 0)
            : 0;
          if (weight > 0) {
            allWeights.push(weight);
          }
        });
      });
      
      if (allWeights.length < 2) {
        return { 
          exercise, 
          progress: 0, 
          hasData: allWeights.length > 0,
          recordCount: records.length,
          latestWeight: allWeights.length > 0 ? Math.max(...allWeights) : 0,
          firstWeight: allWeights.length > 0 ? Math.min(...allWeights) : 0
        };
      }
      
      // Sort weights from lowest to highest
      allWeights.sort((a, b) => a - b);
      
      // Use the 25% lowest weights as "start" and 25% highest as "end"
      const lowestCount = Math.max(1, Math.floor(allWeights.length * 0.25));
      const highestCount = Math.max(1, Math.floor(allWeights.length * 0.25));
      
      const lowestWeights = allWeights.slice(0, lowestCount);
      const highestWeights = allWeights.slice(-highestCount);
      
      const firstWeight = lowestWeights.reduce((sum, w) => sum + w, 0) / lowestWeights.length;
      const latestWeight = highestWeights.reduce((sum, w) => sum + w, 0) / highestWeights.length;
      
      const progressPercentage = firstWeight > 0 
        ? ((latestWeight - firstWeight) / firstWeight) * 100 
        : 0;
      
      return { 
        exercise, 
        progress: progressPercentage,
        latestWeight,
        firstWeight,
        hasData: true,
        recordCount: records.length
      };
    });
    
    // Sortiere nach höchstem Fortschritt, dann Übungen ohne Daten
    return progressList
      .sort((a, b) => {
        if (a.hasData && b.hasData) return b.progress - a.progress;
        if (a.hasData) return -1;
        if (b.hasData) return 1;
        return 0;
      });
    
  }, [filteredExercises, getExerciseRecords]);
  
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: designSystem.spacing.md }}>
      <View style={{ gap: designSystem.spacing.md }}>
        {exercisesWithProgress.map((item, index) => (
          <TouchableOpacity 
            key={item.exercise.id}
            onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.exercise.id })}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: designSystem.radii.md,
              padding: designSystem.spacing.lg,
              ...designSystem.shadow.sm,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item.hasData 
                ? (index < 3 ? designSystem.colors.primaryMedium : designSystem.colors.secondaryLight)
                : 'rgba(229, 231, 235, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: designSystem.spacing.md
            }}>
              <Dumbbell 
                size={18} 
                color={item.hasData 
                  ? (index < 3 ? designSystem.colors.primary : designSystem.colors.secondary)
                  : designSystem.colors.textTertiary
                } 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: designSystem.colors.textPrimary,
                marginBottom: item.hasData ? 4 : 0
              }}>
                {item.exercise.name}
              </Text>
              
              {item.hasData && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
                    {item.recordCount} Einträge
                  </Text>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: designSystem.colors.textTertiary, marginHorizontal: 6 }} />
                  <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
                    {item.firstWeight.toFixed(1)} kg → {item.latestWeight.toFixed(1)} kg
                  </Text>
                </View>
              )}
            </View>
            
            {item.hasData ? (
              <View style={{
                backgroundColor: item.progress > 0 
                  ? designSystem.colors.primaryLight 
                  : (item.progress < 0 ? 'rgba(239, 68, 68, 0.08)' : designSystem.colors.backgroundSecondary),
                paddingHorizontal: designSystem.spacing.sm,
                paddingVertical: 6,
                borderRadius: designSystem.radii.sm,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                {item.progress !== 0 && (
                  <TrendingUp 
                    size={14} 
                    color={item.progress > 0 ? designSystem.colors.primary : '#EF4444'} 
                    style={{ 
                      marginRight: 2,
                      transform: [{ rotate: item.progress < 0 ? '90deg' : '0deg' }]
                    }} 
                  />
                )}
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600', 
                  color: item.progress > 0 
                    ? designSystem.colors.primary 
                    : (item.progress < 0 ? '#EF4444' : designSystem.colors.textTertiary)
                }}>
                  {item.progress > 0 ? '+' : ''}{item.progress.toFixed(0)}%
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary }}>
                Keine Daten
              </Text>
            )}
            
            <ChevronRight size={16} color={designSystem.colors.textTertiary} style={{ marginLeft: designSystem.spacing.sm }} />
          </TouchableOpacity>
        ))}
        
        {exercisesWithProgress.length === 0 && (
          <View style={{ 
            padding: designSystem.spacing.xl, 
            alignItems: 'center',
            backgroundColor: designSystem.colors.backgroundSecondary,
            borderRadius: designSystem.radii.md
          }}>
            <Text style={{ color: designSystem.colors.textSecondary }}>
              {searchTerm ? 'Keine Übungen gefunden' : 'Keine Übungen verfügbar'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};