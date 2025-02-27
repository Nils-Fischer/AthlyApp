import * as React from "react";
import { TextInput, type TextInputProps, View, Keyboard } from "react-native";
import { cn } from "~/lib/utils";

interface InputProps extends Omit<TextInputProps, "placeholderClassName"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  placeholderClassName?: string;
  textSize?: "sm" | "base" | "lg";
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, startContent, endContent, textSize = "base", ...props }, ref) => {
    const textSizeClasses = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    };

    return (
      <View className="relative flex-row items-center w-full">
        {startContent && <View className="absolute left-3 z-10">{startContent}</View>}
        <TextInput
          ref={ref}
          className={cn(
            "flex-1 h-10 native:h-12 rounded-md border border-input bg-background px-3 web:py-2 text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
            textSizeClasses[textSize],
            startContent && "pl-10",
            endContent && "pr-10",
            props.editable === false && "opacity-50 web:cursor-not-allowed",
            className
          )}
          placeholderClassName={cn("text-muted-foreground text-sm", placeholderClassName)}
          multiline={false}
          scrollEnabled={true}
          numberOfLines={1}
          returnKeyType={props.returnKeyType || "done"}
          onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
          {...props}
        />
        {endContent && <View className="absolute right-3 z-10">{endContent}</View>}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
