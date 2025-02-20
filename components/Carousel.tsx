import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, Pressable, Image, StyleSheet } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import RNCarousel from "react-native-reanimated-carousel";
import { PlayFilled } from "~/lib/icons/FilledIcons";
import * as Haptics from "expo-haptics";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_HEIGHT = SCREEN_WIDTH * 0.75;

export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  url: string;
}

export interface CarouselProps {
  mediaItems: MediaItem[];
}

interface VideoItemProps {
  item: MediaItem;
  isActive: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({ item, isActive }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = useCallback(async () => {
    if (!videoRef.current) return;
    try {
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
    } catch (error) {
      console.error("Error toggling video playback:", error);
    }
  }, []);

  // Pause video when the slide is no longer active.
  useEffect(() => {
    const pauseVideo = async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
        }
      }
    };

    if (!isActive) {
      pauseVideo();
    }
  }, [isActive]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePress = useCallback(() => {
    // Toggle haptic feedback for toggle actions: using light impact.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePlayback();
  }, [togglePlayback]);

  return (
    <View style={styles.mediaContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.url }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        style={styles.video}
        shouldPlay={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <Pressable onPress={handlePress} style={styles.overlay}>
        {!isPlaying && (
          <View style={styles.playIconContainer}>
            <PlayFilled style={styles.playIcon} />
          </View>
        )}
      </Pressable>
    </View>
  );
};

export function Carousel({ mediaItems }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <View style={styles.carouselContainer}>
      <RNCarousel
        loop
        width={SCREEN_WIDTH}
        height={CAROUSEL_HEIGHT}
        data={mediaItems}
        onSnapToItem={handleSnapToItem}
        renderItem={({ item, index }) => {
          if (item.type === "video") {
            return <VideoItem item={item} isActive={index === currentIndex} />;
          }
          return <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
  },
  mediaContainer: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust color as needed.
    padding: 16,
    borderRadius: 9999, // Creates a fully-rounded container.
    // For blur effects, consider using Expo's BlurView if required.
  },
  playIcon: {
    height: 32,
    width: 32,
    color: "#FFF", // Adjust based on your theme.
  },
});
