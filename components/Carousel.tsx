import React from "react";
import { View, Dimensions, Pressable, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Play } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Heart, Share2, ArrowLeft } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";
import Animated, { FadeIn } from "react-native-reanimated";
import RNCarousel from "react-native-reanimated-carousel";

const SCREEN_WIDTH = Dimensions.get("window").width;

export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  url: string;
}

export interface CarouselProps {
  height: number;
  mediaItems: MediaItem[];
  onIndexChange?: (index: number) => void;
  currentIndex: number;
  onLike?: () => void;
  isLiked?: boolean;
  onShare?: () => void;
  onBack?: () => void;
  animationDelay?: number;
}

export function Carousel({
  height,
  mediaItems,
  onIndexChange,
  currentIndex,
  onLike,
  isLiked = false,
  onShare,
  onBack,
  animationDelay = 100,
}: CarouselProps) {
  return (
    <View className="relative">
      <RNCarousel
        loop
        width={SCREEN_WIDTH}
        height={height}
        data={mediaItems}
        onSnapToItem={onIndexChange}
        renderItem={({ item }) => {
          if (item.type === "video") {
            return (
              <View className="relative w-full h-full">
                <Video
                  source={{ uri: item.url }}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  style={{ width: "100%", height: "100%" }}
                />
                <Pressable
                  onPress={() => {
                    /* Handle play/pause */
                  }}
                  className="absolute inset-0 items-center justify-center"
                >
                  <View className="bg-background/80 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-8 w-8 text-primary" />
                  </View>
                </Pressable>
              </View>
            );
          }
          return <Image source={{ uri: item.url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />;
        }}
      />

      {/* Navigation Dots */}
      <View className="absolute bottom-4 w-full flex-row justify-center gap-2">
        {mediaItems.map((_, index) => (
          <View
            key={index}
            className={cn("w-2 h-2 rounded-full", currentIndex === index ? "bg-primary" : "bg-muted-foreground/30")}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <Animated.View entering={FadeIn.delay(animationDelay)} className="absolute top-4 right-4 flex-row gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-background/80 backdrop-blur-sm rounded-full"
          onPress={onLike}
        >
          <Heart className={cn("h-5 w-5", isLiked ? "text-red-500 fill-red-500" : "text-foreground")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-background/80 backdrop-blur-sm rounded-full"
          onPress={onShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </Animated.View>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 h-10 w-10 bg-background/80 backdrop-blur-sm rounded-full"
        onPress={onBack}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
    </View>
  );
}
