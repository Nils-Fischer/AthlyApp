import * as React from "react";
import { Pressable } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface ClickableCardProps extends React.ComponentProps<typeof Card> {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const ClickableCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  ClickableCardProps
>(
  (
    {
      className,
      onPress,
      disabled,
      title,
      description,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={cn("w-full", disabled && "opacity-50")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Card ref={ref} className={cn("w-full", className)} {...props}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          {children && <CardContent>{children}</CardContent>}
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </Pressable>
    );
  }
);

ClickableCard.displayName = "ClickableCard";
