import { LucideIcon, LucideProps } from "lucide-react-native";
import { forwardRef } from "react";

export function createFilledIcon(Icon: LucideIcon): LucideIcon {
  const FilledIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => {
    return <Icon {...props} fill={props.color || "currentColor"} />;
  });

  FilledIcon.displayName = `${Icon.displayName}Filled`;
  return FilledIcon as LucideIcon;
}
