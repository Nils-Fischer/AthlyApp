import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ReactNode } from "react";
import { ChevronLeft } from "~/lib/icons/Icons";

interface EditExerciseHeaderProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeMode?: "back" | "close";
  onSave: () => void;
}

export function ExerciseBottomSheetHeader({
  title,
  children,
  onClose,
  closeMode = "close",
  onSave,
}: EditExerciseHeaderProps) {
  return (
    <View className="min-h-full bg-background">
      <View className="px-4 py-2 flex-row items-center justify-between">
        <Button variant="ghost" size="icon" className="w-24" onPress={onClose} haptics="light">
          {closeMode === "close" ? (
            <Text className="text-lg font-semibold text-destructive">Abbrechen</Text>
          ) : (
            <View className="flex-row items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <Text className="text-lg font-semibold text-blue-500">Zurück</Text>
            </View>
          )}
        </Button>
        <Text className="text-lg font-semibold flex-1 text-center" numberOfLines={1}>
          {title}
        </Text>
        <Button variant="ghost" size="icon" className="w-24" onPress={onSave} haptics="medium">
          <Text className="text-lg font-semibold text-destructive">Speichern</Text>
        </Button>
      </View>
      <View className="flex-1">{children}</View>
    </View>
  );
}
