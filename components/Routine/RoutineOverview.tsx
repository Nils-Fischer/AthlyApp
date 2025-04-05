import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
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
  const [name, setName] = useState(routine.name);
  const [description, setDescription] = useState(routine.description);
  const [active, setActive] = useState(routine.active);
  const [frequency, setFrequency] = useState(routine.frequency);
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
          <FullscreenCard.Top className="p-4 min-h-80 max-h-96 bg-foreground justify-between gap-2 pb-8">
            <View className="flex-column gap-2">
              {isEditMode ? (
                <View className="flex-row gap-2 items-center">
                  <H3Input
                    className="italic text-background"
                    defaultValue={name}
                    onChangeText={(text) => setName(text)}
                  />
                  {isEditMode && <Pencil className="text-background/80" size={12} />}
                </View>
              ) : (
                <H3 className="text-background">{routine.name}</H3>
              )}

              {routine.description && (
                <>
                  {isEditMode ? (
                    <PInput
                      className="text-background/80"
                      defaultValue={description}
                      onChangeText={(text) => setDescription(text)}
                    />
                  ) : (
                    <P className="text-background">{routine.description}</P>
                  )}
                </>
              )}
            </View>

            <View className="flex-row justify-between">
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
