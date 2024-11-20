import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Brain, Sparkles, Check, X } from "lucide-react-native";
import { Button } from "~/components/ui/button";

export const AITrainingOptimizer = () => {
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [acceptedOptimizations, setAcceptedOptimizations] = useState<string[]>([]);

  const optimizations = [
    {
      id: "1",
      title: "Volumenoptimierung",
      current: "12 Sätze/Muskelgruppe",
      suggested: "15 Sätze/Muskelgruppe",
      reason: "Basierend auf deiner Regenerationsfähigkeit und Trainingshistorie",
      impact: "Potenziell +12% Muskelaufbau"
    },
    {
      id: "2",
      title: "Trainingsfrequenz",
      current: "4x pro Woche",
      suggested: "5x pro Woche",
      reason: "Deine Erholungsmetriken zeigen Potenzial für höhere Frequenz",
      impact: "Bessere Gewichtsprogressionen"
    },
    {
      id: "3",
      title: "Übungsreihenfolge",
      current: "Standard Push/Pull/Legs",
      suggested: "Optimierte Sequenzierung",
      reason: "Maximale Kraftentwicklung für Hauptübungen",
      impact: "Verbesserte Leistung +8%"
    }
  ];

  const handleOptimization = (id: string, accept: boolean) => {
    if (accept) {
      setAcceptedOptimizations(prev => [...prev, id]);
    } else {
      setAcceptedOptimizations(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <View className="bg-card rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-4">
        <Brain className="h-5 w-5 text-primary mr-2" />
        <Text className="font-semibold text-lg">KI Trainingsoptimierung</Text>
      </View>

      {!showOptimizations ? (
        <View>
          <Text className="text-sm text-muted-foreground mb-4">
            Dein KI Assistant hat 3 Optimierungsmöglichkeiten für deinen Trainingsplan identifiziert.
          </Text>
          <Button 
            className="w-full"
            onPress={() => setShowOptimizations(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <Text className="text-primary-foreground">Optimierungen anzeigen</Text>
          </Button>
        </View>
      ) : (
        <View className="gap-4">
          {optimizations.map((opt) => (
            <View 
              key={opt.id} 
              className={`bg-muted/50 rounded-xl p-4 ${
                acceptedOptimizations.includes(opt.id) ? 'border border-primary' : ''
              }`}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-medium">{opt.title}</Text>
                <View className="flex-row gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full"
                    onPress={() => handleOptimization(opt.id, true)}
                  >
                    <Check className={`h-4 w-4 ${
                      acceptedOptimizations.includes(opt.id) 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full"
                    onPress={() => handleOptimization(opt.id, false)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </View>
              </View>

              <View className="flex-row gap-2 mb-2">
                <View className="flex-1 bg-background/50 rounded-lg p-2">
                  <Text className="text-xs text-muted-foreground mb-1">Aktuell</Text>
                  <Text className="text-sm">{opt.current}</Text>
                </View>
                <View className="flex-1 bg-background/50 rounded-lg p-2">
                  <Text className="text-xs text-muted-foreground mb-1">Vorgeschlagen</Text>
                  <Text className="text-sm text-primary">{opt.suggested}</Text>
                </View>
              </View>

              <Text className="text-xs text-muted-foreground mb-1">Begründung:</Text>
              <Text className="text-sm mb-2">{opt.reason}</Text>

              <View className="bg-primary/10 rounded-lg px-3 py-2">
                <Text className="text-xs text-primary">Erwarteter Impact: {opt.impact}</Text>
              </View>
            </View>
          ))}

          {acceptedOptimizations.length > 0 && (
            <Button className="w-full">
              <Text className="text-primary-foreground">
                {acceptedOptimizations.length} Optimierungen anwenden
              </Text>
            </Button>
          )}
        </View>
      )}
    </View>
  );
};