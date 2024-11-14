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
    // Calculate and round the percentage immediately
    const percentage = value != null ? Math.round((value / max) * 100) : 0;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
        value={percentage}
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
  // Ensure value is always an integer
  const progress = useDerivedValue(() => {
    const safeValue = value ?? 0;
    return Math.min(100, Math.max(0, Math.round(safeValue)));
  });

  const indicator = useAnimatedStyle(() => {
    return {
      width: `${Math.round(progress.value)}%`,
    };
  });

  if (Platform.OS === 'web') {
    const safeValue = Math.min(100, Math.max(0, Math.round(value ?? 0)));
    return (
      <View
        className={cn(
          'h-full w-full flex-1 bg-primary web:transition-all',
          className
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
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
