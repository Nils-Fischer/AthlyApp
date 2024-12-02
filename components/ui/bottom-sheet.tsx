import { View } from "react-native";
import { ReactNode } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  actionSheetRef: React.RefObject<ActionSheetRef>;
  onClose: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

export function BottomSheet({
  title,
  children,
  actionSheetRef,
  onClose,
  snapPoints = [90],
  initialSnapIndex = 0,
}: BottomSheetProps) {
  return (
    <ActionSheet
      ref={actionSheetRef}
      snapPoints={snapPoints}
      initialSnapIndex={initialSnapIndex}
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        backgroundColor: "transparent",
      }}
    >
      <View className="flex-1 bg-background">
        <View className="px-4 py-2 flex-row items-center justify-between border-b border-border">
          <View className="w-24" />
          <Text className="text-lg font-semibold flex-1 text-center" numberOfLines={1}>
            {title}
          </Text>
          <Button variant="ghost" size="icon" className="w-24" onPress={onClose}>
            <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
          </Button>
        </View>
        <View className="flex-1">{children}</View>
      </View>
    </ActionSheet>
  );
}
