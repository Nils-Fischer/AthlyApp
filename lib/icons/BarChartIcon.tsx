import * as React from "react";
import type { LucideIcon, LucideProps } from "lucide-react-native";
import { forwardRef } from "react";
import { Svg, Line, Rect } from "react-native-svg";
import { iconWithClassName } from "./iconWithClassName";

const createBarChartIcon = (filled: boolean): LucideIcon => {
  const BarChartComponent = forwardRef<SVGSVGElement, LucideProps>(
    (props, ref) => {
      const {
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        ...otherProps
      } = props;

      return (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...otherProps}
        >
          {filled ? (
            <>
              <Rect x="5" y="16" width="2" height="4" fill={color} />
              <Rect x="11" y="10" width="2" height="10" fill={color} />
              <Rect x="17" y="4" width="2" height="16" fill={color} />
            </>
          ) : (
            <>
              <Line x1="6" x2="6" y1="20" y2="16" stroke={color} />
              <Line x1="12" x2="12" y1="20" y2="10" stroke={color} />
              <Line x1="18" x2="18" y1="20" y2="4" stroke={color} />
            </>
          )}
        </Svg>
      );
    }
  );

  BarChartComponent.displayName = filled ? "BarChartFilled" : "BarChart";

  return BarChartComponent as LucideIcon;
};

const BarChart = createBarChartIcon(false);
const BarChartFilled = createBarChartIcon(true);
export { BarChart, BarChartFilled };
