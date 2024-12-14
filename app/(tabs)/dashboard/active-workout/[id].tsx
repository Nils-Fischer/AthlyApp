import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, ImageBackground, Alert , useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  PlayCircle, 
  PauseCircle,
  StopCircle,
  X, 
  Timer,
  Dumbbell,
  ChevronRight,
  Flame,
  Plus,
  Trash2,
  GripVertical,
  Edit,
  Weight,
  CheckCircle
} from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useExerciseStore } from '~/stores/exerciseStore';
import { ExerciseModal } from '~/components/dashboard/active-workout/ExerciseModal';
import { ExerciseCard } from '~/components/dashboard/active-workout/ExerciseCard';
import { Exercise, WorkoutExercise, Workout, SetInput } from '~/lib/types';
import { ExerciseLibraryModal } from '~/components/dashboard/active-workout/ExerciseLibraryModal';
import DraggableFlatList, {
  ScaleDecorator,
  DragEndParams,
} from 'react-native-draggable-flatlist';
import { WorkoutStartModal } from '~/components/dashboard/active-workout/WorkoutStartModal';
import { useWorkoutHistoryStore } from '~/stores/workoutHistoryStore';
import { WorkoutSummaryModal } from '~/components/dashboard/active-workout/WorkoutSummaryModal';


// Helper function for formatting time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function ActiveWorkoutScreen() {
  // Layout & Basic States
  const { height } = useWindowDimensions();
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseStore = useExerciseStore();
  const [originalExercises, setOriginalExercises] = useState<WorkoutExercise[]>([]);
  
  // Workout Execution States
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [restTimerInterval, setRestTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [estimatedCalories, setEstimatedCalories] = useState(0);
  

  // UI States
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: Exercise;
    workoutExercise: WorkoutExercise;
  } | null>(null);
  
  const scaleValue = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }]
    };
  });

  // Layout Constants
  const HEADER_HEIGHT = 280;
  const FOOTER_HEIGHT = 120;
  const EXTRA_SCROLL_PADDING = 100;
  const SCROLL_VIEW_HEIGHT = height - HEADER_HEIGHT - FOOTER_HEIGHT;

  const workoutHistory = useWorkoutHistoryStore();


  useEffect(() => {
    workoutHistory.init();
  }, []);

  useEffect(() => {
    if (isStarted && !isPaused) {
      // Grobe Schätzung: 5 Kalorien pro Minute Training
      const caloriesPerMinute = 5;
      setEstimatedCalories(Math.round((workoutTimer / 60) * caloriesPerMinute));
    }
  }, [workoutTimer, isStarted, isPaused]);

  // Timer Effect
  useEffect(() => {
    let workoutInterval: NodeJS.Timeout;
    let restInterval: NodeJS.Timeout;
  
    if (isStarted) {
      // Workout Timer läuft immer
      workoutInterval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
  
      // Rest Timer nur wenn pausiert
      if (isPaused) {
        restInterval = setInterval(() => {
          setRestTimer(prev => prev + 1);
        }, 1000);
      }
    }
  
    return () => {
      clearInterval(workoutInterval);
      if (restInterval) clearInterval(restInterval);
    };
  }, [isStarted, isPaused]);
  
  // Pause-Timer-Komponente
  const PauseTimer = () => (
    <View className="px-4 mb-2">
      <Card className="border-border bg-primary/10 shadow-lg rounded-lg">
        <View className="p-4">
          <View className="flex-row items-center justify-center">
            <Timer size={24} className="text-muted-foreground mr-2" />
            <Text className="text-xl font-semibold">Pause: {formatTime(restTimer)}</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  // Initialize sample workout
  const sampleWorkout: Workout | null = exerciseStore.exercises.length > 0 ? {
    id: 1,
    name: "Full Body Strength",
    description: "A comprehensive full body workout focusing on major muscle groups",
    duration: 60,
    exercises: exerciseStore.exercises.slice(0, 3).map(ex => ({
      exerciseId: ex.id,
      sets: 3,
      reps: 12,
      weight: 40,
      restPeriod: 60,
      isCompleted: false,
      alternatives: []
    }))
  } : null;

  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    sampleWorkout?.exercises || []
  );

  interface WorkoutExerciseState extends WorkoutExercise {
    completedSets: {
      weight: number;
      reps: number;
      isCompleted: boolean;
    }[];
  }

  interface WorkoutHistory {
    [exerciseId: number]: {
      date: string;
      sets: SetInput[];
    }
  }

  const handleWorkoutComplete = () => {
    workoutExercises.forEach(exercise => {
      if (exercise.completedSets) {
        // Nutze den Store statt setState
        workoutHistory.addWorkoutHistory(
          exercise.exerciseId,
          exercise.completedSets
        );
      }
    });
  
    // Rest deiner bestehenden Logik
    setIsStarted(false);
    setIsPaused(false);
    setWorkoutTimer(0);
    setCompletedSets(0);
    setTotalVolume(0);
    router.back();
  };
  

  const handleDeleteExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      sets: 3,
      reps: 12,
      weight: 20,
      restPeriod: 60,
      isCompleted: false,
      alternatives: []
    };
    setWorkoutExercises(prev => [...prev, newExercise]);
    setShowExerciseLibrary(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDragEnd = ({ data }: DragEndParams<WorkoutExercise>) => {
    setWorkoutExercises(data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleExerciseSwap = (index: number, newExercise: Exercise) => {
    setWorkoutExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      const currentExercise = updatedExercises[index];
      updatedExercises[index] = {
        exerciseId: newExercise.id,
        sets: currentExercise.sets,
        reps: currentExercise.reps,
        weight: currentExercise.weight,
        restPeriod: currentExercise.restPeriod,
        isCompleted: false,
        alternatives: []
      };
      return updatedExercises;
    });
  };

  const handleEndWorkout = () => {
    // Stoppe zuerst den Timer
    clearWorkoutTimers();  // Neue Funktion
    
    Alert.alert(
      "Workout beenden?",
      "Bist du sicher, dass du das Training beenden möchtest?",
      [
        {
          text: "Weiter trainieren",
          style: "cancel",
          onPress: () => {
            // Starte Timer wieder, wenn User weitermachen möchte
            setIsStarted(true);
          }
        },
        {
          text: "Beenden",
          style: "destructive",
          onPress: handleConfirmEnd
        }
      ]
    );
  };
  const clearWorkoutTimers = () => {
    setIsStarted(false);
    setIsPaused(true);
    // Speichere die finalen Werte
    const finalDuration = workoutTimer;
    const finalCalories = estimatedCalories;
    setFinalStats({
      duration: workoutTimer,
      calories: estimatedCalories,
      volume: totalVolume,
      completedSets: completedSets
    });
  };
  
  // Neuer State für die finalen Statistiken
  const [finalStats, setFinalStats] = useState({
    duration: 0,
    calories: 0,
    volume: 0,
    completedSets: 0
  });

  const handleConfirmEnd = () => {
    setShowEndConfirmation(false);
    setShowSummary(true);
  };
  
  const handleFinishWorkout = () => {
    handleWorkoutComplete();
    setShowSummary(false);
  };

  const handleCancelEdit = () => {
    setWorkoutExercises(originalExercises);
    setIsEditMode(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  

  const handleSaveChanges = async () => {
    try {
      setOriginalExercises([...workoutExercises]);
      setIsEditMode(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  

  // Effect to fetch initial data
  useEffect(() => {
    exerciseStore.fetchInitialData();
  }, []);

  // Loading and Error States
  if (exerciseStore.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Lade Übungen...</Text>
      </View>
    );
  }

  if (!sampleWorkout || exerciseStore.error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive text-center">
          {exerciseStore.error?.message || "Keine Übungen verfügbar"}
        </Text>
        <Button 
          className="mt-4"
          onPress={() => exerciseStore.fetchInitialData()}
        >
          <Text>Erneut versuchen</Text>
        </Button>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-background">
      {/* Header Section */}
      <Animated.View 
        entering={FadeIn}
        className="pt-7 pb-2 bg-gradient-to-b from-primary/15 via-primary/5 to-background"
      >
        <View className="px-4 mb-2">
          <View className="flex-row justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.back()}
              className="bg-background/80 backdrop-blur-lg rounded-full"
            >
              <X size={24} className="text-foreground" />
            </Button>
            <View className="bg-background/40 backdrop-blur-lg px-6 py-2 rounded-full">
              <Text className="text-xl font-bold text-center">{sampleWorkout.name}</Text>
            </View>
            <Animated.View style={animatedStyle}>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                // Erstelle einen neuen animierten Wert für jede Animation
                const newScale = withSpring(0.8, {
                  damping: 12,
                  stiffness: 200,
                  mass: 0.5
                });

                scaleValue.value = newScale;
                
                // Warte auf die Animation und setze dann zurück
                setTimeout(() => {
                  scaleValue.value = withSpring(1, {
                    damping: 12,
                    stiffness: 200,
                    mass: 0.5
                  });
                }, 100);

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (!isEditMode) {
                  setOriginalExercises([...workoutExercises]);
                }
                setIsEditMode(!isEditMode);
              }}
              disabled={isStarted}
              className="bg-background/80 backdrop-blur-lg rounded-full"
            >
              <Edit 
                size={24} 
                className={isEditMode ? "text-primary" : "text-foreground"} 
              />
              </Button>
            </Animated.View>
          </View>
        </View>

        {isEditMode ? (
          <Animated.View 
            entering={FadeInDown.duration(400).springify()}
            exiting={FadeOut.duration(200)}
            className="px-4 py-1"
          >
            <Card className="border-2 border-primary bg-primary/5">
              <Pressable 
                onPress={() => setShowExerciseLibrary(true)}
                className="p-3"
              >
                <View className="items-center">
                  <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
                    <Plus size={24} className="text-primary" />
                  </View>
                  <Text className="text-lg font-semibold text-primary mb-1">Übung hinzufügen</Text>
                  <Text className="text-sm text-primary/70 text-center">
                    Erweitere dein Workout mit neuen Übungen
                  </Text>
                </View>
                
                <View className="flex-row justify-around mt-6 pt-4 border-t border-primary/20">
                  <View className="items-center">
                    <Text className="text-xs text-primary/70">Übungen</Text>
                    <Text className="text-lg font-semibold text-primary">{workoutExercises.length}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-primary/70">Geschätzte Zeit</Text>
                    <Text className="text-lg font-semibold text-primary">
                      {Math.round(workoutExercises.length * 5)} Min
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-primary/70">Sets Total</Text>
                    <Text className="text-lg font-semibold text-primary">
                      {workoutExercises.reduce((acc, ex) => acc + ex.sets, 0)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Card>
            
            <View className="flex-row items-center justify-center mt-2 px-4">
              <GripVertical size={16} className="text-muted-foreground mr-2" />
              <Text className="text-sm text-muted-foreground">
                Halte & ziehe zum Neuordnen der Übungen
              </Text>
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            entering={SlideInRight.duration(400).springify()}
            exiting={FadeOut.duration(200)}
            className="px-4"
          >
            <Card className="bg-card/90 backdrop-blur-lg border-primary/10">
              <View className="flex-row justify-between p-3">
                {/* Volumen */}
                <View className="items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Weight size={18} className="text-primary" />
                  </View>
                  <Text className="text-sm font-medium mt-1.5">
                    {totalVolume}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Volumen (kg)</Text>
                </View>

                {/* Trainingszeit */}
                <View className="items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Timer size={18} className="text-primary" />
                  </View>
                  <Text className="text-sm font-medium mt-1.5">
                    {formatTime(workoutTimer)}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Trainingszeit</Text>
                </View>

                {/* Abgeschlossene Sets */}
                <View className="items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                    <CheckCircle size={18} className="text-primary" />
                  </View>
                  <Text className="text-sm font-medium mt-1.5">
                    {completedSets}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Sets</Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}
      </Animated.View>
      {isStarted && isPaused && <PauseTimer />}

      {/* Main Content - Exercise List */}
      <View style={{ height: SCROLL_VIEW_HEIGHT }}>
        <DraggableFlatList
          data={workoutExercises}
          contentContainerStyle={{ 
            padding: 16,
            paddingBottom: FOOTER_HEIGHT + EXTRA_SCROLL_PADDING
          }}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.exerciseId.toString()}
          renderItem={({ item: workoutExercise, drag, isActive, getIndex }) => {
            const exercise = exerciseStore.exercises.find(
              ex => ex.id === workoutExercise.exerciseId
            );
            if (!exercise) return null;

            const index = getIndex?.() ?? 0;

            return (
              <ScaleDecorator>
                <Pressable 
                  onPress={() => !isEditMode && setSelectedExercise({ exercise, workoutExercise })}
                  onLongPress={isEditMode ? drag : undefined}
                  disabled={isActive}
                >
                <ExerciseCard
                  exercise={exercise}
                  workoutExercise={workoutExercise}
                  isActive={isStarted && !workoutExercise.isCompleted}
                  index={index}
                  onPress={() => !isEditMode && setSelectedExercise({ exercise, workoutExercise })}
                  currentSet={workoutExercise.isCompleted ? workoutExercise.sets : 
                    Math.floor((completedSets % workoutExercise.sets) + 1)}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteExercise}
                  onSwapExercise={handleExerciseSwap}
                  drag={drag}
                  isHeld={isActive}
                  completedSets={workoutExercise.completedSets}
                />
                </Pressable>
              </ScaleDecorator>
            );
          }}
        />
      </View>

      {/* Footer Controls */}
      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-card/95 backdrop-blur-lg border-t border-border p-4">
          {isEditMode ? (
            <View className="flex-row gap-4">
              <Button 
                className="flex-1 h-14"
                variant="outline"
                onPress={handleCancelEdit}
              >
                <Text className="font-medium text-lg">Abbrechen</Text>
              </Button>
              <Button 
                className="flex-1 h-14"
                onPress={handleSaveChanges}
              >
                <Text className="text-primary-foreground font-medium text-lg">Speichern</Text>
              </Button>
            </View>
          ) : (
            isStarted ? (
              <View className="flex-row gap-4">
                <Button 
                  className="flex-1 h-14"
                  variant="outline"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (!isPaused) {
                      setRestTimer(0);
                    }
                    setIsPaused(!isPaused);
                  }}
                >
                  {isPaused ? (
                    <PlayCircle size={24} className="mr-2" />
                  ) : (
                    <PauseCircle size={24} className="mr-2" />
                  )}
                  <Text className="font-medium text-lg">
                    {isPaused ? "Fortsetzen" : "Pause"}
                  </Text>
                </Button>
                <Button 
                  className="flex-1 h-14"
                  variant="destructive"
                  onPress={handleEndWorkout}
                >
                  <StopCircle size={24} className="mr-2" />
                  <Text className="font-medium text-lg">Beenden</Text>
                </Button>
              </View>
            ) : (
              <Button 
                className="w-full h-14"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowStartModal(true);
                }}
              >
                <PlayCircle size={24} className="mr-2" />
                <Text className="text-primary-foreground font-medium text-lg">
                  Workout starten
                </Text>
              </Button>
            )
          )}
        </View>
        <View className="h-6 bg-card" />
      </View>

      {/* Modals */}
      {selectedExercise && (
        <ExerciseModal
          isVisible={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          exercise={selectedExercise.exercise}
          workoutExercise={selectedExercise.workoutExercise}
          isWorkoutStarted={isStarted}
          previousWorkout={workoutHistory.getLastWorkout(selectedExercise.exercise.id)}
          onSave={(sets) => {
            setWorkoutExercises(prev => prev.map(ex => {
              if (ex.exerciseId === selectedExercise.exercise.id) {
                return {
                  ...ex,
                  completedSets: sets,
                  isCompleted: sets.every(set => set.isCompleted)
                };
              }
              return ex;
            }));

            if (isStarted) {
              const newCompletedSets = sets.filter(set => set.isCompleted).length;
              const newVolume = sets.reduce((acc, set) => 
                set.isCompleted ? acc + (set.weight * set.reps) : acc
              , 0);
      
              setCompletedSets(prev => prev + newCompletedSets);
              setTotalVolume(prev => prev + newVolume);
            }
            
            setSelectedExercise(null);
          }}
          mode="workout"
        />
      )}

      <ExerciseLibraryModal
        isVisible={showExerciseLibrary}
        onClose={() => setShowExerciseLibrary(false)}
        onSelectExercise={handleAddExercise}
        exercises={exerciseStore.exercises}
        currentExercises={workoutExercises}
      />
      <WorkoutStartModal
        isVisible={showStartModal}
        onClose={() => setShowStartModal(false)}
        onStart={() => {
          setShowStartModal(false);
          setIsStarted(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
      <WorkoutSummaryModal
        isVisible={showSummary}
        onClose={handleFinishWorkout}
        duration={finalStats.duration}
        totalVolume={finalStats.volume}
        completedSets={finalStats.completedSets}
        totalSets={workoutExercises.reduce((acc, ex) => acc + ex.sets, 0)}
        estimatedCalories={finalStats.calories}
      />
    </View>
  );
}