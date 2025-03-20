import { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { Button } from "../ui/button";
import { PlayCircle, PauseCircle, X, Pause } from "~/lib/icons/Icons";
import { Progress } from "../ui/progress";
import { Small } from "../ui/typography";
import { formatAudioTime } from "~/lib/Chat/chatUtils";
import { Badge } from "../ui/badge";
import { PauseFilled, PlayFilled } from "~/lib/icons/FilledIcons";

interface ChatAudioMessagePreviewProps {
  audioUrl: string;
  onDelete: () => void;
}

export default function ChatAudioMessagePreview({ audioUrl, onDelete }: ChatAudioMessagePreviewProps) {
  const player = useAudioPlayer(audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(formatAudioTime(0));

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
    <View className="flex-1 flex-row items-center bg-muted rounded-2xl p-2">
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" haptics="light" onPress={togglePlayPause}>
        {isPlaying ? (
          <PauseFilled size={20} className="text-primary" />
        ) : (
          <PlayFilled size={20} className="text-primary" />
        )}
      </Button>
      <View className="flex-1 mx-2">
        <Progress value={progress} className="h-1 bg-muted-foreground/30" indicatorClassName="bg-primary" />
      </View>
      <Small className="text-md text-muted-foreground ml-2 mr-1">{duration}</Small>
      <Button variant="ghost" size="icon" className="w-8 h-8" onPress={onDelete} haptics="light">
        <X size={18} className="text-foreground" />
      </Button>
    </View>
  );
}
