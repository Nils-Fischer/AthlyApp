import React, { useState, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { H1, H3, P, Large, Small, Muted, CardLabel } from "~/components/ui/typography";
import { Badge } from "~/components/ui/badge";
import { Clock, Weight, Flame, Brain } from "~/lib/icons/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import confetti from "~/assets/animations/confetti.json";
import LottieView from "lottie-react-native";

// Mock data types
type Exercise = {
  name: string;
  weight: number;
  isPR: boolean;
  percentageImprovement?: number; // Percentage improvement from previous PR
};

// AI coach feedback types
type AICoachFeedback = {
  message: string;
  coachName: string;
  avatarUrl?: string;
};

type WorkoutCompletionData = {
  workoutName: string;
  date: Date;
  duration: number; // in minutes
  totalWeight: number; // in kg
  caloriesBurned: number;
  trainedMuscles: string[];
  exercises: Exercise[];
  aiCoachFeedback: AICoachFeedback;
};

// Array of motivational feedback slogans
const FEEDBACK_SLOGANS = [
  "✨ Super gemacht! ✨️",
  "🔥 Starke Leistung! 🔥",
  "💪 Beeindruckend! 💪",
  "🏆 Champion-Level! 🏆",
  "👏 Großartige Arbeit! 👏",
  "🚀 Starkes Training! 🚀",
  "⭐ Hervorragend! ⭐",
];

interface WorkoutCompletionModalProps {
  // In a real implementation, you might get this data from props
  // For now, we'll use mock data
  data?: WorkoutCompletionData;
}

export const WorkoutCompletionModal: React.FC<WorkoutCompletionModalProps> = ({ data }) => {
  const [completionData, setCompletionData] = useState<WorkoutCompletionData | null>(null);
  const animationRef = useRef<any>(null);

  // Select a random slogan when the component mounts
  const randomSlogan = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * FEEDBACK_SLOGANS.length);
    return FEEDBACK_SLOGANS[randomIndex];
  }, []);

  useEffect(() => {
    // If real data is provided via props, use that instead
    if (data) {
      setCompletionData(data);
    } else {
      // Otherwise use mock data for preview
      const mockData: WorkoutCompletionData = {
        workoutName: "Oberkörper Workout",
        date: new Date(),
        duration: 45,
        totalWeight: 1250,
        caloriesBurned: 320,
        trainedMuscles: ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps"],
        exercises: [
          { name: "Bankdrücken", weight: 80, isPR: true, percentageImprovement: 5.3 },
          { name: "Bizeps Curls", weight: 20, isPR: true, percentageImprovement: 11.1 },
          { name: "Schulterdrücken", weight: 25, isPR: false },
          { name: "Klimmzüge", weight: 0, isPR: false },
        ],
        aiCoachFeedback: {
          coachName: "Athly",
          message:
            "Dein Oberkörper-Training war sehr effektiv! Besonders beeindruckend ist deine Steigerung beim Bankdrücken und Bizeps Curls. Überlege vor deinem nächsten Training, dich auch auf den Trizeps zu konzentrieren, um ein ausgewogenes Training zu gewährleisten.",
        },
      };
      setCompletionData(mockData);
    }

    // Play the confetti animation when the component mounts
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, [data]);

  // Format date as string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get PRs from exercises
  const getPRs = () => {
    if (!completionData) return [];
    return completionData.exercises.filter((exercise) => exercise.isPR);
  };

  if (!completionData) {
    return null;
  }

  return (
    <ScrollView>
      {/* Confetti Animation */}
      <View className="absolute top-0 left-0 right-0 z-10 h-80 pointer-events-none">
        <LottieView ref={animationRef} source={confetti} loop={false} autoPlay />
      </View>

      <View className="flex flex-col p-4 gap-6">
        {/* Header */}
        <View className="items-center mt-5 gap-2">
          <H1>{randomSlogan}</H1>
          <H3 className="text-muted-foreground mt-1">{formatDate(completionData.date)}</H3>
        </View>

        {/* Main Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>{completionData.workoutName}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Stats Row */}
            <View className="flex flex-row justify-between my-4">
              <View className="items-center">
                <View className="flex flex-row items-center">
                  <Clock size={18} className="text-muted-foreground mr-2" />
                  <Large className="text-primary">{completionData.duration} Min</Large>
                </View>
              </View>
              <View className="items-center">
                <View className="flex flex-row items-center">
                  <Weight size={18} className="text-muted-foreground mr-2" />
                  <Large className="text-primary">{completionData.totalWeight} kg</Large>
                </View>
              </View>
              <View className="items-center">
                <View className="flex flex-row items-center">
                  <Flame size={18} className="text-muted-foreground mr-2" />
                  <Large className="text-primary">{completionData.caloriesBurned} kcal</Large>
                </View>
              </View>
            </View>

            {/* Trained Muscles */}
            <View className="my-4">
              <Small className="text-muted-foreground mb-2">TRAINIERTE MUSKELN</Small>
              <View className="flex flex-row flex-wrap gap-2">
                {completionData.trainedMuscles.map((muscle, index) => (
                  <Badge key={index} variant="secondary">
                    <P className="text-secondary-foreground">{muscle}</P>
                  </Badge>
                ))}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* PRs Card */}
        {getPRs().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>NEUE BESTLEISTUNGEN</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-2">
                {getPRs().map((exercise, index) => (
                  <View key={index} className="flex flex-row items-center">
                    <View className="flex-1 flex-row items-center gap-2">
                      <P>{exercise.name}</P>
                      <CardLabel className="text-green-500 text-sm mt-0.5">NEW PR</CardLabel>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Muted>{exercise.weight} kg</Muted>
                      {exercise.percentageImprovement && (
                        <Small className="text-green-500 mt-0.5">{`+${exercise.percentageImprovement.toFixed(
                          1
                        )}%`}</Small>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {/* AI Coach Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>COACH FEEDBACK</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex flex-row mt-2">
              {/* Avatar */}
              <Avatar className="h-12 w-12 bg-primary" alt={`${completionData.aiCoachFeedback.coachName} Avatar`}>
                {completionData.aiCoachFeedback.avatarUrl ? (
                  <AvatarImage source={{ uri: completionData.aiCoachFeedback.avatarUrl }} />
                ) : (
                  <AvatarFallback className="bg-primary">
                    <P className="text-primary-foreground text-2xl">A</P>
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Chat Bubble */}
              <View className="flex-1 ml-3">
                {/* Coach Name */}
                <Small className="text-muted-foreground font-medium mb-1">
                  {completionData.aiCoachFeedback.coachName}
                </Small>

                {/* Message Bubble */}
                <View className="bg-secondary rounded-2xl rounded-tl-none p-3">
                  <P className="text-secondary-foreground">{completionData.aiCoachFeedback.message}</P>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Back to Home Button */}
        <Button variant="default" haptics="heavy" onPress={() => router.back()} className="py-10 mb-10">
          <Large className="text-primary-foreground font-bold">Fertig</Large>
        </Button>
      </View>
    </ScrollView>
  );
};

export default WorkoutCompletionModal;
