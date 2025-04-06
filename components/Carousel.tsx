import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import RNCarousel from "react-native-reanimated-carousel";
import { useEvent } from "expo";
import { PauseFilled, PlayFilled } from "~/lib/icons/FilledIcons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_HEIGHT = SCREEN_WIDTH * 0.75;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
  const player = useVideoPlayer(item.url, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  const [controlsVisible, setControlsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setControlsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setControlsVisible(false), 750);
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.mediaContainer}>
        <VideoView
          style={styles.media}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
          nativeControls={false}
        />
      </View>
      <Pressable style={styles.iconContainer} onPress={handlePress}>
        {controlsVisible &&
          (isPlaying ? (
            <PauseFilled className="text-white" size={48} />
          ) : (
            <PlayFilled className="text-white" size={48} />
          ))}
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
    <View className="relative">
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
          return (
            <View style={styles.contentContainer}>
              <View style={styles.mediaContainer}>
                <Image
                  source={{ uri: item.url }}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={300}
                  style={styles.media}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 0,
  },
  mediaContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
