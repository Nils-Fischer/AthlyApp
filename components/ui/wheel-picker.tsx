import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, Modal } from "react-native";
import { H3, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Picker, PickerColumn, PickerItem } from "react-native-picky";
import { Card, CardHeader } from "~/components/ui/card";

interface WheelPickerProps {
  isOpen: boolean;
  title?: string;
  value: number;
  rangeStart: number;
  rangeEnd: number;
  step?: number;
  unit?: string;
  onSave: (value: number) => void;
  onClose: () => void;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  isOpen,
  title,
  value,
  rangeStart,
  rangeEnd,
  step = 1,
  unit = "",
  onSave,
  onClose,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    // Reset selected value if the initial value prop changes while open
    if (isOpen) {
      setSelectedValue(value);
    }
  }, [value, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedValue);
    onClose();
  };

  const handleBackdropPress = () => {
    onClose();
  };

  const generatePickerItems = () => {
    const items = [];
    for (let i = rangeStart; i <= rangeEnd; i += step) {
      items.push(<PickerItem key={`item-${i}`} label={`${i} ${unit}`.trim()} value={i} />);
    }
    return items;
  };

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/70">
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>

        <View>
          <Card className="bg-background m-8 my-4">
            {title && (
              <CardHeader className="gap-2">
                <H3>{title}</H3>
                <View className="h-[1px] mt-2 bg-border" />
              </CardHeader>
            )}

            <View className="p-7">
              <Picker>
                <PickerColumn selectedValue={selectedValue} onChange={(item) => setSelectedValue(Number(item.value))}>
                  {generatePickerItems()}
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

export default WheelPicker;
