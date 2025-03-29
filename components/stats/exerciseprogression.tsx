import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { useWorkoutStats } from "~/hooks/use-workout-stats";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { format, subDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { LineChart } from 'react-native-chart-kit';
import { Activity, BarChart2, Dumbbell, ChevronRight, Calendar, TrendingUp, Clock } from "~/lib/icons/Icons";
import { ArrowRight } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';
import { Exercise, ExerciseRecord } from "~/lib/types";

// Extend the ExerciseRecord interface to include date property
interface ExerciseRecordWithDate extends ExerciseRecord {
  date?: Date;
}

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
    primaryMedium: 'rgba(34, 197, 94, 0.15)',
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

// Hilfsfunktion zum Extrahieren des maximalen Gewichts aus einer Übungssession
const getMaxWeightFromRecord = (record: ExerciseRecordWithDate): number => {
  if (!record || !record.sets || record.sets.length === 0) return 0;
  
  return Math.max(...record.sets.map(set => {
    if (set.weight !== null && set.weight !== undefined) {
      return typeof set.weight === 'number' ? set.weight : parseFloat(String(set.weight)) || 0;
    }
    return 0;
  }));
};

// Hilfsfunktion zum Berechnen des Gesamtvolumens einer Übungssession
const getTotalVolumeFromRecord = (record: ExerciseRecordWithDate): number => {
  if (!record || !record.sets || record.sets.length === 0) return 0;
  
  return record.sets.reduce((total, set) => {
    const reps = set.reps !== null && set.reps !== undefined 
      ? (typeof set.reps === 'number' ? set.reps : parseFloat(String(set.reps)) || 0) 
      : 0;
    const weight = set.weight !== null && set.weight !== undefined 
      ? (typeof set.weight === 'number' ? set.weight : parseFloat(String(set.weight)) || 0)
      : 0;
    return total + (reps * weight);
  }, 0);
};

// Komponente für das Top-Progression-Widget auf der StatsScreen
export const TopProgressionWidget = ({ onViewAllPress }: { onViewAllPress: () => void }) => {
  const { getExerciseRecords } = useWorkoutHistoryStore();
  const { exercises } = useExerciseStore();
  
  // Berechne die Top-Progression-Übung
  const topProgressExercise = useMemo(() => {
    if (!exercises || exercises.length === 0) return null;
    
    const exerciseProgress = exercises.map(exercise => {
      const records = getExerciseRecords(exercise.id);
      if (records.length < 2) return { exercise, progress: 0 };
      
      // Get all non-zero weights from all records
      const allWeights: number[] = []; // Add explicit type here
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
      if (allWeights.length < 2) return { exercise, progress: 0 };
      
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
        firstWeight 
      };
    });
    
    // Sortiere nach höchstem Fortschritt
    return exerciseProgress
      .filter(item => item.progress > 0 && !isNaN(item.progress))
      .sort((a, b) => b.progress - a.progress)[0];
    
  }, [exercises, getExerciseRecords]);
  if (!topProgressExercise) {
    return (
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm,
        marginBottom: designSystem.spacing.md
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
          <View style={{
            padding: designSystem.spacing.xs,
            borderRadius: designSystem.radii.sm,
            backgroundColor: designSystem.colors.primaryLight,
            marginRight: designSystem.spacing.sm
          }}>
            <TrendingUp size={18} color={designSystem.colors.primary} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary }}>
            Debug: Übungsfortschritt
          </Text>
        </View>
        
        {/* Debug Information */}
        <View style={{ 
          backgroundColor: designSystem.colors.backgroundSecondary, 
          padding: designSystem.spacing.md,
          borderRadius: designSystem.radii.sm,
          marginBottom: designSystem.spacing.md
        }}>
          <Text style={{ color: designSystem.colors.textSecondary, marginBottom: 8 }}>Übungs-Daten:</Text>
          <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
            Anzahl Übungen: {exercises?.length || 0}
          </Text>
          
          {exercises && exercises.length > 0 && exercises.slice(0, 3).map((ex, idx) => (
            <View key={idx} style={{ marginTop: 8, paddingTop: 8, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: designSystem.colors.border }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: designSystem.colors.textPrimary }}>
                Übung {idx+1}: {ex.name} (ID: {ex.id})
              </Text>
              
              {(() => {
                const records = getExerciseRecords(ex.id);
                return (
                  <>
                    <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
                      Trainingseinträge: {records.length}
                    </Text>
                    
                    {records.length > 0 && (
                      <>
                        <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
                          Datum vorhanden: {records[0].date ? 'Ja' : 'Nein'}
                        </Text>
                        <Text style={{ fontSize: 12, color: designSystem.colors.textSecondary }}>
                          Gewichte: {records.map(r => getMaxWeightFromRecord(r)).join(', ')}
                        </Text>
                      </>
                    )}
                  </>
                );
              })()}
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          onPress={onViewAllPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: designSystem.colors.primaryLight,
            paddingHorizontal: designSystem.spacing.sm,
            paddingVertical: 6,
            borderRadius: designSystem.radii.sm,
            alignSelf: 'flex-start'
          }}
        >
          <Text style={{ fontSize: 12, color: designSystem.colors.primary, fontWeight: '500', marginRight: 4 }}>
            Übungen anzeigen
          </Text>
          <ChevronRight size={14} color={designSystem.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }
  
  const { exercise, progress, latestWeight, firstWeight } = topProgressExercise;
  
  return (
    <View style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: designSystem.radii.lg,
      padding: designSystem.spacing.lg,
      ...designSystem.shadow.sm,
      marginBottom: designSystem.spacing.md
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            padding: designSystem.spacing.xs,
            borderRadius: designSystem.radii.sm,
            backgroundColor: designSystem.colors.primaryLight,
            marginRight: designSystem.spacing.sm
          }}>
            <TrendingUp size={18} color={designSystem.colors.primary} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary }}>
            Beste Progression
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={onViewAllPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: designSystem.colors.primaryLight,
            paddingHorizontal: designSystem.spacing.sm,
            paddingVertical: 6,
            borderRadius: designSystem.radii.sm
          }}
        >
          <Text style={{ fontSize: 12, color: designSystem.colors.primary, fontWeight: '500', marginRight: 4 }}>
            Alle anzeigen
          </Text>
          <ArrowRight size={14} color={designSystem.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: designSystem.spacing.md,
        backgroundColor: designSystem.colors.backgroundSecondary,
        borderRadius: designSystem.radii.md,
        marginBottom: designSystem.spacing.sm
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: designSystem.colors.primaryMedium,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: designSystem.spacing.md
        }}>
          <Dumbbell size={20} color={designSystem.colors.primary} />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary, marginBottom: 2 }}>
            {exercise.name}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: designSystem.colors.textSecondary, marginRight: 6 }}>
              {firstWeight} kg
            </Text>
            <TrendingUp size={12} color={designSystem.colors.textTertiary} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: designSystem.colors.primary, marginLeft: 6 }}>
              {latestWeight} kg
            </Text>
          </View>
        </View>
        
        <View style={{
          backgroundColor: designSystem.colors.primaryLight,
          paddingHorizontal: designSystem.spacing.sm,
          paddingVertical: 6,
          borderRadius: designSystem.radii.sm,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <TrendingUp size={14} color={designSystem.colors.primary} style={{ marginRight: 2 }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: designSystem.colors.primary }}>
            +{progress.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

// Liste aller Übungen mit Progression
export const ExerciseProgressionList = ({ navigation }: { navigation: any }) => {
  const { getExerciseRecords } = useWorkoutHistoryStore();
  const { exercises } = useExerciseStore();
  
// Berechne die Progression für alle Übungen
const exercisesWithProgress = useMemo(() => {
    if (!exercises || exercises.length === 0) return [];
    
    const progressList = exercises.map(exercise => {
      const records = getExerciseRecords(exercise.id);
      if (records.length < 1) return { exercise, progress: 0, hasData: false };
      
      // Get all non-zero weights from all records
      const allWeights: number[] = []; // Add explicit type here
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
    
  }, [exercises, getExerciseRecords]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: designSystem.spacing.md }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: '700', 
        color: designSystem.colors.textPrimary,
        marginBottom: designSystem.spacing.lg,
        marginTop: designSystem.spacing.sm,
        marginLeft: designSystem.spacing.xs
      }}>
        Übungsprogression
      </Text>
      
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
                    {item.firstWeight} kg → {item.latestWeight} kg
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
            
            <ArrowRight size={16} color={designSystem.colors.textTertiary} style={{ marginLeft: designSystem.spacing.sm }} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Detailansicht einer Übung mit Progressionsgraph
export const ExerciseProgressionDetail = ({ route }: { route: any }) => {
  const { exerciseId } = route.params;
  const { getExerciseRecords } = useWorkoutHistoryStore();
  const { getExerciseById } = useExerciseStore();
  const exercise = getExerciseById(exerciseId);
  const screenWidth = Dimensions.get('window').width - 40;
  
  const [chartMetric, setChartMetric] = useState<'weight' | 'volume' | 'reps'>('weight');
  
  // Hole und verarbeite die Übungsdaten
  const exerciseData = useMemo(() => {
    if (!exercise) return { records: [], chartData: { labels: [], datasets: [{ data: [] }] } };
    
    const records = getExerciseRecords(exerciseId);
    
    // Sortiere Records nach Datum
    const sortedRecords = [...records].sort(
      (a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : new Date().getTime();
        const dateB = b.date ? new Date(b.date).getTime() : new Date().getTime();
        return dateA - dateB;
      }
    );
    
    // Extrahiere Daten für das Chart
    const chartLabels: string[] = [];
    const weightData: number[] = [];
    const volumeData: number[] = [];
    const repData: number[] = [];
    
    sortedRecords.forEach(record => {
      // Extrahiere Datum
      const date = record.date ? new Date(record.date) : new Date();
      chartLabels.push(format(date, 'dd.MM'));
      
      // Maximalgewicht
      weightData.push(getMaxWeightFromRecord(record));
      
      // Gesamtvolumen
      volumeData.push(getTotalVolumeFromRecord(record) / 100); // Skaliere für bessere Darstellung
      
      // Durchschnittliche Wiederholungen
      const totalReps = record.sets.reduce((sum, set) => {
        return sum + (set.reps || 0);
      }, 0);
      
      repData.push(record.sets.length > 0 ? Math.round(totalReps / record.sets.length) : 0);
    });
    
    // Erstelle Chart-Daten
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartMetric === 'weight' ? weightData : 
                chartMetric === 'volume' ? volumeData : repData,
          color: () => designSystem.colors.primary,
          strokeWidth: 2
        }
      ],
      legend: [chartMetric === 'weight' ? 'Gewicht (kg)' : 
               chartMetric === 'volume' ? 'Volumen (kg×10)' : 'Ø Wiederholungen']
    };
    
    return { records: sortedRecords, chartData };
  }, [exercise, exerciseId, getExerciseRecords, chartMetric]);
  
  if (!exercise) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: designSystem.colors.textSecondary }}>Übung nicht gefunden</Text>
    </View>
  );

  // Berechne die Gesamtprogression
  const calculateProgress = () => {
    const { records } = exerciseData;
    if (records.length < 2) return { percentage: 0, first: 0, latest: 0 };
    
    const first = getMaxWeightFromRecord(records[0]);
    const latest = getMaxWeightFromRecord(records[records.length - 1]);
    
    const percentage = first > 0 ? ((latest - first) / first) * 100 : 0;
    
    return { percentage, first, latest };
  };
  
  const progress = calculateProgress();
  const isPositive = progress.percentage > 0;
  
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: designSystem.spacing.md }}>
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: designSystem.radii.lg,
        padding: designSystem.spacing.lg,
        ...designSystem.shadow.sm,
        marginBottom: designSystem.spacing.md
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designSystem.spacing.md }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: designSystem.colors.primaryMedium,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: designSystem.spacing.md
          }}>
            <Dumbbell size={22} color={designSystem.colors.primary} />
          </View>
          
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: designSystem.colors.textPrimary, marginBottom: 2 }}>
              {exercise.name}
            </Text>
            <Text style={{ fontSize: 14, color: designSystem.colors.textSecondary }}>
              {exerciseData.records.length} Einträge
            </Text>
          </View>
        </View>
        
        {exerciseData.records.length >= 2 && (
          <View style={{
            backgroundColor: isPositive ? designSystem.colors.primaryLight : 'rgba(239, 68, 68, 0.08)',
            borderRadius: designSystem.radii.md,
            padding: designSystem.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: designSystem.spacing.md
          }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: designSystem.colors.textPrimary }}>
              Gesamtfortschritt
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: designSystem.colors.textSecondary, marginRight: 8 }}>
                {progress.first} kg → {progress.latest} kg
              </Text>
              
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                paddingHorizontal: designSystem.spacing.sm,
                paddingVertical: 6,
                borderRadius: designSystem.radii.sm,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <TrendingUp 
                  size={14} 
                  color={isPositive ? designSystem.colors.primary : '#EF4444'} 
                  style={{ 
                    marginRight: 2,
                    transform: [{ rotate: !isPositive ? '90deg' : '0deg' }]
                  }} 
                />
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600', 
                  color: isPositive ? designSystem.colors.primary : '#EF4444'
                }}>
                  {isPositive ? '+' : ''}{progress.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Chart-Typ-Auswahl */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginBottom: designSystem.spacing.md,
          backgroundColor: designSystem.colors.backgroundSecondary,
          borderRadius: designSystem.radii.md,
          padding: 2
        }}>
          <TouchableOpacity 
            onPress={() => setChartMetric('weight')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: chartMetric === 'weight' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: designSystem.radii.sm
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              fontWeight: chartMetric === 'weight' ? '600' : '400',
              color: chartMetric === 'weight' ? designSystem.colors.primary : designSystem.colors.textSecondary
            }}>
              Gewicht
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setChartMetric('volume')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: chartMetric === 'volume' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: designSystem.radii.sm
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              fontWeight: chartMetric === 'volume' ? '600' : '400',
              color: chartMetric === 'volume' ? designSystem.colors.primary : designSystem.colors.textSecondary
            }}>
              Volumen
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setChartMetric('reps')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: chartMetric === 'reps' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: designSystem.radii.sm
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              fontWeight: chartMetric === 'reps' ? '600' : '400',
              color: chartMetric === 'reps' ? designSystem.colors.primary : designSystem.colors.textSecondary
            }}>
              Wiederholungen
            </Text>
          </TouchableOpacity>
        </View>
        
        {exerciseData.records.length >= 2 ? (
          <LineChart
            data={exerciseData.chartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: designSystem.colors.primary
              }
            }}
            bezier
            style={{
              borderRadius: designSystem.radii.md,
              marginVertical: designSystem.spacing.sm
            }}
          />
        ) : (
          <View style={{ 
            height: 200, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: designSystem.colors.backgroundSecondary,
            borderRadius: designSystem.radii.md
          }}>
            <Text style={{ color: designSystem.colors.textSecondary, marginBottom: 8 }}>
              Nicht genügend Daten für einen Graphen
            </Text>
            <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary }}>
              Mindestens 2 Trainings erforderlich
            </Text>
          </View>
        )}
      </View>
      
      {/* Letzte Trainings */}
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: designSystem.colors.textSecondary,
        marginBottom: designSystem.spacing.sm,
        marginLeft: designSystem.spacing.xs
      }}>
        Letzte Trainings
      </Text>
      
      <View style={{ gap: designSystem.spacing.md }}>
        {exerciseData.records.slice(0, 5).map((record, index) => {
          const date = record.date ? new Date(record.date) : new Date();
          const maxWeight = getMaxWeightFromRecord(record);
          const totalVolume = getTotalVolumeFromRecord(record);
          
          // Berechne Performance-Trend zwischen aktuellem und vorherigem Training
          let trendPercentage = 0;
          if (index < exerciseData.records.length - 1) {
            const prevMaxWeight = getMaxWeightFromRecord(exerciseData.records[index + 1]);
            trendPercentage = prevMaxWeight > 0 ? ((maxWeight - prevMaxWeight) / prevMaxWeight) * 100 : 0;
          }
          
          return (
            <View 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: designSystem.radii.md,
                padding: designSystem.spacing.md,
                ...designSystem.shadow.sm
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: designSystem.spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calendar size={16} color={designSystem.colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: designSystem.colors.textPrimary }}>
                    {format(date, 'EEEE, dd. MMMM yyyy', { locale: de })}
                  </Text>
                </View>
                
                {index > 0 && trendPercentage !== 0 && (
                  <View style={{
                    backgroundColor: trendPercentage > 0 ? designSystem.colors.primaryLight : 'rgba(239, 68, 68, 0.08)',
                    paddingHorizontal: designSystem.spacing.sm,
                    paddingVertical: 4,
                    borderRadius: designSystem.radii.sm,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <TrendingUp 
                      size={12} 
                      color={trendPercentage > 0 ? designSystem.colors.primary : '#EF4444'} 
                      style={{ 
                        marginRight: 2,
                        transform: [{ rotate: trendPercentage < 0 ? '90deg' : '0deg' }]
                      }} 
                    />
                    <Text style={{ 
                      fontSize: 12, 
                      fontWeight: '500', 
                      color: trendPercentage > 0 ? designSystem.colors.primary : '#EF4444'
                    }}>
                      {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                backgroundColor: designSystem.colors.backgroundSecondary, 
                borderRadius: designSystem.radii.sm,
                padding: designSystem.spacing.sm
              }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary, marginBottom: 2 }}>
                    Max. Gewicht
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary }}>
                    {maxWeight} kg
                  </Text>
                </View>
                
                <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(229, 231, 235, 0.5)' }}>
                  <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary, marginBottom: 2 }}>
                    Sätze
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary }}>
                    {record.sets.length}
                  </Text>
                </View>
                
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary, marginBottom: 2 }}>
                    Volumen
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: designSystem.colors.textPrimary }}>
                    {totalVolume} kg
                  </Text>
                </View>
              </View>
              
              <View style={{ marginTop: designSystem.spacing.sm }}>
                {record.sets.map((set, setIndex) => (
                  <View 
                    key={setIndex}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 4,
                      borderBottomWidth: setIndex < record.sets.length - 1 ? 1 : 0,
                      borderBottomColor: designSystem.colors.border
                    }}
                  >
                    <Text style={{ width: 80, color: designSystem.colors.textSecondary }}>
                      Satz {setIndex + 1}
                    </Text>
                    <Text style={{ 
                      flex: 1, 
                      fontWeight: '500', 
                      color: designSystem.colors.textPrimary,
                      textAlign: 'center'
                    }}>
                      {set.weight || 0} kg
                    </Text>
                    <Text style={{ width: 80, textAlign: 'right', color: designSystem.colors.textSecondary }}>
                      {set.reps || 0} Wdh.
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
        
        {exerciseData.records.length === 0 && (
          <View style={{
            padding: designSystem.spacing.xl,
            backgroundColor: designSystem.colors.backgroundSecondary,
            borderRadius: designSystem.radii.md,
            alignItems: 'center'
          }}>
            <Dumbbell size={24} color={designSystem.colors.textTertiary} style={{ marginBottom: designSystem.spacing.sm }} />
            <Text style={{ color: designSystem.colors.textSecondary, textAlign: 'center' }}>
              Keine Trainingseinträge für diese Übung vorhanden
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Hauptkomponente, die je nach Navigation-Route die entsprechende Unterkomponente rendert
export const ExerciseProgression = ({ route, navigation }: { route?: any, navigation?: any }) => {
  // Bestimme den anzuzeigenden Screen basierend auf der aktuellen Route
  const currentScreen = route?.name || 'TopProgress';
  
  const handleViewAllPress = () => {
    if (navigation) {
      navigation.navigate('ExerciseProgressionList');
    }
  };
  
  switch (currentScreen) {
    case 'ExerciseDetail':
      return <ExerciseProgressionDetail route={route} />;
    case 'ExerciseProgressionList':
      return <ExerciseProgressionList navigation={navigation} />;
    default:
      return <TopProgressionWidget onViewAllPress={handleViewAllPress} />;
  }
};