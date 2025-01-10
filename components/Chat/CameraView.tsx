import { Camera, CameraDevice, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { StyleSheet, View, Pressable, Animated, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useCallback, useRef, useEffect, useState } from "react";
import { FullWindowOverlay } from "react-native-screens";
import { AnimatedIconButton } from "~/components/ui/animated-icon-button";
import { StopCircle, Check, X } from "~/lib/icons/Icons";

export function CameraView({ onCancel, onUsePhoto }: { onCancel: () => void; onUsePhoto: (uri: string) => void }) {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [photo, setPhoto] = useState<{ path: string } | null>(null);

  const onTakePhoto = useCallback(async () => {
    try {
      const photo = await camera.current?.takePhoto({
        flash: "off",
      });
      if (photo) {
        setPhoto(photo);
      }
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  }, [camera]);

  const onRetakePhoto = useCallback(() => {
    setPhoto(null);
  }, []);

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission)
    return (
      <View className="absolute inset-0 justify-center items-center bg-background p-4 gap-4">
        <Text className="text-lg text-foreground text-center">
          Camera permissions are required to use this feature.
        </Text>
        <Button onPress={requestPermission} variant="default">
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  if (device == null)
    return (
      <View className="absolute inset-0 justify-center items-center bg-background p-4">
        <Text className="text-lg text-foreground text-center">No camera device found on this device.</Text>
      </View>
    );
  return (
    <FullWindowOverlay>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!photo}
        photo={true}
        className="flex-1"
      />

      {photo ? (
        <>
          <Image source={{ uri: `file://${photo.path}` }} className="absolute inset-0 w-full h-full" />
          <View className="absolute top-14 left-4">
            <AnimatedIconButton
              onPress={onCancel}
              icon={<X className="text-white" size={24} />}
              className="bg-transparent w-10 h-10 p-0"
            />
          </View>
          <View className="absolute bottom-14 inset-x-0 flex-row items-center justify-center gap-4">
            <AnimatedIconButton
              className="flex-none bg-destructive"
              onPress={onRetakePhoto}
              icon={<StopCircle className="text-background" size={24} />}
              label="Verwerfen"
            />
            <AnimatedIconButton
              className="flex-none bg-primary"
              onPress={() => onUsePhoto(photo.path)}
              icon={<Check className="text-background" size={24} />}
              label="Verwenden"
            />
          </View>
        </>
      ) : (
        <>
          <View className="absolute top-14 left-4">
            <AnimatedIconButton
              onPress={onCancel}
              icon={<X className="text-white" size={24} />}
              className="bg-transparent w-10 h-10 p-0"
            />
          </View>
          <View className="absolute bottom-14 inset-x-0 flex items-center">
            <Pressable
              onPressIn={() => handlePressIn(scaleAnim)}
              onPressOut={() => handlePressOut(scaleAnim)}
              onPress={onTakePhoto}
            >
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <View className="w-24 h-24 rounded-full items-center justify-center bg-transparent">
                  <View className="w-20 h-20 rounded-full border-[8px] border-white" />
                </View>
              </Animated.View>
            </Pressable>
          </View>
        </>
      )}
    </FullWindowOverlay>
  );
}
