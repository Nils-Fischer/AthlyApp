import type { LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import type { IconProps as PhosphorIconProps } from "phosphor-react-native";

type LucideComponent = React.FC<LucideProps>;

type PhosphorComponent = React.ComponentType<PhosphorIconProps>;

type IconComponent = LucideComponent | PhosphorComponent;

export function iconWithClassName(icons: IconComponent[]) {
  icons.forEach((Icon) => {
    cssInterop(Icon as React.ComponentType<any>, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    });
  });
}
