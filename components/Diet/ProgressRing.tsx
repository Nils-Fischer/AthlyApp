import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import Svg, { Circle } from "react-native-svg";

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  label: string;
  value: string;
}

export const ProgressRing = React.memo<ProgressRingProps>(
  ({ progress, size, strokeWidth, label, value }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View className="items-center">
        <View className="relative">
          <Svg width={size} height={size}>
            <Circle
              stroke="#e5e5e5"
              fill="none"
              strokeWidth={strokeWidth}
              cx={size / 2}
              cy={size / 2}
              r={radius}
            />
            <Circle
              stroke="hsl(var(--primary))"
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-2xl font-bold">{value}</Text>
            <Small>{label}</Small>
          </View>
        </View>
      </View>
    );
  }
);

ProgressRing.displayName = "ProgressRing";