import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Small } from "../ui/typography";
import { cn } from "~/lib/utils";
import { formatAudioTime } from "~/lib/Chat/chatUtils";
import { PauseFilled, PlayFilled } from "~/lib/icons/FilledIcons";

interface ChatAudioMessageProps {
  audioUrl: string;
}

export default function ChatAudioMessage({ audioUrl }: ChatAudioMessageProps) {
  const player = useAudioPlayer(audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(formatAudioTime(0));

  // Add a ref to store the interval id
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setDuration(formatAudioTime(player.duration));
  }, [player.duration]);

  const togglePlayPause = async () => {
    try {
      if (player.playing) {
        await player.pause();
        setIsPlaying(false);
        if (progressIntervalRef.current !== null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        await player.play();
        setIsPlaying(true);
        startProgressTracking();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current !== null) return;
    progressIntervalRef.current = setInterval(async () => {
      if (player.duration > 0) {
        const newProgress = player.currentTime / player.duration;
        setProgress(newProgress * 100);
      }
      setCurrentTime(formatAudioTime(player.currentTime));

      // Auto-stop at the end
      if (player.currentTime >= player.duration) {
        if (progressIntervalRef.current !== null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        await player.seekTo(0);
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(formatAudioTime(0));
      }
    }, 10) as unknown as number;
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <View className={cn("rounded-2xl my-1", "bg-primary self-end")}>
      <View className="flex-row items-center space-x-2 w-60 justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full bg-transparent"
          haptics="light"
          onPress={togglePlayPause}
        >
          {isPlaying ? (
            <PauseFilled size={24} className="text-primary-foreground" />
          ) : (
            <PlayFilled size={24} className="text-primary-foreground" />
          )}
        </Button>

        <View className="flex-1 gap-1">
          <Small />
          <Progress
            value={progress}
            className="h-1 bg-primary-foreground/30"
            indicatorClassName="bg-primary-foreground"
          />

          <View className="flex-row justify-between mt-1">
            <Small className="text-primary-foreground/80">{currentTime}</Small>
            <Small className="text-primary-foreground/80">{duration}</Small>
          </View>
        </View>
      </View>
    </View>
  );
}
