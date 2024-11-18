// TrainTechApp/components/Stats/AIInsights.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Brain, TrendingUp, AlertCircle, Target, Zap, Activity, BarChart2 } from "lucide-react-native";
import { AIPredictions } from "./AIPredictions";
import { AITrainingOptimizer } from "./AITrainingOptimizer";

export const AIInsights = () => {
  return (
    <View className="gap-4">
      {/* AI Status Card */}
      <View className="bg-card/80 rounded-2xl p-4 border border-primary/10">
        <View className="flex-row items-center mb-3">
          <Brain className="h-5 w-5 text-primary mr-2" />
          <Text className="font-semibold text-lg">KI Training Assistant</Text>
        </View>
        
        <Text className="text-sm text-muted-foreground mb-4">
          Basierend auf deinen letzten 48 Trainingseinheiten und deinem Fortschritt hat dein KI Assistant neue Erkenntnisse generiert.
        </Text>

        {/* AI Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-primary/5 p-3 rounded-xl">
            <Text className="text-xs text-muted-foreground mb-1">Trainings Analysiert</Text>
            <Text className="font-semibold">48</Text>
          </View>
          <View className="flex-1 bg-primary/5 p-3 rounded-xl">
            <Text className="text-xs text-muted-foreground mb-1">Optimierungen</Text>
            <Text className="font-semibold">7</Text>
          </View>
          <View className="flex-1 bg-primary/5 p-3 rounded-xl">
            <Text className="text-xs text-muted-foreground mb-1">Fortschritt</Text>
            <Text className="font-semibold">+15%</Text>
          </View>
        </View>
      </View>

      {/* Key Insights */}
      <View className="bg-card rounded-2xl p-4">
        <Text className="font-semibold text-lg mb-3">Key Insights</Text>
        
        <View className="gap-3">
          <View className="bg-emerald-500/10 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
              <Text className="font-medium">Fortschritt Empfehlung</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Deine Leistung bei Bankdrücken zeigt optimale Progressive Overload. Erhöhe das Gewicht um 2.5kg in der nächsten Session.
            </Text>
          </View>

          <View className="bg-orange-500/10 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Activity className="h-5 w-5 text-orange-500 mr-2" />
              <Text className="font-medium">Recovery Status</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Deine CNS Belastung ist erhöht. Plane einen zusätzlichen Ruhetag vor deinem nächsten Heavy Pull Day ein.
            </Text>
          </View>

          <View className="bg-blue-500/10 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              <Text className="font-medium">Zielerreichung</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Du bist auf Kurs für dein Kraftziel. Bei gleichbleibendem Fortschritt erreichst du 140kg Bankdrücken in 6 Wochen.
            </Text>
          </View>
        </View>
      </View>

      {/* Performance Analysis */}
      <View className="bg-card rounded-2xl p-4">
        <Text className="font-semibold text-lg mb-3">KI Performance Analysis</Text>
        
        <View className="gap-3">
          {[
            {
              title: "Volumen Management",
              value: "Optimal",
              detail: "Dein Trainingsvolumen liegt im optimalen Bereich für Hypertrophie",
              icon: <BarChart2 className="h-5 w-5 text-primary" />,
              status: "success"
            },
            {
              title: "Intensität",
              value: "Leicht Erhöht",
              detail: "Die durchschnittliche Intensität könnte für bessere Regeneration reduziert werden",
              icon: <Zap className="h-5 w-5 text-yellow-500" />,
              status: "warning"
            },
            {
              title: "Form Qualität",
              value: "Verbesserungspotential",
              detail: "Bei Kniebeugen wurde suboptimale Bewegungsausführung erkannt",
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
              status: "alert"
            }
          ].map((item, index) => (
            <View 
              key={index}
              className={`p-4 rounded-xl border ${
                item.status === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' :
                item.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                'border-red-500/20 bg-red-500/5'
              }`}
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <View className="flex-row items-center mb-1">
                    {item.icon}
                    <Text className="font-medium ml-2">{item.title}</Text>
                  </View>
                  <Text className="text-sm font-medium mb-1">{item.value}</Text>
                  <Text className="text-xs text-muted-foreground">{item.detail}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <AIPredictions />
      <AITrainingOptimizer />
    </View>
  );
};