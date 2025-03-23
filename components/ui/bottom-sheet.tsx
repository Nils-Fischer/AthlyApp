import { View } from "react-native";
import { ReactNode, useRef, useEffect } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/Icons";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onBack?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <Button variant="ghost" size="icon" className="w-24" onPress={onPress}>
    <ChevronLeft size={24} className="text-foreground" />
  </Button>
);

const CancelButton = ({ onPress }: { onPress: () => void }) => (
  <Button variant="ghost" size="icon" className="w-24" onPress={onPress}>
    <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
  </Button>
);

const SaveButton = ({ onPress }: { onPress: () => void }) => (
  <Button variant="ghost" size="icon" className="w-24" onPress={onPress}>
    <Text className="text-lg font-semibold text-destructive">Speichern</Text>
  </Button>
);

const BottomSheetHeader = ({
  title,
  onClose,
  onSave,
  onBack,
}: {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  onBack?: () => void;
}) => {
  const leftButton = onBack ? (
    <BackButton onPress={onBack} />
  ) : onSave ? (
    <CancelButton onPress={onClose} />
  ) : (
    <View className="w-24" />
  );

  const rightButton = onSave ? <SaveButton onPress={onSave} /> : <CancelButton onPress={onClose} />;

  return (
    <View className="px-4 py-2 flex-row items-center justify-between">
      {leftButton}
      <Text className="text-lg font-semibold flex-1 text-center" numberOfLines={1}>
        {title}
      </Text>
      {rightButton}
    </View>
  );
};

export function BottomSheet({
  title,
  children,
  isOpen,
  onClose,
  onSave,
  onBack,
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
        <BottomSheetHeader title={title} onClose={onClose} onSave={onSave} onBack={onBack} />
        <View className="flex-1">{children}</View>
      </View>
    </ActionSheet>
  );
}
