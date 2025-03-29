import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import { ArrowUp, ArrowDown } from "lucide-react-native";

// Design System Definition
const designSystem = {
  // Abstände
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  // Radien
  radii: {
    sm: 16,
    md: 20,
    lg: 24
  },
  // Schatten
  shadow: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 2
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3
    }
  },
  // Farben - basierend auf neuen UI-Vorgaben
  colors: {
    background: '#FFFFFF',
    backgroundSecondary: 'rgba(248, 250, 252, 0.95)',
    primary: '#22C55E',  // Primäre Akzentfarbe - Kräftiges Grün
    primaryLight: 'rgba(34, 197, 94, 0.08)',
    secondary: '#7A86E8', // Sekundäre Akzentfarbe - Helles Lila-Blau
    secondaryLight: 'rgba(122, 134, 232, 0.08)',
    tertiary: '#F97316',  // Tertiäre Akzentfarbe - Warmes Orange
    tertiaryLight: 'rgba(249, 115, 22, 0.08)',
    success: '#22C55E',   // Grün für Erfolge und Fortschritt
    successLight: 'rgba(34, 197, 94, 0.08)',
    warning: '#FBBF24',   // Warnung - Gelb
    warningLight: 'rgba(251, 191, 36, 0.08)',
    error: '#EF4444',     // Fehler/Wichtig - Rot
    errorLight: 'rgba(239, 68, 68, 0.08)',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#9CA3AF',
    border: 'rgba(229, 231, 235, 0.8)'
  },
  // Typografie
  typography: {
    heading1: {
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 34
    },
    heading2: {
      fontSize: 22,
      fontWeight: "700",
      lineHeight: 28
    },
    heading3: {
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 24
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 22
    },
    caption: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 18
    },
    small: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 16
    }
  }
};

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
  
  // Bestimme Farbschemata basierend auf Variante mit den neuen Designfarben
  const getColorScheme = () => {
    switch(variant) {
      case "secondary":
        return {
          textColor: designSystem.colors.secondary,
          backgroundColor: designSystem.colors.secondaryLight
        };
      case "success":
        return {
          textColor: designSystem.colors.success,
          backgroundColor: designSystem.colors.successLight
        };
      case "warning":
        return {
          textColor: designSystem.colors.warning,
          backgroundColor: designSystem.colors.warningLight
        };
      case "destructive":
        return {
          textColor: designSystem.colors.tertiary,  // Warmes Orange für "Destructive"
          backgroundColor: designSystem.colors.tertiaryLight
        };
      default: // primary
        return {
          textColor: designSystem.colors.primary,
          backgroundColor: designSystem.colors.primaryLight
        };
    }
  };

  const colors = getColorScheme();
  
  // Trend-Farben
  const trendColor = isPositive ? designSystem.colors.success : designSystem.colors.error;
  const trendBg = isPositive ? designSystem.colors.successLight : designSystem.colors.errorLight;
  
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return compact ? (
    // Kompakte Version
    <View style={{ 
      flex: 1,
      borderRadius: designSystem.radii.md,
      padding: designSystem.spacing.lg,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      ...designSystem.shadow.sm
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <View style={{ 
              marginRight: designSystem.spacing.sm,
              padding: designSystem.spacing.sm,
              borderRadius: designSystem.radii.sm / 2,
              backgroundColor: colors.backgroundColor
            }}>
              {icon}
            </View>
          )}
          <Text style={{ 
            fontSize: designSystem.typography.caption.fontSize,
            fontWeight: "600",
            color: designSystem.colors.textSecondary
          }}>
            {title}
          </Text>
        </View>
        
        {showTrend && (
          <View style={{ 
            paddingHorizontal: designSystem.spacing.sm,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: trendBg
          }}>
            <Text style={{ 
              fontSize: 11,
              fontWeight: "600",
              color: trendColor
            }}>
              {Math.abs(trend)}%
            </Text>
            <TrendIcon size={10} style={{ marginLeft: 2 }} color={trendColor} />
          </View>
        )}
      </View>
      
      <Text style={{ 
        fontSize: 24,
        fontWeight: "700",
        marginTop: designSystem.spacing.md,
        marginBottom: 4,
        color: designSystem.colors.textPrimary
      }}>
        {value}{valueSuffix}
      </Text>
      
      <Text style={{ 
        fontSize: designSystem.typography.small.fontSize,
        color: designSystem.colors.textTertiary
      }}>
        {subtitle}
      </Text>
      
      {/* Accent Line */}
      <View style={{ 
        height: 3,
        width: 32,
        marginTop: designSystem.spacing.md,
        borderRadius: 1.5,
        backgroundColor: colors.textColor,
        opacity: 0.25
      }} />
    </View>
  ) : (
    // Volle Version
    <View style={{ 
      borderRadius: designSystem.radii.lg,
      padding: designSystem.spacing.xl,
      marginBottom: designSystem.spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      ...designSystem.shadow.sm
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <View style={{ 
              marginRight: designSystem.spacing.md,
              padding: designSystem.spacing.sm,
              borderRadius: designSystem.radii.sm,
              backgroundColor: colors.backgroundColor
            }}>
              {icon}
            </View>
          )}
          <Text style={{ 
            fontSize: designSystem.typography.body.fontSize,
            fontWeight: "600",
            color: designSystem.colors.textPrimary
          }}>
            {title}
          </Text>
        </View>
        
        {showTrend && (
          <View style={{ 
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: designSystem.radii.sm,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: trendBg
          }}>
            <Text style={{ 
              fontSize: designSystem.typography.small.fontSize,
              fontWeight: "600",
              color: trendColor
            }}>
              {Math.abs(trend)}%
            </Text>
            <TrendIcon size={12} style={{ marginLeft: 4 }} color={trendColor} />
          </View>
        )}
      </View>
      
      <View style={{ marginTop: designSystem.spacing.lg }}>
        <Text style={{ 
          fontSize: 30,
          fontWeight: "700",
          marginBottom: 6,
          color: designSystem.colors.textPrimary
        }}>
          {value}{valueSuffix}
        </Text>
        
        <Text style={{ 
          fontSize: designSystem.typography.small.fontSize,
          color: designSystem.colors.textTertiary
        }}>
          {subtitle}
        </Text>
      </View>
      
      {/* Accent Line */}
      <View style={{ 
        height: 3,
        width: 40,
        marginTop: designSystem.spacing.lg,
        borderRadius: 1.5,
        backgroundColor: colors.textColor,
        opacity: 0.25
      }} />
    </View>
  );
};