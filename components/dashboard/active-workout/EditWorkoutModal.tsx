//components\dashboard\active-workout\EditWorkoutModal.tsx
import React, { useState } from 'react';
import { View, Modal, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { 
  X, 
  Plus, 
  GripVertical,
  Save,
  Search,
  Trash2
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Exercise, WorkoutExercise, Workout } from '~/lib/types';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
type RenderItemParamsWithIndex = RenderItemParams<WorkoutExercise> & {
    index: number;
  };

  interface EditWorkoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    workout: Workout;
    exercises: Exercise[];
    onSave: (workout: Workout) => void;
  }
  
  export const EditWorkoutModal = ({
    isVisible,
    onClose,
    workout,
    exercises,
    onSave,
  }: EditWorkoutModalProps) => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(workout.exercises);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExerciseList, setShowExerciseList] = useState(false);

  const handleDragEnd = ({ data }: { data: WorkoutExercise[] }) => {
    setWorkoutExercises(data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDelete = (index: number) => {
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
    setShowExerciseList(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderExercise = ({ item, drag, isActive, getIndex }: RenderItemParams<WorkoutExercise>) => {
    const exercise = exercises.find(ex => ex.id === item.exerciseId);
    const index = getIndex();
    if (!exercise) return null;

    return (
        <ScaleDecorator>
          <Animated.View
            entering={FadeInDown.delay(index !== undefined ? index * 50 : 0)}
            style={[isActive && { backgroundColor: 'rgba(0,0,0,0.1)' }]}
            className="mb-2"
          >
            <Card className="bg-card/60 backdrop-blur-lg">
              <View className="flex-row items-center p-4">
                <Pressable onLongPress={drag} className="pr-3">
                  <GripVertical size={20} className="text-muted-foreground" />
                </Pressable>
                
                <View className="flex-1">
                  <Text className="font-medium">{exercise.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.sets}×{item.reps} • {item.weight}kg
                  </Text>
                </View>
  
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onPress={() => handleDelete(index ?? 0)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </View>
            </Card>
          </Animated.View>
        </ScaleDecorator>
      );
    };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View className="pt-14 px-4 pb-4 border-b border-border">
          <View className="flex-row justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onPress={onClose}
            >
              <X size={24} className="text-foreground" />
            </Button>
            <Text className="text-xl font-bold">Workout bearbeiten</Text>
            <Button
              variant="ghost"
              size="icon"
              onPress={() => {
                onSave({ ...workout, exercises: workoutExercises });
                onClose();
              }}
            >
              <Save size={24} className="text-primary" />
            </Button>
          </View>
        </View>

        <DraggableFlatList
          data={workoutExercises}
          ListHeaderComponent={
            <View className="p-4">
              <Button
                className="w-full mb-4"
                variant="outline"
                onPress={() => setShowExerciseList(true)}
              >
                <Plus size={20} className="mr-2" />
                <Text>Übung hinzufügen</Text>
              </Button>
            </View>
          }
          renderItem={renderExercise}
          keyExtractor={(item, index) => `${item.exerciseId}-${index}`}
          onDragEnd={handleDragEnd}
          contentContainerStyle={{ padding: 16 }}
        />

        {/* Exercise Selection Modal */}
        <Modal
          visible={showExerciseList}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowExerciseList(false)}
        >
          <View className="flex-1 bg-background">
            <View className="pt-14 px-4 pb-4 border-b border-border">
              <View className="flex-row justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() => setShowExerciseList(false)}
                >
                  <X size={24} className="text-foreground" />
                </Button>
                <Text className="text-xl font-bold">Übung auswählen</Text>
                <View style={{ width: 40 }} />
              </View>

              <View className="flex-row items-center bg-secondary/20 rounded-lg px-3">
                <Search size={20} className="text-muted-foreground mr-2" />
                <TextInput
                  placeholder="Übung suchen..."
                  className="flex-1 h-10 text-base"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView className="flex-1 p-4">
              {exercises
                .filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((exercise, index) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => handleAddExercise(exercise)}
                    className="mb-2"
                  >
                    <Card className="bg-card/60 backdrop-blur-lg">
                      <View className="p-4 flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                          <Plus size={20} className="text-primary" />
                        </View>
                        <View>
                          <Text className="font-medium">{exercise.name}</Text>
                          <Text className="text-sm text-muted-foreground">
                            {exercise.primaryMuscles.join(', ')}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};