import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { 
  Check,
  Timer,
  Dumbbell,
  ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface WorkoutStartModalProps {
  isVisible: boolean;
  onStart: () => void;
  onClose: () => void;
}

const FeatureItem = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View className="flex-row items-start space-x-3 py-3">
    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="font-medium text-base">{title}</Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </View>
  </View>
);

export const WorkoutStartModal = ({ isVisible, onStart, onClose }: WorkoutStartModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <Card className="bg-card p-4 rounded-3xl">
          <View className="items-center pb-6">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Dumbbell size={32} className="text-primary" />
            </View>
            <Text className="text-2xl font-bold">Workout startet</Text>
            <Text className="text-base text-muted-foreground text-center mt-1">
              Tracke dein Training und erreiche deine Ziele
            </Text>
          </View>

          <View className="space-y-2">
            <FeatureItem
              icon={<Check size={20} className="text-primary" />}
              title="Sets loggen"
              description="Markiere deine Sets als abgeschlossen"
            />
            <FeatureItem
              icon={<Timer size={20} className="text-primary" />}
              title="Trainingszeit"
              description="Behalte deine Trainingszeit im Blick"
            />
            <FeatureItem
              icon={<ChevronRight size={20} className="text-primary" />}
              title="Flexibel bleiben"
              description="Passe Übungen und Sets jederzeit an"
            />
          </View>

          <Button 
            className="w-full h-14 mt-6"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onStart();
            }}
          >
            <Text className="text-primary-foreground font-medium text-lg">
              Los geht's!
            </Text>
          </Button>
        </Card>
      </View>
    </Modal>
  );
};