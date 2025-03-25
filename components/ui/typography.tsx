import * as Slot from "@rn-primitives/slot";
import { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { Platform, Text as RNText, Pressable } from "react-native";
import { cn } from "~/lib/utils";

/**
 * H1 - Main headings for pages or main sections
 * - Very large text (text-4xl/5xl)
 * - Extra bold (font-extrabold)
 * - For the most important heading on a page
 */
const H1 = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      role="heading"
      aria-level="1"
      className={cn(
        "web:scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl web:select-text",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

H1.displayName = "H1";

/**
 * H2 - Section headings
 * - Large text (text-3xl)
 * - With underline (border-b)
 * - For important sections within a page
 */
const H2 = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      role="heading"
      aria-level="2"
      className={cn(
        "web:scroll-m-20 border-b border-border pb-2 text-3xl text-foreground font-semibold tracking-tight first:mt-0 web:select-text",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

H2.displayName = "H2";

/**
 * H3 - Subsection headings
 * - Medium text (text-2xl)
 * - For headings of subsections within sections
 */
const H3 = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      role="heading"
      aria-level="3"
      className={cn("web:scroll-m-20 text-2xl text-foreground font-semibold tracking-tight web:select-text", className)}
      ref={ref}
      {...props}
    />
  );
});

H3.displayName = "H3";

/**
 * H4 - Smaller subsection headings
 * - Slightly larger text (text-xl)
 * - For the finest level of structuring
 */
const H4 = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      role="heading"
      aria-level="4"
      className={cn("web:scroll-m-20 text-xl text-foreground font-semibold tracking-tight web:select-text", className)}
      ref={ref}
      {...props}
    />
  );
});

H4.displayName = "H4";

/**
 * P - Standard text for body text
 * - Base font size (text-base)
 * - For the main text content
 */
const P = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return <Component className={cn("text-base text-foreground web:select-text", className)} ref={ref} {...props} />;
});
P.displayName = "P";

/**
 * BlockQuote - Quotes
 * - Indented with left border
 * - Italicized
 * - For direct quotes or highlighted text passages
 */
const BlockQuote = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      // @ts-ignore - role of blockquote renders blockquote element on the web
      role={Platform.OS === "web" ? "blockquote" : undefined}
      className={cn(
        "mt-6 native:mt-4 border-l-2 border-border pl-6 native:pl-3 text-base text-foreground italic web:select-text",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

BlockQuote.displayName = "BlockQuote";

/**
 * Code - Code snippets or technical terms
 * - Smaller font size (text-sm)
 * - Background and border for emphasis
 * - For code examples, commands, or technical identifiers
 */
const Code = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      // @ts-ignore - role of code renders code element on the web
      role={Platform.OS === "web" ? "code" : undefined}
      className={cn(
        "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-foreground font-semibold web:select-text",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Code.displayName = "Code";

/**
 * Lead - Introductory text
 * - Larger text (text-xl)
 * - Muted color (text-muted-foreground)
 * - For introductions at the beginning of a section or summaries
 */
const Lead = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return <Component className={cn("text-xl text-muted-foreground web:select-text", className)} ref={ref} {...props} />;
});

Lead.displayName = "Lead";

/**
 * Large - Highlighted text
 * - Larger text (text-xl)
 * - Semi-bold (font-semibold)
 * - For important information that should stand out
 */
const Large = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn("text-xl text-foreground font-semibold web:select-text", className)}
      ref={ref}
      {...props}
    />
  );
});

Large.displayName = "Large";

/**
 * Small - Small text
 * - Smaller font (text-sm)
 * - Medium weight (font-medium)
 * - For less important information such as metadata, date inputs, or additional information
 */
const Small = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn("text-sm text-foreground font-medium leading-none web:select-text", className)}
      ref={ref}
      {...props}
    />
  );
});

Small.displayName = "Small";

/**
 * Muted - Subdued text
 * - Smaller font (text-sm)
 * - Muted color (text-muted-foreground)
 * - For subordinate information, hints, or disabled elements
 */
const Muted = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return <Component className={cn("text-sm text-muted-foreground web:select-text", className)} ref={ref} {...props} />;
});

Muted.displayName = "Muted";

/**
 * CardLabel - Card section titles in all caps
 * - Smaller font (text-sm)
 * - All caps text
 * - Avenir font
 * - For card headers and section labels
 */
const CardLabel = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn("text-sm text-muted-foreground font-bold tracking-widest uppercase web:select-text", className)}
      style={{ fontFamily: "Avenir" }}
      ref={ref}
      {...props}
    />
  );
});

CardLabel.displayName = "CardLabel";

/**
 * Link - Pressable link text
 * - Blue color (text-primary)
 * - Underlined (underline)
 * - For interactive links within text content
 */
const Link = React.forwardRef<TextRef, SlottableTextProps & { onPress?: () => void; href?: string }>(
  ({ className, asChild = false, onPress, href, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        // @ts-ignore - role of link renders a element on the web
        role={Platform.OS === "web" ? "link" : undefined}
        // @ts-ignore - href for web
        href={Platform.OS === "web" ? href : undefined}
        onPress={onPress}
        className={cn("text-blue-500", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small, CardLabel, Link };
