//components\dashboard\active-workout\ExerciseModal.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Pressable, 
  Modal, 
  TextInput, 
  Platform, 
  Image,
  Switch,
  ImageBackground
} from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { 
  X, 
  Weight, 
  BarChart3, 
  ChevronRight,
  Users2,
  Trophy,
  Info,
  Plus,
  Trash2,
  Check,
  Dumbbell,
  ArrowLeft
} from 'lucide-react-native';
import { Exercise, WorkoutExercise } from '~/lib/types';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
import { useNavigationStore } from '~/stores/navigationStore';
import { useWorkoutHistoryStore } from '~/stores/workoutHistoryStore';
import { WorkoutHistoryView } from './WorkoutHistoryView';
import { ExerciseTimer } from '~/components/dashboard/active-workout/ExerciseTimer';
import { WarmupRecommendations } from '~/components/dashboard/active-workout/WarmupRecommendations';

interface SetInput {
  reps: number;
  weight: number;
  isCompleted?: boolean;
  previousWeight?: number;
  previousReps?: number;
}

interface WarmUpSet {
  percentage: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}


interface ExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  isWorkoutStarted: boolean;
  onSave: (sets: SetInput[]) => void;
  previousWorkout?: {
    date: string;
    sets: SetInput[];
  };
  mode: 'planning' | 'workout';
}

export const ExerciseModal = ({
  isVisible,
  onClose,
  exercise,
  workoutExercise,
  isWorkoutStarted,
  onSave,
  previousWorkout,
}: ExerciseModalProps) => {
  // States
  const workoutHistory = useWorkoutHistoryStore();
  
  useEffect(() => {
    workoutHistory.init();
  }, []);
  
  const initialSets = useMemo(() => {
    if (workoutExercise.completedSets) {
      return workoutExercise.completedSets;
    }
    
    const lastWorkout = workoutHistory.getLastWorkout(exercise.id);
    if (lastWorkout?.sets) {
      return Array(workoutExercise.sets).fill(0).map((_, index) => {
        const lastSet = lastWorkout.sets[index];
        return {
          reps: lastSet?.reps || workoutExercise.reps,
          weight: lastSet?.weight || workoutExercise.weight,
          isCompleted: false
        };
      });
    }
    
    return Array(workoutExercise.sets).fill({
      reps: workoutExercise.reps,
      weight: workoutExercise.weight,
      isCompleted: false
    });
  }, [workoutExercise, exercise.id]);

  const [sets, setSets] = useState<SetInput[]>(initialSets);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [warmUpSet, setWarmUpSet] = useState<SetInput | null>(null);
  const navigationStore = useNavigationStore();
  const [rpe, setRpe] = useState<number>(7);

  useEffect(() => {
    return () => {
      navigationStore.setPreviousScreen(undefined);
    };
  }, []);

  const getSaveButtonText = () => {
    if (isWorkoutStarted) {
      return "Sets speichern";
    }
    return "Übung aktualisieren";
  };
  const [showHistory, setShowHistory] = useState(false);


  // Calculations
  const warmUpSets = useMemo(() => {
    const workingWeight = Math.max(...sets.map(s => s.weight));
    return [
      { percentage: 40, reps: 10 },
      { percentage: 60, reps: 8 },
      { percentage: 80, reps: 6 }
    ].map(set => ({
      ...set,
      weight: Math.round((set.percentage / 100) * workingWeight),
      isCompleted: false
    }));
  }, [sets]);

  const totalVolume = useMemo(() => {
    return sets.reduce((total, set) => {
      return total + (set.weight * set.reps);
    }, 0);
  }, [sets]);

  // Handlers
  const handleSetComplete = useCallback((index: number) => {
    const newSets = [...sets];
    newSets[index] = { 
      ...newSets[index], 
      isCompleted: !newSets[index].isCompleted 
    };
    setSets(newSets);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [sets]);
  const handleAddSet = useCallback(() => {
    setSets(prev => [...prev, { reps: 0, weight: 0, isCompleted: false }]);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleDeleteSet = useCallback((index: number) => {
    setSets(prev => {
      // Don't allow deleting if only one set remains
      if (prev.length <= 1) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return prev;
      }
      
      const newSets = [...prev];
      newSets.splice(index, 1);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return newSets;
    });
  }, []);

  const updateSet = useCallback((index: number, field: keyof SetInput, value: string) => {
    const numValue = parseInt(value) || 0;
    setSets(prev => {
      const newSets = [...prev];
      newSets[index] = { ...newSets[index], [field]: numValue };
      return newSets;
    });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleSave = useCallback(() => {
    onSave(sets);
    onClose();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [sets, onSave, onClose]);
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 200 }}>
          {/* Enhanced Header Image */}
          <View className="relative w-full h-48">
            <ImageBackground 
              source={{ uri: exercise.images?.[0] || "/api/placeholder/400/320" }}
              className="w-full h-full"
            >
              <View className="absolute inset-0 bg-black/30" />
              <View className="absolute top-0 left-0 right-0 pt-14 px-4 pb-4">
                <View className="flex-row justify-between items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={onClose}
                    className="bg-background/10 backdrop-blur-lg rounded-full"
                  >
                    <ArrowLeft size={24} className="text-white" />
                  </Button>
                  <View className="bg-background/10 backdrop-blur-lg px-4 py-1 rounded-full">
                    <Text className="text-white font-medium">Übung bearbeiten</Text>
                  </View>
                  <View style={{ width: 40 }} />
                </View>
              </View>
            </ImageBackground>
          </View>

          <View className="px-4 -mt-6">
            {/* Exercise Title & Stats Card */}
            <Card className="bg-card/95 backdrop-blur-lg border-primary/10 mb-6">
              <View className="p-4">
                <Text className="text-2xl font-bold mb-3">{exercise.name}</Text>
                <View className="flex-row gap-4 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
                      <Users2 size={16} className="text-primary" />
                    </View>
                    <View>
                      <Text className="text-sm text-muted-foreground">{exercise.timesUsed || "150"}x</Text>
                      <Text className="text-xs text-muted-foreground">verwendet</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
                      <Trophy size={16} className="text-primary" />
                    </View>
                    <View>
                      <Text className="text-sm text-muted-foreground">Top 10</Text>
                      <Text className="text-xs text-muted-foreground">Übung</Text>
                    </View>
                  </View>
                </View>

                {/* Quick Stats Grid */}
                <View className="flex-row gap-4">
                  <Card className="flex-1 p-3 border-primary/10">
                    <View className="flex-row items-center">
                      <Weight size={16} className="text-primary mr-2" />
                      <Text className="text-sm text-muted-foreground">Equipment</Text>
                    </View>
                    <Text className="font-medium mt-1">{exercise.equipment}</Text>
                  </Card>
                  <Card className="flex-1 p-3 border-primary/10">
                    <View className="flex-row items-center">
                      <BarChart3 size={16} className="text-primary mr-2" />
                      <Text className="text-sm text-muted-foreground">Level</Text>
                    </View>
                    <Text className="font-medium mt-1">{exercise.level}</Text>
                  </Card>
                </View>
              </View>
            </Card>

            {/* Exercise Details Link */}
            <Card className="mb-6 border-primary/10">
              <Pressable 
                className="p-4 flex-row items-center justify-between active:opacity-70"
                onPress={async () => {
                  navigationStore.setPreviousScreen('exerciseModal');
                  onClose();
                  setTimeout(() => {
                    router.push(`/(tabs)/workout/exercise/${exercise.id}`);
                  }, 150);
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Info size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium">Übungsdetails</Text>
                    <Text className="text-sm text-muted-foreground">Anleitung & Ausführung</Text>
                  </View>
                </View>
                <ChevronRight size={20} className="text-muted-foreground" />
              </Pressable>
              {/* Neuer Button für Workout History */}
              <Pressable 
                className="p-4 flex-row items-center justify-between active:opacity-70"
                onPress={() => {
                  // Hier Modal mit WorkoutHistoryView öffnen
                  setShowHistory(true);
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <BarChart3 size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium">Trainings-Historie</Text>
                    <Text className="text-sm text-muted-foreground">Vergangene Leistungen</Text>
                  </View>
                </View>
                <ChevronRight size={20} className="text-muted-foreground" />
              </Pressable>
            </Card>

            {/* Sets Management Card */}
            <Card className="mb-6 border-primary/10">
              <View className="p-4">
                {/* Warm-up Toggle */}
                <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-border">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                      <Dumbbell size={20} className="text-primary" />
                    </View>
                    <View>
                      <Text className="font-medium">Aufwärmen</Text>
                      <Text className="text-sm text-muted-foreground">Vorbereitung für dein Training</Text>
                      
                    </View>
                  </View>
                  <Switch
                    value={!!warmUpSet}
                    onValueChange={(value) => {
                      if (value) {
                        setWarmUpSet({ reps: 0, weight: 0, isCompleted: false });
                      } else {
                        setWarmUpSet(null);
                      }
                    }}
                  />
                </View>

      {warmUpSet && (
        <Animated.View
          entering={FadeInDown}
          className="mb-6"
        >
          <View className="flex-row items-center py-4">
            <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mx-3">
              <Text className="text-base font-medium text-foreground">W</Text>
            </View>

            <View className="flex-1 px-2">
              <Text className="text-xs text-muted-foreground mb-1">
                Gewicht
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 h-9 px-3 rounded-lg bg-secondary/10 text-base"
                  value={warmUpSet.weight.toString()}
                  onChangeText={(value) => setWarmUpSet(prev => ({
                    ...prev!,
                    weight: parseInt(value) || 0
                  }))}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholder="0"
                />
                <Text className="ml-1 text-sm text-muted-foreground">kg</Text>
              </View>
        </View>

      <View className="flex-1 px-2">
        <Text className="text-xs text-muted-foreground mb-1">
          Wdh
        </Text>
        <TextInput
          className="h-9 px-3 rounded-lg bg-secondary/10 text-base"
          value={warmUpSet.reps.toString()}
          onChangeText={(value) => setWarmUpSet(prev => ({
            ...prev!,
            reps: parseInt(value) || 0
          }))}
          keyboardType="numeric"
          maxLength={2}
          placeholder="0"
        />
      </View>

                <Pressable
                  onPress={() => {
                    setWarmUpSet(prev => ({
                      ...prev!,
                      isCompleted: !prev!.isCompleted
                    }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`w-10 h-10 rounded-full items-center justify-center mx-2 ${
                    warmUpSet.isCompleted ? 'bg-primary' : 'bg-secondary/10'
                  }`}
                >
                  <Check 
                    size={16} 
                    className={warmUpSet.isCompleted ? 'text-white' : 'text-muted-foreground'} 
                  />
                </Pressable>
              </View>
            </Animated.View>
        )}

                {/* Working Sets Header */}
                <View className="flex-row justify-between items-center mb-6">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-semibold mr-2">Working Sets</Text>
                    <Text className="text-sm text-muted-foreground">
                      ({sets.length} Sets)
                    </Text>
                  </View>
                  <View className="flex-row gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-full ${isDeleteMode ? 'bg-destructive/10' : 'bg-secondary/10'}`}
                      onPress={() => {
                        setIsDeleteMode(!isDeleteMode);
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                    >
                      <Trash2 
                        size={16} 
                        className={isDeleteMode ? "text-destructive" : "text-muted-foreground"} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-primary/10"
                      onPress={handleAddSet}
                    >
                      <Plus size={16} className="text-primary" />
                    </Button>
                  </View>
                </View>

              {/* Working Sets List */}
            <View className="space-y-2">
            {sets.map((set, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 50)}
                className={`
                  rounded-xl overflow-hidden
                  ${isWorkoutStarted && set.isCompleted ? 'border-2 border-green-500 bg-green-50' : 'bg-secondary/5'}
                `}
              >
                <View className="p-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-background items-center justify-center">
                      <Text className="text-base font-medium text-foreground">{index + 1}</Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground mb-1">Gewicht</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className={`
                            flex-1 h-10 px-3 rounded-lg text-base
                            ${isWorkoutStarted && set.isCompleted ? 'bg-green-50' : 'bg-background'}
                          `}
                          value={set.weight.toString()}
                          onChangeText={(value) => updateSet(index, 'weight', value)}
                          keyboardType="numeric"
                          maxLength={3}
                          placeholder="0"
                        />
                        <Text className="ml-2 text-sm text-muted-foreground">kg</Text>
                      </View>
                    </View>

                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground mb-1">Wdh</Text>
                      <TextInput
                        className={`
                          h-10 px-3 rounded-lg text-base
                          ${isWorkoutStarted && set.isCompleted ? 'bg-green-50' : 'bg-background'}
                        `}
                        value={set.reps.toString()}
                        onChangeText={(value) => updateSet(index, 'reps', value)}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder="0"
                      />
                    </View>

                      {/* Aktions-Buttons basierend auf Modus */}
                      {isWorkoutStarted ? (
                        !isDeleteMode ? (
                          <Pressable
                            onPress={() => handleSetComplete(index)}
                            className={`
                              w-10 h-10 rounded-full items-center justify-center ml-2
                              ${set.isCompleted ? 'bg-green-500' : 'bg-background'}
                              ${set.isCompleted ? 'border-green-500' : 'border border-gray-200'}
                            `}
                          >
                            <Check 
                              size={16} 
                              className={set.isCompleted ? 'text-white' : 'text-green-500'} 
                            />
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => handleDeleteSet(index)}
                            className="w-10 h-10 rounded-full items-center justify-center ml-2 bg-destructive"
                          >
                            <Trash2 size={16} className="text-white" />
                          </Pressable>
                        )
                      ) : (
                        isDeleteMode ? (
                          <Pressable
                            onPress={() => handleDeleteSet(index)}
                            className="w-10 h-10 rounded-full items-center justify-center ml-2 bg-destructive"
                          >
                            <Trash2 size={16} className="text-white" />
                          </Pressable>
                        ) : null
                      )}
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        </Card>

            {/* RPE Selector Card */}
            <Card className="mb-6 border-primary/10">
              <View className="p-4">
                <Text className="font-medium mb-4">RPE (Gefühlte Intensität)</Text>
                <View className="flex-row justify-between">
                  {[1,2,3,4,5].map((value) => (
                    <Pressable
                      key={value}
                      onPress={() => setRpe(value)}
                      className={`w-14 h-14 rounded-2xl items-center justify-center ${
                        rpe === value ? 'bg-primary' : 'bg-secondary/10'
                      }`}
                    >
                      <Text className={`text-lg ${rpe === value ? 'text-white font-medium' : 'text-foreground'}`}>
                        {value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* History Modal */}
<Modal
  visible={showHistory}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setShowHistory(false)}
>
  <View className="flex-1 bg-background">
    <View className="pt-7 px-4 pb-4 border-b border-border">
      <View className="flex-row justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setShowHistory(false)}
          className="bg-background/80 backdrop-blur-lg rounded-full"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Button>
        <Text className="text-xl font-bold">Trainings-Historie</Text>
        <View style={{ width: 40 }} />
      </View>
    </View>
    
    <WorkoutHistoryView
      exerciseId={exercise.id}
      history={Object.values(workoutHistory.history)
        .filter(entry => entry.sets?.length > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
      exerciseName={exercise.name}
    />
  </View>
</Modal>

{/* Footer mit fixierter Position */}
<View className="absolute bottom-14 left-0 right-0">
  <View className="p-4 border-t border-border bg-card/95 backdrop-blur-lg">
    <View className="flex-row justify-between mb-4">
      <View className="items-center flex-1">
        <Text className="text-sm font-medium">{sets.length.toString()}</Text>
        <Text className="text-xs text-muted-foreground">Sätze</Text>
      </View>
      <View className="items-center flex-1">
        <Text className="text-sm font-medium">
          {sets.filter(s => s.isCompleted).length.toString()}
        </Text>
        <Text className="text-xs text-muted-foreground">Abgeschlossen</Text>
      </View>
      <View className="items-center flex-1">
        <Text className="text-sm font-medium">{totalVolume.toString()}</Text>
        <Text className="text-xs text-muted-foreground">Volumen (kg)</Text>
      </View>
    </View>
    
      <Button 
            className="w-full h-14"
            onPress={handleSave}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-primary-foreground font-medium text-lg">
                {getSaveButtonText()}
              </Text>
            </View>
          </Button>
          </View>
          <View className="h-6 bg-card" />
        </View>
      </View>
    </Modal>
  );
};