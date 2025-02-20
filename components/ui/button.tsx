import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable, type GestureResponderEvent } from "react-native";
import * as Haptics from "expo-haptics";
import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost: "bg-transparent web:hover:opacity-80 active:opacity-80",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline ",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 native:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        secondary: "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-hover:opacity-70 group-active:opacity-70",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type HapticsFeedback =
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "rigid"
  | "soft";

/**
 * A customizable button component with integrated haptic feedback support.
 *
 * @component
 *
 * @example
 * // Basic usage with success feedback
 * <Button
 *   variant="default"
 *   haptics="success"
 *   onPress={() => handleFormSubmit()}
 * >
 *   Submit
 * </Button>
 *
 * @example
 * // Destructive action with heavy impact
 * <Button
 *   variant="destructive"
 *   haptics="heavy"
 *   onPress={() => deleteItem()}
 * >
 *   Delete Forever
 * </Button>
 *
 * @param {HapticsFeedback} [haptics] - Type of haptic feedback to trigger on press
 * @param {string} [className] - Additional class names for styling
 * @param {VariantProps} [variant] - Visual variant of the button
 * @param {VariantProps} [size] - Size variant of the button
 *
 * @typedef {("selection"|"success"|"warning"|"error"|"light"|"medium"|"heavy"|"rigid"|"soft")} HapticsFeedback
 *
 * ## Haptic Feedback Guide
 *
 * - **Notification Types** (use for system feedback):
 *   - `success`: Successful operations (form submissions, completed actions)
 *   - `warning`: Non-critical issues (partial successes, validation warnings)
 *   - `error`: Critical failures (network errors, authentication issues)
 *
 * - **Selection Feedback**:
 *   - `selection`: Discrete interactions (toggle switches, radio buttons, pickers)
 *
 * - **Impact Styles** (use for physical interactions):
 *   - `light`: Subtle feedback (icon buttons, small interface elements)
 *   - `medium`: Standard button presses (most common interactions)
 *   - `heavy`: Significant actions (destructive operations, major changes)
 *   - `rigid`: Sharp mechanical interactions (switches, sliders)
 *   - `soft`: Gentle organic interactions (toggle animations, soft transitions)
 */
type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Configure haptic feedback for button interactions.
     * Feedback is triggered before the onPress handler executes.
     *
     * @example
     * // Success notification for form submission
     * haptics="success"
     *
     * @example
     * // Heavy impact for destructive action
     * haptics="heavy"
     */
    haptics?: HapticsFeedback;
  };

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, haptics, onPress, ...props }, ref) => {
    const handlePress = async (event: GestureResponderEvent) => {
      try {
        if (haptics) {
          if (haptics === "selection") {
            await Haptics.selectionAsync();
          } else if (haptics === "success") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (haptics === "warning") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else if (haptics === "error") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          } else {
            await Haptics.impactAsync(haptics as Haptics.ImpactFeedbackStyle);
          }
        }
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
      if (onPress) {
        onPress(event);
      }
    };

    return (
      <TextClassContext.Provider
        value={cn(props.disabled && "web:pointer-events-none", buttonTextVariants({ variant, size }))}
      >
        <Pressable
          className={cn(
            props.disabled && "opacity-50 web:pointer-events-none",
            buttonVariants({ variant, size, className })
          )}
          ref={ref}
          role="button"
          {...props}
          onPress={handlePress}
        />
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
