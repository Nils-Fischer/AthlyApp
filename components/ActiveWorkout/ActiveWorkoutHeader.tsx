import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, ArrowLeft, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fitnessLightColors } from '../../lib/theme/lightColors';

// Hilfsfunktion zur Formatierung der Zeit
const formatTimeHHMMSS = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface ActiveWorkoutHeaderProps {
  workoutName: string;
  elapsedTime: number;
  isStarted: boolean;
  onClose: () => void;
  onBack?: () => void;
}

export const ActiveWorkoutHeader: React.FC<ActiveWorkoutHeaderProps> = ({
  workoutName,
  elapsedTime,
  isStarted,
  onClose,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="w-full px-4"
      style={{ 
        paddingTop: insets.top + 8,
        paddingBottom: 10,
        backgroundColor: fitnessLightColors.background.elevated,
      }}
    >
      <View className="flex-row justify-between items-center">
        {onBack ? (
          <TouchableOpacity
            className="p-1 -ml-1"
            onPress={onBack}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <ArrowLeft size={22} color={fitnessLightColors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}
        
        <View className="flex-1 items-center">
          <Text 
            className="text-base font-semibold" 
            style={{ color: fitnessLightColors.text.primary }}
            numberOfLines={1}
          >
            {workoutName}
          </Text>
          
          {isStarted && (
            <View className="flex-row items-center mt-0.5">
              <Clock size={12} color={fitnessLightColors.text.tertiary} />
              <Text 
                className="ml-1 text-xs" 
                style={{ color: fitnessLightColors.text.tertiary }}
              >
                {formatTimeHHMMSS(elapsedTime)}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          className="p-1 -mr-1"
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X size={22} color={fitnessLightColors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActiveWorkoutHeader; 