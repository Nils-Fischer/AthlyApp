import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import { ArrowUp, ArrowDown } from "lucide-react-native";
import { fitnessLightColors } from "~/lib/theme/lightColors";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number; // Prozentual, z.B. +15 für 15% mehr
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive"; 
  compact?: boolean;
  valueSuffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "primary",
  compact = false,
  valueSuffix = ""
}) => {
  // Bestimme Trend-Richtung und Farbe
  const showTrend = trend !== undefined && trend !== 0;
  const isPositive = trend && trend > 0;
  
  // Bestimme Farbschemata basierend auf Variante mit den neuen Neon-Farben
  const getColorScheme = () => {
    switch(variant) {
      case "secondary":
        return {
          textColor: fitnessLightColors.secondary.default, // Neon-Pink
          backgroundColor: 'rgba(255, 45, 202, 0.06)',
          borderColor: 'rgba(255, 45, 202, 0.1)'
        };
      case "success":
        return {
          textColor: fitnessLightColors.tertiary.default, // Neon-Grün
          backgroundColor: 'rgba(0, 230, 118, 0.06)',
          borderColor: 'rgba(0, 230, 118, 0.1)'
        };
      case "warning":
        return {
          textColor: fitnessLightColors.accent.default, // Leuchtendes Gelb
          backgroundColor: 'rgba(255, 221, 0, 0.06)',
          borderColor: 'rgba(255, 221, 0, 0.1)'
        };
      case "destructive":
        return {
          textColor: fitnessLightColors.status.error, // Neon-Rot
          backgroundColor: 'rgba(255, 23, 68, 0.06)',
          borderColor: 'rgba(255, 23, 68, 0.1)'
        };
      default: // primary
        return {
          textColor: fitnessLightColors.primary.default, // Neon-Blau
          backgroundColor: 'rgba(0, 178, 255, 0.06)',
          borderColor: 'rgba(0, 178, 255, 0.1)'
        };
    }
  };

  const colors = getColorScheme();
  
  // Trend-Farben mit Neon-Farben
  const trendColor = isPositive ? fitnessLightColors.tertiary.default : fitnessLightColors.status.error;
  const trendBg = isPositive ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 23, 68, 0.08)';
  
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return compact ? (
    // Kompakte Version mit modernem Neon-Look
    <View 
      className="flex-1 rounded-xl p-4 overflow-hidden"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0,
        shadowColor: fitnessLightColors.ui.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          {icon && (
            <View 
              className="mr-2.5 p-2 rounded-full"
              style={{ backgroundColor: colors.backgroundColor }}
            >
              {icon}
            </View>
          )}
          <Text 
            className="text-xs font-medium"
            style={{ color: fitnessLightColors.text.secondary }}
          >
            {title}
          </Text>
        </View>
        
        {showTrend && (
          <View 
            className="px-2 py-0.5 rounded-full flex-row items-center"
            style={{ backgroundColor: trendBg }}
          >
            <Text 
              className="text-[10px] font-medium"
              style={{ color: trendColor }}
            >
              {Math.abs(trend)}%
            </Text>
            <TrendIcon size={10} className="ml-0.5" color={trendColor} />
          </View>
        )}
      </View>
      
      <Text 
        className="text-xl font-bold mt-3 mb-1"
        style={{ color: fitnessLightColors.text.primary }}
      >
        {value}{valueSuffix}
      </Text>
      
      <Text 
        className="text-xs"
        style={{ color: fitnessLightColors.text.tertiary }}
      >
        {subtitle}
      </Text>
      
      {/* Moderner Neon Accent Line */}
      <View 
        className="h-1 w-10 mt-3 rounded-full"
        style={{ backgroundColor: colors.textColor, opacity: 0.25 }}
      />
    </View>
  ) : (
    // Volle Version mit modernem Neon-Look und mehr Whitespace
    <View 
      className="rounded-xl p-6 mb-5"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderWidth: 0,
        shadowColor: fitnessLightColors.ui.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          {icon && (
            <View 
              className="mr-3 p-2.5 rounded-full"
              style={{ backgroundColor: colors.backgroundColor }}
            >
              {icon}
            </View>
          )}
          <Text 
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            {title}
          </Text>
        </View>
        
        {showTrend && (
          <View 
            className="px-2.5 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: trendBg }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: trendColor }}
            >
              {Math.abs(trend)}%
            </Text>
            <TrendIcon size={12} className="ml-1" color={trendColor} />
          </View>
        )}
      </View>
      
      <View className="mt-4">
        <Text 
          className="text-3xl font-bold mb-1.5"
          style={{ color: fitnessLightColors.text.primary }}
        >
          {value}{valueSuffix}
        </Text>
        
        <Text 
          className="text-xs"
          style={{ color: fitnessLightColors.text.tertiary }}
        >
          {subtitle}
        </Text>
      </View>
      
      {/* Moderner Neon Accent Line */}
      <View 
        className="h-1 w-16 mt-4 rounded-full"
        style={{ backgroundColor: colors.textColor, opacity: 0.25 }}
      />
    </View>
  );
};