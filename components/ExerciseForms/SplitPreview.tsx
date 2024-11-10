import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { ClickableCard } from "../ClickableCard";
import { cn } from "~/lib/utils";
import { Activity } from "~/lib/icons/Icons";
import Animated, { FadeInDown } from "react-native-reanimated";

type SplitOption = {
  id: string;
  title: string;
  description: string;
  details: string[];
  daysPerWeek: number;
};

const TRAINING_SPLITS: Record<number, SplitOption[]> = {
  1: [
    {
      id: "fullbody-1",
      title: "Ganzkörper-Training",
      description: "Maximale Effizienz in einer Session",
      details: [
        "Trainiert alle wichtigen Muskelgruppen in einer Session",
        "Ideal für Anfänger und Fortgeschrittene",
        "Optimale Erholung zwischen den Trainingseinheiten",
      ],
      daysPerWeek: 1,
    },
  ],
  2: [
    {
      id: "ppl-3",
      title: "Push Pull Legs Split",
      description: "Der Klassiker für gezielte Muskelentwicklung",
      details: [
        "Push: Brust, Schultern, Trizeps",
        "Pull: Rücken, Bizeps",
        "Legs: Beine, Core",
      ],
      daysPerWeek: 3,
    },
    {
      id: "fullbody-2",
      title: "Ganzkörper 2x Split",
      description: "Optimale Trainingsfrequenz für konstante Fortschritte",
      details: [
        "Zwei intensive Ganzkörpereinheiten",
        "Ausgewogenes Verhältnis von Training und Regeneration",
        "Flexibel in der Wochenplanung",
      ],
      daysPerWeek: 2,
    },
    {
      id: "upper-lower-3",
      title: "Upper/Lower Split",
      description: "Effektive Aufteilung für gezielten Muskelaufbau",
      details: [
        "Oberkörper: Intensiver Fokus auf obere Muskelketten",
        "Unterkörper: Komplettes Bein- und Core-Training",
        "Optional: Zusätzlicher Ganzkörpertag für mehr Volumen",
      ],
      daysPerWeek: 3,
    },
  ],
  3: [
    {
      id: "upper-lower-4",
      title: "Upper/Lower 4-Tage Split",
      description: "Intensive Trainingsfrequenz für maximale Resultate",
      details: [
        "Zweimal wöchentlich Oberkörpertraining",
        "Zweimal wöchentlich Unterkörpertraining",
        "Optimale Verteilung der Trainingsbelastung",
      ],
      daysPerWeek: 4,
    },
    {
      id: "ppl-ul-5",
      title: "5-Tage Power Split",
      description: "Fortgeschrittenes Training für maximale Intensität",
      details: [
        "Kombination aus Push/Pull/Legs",
        "Zusätzliche Spezialisierung durch Ober-/Unterkörpertage",
        "Hohe Trainingsfrequenz für schnelle Fortschritte",
      ],
      daysPerWeek: 5,
    },
    {
      id: "ppl-2-6",
      title: "Push Pull Legs 2x",
      description: "Maximales Trainingsvolumen für optimale Ergebnisse",
      details: [
        "Zweimaliges Training aller Muskelgruppen pro Woche",
        "Höchste Trainingsfrequenz für maximale Reize",
        "Perfekt für ambitionierte Athleten",
      ],
      daysPerWeek: 6,
    },
  ],
};

interface AnimatedCardProps {
  index: number;
  split: SplitOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const AnimatedCard = ({
  index,
  split,
  isSelected,
  onSelect,
}: AnimatedCardProps) => {
  const enteringAnimation = FadeInDown.delay(index * 500)
    .springify()
    .damping(12)
    .stiffness(80);

  return (
    <Animated.View entering={enteringAnimation}>
      <ClickableCard
        title={split.title}
        description={`${split.daysPerWeek}x pro Woche`}
        onPress={() => onSelect(split.id)}
        className={cn(
          "border-2",
          isSelected ? "border-primary" : "border-border"
        )}
      >
        <View className="gap-2">
          <Text className="text-sm text-muted-foreground">
            {split.description}
          </Text>
          <View className="mt-2">
            {split.details.map((detail, index) => (
              <View key={index} className="flex-row items-center gap-2 py-1">
                <Activity size={16} className="text-primary" />
                <Text className="text-sm flex-1">{detail}</Text>
              </View>
            ))}
          </View>
        </View>
      </ClickableCard>
    </Animated.View>
  );
};

interface TrainingSplitPreviewProps {
  frequency: number;
  selectedSplit: string | null;
  onSplitSelect: (splitId: string) => void;
}

export function TrainingSplitPreview({
  frequency,
  selectedSplit,
  onSplitSelect,
}: TrainingSplitPreviewProps) {
  const availableSplits = TRAINING_SPLITS[frequency] || [];

  return (
    <View className="flex-1">
      <Animated.View
        className="px-4"
        entering={FadeInDown.duration(1000).springify()}
      >
        <Text className="text-2xl font-bold mb-2">
          Wähle dein Trainingsprogramm
        </Text>
        <Text className="text-base text-muted-foreground mb-6">
          Basierend auf deiner gewählten Trainingsfrequenz
        </Text>
      </Animated.View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="gap-4">
          {availableSplits.map((split, index) => (
            <AnimatedCard
              key={split.id}
              index={index}
              split={split}
              isSelected={selectedSplit === split.id}
              onSelect={onSplitSelect}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
