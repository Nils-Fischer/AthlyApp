import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Modal } from "react-native";
import { CardLabel, H3, Muted, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Picker, PickerColumn, PickerItem } from "react-native-picky";
import { Card, CardHeader } from "~/components/ui/card";

interface SetLoggingWheelPickerProps {
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  reps?: number;
  weight?: number;
  onSave: (reps: number, weight: number) => void;
  onClose?: () => void;
  isVisible: boolean;
}

export const SetLoggingWheelPicker: React.FC<SetLoggingWheelPickerProps> = ({
  exerciseName,
  currentSet,
  totalSets,
  reps = 8,
  weight = 0,
  onSave,
  onClose,
  isVisible,
}) => {
  const [selectedReps, setSelectedReps] = useState(reps);
  const [selectedWeight, setSelectedWeight] = useState(weight);

  if (!isVisible) return null;

  const handleSave = () => {
    onSave(selectedReps, selectedWeight);
    onClose?.();
  };

  const handleBackdropPress = () => {
    onClose?.();
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/70">
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>

        <View>
          <Card className="bg-background m-8 my-4">
            <CardHeader className="gap-2">
              <H3>{exerciseName}</H3>
              <Muted>
                Satz {currentSet}/{totalSets}
              </Muted>
              <View className="h-[1px] mt-2 bg-border" />
            </CardHeader>

            <View className="p-7">
              <Picker>
                <PickerColumn selectedValue={selectedReps} onChange={(value) => setSelectedReps(Number(value))}>
                  {Array.from({ length: 30 }, (_, i) => (
                    <PickerItem key={`rep-${i + 1}`} label={`${i + 1} Wdh.`} value={i + 1} />
                  ))}
                </PickerColumn>
                <PickerColumn selectedValue={selectedWeight} onChange={(value) => setSelectedWeight(Number(value))}>
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
