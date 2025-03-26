import { Exercise } from "~/lib/types";
import { Image } from "react-native";
import { Carousel, MediaItem, MediaType } from "~/components/Carousel";
import { View, ScrollView, Pressable } from "react-native";
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { Text } from "~/components/ui/text";
import { useExerciseStore } from "~/stores/exerciseStore";
import {
  Activity,
  AlertTriangle,
  BicepsFlexed,
  Check,
  CheckCircle,
  CircleAlert,
  ClipboardList,
  Dumbbell,
} from "~/lib/icons/Icons";
import { getMuscleGroup } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import * as Haptics from "expo-haptics";
import { FullscreenCard } from "~/components/ui/fullscreen-card";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ANIMATION_BASE_DELAY = 100;
const STAGGER_DELAY = 50;

export const ExerciseDetail: React.FC<{ exercise: Exercise; navigateToExercise: (exercise: Exercise) => void }> = ({
  exercise,
  navigateToExercise,
}) => {
  const exerciseStore = useExerciseStore();
  const mediaItems: MediaItem[] = [
    { type: "image" as const, url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg" },
    { type: "video" as const, url: "https://videos.pexels.com/video-files/4065388/4065388-uhd_2560_1440_30fps.mp4" },
    ...(exercise?.media?.map((url) => {
      const type = url.endsWith(".jpg") || url.endsWith(".png") ? "image" : "video";
      return { type: type as MediaType, url };
    }) || []),
  ];

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <AnimatedScrollView onScroll={scrollHandler} scrollEventThrottle={16} className="flex-1" bounces={false}>
      <FullscreenCard>
        <FullscreenCard.Top>
          <Carousel mediaItems={mediaItems} />
        </FullscreenCard.Top>
        <FullscreenCard.Content overlap={20}>
          {/* Karteninhalt */}
          <Text className="text-2xl font-bold mb-2">{exercise.name}</Text>
          <View className="flex-row gap-2 mb-2">
            {[...new Set(exercise.primaryMuscles.map(getMuscleGroup))].map((muscle, index) => (
              <Badge key={index} variant="default">
                <Text className="text-md">{muscle}</Text>
              </Badge>
            ))}
          </View>

          {/* Enhanced Stats Section */}
          <View className="flex-row gap-4 mb-6">
            <Animated.View
              entering={FadeInDown.delay(ANIMATION_BASE_DELAY).springify()}
              className="flex-1 bg-muted/50 rounded-2xl p-4"
            >
              <Text className="text-sm text-muted-foreground mb-1">Level</Text>
              <Text className="font-semibold">{exercise.difficulty}</Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(ANIMATION_BASE_DELAY).springify()}
              className="flex-1 bg-muted/50 rounded-2xl p-4"
            >
              <Text className="text-sm text-muted-foreground mb-1">Mechanik</Text>
              <Text className="font-semibold">{exercise.mechanic}</Text>
            </Animated.View>
          </View>

          {/* Equipment Section */}
          <Animated.View
            entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY).springify()}
            className="mb-6 gap-2"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <Dumbbell size={20} className="text-foreground" />
              <Text className="font-semibold text-lg">Ausrüstung</Text>
            </View>
            <View className="flex-row flex-wrap">
              <Badge variant="secondary">
                <Text className="text-sm">{exercise.equipment}</Text>
              </Badge>
            </View>
          </Animated.View>

          {/* Muscles Section */}
          <Animated.View entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY).springify()} className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <BicepsFlexed size={20} className="text-foreground" />
              <Text className="font-semibold text-lg">Trainierte Muskeln</Text>
            </View>
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

          {/* Description Section */}
          {exercise.description && (
            <Animated.View
              entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY * 2).springify()}
              className="mb-6"
            >
              <View className="flex-row items-center gap-2 mb-3">
                <ClipboardList size={20} className="text-foreground" />
                <Text className="font-semibold text-lg">Beschreibung</Text>
              </View>
              <Text className="flex-1 text-sm leading-relaxed">{exercise.description}</Text>
            </Animated.View>
          )}

          {/* Instructions Section */}
          <Animated.View entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY * 3).springify()}>
            <View className="flex-row items-center gap-2 mb-3">
              <ClipboardList size={20} className="text-foreground" />
              <Text className="font-semibold text-lg">Ausführung</Text>
            </View>
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

          {/* Common Mistakes and Form Cues Section */}
          <Animated.View
            entering={FadeInDown.delay(ANIMATION_BASE_DELAY + STAGGER_DELAY * 4).springify()}
            className="mt-6"
          >
            <View className="flex-row gap-4">
              {/* Common Mistakes */}
              {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-3">
                    <CircleAlert size={20} className="text-foreground" />
                    <Text className="font-semibold text-lg">Häufige Fehler</Text>
                  </View>
                  <View className="gap-2">
                    {exercise.commonMistakes.map((mistake, index) => (
                      <View key={index} className="p-1 flex-row items-center gap-2">
                        <AlertTriangle className="text-destructive" size={16} />
                        <Text className="flex-1 text-xs">{mistake}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Form Cues */}
              {exercise.formCues && exercise.formCues.length > 0 && (
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-3">
                    <CheckCircle size={20} className="text-foreground" />
                    <Text className="font-semibold text-lg">Form-Hinweise</Text>
                  </View>
                  <View className="gap-2">
                    {exercise.formCues.map((cue, index) => (
                      <View key={index} className="p-1 flex-row items-center gap-2">
                        <Check className="text-primary" size={16} />
                        <Text className="flex-1 text-xs">{cue}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        </FullscreenCard.Content>
      </FullscreenCard>

      {/* Related Exercises */}
      <View className="mt-8 px-4">
        <Text className="font-semibold text-lg mb-4">Ähnliche Übungen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
          <View className="flex-row gap-4">
            {exerciseStore.exercises
              ?.filter(
                (e) =>
                  e.id !== exercise.id && e.primaryMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle))
              )
              .slice(0, 3)
              .map((relatedExercise) => (
                <Pressable
                  key={relatedExercise.id}
                  onPress={() => {
                    navigateToExercise(relatedExercise);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="w-48"
                >
                  <View className="bg-muted/50 rounded-xl overflow-hidden">
                    <Image
                      source={{
                        uri: relatedExercise.media.find((media) => media.endsWith(".jpg") || media.endsWith(".png")),
                      }}
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
  );
};
