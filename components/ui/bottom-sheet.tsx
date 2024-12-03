import { View } from "react-native";
import { ReactNode, useRef, useEffect } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

export function BottomSheet({
  title,
  children,
  isOpen,
  onClose,
  onSave,
  snapPoints = [95],
  initialSnapIndex = 0,
}: BottomSheetProps) {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    if (isOpen) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, [isOpen]);

  return (
    <ActionSheet
      ref={actionSheetRef}
      snapPoints={snapPoints}
      initialSnapIndex={initialSnapIndex}
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      onClose={onClose}
    >
      <View className="min-h-full bg-background">
        <View className="px-4 py-2 flex-row items-center justify-between">
          {onSave === undefined ? (
            <View className="w-24" />
          ) : (
            <Button variant="ghost" size="icon" className="w-24" onPress={onClose}>
              <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
            </Button>
          )}
          <Text className="text-lg font-semibold flex-1 text-center" numberOfLines={1}>
            {title}
          </Text>
          {onSave ? (
            <Button variant="ghost" size="icon" className="w-24" onPress={onSave}>
              <Text className="text-lg font-semibold text-destructive">Speichern</Text>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="w-24" onPress={onClose}>
              <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
            </Button>
          )}
        </View>
        <View className="flex-1">{children}</View>
      </View>
    </ActionSheet>
  );
}
