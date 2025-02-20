import React from "react";
import { View, Dimensions, Pressable, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import RNCarousel from "react-native-reanimated-carousel";
import { PlayFilled } from "~/lib/icons/FilledIcons";
import * as Haptics from "expo-haptics";

const SCREEN_WIDTH = Dimensions.get("window").width;

export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  url: string;
}

export interface CarouselProps {
  mediaItems: MediaItem[];
}

export function Carousel({ mediaItems }: CarouselProps) {
  const videoRef = React.useRef<Video>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const height = SCREEN_WIDTH * 0.75;

  const togglePlayback = async () => {
    if (!videoRef.current) return;

    const status = await videoRef.current.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <View className="relative">
      <RNCarousel
        loop
        width={SCREEN_WIDTH}
        height={height}
        data={mediaItems}
        onSnapToItem={() => {
          setIsPlaying(false);
        }}
        renderItem={({ item }) => {
          if (item.type === "video") {
            return (
              <View className="relative w-full h-full">
                <Video
                  ref={videoRef}
                  source={{ uri: item.url }}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  style={{ width: "100%", height: "100%" }}
                  shouldPlay={false}
                  onPlaybackStatusUpdate={(status) => {
                    if (!status.isLoaded) return;
                    setIsPlaying(status.isPlaying);
                  }}
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    togglePlayback();
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!isPlaying && (
                    <View className="bg-foreground/40 backdrop-blur-sm rounded-full p-4">
                      <PlayFilled className="h-8 w-8 text-background" />
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }
          return <Image source={{ uri: item.url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />;
        }}
      />
    </View>
  );
}
