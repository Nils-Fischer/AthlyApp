// TrainTechApp/app/workout/exercise/[id].tsx
import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";
import { Carousel } from "~/components/Carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
  FadeInDown,
} from "react-native-reanimated";
import { Trophy, Users2 } from "~/lib/icons/Icons";

const HEADER_HEIGHT = 288;

type MediaType = "image" | "video";

interface MediaItem {
  type: MediaType;
  url: string;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ANIMATION_BASE_DELAY = 100;
const STAGGER_DELAY = 50;
export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const exerciseStore = useExerciseStore();
  const exercise = exerciseStore.exercises.find((ex) => ex.id === Number(id));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const scrollY = useSharedValue(0);

  const safeAreaEdges: Edge[] = ["top"];

  const mediaItems: MediaItem[] = [
    ...(exercise?.images?.map((url) => ({ type: "image" as const, url })) || []),
    { type: "video" as const, url: "https://example.com/exercise-video.mp4" },
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0], [1.5, 1], { extrapolateRight: "clamp" });

    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0.3], { extrapolateRight: "clamp" });

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const handleShare = async () => {
    // Implement share functionality
  };

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Übung nicht gefunden</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={safeAreaEdges}>
      <AnimatedScrollView onScroll={scrollHandler} scrollEventThrottle={16} className="flex-1" bounces={false}>
        {/* Media Carousel Section */}
        <Animated.View style={[{ height: HEADER_HEIGHT }, headerStyle]} className="relative">
          <Carousel
            height={HEADER_HEIGHT}
            mediaItems={mediaItems}
            onIndexChange={setActiveIndex}
            currentIndex={activeIndex}
            onLike={() => setIsLiked(!isLiked)}
            isLiked={isLiked}
            onShare={handleShare}
            onBack={() => router.back()}
            animationDelay={ANIMATION_BASE_DELAY}
          />
        </Animated.View>

        {/* Content */}
        <View className="px-4 -mt-6 relative">
          <Animated.View
            entering={FadeInDown.duration(400).springify()}
            className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg"
          >
            <Text className="text-2xl font-bold mb-2">{exercise.name}</Text>
            <Text className="text-muted-foreground mb-2">{exercise.equipment}</Text>

            {/* Analytics Integration - Add right after equipment text */}
            <View className="flex-row gap-2 mb-6">
              <View className="flex-row items-center">
                <Users2 className="h-4 w-4 text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground">{exercise.timesUsed || "150"}x verwendet</Text>
              </View>
              <View className="flex-row items-center">
                <Trophy className="h-4 w-4 text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground">Top 10 Übung</Text>
              </View>
            </View>

            {/* Enhanced Stats Section */}
            <View className="flex-row gap-4 mb-6">
              <Animated.View
                entering={FadeInDown.delay(ANIMATION_BASE_DELAY).springify()}
                className="flex-1 bg-muted/50 rounded-2xl p-4"
              >
                <Text className="text-sm text-muted-foreground mb-1">Level</Text>
                <Text className="font-semibold">{exercise.level}</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(ANIMATION_BASE_DELAY).springify()}
                className="flex-1 bg-muted/50 rounded-2xl p-4"
              >
                <Text className="text-sm text-muted-foreground mb-1">Mechanik</Text>
                <Text className="font-semibold">{exercise.mechanic}</Text>
              </Animated.View>
            </View>

            {/* Muscles Section */}
            <Animated.View
              entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY).springify()}
              className="mb-6"
            >
              <Text className="font-semibold text-lg mb-3">Trainierte Muskeln</Text>
              <View className="gap-4">
                <View>
                  <Text className="text-sm text-muted-foreground mb-2">Primär</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {exercise.primaryMuscles.map((muscle, index) => (
                      <View key={index} className="bg-primary/10 rounded-full px-3 py-1.5">
                        <Text className="text-xs text-primary font-medium">{muscle}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {exercise.secondaryMuscles.length > 0 && (
                  <View>
                    <Text className="text-sm text-muted-foreground mb-2">Sekundär</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {exercise.secondaryMuscles.map((muscle, index) => (
                        <View key={index} className="bg-muted rounded-full px-3 py-1.5">
                          <Text className="text-xs text-muted-foreground font-medium">{muscle}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Instructions Section */}
            <Animated.View entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY * 2).springify()}>
              <Text className="font-semibold text-lg mb-3">Ausführung</Text>
              <View className="gap-4">
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} className="bg-muted/50 rounded-2xl p-4 flex-row gap-4">
                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                      <Text className="text-primary font-semibold">{index + 1}</Text>
                    </View>
                    <Text className="flex-1 text-sm leading-relaxed">{instruction}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </Animated.View>
        </View>
        {/* Related Exercises */}
        <View className="mt-8">
          <Text className="font-semibold text-lg mb-4">Ähnliche Übungen</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            <View className="flex-row gap-4">
              {exerciseStore.exercises
                .filter(
                  (e) =>
                    e.id !== exercise.id && e.primaryMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle))
                )
                .slice(0, 3)
                .map((relatedExercise) => (
                  <Pressable
                    key={relatedExercise.id}
                    onPress={() => router.push(`/workout/exercise/${relatedExercise.id}`)}
                    className="w-48"
                  >
                    <View className="bg-muted/50 rounded-xl overflow-hidden">
                      <Image
                        source={{ uri: relatedExercise.images?.[0] || "/api/placeholder/192/128" }}
                        className="w-full h-32"
                      />
                      <View className="p-3">
                        <Text className="font-medium">{relatedExercise.name}</Text>
                        <Text className="text-sm text-muted-foreground">{relatedExercise.primaryMuscles[0]}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </View>
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </AnimatedScrollView>
    </SafeAreaView>
  );
}
