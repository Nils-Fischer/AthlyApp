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
  
  // Bestimme Farbschemata basierend auf Variante für iOS-Stil
  const getColorScheme = () => {
    switch(variant) {
      case "secondary":
        return {
          textColor: fitnessLightColors.secondary.default,
          backgroundColor: 'rgba(0, 136, 255, 0.05)',
          borderColor: 'rgba(0, 136, 255, 0.1)'
        };
      case "success":
        return {
          textColor: fitnessLightColors.tertiary.default,
          backgroundColor: 'rgba(0, 200, 83, 0.05)',
          borderColor: 'rgba(0, 200, 83, 0.1)'
        };
      case "warning":
        return {
          textColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderColor: 'rgba(245, 158, 11, 0.1)'
        };
      case "destructive":
        return {
          textColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderColor: 'rgba(239, 68, 68, 0.1)'
        };
      default: // primary
        return {
          textColor: fitnessLightColors.secondary.default,
          backgroundColor: 'rgba(0, 136, 255, 0.05)',
          borderColor: 'rgba(0, 136, 255, 0.1)'
        };
    }
  };

  const colors = getColorScheme();
  
  // Trend-Farben für iOS-Stil
  const trendColor = isPositive ? fitnessLightColors.tertiary.default : '#EF4444';
  const trendBg = isPositive ? 'rgba(0, 200, 83, 0.08)' : 'rgba(239, 68, 68, 0.08)';
  
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return compact ? (
    // Kompakte Version für iOS-Stil
    <View 
      className="flex-1 rounded-xl p-3 overflow-hidden"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0.5,
        borderColor: fitnessLightColors.ui.border,
        shadowColor: fitnessLightColors.ui.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          {icon && (
            <View 
              className="mr-2 p-1.5 rounded-full"
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
            className="px-1.5 py-0.5 rounded-full flex-row items-center"
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
        className="text-xl font-bold mt-2 mb-0.5"
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
      
      {/* iOS-Style Accent Line */}
      <View 
        className="h-0.5 w-8 mt-2.5 rounded-full"
        style={{ backgroundColor: colors.textColor, opacity: 0.2 }}
      />
    </View>
  ) : (
    // Volle Version für iOS-Stil
    <View 
      className="rounded-xl p-4 mb-4"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0.5,
        borderColor: fitnessLightColors.ui.border,
        shadowColor: fitnessLightColors.ui.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
            className="font-medium"
            style={{ color: fitnessLightColors.text.primary }}
          >
            {title}
          </Text>
        </View>
        
        {showTrend && (
          <View 
            className="px-2 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: trendBg }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: trendColor }}
            >
              {Math.abs(trend)}%
            </Text>
            <TrendIcon size={12} className="ml-0.5" color={trendColor} />
          </View>
        )}
      </View>
      
      <View className="mt-3">
        <Text 
          className="text-2xl font-bold mb-1"
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
      
      {/* iOS-Style Accent Line */}
      <View 
        className="h-1 w-16 mt-3 rounded-full"
        style={{ backgroundColor: colors.textColor, opacity: 0.2 }}
      />
    </View>
  );
};