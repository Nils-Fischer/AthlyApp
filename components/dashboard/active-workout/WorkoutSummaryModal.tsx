// components/dashboard/active-workout/WorkoutSummaryModal.tsx
import React, { useState } from 'react';
import { View, Modal, ScrollView, TextInput, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { 
  Timer, 
  Dumbbell, 
  Flame, 
  Trophy, 
  Brain,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  BarChart3,
  Calendar
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { WorkoutPerformance } from '~/lib/types';
import { useWorkoutProgressStore } from '~/stores/workoutProgressStore';
import { generateIntelligentFeedback } from '~/lib/utils';

interface WorkoutProgress {
  trend: {
    lastFive: number[];  // Letzte 5 Leistungen
    average: number;     // Durchschnitt
    seasonBest: number;  // Beste Leistung
  };
  context: {
    daysFromLastWorkout: number;
    totalWorkouts: number;
    consistency: number; // % der geplanten Workouts
  };
}

interface WorkoutSummaryModalProps {
  isVisible: boolean;
  onClose: () => void;
  duration: number;
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  estimatedCalories: number;
  performance?: WorkoutPerformance;
}




const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} Std ${minutes} Min`;
  }
  return `${minutes} Minuten`;
};

type Mood = 'great' | 'good' | 'bad';
type Difficulty = 'easy' | 'perfect' | 'hard';

export const WorkoutSummaryModal = ({ 
  isVisible, 
  onClose, 
  duration, 
  totalVolume, 
  completedSets, 
  totalSets, 
  estimatedCalories 
}: WorkoutSummaryModalProps) => {
 
  const workoutProgress = useWorkoutProgressStore();
  const trend = workoutProgress.getTrend() ?? {
    lastFive: [],
    average: {
      volume: 0,
      intensity: 0,
      completion: 0
    },
    bestPerformance: {
      date: new Date().toISOString(),
      volume: 0,
      intensity: 0,
      completedSets: 0,
      totalSets: 0,
      duration: 0,
      exercises: []
    },
    consistency: 0,
    currentStreak: 0
  };
  const recovery = workoutProgress.getRecoveryRecommendation();
  // User Feedback States
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [userNote, setUserNote] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const fadeAnim = useSharedValue(1);
  const performanceChange = trend.lastFive.length > 0
  ? ((totalVolume - trend.average.volume) / trend.average.volume) * 100
  : 0;

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value
    };
  });
  const handleFinish = () => {

    const newPerformance: WorkoutPerformance = {
      date: new Date().toISOString(),
      volume: totalVolume,
      intensity: selectedDifficulty === 'hard' ? 90 : selectedDifficulty === 'perfect' ? 75 : 60,
      completedSets,
      totalSets,
      duration,
      exercises: [] // Hier müsstest du die Exercise-Performance hinzufügen
    };
    
    workoutProgress.addPerformance(newPerformance);

  if (selectedMood && selectedDifficulty) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowThankYou(true);
    setTimeout(() => {
      fadeAnim.value = withTiming(0, {
        duration: 300,
      }, () => {
        runOnJS(onClose)();
      });
    }, 1500);
  } else {
    onClose();
  }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <Animated.View style={fadeStyle} className="flex-1 bg-background">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
          <Animated.View 
            entering={FadeInDown.duration(500)}
            className="pb-20"
          >
            {/* Header Banner */}
            <View className="h-48 bg-primary/10">
              <View className="absolute inset-0 items-center justify-center">
                <View className="items-center">
                  <Trophy size={50} className="text-primary mb-4" />
                  <Text className="text-2xl font-bold mb-2">Training abgeschlossen!</Text>
                </View>
              </View>
            </View>

            {/* Main Content */}
            <View className="px-4 -mt-8">
              {/* Primary Stats Cards */}
              <View className="flex-row gap-4 mb-6">
                <Card className="flex-1 p-4 border-primary/10">
                  <View className="items-center">
                    <Dumbbell size={24} className="text-primary mb-2" />
                    <Text className="text-2xl font-bold">{totalVolume}</Text>
                    <Text className="text-sm text-muted-foreground">Volumen (kg)</Text>
                  </View>
                </Card>
                <Card className="flex-1 p-4 border-primary/10">
                  <View className="items-center">
                    <Flame size={24} className="text-primary mb-2" />
                    <Text className="text-2xl font-bold">{estimatedCalories}</Text>
                    <Text className="text-sm text-muted-foreground">Kalorien</Text>
                  </View>
                </Card>
              </View>

              {/* Detailed Stats */}
              <Card className="mb-6 border-primary/10">
                <View className="divide-y divide-border">
                  <View className="p-4 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Timer size={20} className="text-primary mr-3" />
                      <Text className="text-base">Trainingszeit</Text>
                    </View>
                    <Text className="text-lg font-semibold">{formatDuration(duration)}</Text>
                  </View>
                  
                  <View className="p-4 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <BarChart3 size={20} className="text-primary mr-3" />
                      <Text className="text-base">  Sets abgeschlossen</Text>
                    </View>
                    <Text className="text-lg font-semibold">{completedSets}/{totalSets}</Text>
                  </View>
                </View>
              </Card>

              {/* User Feedback Section */}
              <Card className="mb-6 border-primary/10">
                <View className="p-4">
                  <Text className="text-lg font-semibold mb-4">Wie war dein Training?</Text>
                  
                  {/* Mood Selection */}
               <View className="flex-row justify-around mb-6">
                    {[
                      { value: 'great', icon: Smile, label: 'Super' },
                      { value: 'good', icon: Meh, label: 'Okay' },
                      { value: 'bad', icon: Frown, label: 'Schwer' }
                    ].map(({ value, icon: Icon, label }) => (
                      <Pressable
                        key={value}
                        onPress={() => {
                          setSelectedMood(value as Mood);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className={`items-center p-3 rounded-xl ${
                          selectedMood === value 
                          ? 'bg-primary/10' 
                          : 'bg-secondary/5'
                        }`}
                      >
                        <View>
                          <Icon 
                            size={32} 
                            className={selectedMood === value ? 'text-primary' : 'text-muted-foreground'} 
                          />
                        </View>
                        <Text className={`text-sm mt-1 ${
                          selectedMood === value ? 'text-primary font-medium' : ''
                        }`}>
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                    {/* Difficulty Selection */}
                    <Text className="text-base mb-3">Schwierigkeitsgrad?</Text>
                    <View className="flex-row justify-around mb-6">
                      <Pressable
                        onPress={(e) => {
                          e.preventDefault();
                          setSelectedDifficulty('easy');
                        }}
                        className={`items-center p-3 rounded-xl ${selectedDifficulty === 'easy' ? 'bg-primary/10' : ''}`}
                      >
                        <ThumbsDown 
                          size={32} 
                          color={selectedDifficulty === 'easy' ? '#0091ff' : '#64748b'}
                        />
                        <Text className="text-sm mt-1">Zu leicht</Text>
                      </Pressable>
                    <Pressable
                      onPress={() => setSelectedDifficulty('perfect')}
                      className={`items-center p-3 rounded-xl ${selectedDifficulty === 'perfect' ? 'bg-primary/10' : ''}`}
                    >
                      <ThumbsUp size={32} className={selectedDifficulty === 'perfect' ? 'text-primary' : 'text-muted-foreground'} />
                      <Text className="text-sm mt-1">Perfekt</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setSelectedDifficulty('hard')}
                      className={`items-center p-3 rounded-xl ${selectedDifficulty === 'hard' ? 'bg-primary/10' : ''}`}
                    >
                      <ThumbsDown size={32} className={selectedDifficulty === 'hard' ? 'text-primary' : 'text-muted-foreground'} />
                      <Text className="text-sm mt-1">Zu schwer</Text>
                    </Pressable>
                  </View>
                  {(selectedMood && selectedDifficulty) && (
                    <Card className="mb-6 border-primary/10">
                      <View className="p-4">
                        <View className="flex-row items-center mb-4">
                          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                            <Brain size={24} className="text-primary" />
                          </View>
                          <View className="ml-3">
                            <Text className="text-lg font-semibold">Coach Feedback</Text>
                            <Text className="text-sm text-muted-foreground">Intelligente Analyse</Text>
                          </View>
                        </View>

                        {/* Hauptnachricht */}
                        <Text className="text-base text-foreground leading-relaxed mb-4">
                          {generateIntelligentFeedback(
                            selectedMood,
                            selectedDifficulty,
                            {
                              date: new Date().toISOString(),
                              volume: totalVolume,
                              intensity: selectedDifficulty === 'hard' ? 90 : selectedDifficulty === 'perfect' ? 75 : 60,
                              completedSets,
                              totalSets,
                              duration,
                              exercises: []
                            },
                            trend.lastFive
                          ).mainMessage}
                        </Text>

                        {/* Details */}
                        <View className="space-y-2">
                          {generateIntelligentFeedback(
                            selectedMood,
                            selectedDifficulty,
                            {
                              date: new Date().toISOString(),
                              volume: totalVolume,
                              intensity: selectedDifficulty === 'hard' ? 90 : selectedDifficulty === 'perfect' ? 75 : 60,
                              completedSets,
                              totalSets,
                              duration,
                              exercises: []
                            },
                            trend.lastFive
                          ).details.map((detail, index) => (
                            <View key={index} className="flex-row items-center bg-secondary/5 p-3 rounded-lg">
                              <View className={`w-2 h-2 rounded-full mr-3 ${
                                detail.priority === 'high' ? 'bg-primary' : 
                                detail.priority === 'medium' ? 'bg-yellow-500' : 
                                'bg-muted-foreground'
                              }`} />
                              <Text className="text-sm">{detail.message}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </Card>
                  )}

                  {/* Notes Section */}
                  <Text className="text-base mb-3">Notizen für das nächste Training (optional)</Text>
                  <TextInput
                    className="bg-secondary/10 p-3 rounded-xl min-h-[100] text-base"
                    multiline
                    value={userNote}
                    onChangeText={setUserNote}
                    placeholder="z.B. Mehr Fokus auf Beintraining..."
                    placeholderTextColor="#666"
                  />
                </View>
              </Card>
            </View>
                    {/* Progress Section mit verbessertem Design */}
                    <Card className="mb-6 border-primary/10">
                      <View className="p-4">
                        <View className="flex-row items-center mb-6">
                          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                            <BarChart3 size={24} className="text-primary" />
                          </View>
                          <View className="ml-3">
                            <Text className="text-lg font-semibold">Trainings-Fortschritt</Text>
                            <Text className="text-sm text-muted-foreground">Deine Leistungsentwicklung</Text>
                          </View>
                        </View>

                        {/* Leistungsmetriken */}
                        <View className="flex-row justify-between mb-6 bg-secondary/5 p-4 rounded-xl">
                          <View className="items-center">
                            <Text className="text-2xl font-bold text-primary">{trend.currentStreak}🔥</Text>
                            <Text className="text-xs text-muted-foreground mt-1">Tage Streak</Text>
                          </View>
                          <View className="h-12 w-[1px] bg-border" />
                          <View className="items-center">
                            <Text className="text-2xl font-bold text-primary">{Math.round(trend.consistency)}%</Text>
                            <Text className="text-xs text-muted-foreground mt-1">Konstanz</Text>
                          </View>
                          <View className="h-12 w-[1px] bg-border" />
                          <View className="items-center">
                            <Text className="text-2xl font-bold text-green-500">{totalVolume > trend.average.volume ? '↗' : '→'}</Text>
                            <Text className="text-xs text-muted-foreground mt-1">Trend</Text>
                          </View>
                        </View>

                        {/* Volume Progress */}
                        <View className="mb-6">
                          <View className="flex-row justify-between mb-2">
                            <Text className="text-sm font-medium">Volumen-Entwicklung</Text>
                            <Text className="text-sm text-primary font-medium">
                              {totalVolume > trend.average.volume ? '+' : ''} 
                              {Math.round(((totalVolume - trend.average.volume) / trend.average.volume) * 100)}%
                            </Text>
                          </View>
                          <View className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                            <View 
                              className="h-full bg-primary"
                              style={{ 
                                width: `${Math.min(100, (totalVolume / (trend.bestPerformance.volume || 1)) * 100)}%` 
                              }} 
                            />
                          </View>
                          <View className="flex-row justify-between mt-1">
                            <Text className="text-xs text-muted-foreground">Ø {Math.round(trend.average.volume)}kg</Text>
                            <Text className="text-xs text-muted-foreground">Heute: {totalVolume}kg</Text>
                          </View>
                        </View>
                        
                      </View>
                      <View className="p-4">
    <View className="flex-row items-center mb-4">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
        <Calendar size={20} className="text-primary" />
      </View>
      <View>
        <Text className="text-lg font-semibold">Nächstes Training</Text>
        <Text className="text-sm text-muted-foreground">
          {new Date(Date.now() + (recovery.nextWorkoutIn * 24 * 60 * 60 * 1000)).toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </Text>
      </View>
    </View>

    <View className="space-y-4">
      {/* Empfehlungen basierend auf heutigem Training */}
      <View className="bg-secondary/5 p-3 rounded-xl space-y-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Optimale Intensität</Text>
          <Text className="font-medium">{recovery.recommendedIntensity}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Empfohlene Pause</Text>
          <Text className="font-medium">{recovery.nextWorkoutIn * 24}h</Text>
        </View>
        {selectedDifficulty === 'easy' && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">Gewichtsanpassung</Text>
            <Text className="font-medium text-green-500">+2.5-5kg</Text>
          </View>
        )}
      </View>

      {/* Vorbereitungs-Tipps */}
      <View className="space-y-2">
        <Text className="font-medium mb-1">Vorbereitung</Text>
        {recovery.tips.map((tip, index) => (
          <View key={index} className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-3 ${
              tip.priority === 'high' ? 'bg-primary' : 'bg-muted-foreground'
            }`} />
            <Text className="text-sm">{tip.message}</Text>
          </View>
        ))}
      </View>

      {/* Zusätzliche Empfehlung basierend auf Performance */}
      {performanceChange > 0 && trend.lastFive.length > 0 && (
        <View className="bg-primary/5 p-3 rounded-xl">
          <Text className="text-sm">
            Deine Leistungssteigerung von {Math.round(performanceChange)}% zeigt, dass du bereit für neue Herausforderungen bist. 
            Fokussiere dich beim nächsten Training besonders auf saubere Ausführung bei den erhöhten Gewichten.
          </Text>
        </View>
      )}
    </View>
  </View>
                </Card>
          </Animated.View>
        </ScrollView>
        

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0">
          <View className="px-4 py-4 border-t border-border bg-card/95 backdrop-blur-lg">
            {showThankYou ? (
              <View className="items-center py-2">
                <Text className="text-lg font-semibold text-primary">
                  Danke für dein Feedback!
                </Text>
              </View>
            ) : (
              <Button 
                className="w-full h-12 mb-12 "
                onPress={handleFinish}
              >
                <Text className="text-primary-foreground font-medium text-lg">
                  Training abschließen
                </Text>
              </Button>
            )}
          </View>
          <View className="h-6 bg-card" />
        </View>
      </Animated.View>
    </Modal>
  );
};