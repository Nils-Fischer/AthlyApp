import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, multiline = true, numberOfLines = 4, placeholderClassName, value, onChangeText, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChangeText = (text: string) => {
      setLocalValue(text);
      if (onChangeText) {
        onChangeText(text);
      }
    };

    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground placeholder:text-sm web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground text-sm", placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        value={localValue}
        onChangeText={handleChangeText}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
