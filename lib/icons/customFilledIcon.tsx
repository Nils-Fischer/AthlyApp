import { forwardRef } from "react";
import type { LucideProps } from "lucide-react-native";
import type { IconProps as PhosphorIconProps } from "phosphor-react-native";
import React from "react";

// Define component types (could also be imported)
type LucideComponent = React.FC<LucideProps>;
type PhosphorComponent = React.ComponentType<PhosphorIconProps>;
type IconComponent = LucideComponent | PhosphorComponent;

// Define a union type for the props these components can accept
type CombinedIconProps = LucideProps | PhosphorIconProps;

export function createFilledIcon<T extends IconComponent>(Icon: T): T {
  const FilledIcon = forwardRef<unknown, CombinedIconProps>((props, ref) => {
    // Force the icon to use the "fill" weight
    return <Icon {...(props as any)} weight="fill" />;
  });

  FilledIcon.displayName = `${(Icon as any).displayName || "Icon"}Filled`;
  return FilledIcon as unknown as T;
}
