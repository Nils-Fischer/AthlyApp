import { Camera, CameraDevice, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { StyleSheet, View, Pressable, Animated, Image, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useCallback, useRef, useEffect, useState } from "react";
import { FullWindowOverlay } from "react-native-screens";
import { AnimatedIconButton } from "~/components/ui/animated-icon-button";
import { StopCircle, Check, X } from "~/lib/icons/Icons";
import { SymbolView } from "expo-symbols";
import * as MediaLibrary from "expo-media-library";

export function CameraView({
  onCancel,
  onUsePhoto,
  switchToGallery,
}: {
  onCancel: () => void;
  onUsePhoto: (uri: string) => void;
  switchToGallery: () => void;
}) {
  const camera = useRef<Camera>(null);
  const [cameraType, setCameraType] = useState<"back" | "front">("back");
  const device = useCameraDevice(cameraType);
  const { hasPermission, requestPermission } = useCameraPermission();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [photo, setPhoto] = useState<{ path: string } | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const toggleCameraType = () => {
    setCameraType((prevType) => (prevType === "back" ? "front" : "back"));
  };

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

  const loadLastPhoto = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 1,
        sortBy: MediaLibrary.SortBy.creationTime,
        mediaType: MediaLibrary.MediaType.photo,
      });
      if (assets.length > 0) {
        setGalleryPreview(assets[0].uri);
      }
    }
  }, []);

  const onCameraInitialized = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLastPhoto();
  }, [loadLastPhoto]);

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
        onInitialized={onCameraInitialized}
      />

      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-background">
          <ActivityIndicator size="large" className="text-foreground" />
        </View>
      )}

      {!isLoading && photo ? (
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
      ) : !isLoading ? (
        <>
          <View className="absolute top-14 left-4 right-4 flex-row justify-between">
            <AnimatedIconButton
              onPress={onCancel}
              icon={<X className="text-white" size={24} />}
              className="bg-transparent w-10 h-10 p-0"
            />
          </View>

          <View className="absolute bottom-14 inset-x-0 flex-row items-center justify-between px-10">
            <Pressable onPress={switchToGallery} className="w-12 h-12 rounded-lg overflow-hidden bg-black/50">
              {galleryPreview ? (
                <Image source={{ uri: galleryPreview }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <SymbolView
                    name="photo.on.rectangle"
                    style={{ width: 20, height: 20 }}
                    type="hierarchical"
                    tintColor="white"
                    weight="regular"
                  />
                </View>
              )}
            </Pressable>
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
            <Pressable
              onPress={toggleCameraType}
              className="h-14 w-14 rounded-full bg-black/50 items-center justify-center"
            >
              <SymbolView
                name="arrow.trianglehead.2.clockwise.rotate.90"
                style={{ width: 25, height: 25 }}
                type="hierarchical"
                tintColor="white"
                weight="regular"
              />
            </Pressable>
          </View>
        </>
      ) : null}
    </FullWindowOverlay>
  );
}
