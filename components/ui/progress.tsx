import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface ProgressProps extends ProgressPrimitive.RootProps {
  indicatorClassName?: string;
  max?: number;
}

const Progress = React.forwardRef<ProgressPrimitive.RootRef, ProgressProps>(
  ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
    // Calculate the percentage based on the max value
    const percentage = value != null ? (value / max) * 100 : 0;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
        value={percentage} // Pass the calculated percentage to the root
      >
        <Indicator value={percentage} className={indicatorClassName} />
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

interface IndicatorProps {
  value: number | undefined | null;
  className?: string;
}

function Indicator({ value, className }: IndicatorProps) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    const width = progress.value;
    return {
      width: `${Math.round(width)}%`,
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'h-full w-full flex-1 bg-primary web:transition-all',
          className
        )}
        style={{ transform: `translateX(-${100 - Math.round(value ?? 0)}%)` }}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full w-full', className)}
        />
      </View>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={indicator}
        className={cn('h-full bg-foreground', className)}
      />
    </ProgressPrimitive.Indicator>
  );
}

export { Progress };
export type { ProgressProps };
