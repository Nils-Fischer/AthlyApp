import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Modal } from "react-native";
import { H3, Muted, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Picker, PickerColumn, PickerItem } from "react-native-picky";
import { Card, CardHeader } from "~/components/ui/card";
import { SetInput } from "~/lib/types";

interface SetLoggingWheelPickerProps {
  exerciseName: string;
  setInput: SetInput;
  isOpen: boolean;
  fallbackReps?: number;
  fallbackWeight?: number;
  currentSet: number;
  totalSets?: number;
  onSave: (reps: number, weight: number) => void;
  onClose?: () => void;
}

export const SetLoggingWheelPicker: React.FC<SetLoggingWheelPickerProps> = ({
  exerciseName,
  setInput,
  fallbackReps = 8,
  fallbackWeight = 0,
  currentSet,
  totalSets,
  onSave,
  onClose,
  isOpen,
}) => {
  const [selectedReps, setSelectedReps] = useState(setInput.reps || setInput.targetReps || fallbackReps);
  const [selectedWeight, setSelectedWeight] = useState(setInput.weight || setInput.targetWeight || fallbackWeight);

  if (!isOpen) return null;

  const handleSave = () => {
    console.log("selectedReps", selectedReps);
    console.log("selectedWeight", selectedWeight);
    onSave(selectedReps, selectedWeight);
    onClose?.();
  };

  const handleBackdropPress = () => {
    onClose?.();
  };

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/70">
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>

        <View>
          <Card className="bg-background m-8 my-4">
            <CardHeader className="gap-2">
              <H3>{exerciseName}</H3>
              <Muted>
                Satz {currentSet}
                {totalSets ? `/${totalSets}` : ""}
              </Muted>
              <View className="h-[1px] mt-2 bg-border" />
            </CardHeader>

            <View className="p-7">
              <Picker>
                <PickerColumn selectedValue={selectedReps} onChange={(item) => setSelectedReps(Number(item.value))}>
                  {Array.from({ length: 30 }, (_, i) => (
                    <PickerItem key={`rep-${i + 1}`} label={`${i + 1} Wdh.`} value={i + 1} />
                  ))}
                </PickerColumn>
                <PickerColumn selectedValue={selectedWeight} onChange={(item) => setSelectedWeight(Number(item.value))}>
                  {Array.from({ length: 601 }, (_, i) => (
                    <PickerItem key={`weight-${i}`} label={`${i} kg`} value={i} />
                  ))}
                </PickerColumn>
              </Picker>
            </View>
          </Card>

          <Button className="mx-8 mb-16 bg-card" haptics="light" onPress={handleSave}>
            <P className="text-card-foreground font-semibold">Speichern</P>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default SetLoggingWheelPicker;
