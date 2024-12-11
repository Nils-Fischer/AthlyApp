import React, { useState } from 'react';
import { View, Modal, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { X, Search, Plus, Filter } from 'lucide-react-native';
import { Exercise, WorkoutExercise } from '~/lib/types';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn, 
  FadeOut,
  Layout
} from 'react-native-reanimated';

interface ExerciseLibraryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  exercises: Exercise[];
  currentExercises: WorkoutExercise[];
}

export const ExerciseLibraryModal = ({
  isVisible,
  onClose,
  onSelectExercise,
  exercises,
  currentExercises,
}: ExerciseLibraryModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from exercises
  const categories = [...new Set(exercises.map(ex => ex.category))];

  const filteredExercises = exercises
    .filter(ex => 
      // Exclude already added exercises
      !currentExercises.some(we => we.exerciseId === ex.id) &&
      // Search query filter
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      // Category filter
      (!selectedCategory || ex.category === selectedCategory)
    );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View className="pt-14 px-4 pb-4 border-b border-border">
          <View className="flex-row justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onPress={onClose}
            >
              <X size={24} className="text-foreground" />
            </Button>
            <Text className="text-xl font-bold">Übung auswählen</Text>
            <Button
              variant="ghost"
              size="icon"
              onPress={() => {
                setShowFilters(!showFilters);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Filter size={24} className={showFilters ? "text-primary" : "text-foreground"} />
            </Button>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-secondary/20 rounded-lg px-3 mb-4">
            <Search size={20} className="text-muted-foreground mr-2" />
            <TextInput
              placeholder="Übung suchen..."
              className="flex-1 h-10 text-base"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Section */}
          {showFilters && (
            <Animated.View
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(150)}
              layout={Layout.duration(150)}
              className="gap-4 mb-4"
            >
              <View>
                <Text className="font-medium mb-2">Kategorie</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => {
                        setSelectedCategory(null);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className={`px-4 py-2 rounded-full ${!selectedCategory ? 'bg-primary' : 'bg-secondary/20'}`}
                    >
                      <Text className={!selectedCategory ? 'text-white' : 'text-foreground'}>Alle</Text>
                    </Pressable>
                    {categories.map(category => (
                      <Pressable
                        key={category}
                        onPress={() => {
                          setSelectedCategory(category);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-primary' : 'bg-secondary/20'}`}
                      >
                        <Text className={selectedCategory === category ? 'text-white' : 'text-foreground'}>
                          {category}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Exercise List */}
        <ScrollView className="flex-1 p-4">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelectExercise(exercise);
                }}
                className="mb-2 active:opacity-70"
              >
                <Card className="bg-card/60 backdrop-blur-lg">
                  <View className="p-4 flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                      <Plus size={20} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium">{exercise.name}</Text>
                      <Text className="text-sm text-muted-foreground">
                        {exercise.primaryMuscles.join(', ')}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted-foreground text-center">
                Keine Übungen gefunden
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};