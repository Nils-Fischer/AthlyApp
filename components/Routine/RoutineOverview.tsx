import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View, ImageBackground, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Exercise, Routine, Workout } from "~/lib/types";
import { cn, generateId } from "~/lib/utils";
import { CardLabel, H3, P } from "../ui/typography";
import { FullscreenCard } from "../ui/fullscreen-card";
import { Calendar, CircleAlert, CheckCircle, Plus, MoreHorizontal, Trash2, Pencil } from "~/lib/icons/Icons";
import { WorkoutCard } from "../Workout/WorkoutCard";
import { H3Input, PInput } from "../ui/typography-inputs";
import WheelPicker from "../ui/wheel-picker";
import { Card, CardHeader } from "../ui/card";
import { CustomDropdownMenu } from "../ui/custom-dropdown-menu";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { BlurView } from "expo-blur";

function getImageUriForTimeOfDay(): string {
  const hour = new Date().getHours();

  // Morning (5am - 11am)
  if (hour >= 5 && hour < 12) {
    return "https://images.pexels.com/photos/29485381/pexels-photo-29485381/free-photo-of-silhouette-of-person-stretching-at-sunrise-by-the-sea.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
  // Midday (12pm - 5pm)
  else if (hour >= 12 && hour < 18) {
    return "https://images.pexels.com/photos/31381391/pexels-photo-31381391/free-photo-of-dynamic-outdoor-fitness-training-in-peru.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
  // Evening (6pm - 9pm)
  else if (hour >= 18 && hour < 22) {
    return "https://images.pexels.com/photos/31407831/pexels-photo-31407831/free-photo-of-silhouette-of-a-runner-at-sunset-in-vibrant-landscape.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
  // Night (10pm - 4am)
  else {
    return "https://images.pexels.com/photos/9845424/pexels-photo-9845424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
}

export function RoutineOverview({
  routine: initialRoutine,
  handleWorkoutPress,
  exercises,
  isEditMode,
  updateRoutine,
}: {
  routine: Routine;
  handleWorkoutPress?: (workoutId: string) => void;
  exercises: Exercise[];
  isEditMode: boolean;
  updateRoutine: (routine: Routine) => void;
}) {
  const [routine, setRoutine] = useState(initialRoutine);
  const [name, setName] = useState(initialRoutine.name);
  const [description, setDescription] = useState(initialRoutine.description);
  const [active, setActive] = useState(initialRoutine.active);
  const [frequency, setFrequency] = useState(initialRoutine.frequency);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showDeleteWorkoutAlert, setShowDeleteWorkoutAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditMode) {
      const updatedRoutine: Routine = {
        ...routine,
        name: name,
        description: description,
        active: active,
        frequency: frequency,
      };

      if (
        updatedRoutine.name !== routine.name ||
        updatedRoutine.description !== routine.description ||
        updatedRoutine.active !== routine.active ||
        updatedRoutine.frequency !== routine.frequency
      ) {
        updateRoutine(updatedRoutine);
        setRoutine(updatedRoutine);
      }
    }
  }, [isEditMode]);

  useEffect(() => {
    setRoutine(initialRoutine);
    setName(initialRoutine.name);
    setDescription(initialRoutine.description);
    setActive(initialRoutine.active);
    setFrequency(initialRoutine.frequency);
  }, [initialRoutine]);

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    setRoutine(updatedRoutine);
    await updateRoutine(updatedRoutine);
  };

  const handleAddWorkout = async () => {
    const newWorkout: Workout = {
      id: generateId(),
      name: `Workout ${routine.workouts.length + 1}`,
      description: "Neues Workout",
      exercises: [],
    };

    const updatedRoutine: Routine = {
      ...routine,
      workouts: [...routine.workouts, newWorkout],
    };
    await handleUpdateRoutine(updatedRoutine);
  };

  const deleteWorkout = async (workoutId: string) => {
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.filter((workout) => workout.id !== workoutId),
    };
    setRoutine(updatedRoutine);
    await updateRoutine(updatedRoutine);
  };

  const getDropdownItems = (workout: Workout) => [
    {
      name: "Workout löschen",
      icon: ({ size, className }: { size: number; className: string }) => <Trash2 size={size} className={className} />,
      onPress: () => setShowDeleteWorkoutAlert(workout.id),
      destructive: true,
    },
  ];

  const getRightContent = (workout: Workout) => {
    return (
      <CustomDropdownMenu
        items={getDropdownItems(workout)}
        align="start"
        trigger={
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full" haptics="light">
            <MoreHorizontal size={20} className="text-primary" />
          </Button>
        }
      />
    );
  };

  if (!routine || !routine.workouts.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">Keine Workouts gefunden</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <FullscreenCard className="h-full pb-20">
          <FullscreenCard.Top className="relative overflow-hidden p-4 min-h-80 justify-between gap-2 pb-8">
            <ImageBackground
              source={{
                uri: getImageUriForTimeOfDay(),
              }}
              resizeMode="cover"
              style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-column gap-2 z-10 rounded-lg overflow-hidden p-2">
              <BlurView intensity={10} tint="dark" className="rounded-xl p-2">
                {isEditMode ? (
                  <View className="flex-row gap-2 items-center ">
                    <H3Input
                      className="italic text-card font-bold"
                      defaultValue={name}
                      onChangeText={(text) => setName(text)}
                    />
                    {isEditMode && <Pencil className="text-card" size={12} />}
                  </View>
                ) : (
                  <H3 className="text-card font-bold">{routine.name}</H3>
                )}
              </BlurView>

              {routine.description && (
                <BlurView intensity={10} tint="dark" className="rounded-lg p-2">
                  {isEditMode ? (
                    <PInput
                      className="text-card"
                      defaultValue={description}
                      onChangeText={(text) => setDescription(text)}
                    />
                  ) : (
                    <P className="text-card">{routine.description}</P>
                  )}
                </BlurView>
              )}
            </View>

            <View className="flex-row justify-between z-10">
              <Pressable
                onPress={() => setShowFrequency(!showFrequency)}
                className="p-0 m-0 active:opacity-70"
                disabled={!isEditMode}
              >
                <View className="flex-row items-center gap-2">
                  <Calendar className="text-background" size={18} />
                  <P className={cn("text-background", isEditMode && "italic")}>{frequency}x pro Woche</P>
                  {isEditMode && <Pencil className="text-background/80" size={12} />}
                </View>
              </Pressable>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => setActive(!active)}
                  className="p-0 m-0 active:opacity-70"
                  disabled={!isEditMode}
                >
                  {active ? (
                    <View className="flex-row items-center gap-2">
                      <CheckCircle className="text-primary-foreground" size={18} />
                      <P className={cn("text-background", isEditMode && "italic")}>Aktiv</P>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <CircleAlert className="text-destructive-foreground" size={18} />
                      <P className="text-background">Inaktiv</P>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </FullscreenCard.Top>
          <FullscreenCard.Content overlap={20} className="h-full">
            <View className="gap-2">
              {routine.workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  exercises={exercises}
                  rightAccessory={getRightContent(workout)}
                  onPress={() => handleWorkoutPress?.(workout.id)}
                />
              ))}
              {isEditMode && (
                <Pressable onPress={handleAddWorkout}>
                  <Card>
                    <CardHeader className="flex-row items-center justify-between gap-2">
                      <CardLabel className="text-foreground">Workout hinzufügen</CardLabel>
                      <Plus className="text-foreground" size={24} />
                    </CardHeader>
                  </Card>
                </Pressable>
              )}
            </View>
          </FullscreenCard.Content>
        </FullscreenCard>
      </ScrollView>

      <WheelPicker
        isOpen={showFrequency}
        value={frequency}
        rangeStart={1}
        rangeEnd={7}
        step={1}
        onSave={(value) => {
          setFrequency(value);
          setShowFrequency(false);
        }}
        onClose={() => setShowFrequency(false)}
      />

      {showDeleteWorkoutAlert && (
        <AlertDialog open={showDeleteWorkoutAlert !== null} onOpenChange={() => setShowDeleteWorkoutAlert(null)}>
          <AlertDialogContent className="w-[90%] max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Workout löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                <Text className="text-foreground text-center">Dieser Workout wird unwiderruflich gelöscht.</Text>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-center mt-4 gap-3">
              <AlertDialogCancel className="flex-1 max-w-[160px]" haptics="light">
                <Text>Abbrechen</Text>
              </AlertDialogCancel>
              <AlertDialogAction
                className="flex-1 max-w-[160px] bg-destructive text-destructive-foreground"
                onPress={() => deleteWorkout(showDeleteWorkoutAlert)}
                haptics="medium"
              >
                <Text>Löschen</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
