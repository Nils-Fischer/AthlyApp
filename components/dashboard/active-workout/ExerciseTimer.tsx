import React, { useState, useEffect } from 'react';
import { View, Vibration } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Timer, Play, Pause, SkipForward } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ExerciseTimerProps {
  defaultRestTime: number; // in Sekunden
  intensity: 'light' | 'medium' | 'heavy';
  onTimerComplete?: () => void;
}

export const ExerciseTimer = ({ 
  defaultRestTime,
  intensity,
  onTimerComplete 
}: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Berechne Pausenzeit basierend auf Intensität
  const getRecommendedRestTime = () => {
    switch (intensity) {
      case 'light': return 60; // 1 Minute
      case 'medium': return 90; // 1.5 Minuten
      case 'heavy': return 180; // 3 Minuten
      default: return defaultRestTime;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(interval);
            setIsActive(false);
            onTimerComplete?.();
            // Vibration und Sound wenn Timer fertig
            Vibration.vibrate([0, 500, 200, 500]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return time - 1;
        });

        // Vibration bei 5 Sekunden übrig
        if (timeLeft === 6) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setTimeLeft(getRecommendedRestTime());
    setIsActive(true);
    setIsPaused(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSkip = () => {
    setIsActive(false);
    setTimeLeft(0);
    onTimerComplete?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="bg-card rounded-lg p-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Timer className="text-primary mr-2" size={20} />
          <Text className="text-base font-medium">Pause Timer</Text>
        </View>
        <Text className="text-sm text-muted-foreground">
          Empfohlen: {formatTime(getRecommendedRestTime())}
        </Text>
      </View>

      <View className="items-center mb-4">
        <Text className="text-4xl font-bold">
          {formatTime(timeLeft)}
        </Text>
      </View>

      <View className="flex-row justify-around">
        {!isActive ? (
          <Button 
            variant="default"
            className="flex-1 mr-2"
            onPress={handleStart}
          >
            <Play size={20} className="mr-2" />
            <Text className="text-primary-foreground">Start</Text>
          </Button>
        ) : (
          <>
            <Button 
              variant="outline"
              className="flex-1 mr-2"
              onPress={handlePauseResume}
            >
              {isPaused ? (
                <>
                  <Play size={20} className="mr-2" />
                  <Text>Fortsetzen</Text>
                </>
              ) : (
                <>
                  <Pause size={20} className="mr-2" />
                  <Text>Pause</Text>
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 ml-2"
              onPress={handleSkip}
            >
              <SkipForward size={20} className="mr-2" />
              <Text>Überspringen</Text>
            </Button>
          </>
        )}
      </View>
    </View>
  );
};