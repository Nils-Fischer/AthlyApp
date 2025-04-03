import * as React from "react";
import { TextInput, type TextInputProps, Keyboard, Platform } from "react-native";
import { cn } from "~/lib/utils";

// Base props to omit/override for typography inputs
type OmittedInputProps = "editable" | "className" | "style";

// H1 Input
const H1Input = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "web:scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl web:select-text", // H1 styles
          className
        )}
        multiline={false} // Default to single line like H1
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
H1Input.displayName = "H1Input";

// H2 Input
const H2Input = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "web:scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 web:select-text", // H2 styles (removed border-b)
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
H2Input.displayName = "H2Input";

// H3 Input
const H3Input = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        aria-level="3"
        className={cn(
          "bg-transparent border-0 p-0",
          "web:scroll-m-20 text-2xl font-semibold tracking-tight web:select-text", // H3 styles
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
H3Input.displayName = "H3Input";

// H4 Input
const H4Input = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "web:scroll-m-20 text-xl font-semibold tracking-tight web:select-text", // H4 styles
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
H4Input.displayName = "H4Input";

// P Input
const PInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "text-base web:select-text", // P styles
          className
        )}
        // Allow multiline by default for paragraph-like input
        multiline={props.multiline !== undefined ? props.multiline : true}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
PInput.displayName = "PInput";

// BlockQuote Input
const BlockQuoteInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "mt-6 native:mt-4 pl-6 native:pl-3 text-base italic web:select-text", // BlockQuote styles (removed border)
          className
        )}
        multiline={props.multiline !== undefined ? props.multiline : true}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
BlockQuoteInput.displayName = "BlockQuoteInput";

// Code Input
const CodeInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "relative px-[0.3rem] py-[0.2rem] text-sm font-semibold web:select-text", // Code styles (removed bg-muted, rounded-md)
          className
        )}
        multiline={false} // Code is usually single line
        autoCapitalize="none" // Often needed for code
        autoCorrect={false} // Often needed for code
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
CodeInput.displayName = "CodeInput";

// Lead Input
const LeadInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 placeholder:text-muted-foreground", // Base transparent input styles
          "text-xl text-muted-foreground web:select-text", // Lead styles
          className
        )}
        multiline={props.multiline !== undefined ? props.multiline : true} // Lead text can be longer
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
LeadInput.displayName = "LeadInput";

// Large Input
const LargeInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "text-xl font-semibold web:select-text", // Large styles
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
LargeInput.displayName = "LargeInput";

// Small Input
const SmallInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground", // Base transparent input styles
          "text-sm font-medium leading-none web:select-text", // Small styles
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
SmallInput.displayName = "SmallInput";

// Muted Input
const MutedInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 placeholder:text-muted-foreground", // Base transparent input styles
          "text-sm text-muted-foreground web:select-text", // Muted styles
          className
        )}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
MutedInput.displayName = "MutedInput";

// CardLabel Input
const CardLabelInput = React.forwardRef<TextInput, Omit<TextInputProps, "className"> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 placeholder:text-muted-foreground", // Base transparent input styles
          "text-sm text-muted-foreground font-bold tracking-widest uppercase web:select-text", // CardLabel styles
          className
        )}
        style={[{ fontFamily: "Avenir" }, props.style]}
        multiline={false}
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
CardLabelInput.displayName = "CardLabelInput";

// Link Input
const LinkInput = React.forwardRef<TextInput, Omit<TextInputProps, OmittedInputProps> & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "bg-transparent border-0 p-0 text-primary placeholder:text-muted-foreground underline", // Base transparent input styles + Link styles (using text-primary and underline)
          className
        )}
        multiline={false}
        keyboardType="url" // Sensible default for links
        returnKeyType={props.returnKeyType || "done"}
        returnKeyLabel={Platform.OS === "android" ? props.returnKeyLabel || "fertig" : undefined}
        onSubmitEditing={props.onSubmitEditing || (() => Keyboard.dismiss())}
        {...props}
      />
    );
  }
);
LinkInput.displayName = "LinkInput";

export {
  H1Input,
  H2Input,
  H3Input,
  H4Input,
  PInput,
  BlockQuoteInput,
  CodeInput,
  LeadInput,
  LargeInput,
  SmallInput,
  MutedInput,
  CardLabelInput,
  LinkInput,
};
