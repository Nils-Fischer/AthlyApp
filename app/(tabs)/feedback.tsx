import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image as RNImage,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { Camera, Image, Plus, X, CheckCircle } from "~/lib/icons/Icons"; // Ensure CheckCircle is imported
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from "~/components/ui/select";
import { BlurView } from "expo-blur";
import { useColorScheme } from "nativewind";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CameraView } from "~/components/Chat/CameraView";
import { supabase } from "~/lib/supabase";
import { useUserProfileStore } from "~/stores/userProfileStore";

const CATEGORIES = [
  { value: "bug", label: "Problem melden", icon: "🐞" },
  { value: "feedback", label: "Feedback", icon: "💬" },
  { value: "feature", label: "Funktionswunsch", icon: "✨" },
  { value: "other", label: "Sonstiges", icon: "❓" },
];

export default function FeedbackScreen() {
  const [feedbackData, setFeedbackData] = useState<{
    category: Option;
    message: string;
    images: string[];
    isSubmitting: boolean;
    showSuccess: boolean;
  }>({
    category: CATEGORIES[1],
    message: "",
    images: [],
    isSubmitting: false,
    showSuccess: false,
  });

  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const [showCamera, setShowCamera] = React.useState(false);
  const { profile } = useUserProfileStore();

  // Reset success message after 3 seconds
  useEffect(() => {
    if (feedbackData.showSuccess) {
      const timer = setTimeout(() => {
        setFeedbackData((prev) => ({ ...prev, showSuccess: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [feedbackData.showSuccess]);

  const imageOptions = [
    {
      name: "Take Photo",
      icon: Camera,
      onPress: () => {
        setShowCamera(true);
      },
    },
    {
      name: "Upload Image",
      icon: Image,
      onPress: openGallery,
    },
  ];

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.5,
      exif: false,
      allowsMultipleSelection: true,
      selectionLimit: 5 - feedbackData.images.length,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      result.assets.forEach((asset) => {
        addPictureToMessage(asset.uri);
      });
    }
  }

  const addPictureToMessage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });
      if (!manipResult.base64) throw new Error("Image compression failed");

      setFeedbackData((prev) => ({
        ...prev,
        images: [...prev.images, `data:image/jpeg;base64,${manipResult.base64}`],
      }));
    } catch (error) {
      console.error("Image manipulation failed", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setFeedbackData((prev) => ({ ...prev, isSubmitting: true }));

      if (!feedbackData.message.trim()) return;

      if (profile) {
        const { error } = await supabase.from("feedback").insert({
          user_id: profile.id,
          category: feedbackData.category?.value || "",
          message: feedbackData.message,
          images: feedbackData.images,
        });
        if (error) throw error;
      }

      setFeedbackData((prev) => ({
        ...prev,
        category: CATEGORIES[1],
        message: "",
        images: [],
        isSubmitting: false,
        showSuccess: true,
      }));

      // Set a timer to hide the success popup after 3 seconds
      setTimeout(() => {
        setFeedbackData((prev) => ({ ...prev, showSuccess: false }));
      }, 3000); // Change 3000 to the desired duration in milliseconds
    } catch (error) {
      console.error("Submission error:", error);
      setFeedbackData((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  if (showCamera) {
    return (
      <CameraView
        onCancel={() => setShowCamera(false)}
        onUsePhoto={(uri) => {
          setShowCamera(false);
          addPictureToMessage(uri);
        }}
        switchToGallery={() => {
          setShowCamera(false);
          openGallery();
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-background pt-5">
      {/* Success Overlay */}
      {feedbackData.showSuccess && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BlurView
            intensity={90}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View className="bg-card/90 p-8 rounded-2xl items-center space-y-4 border border-border">
              <CheckCircle size={48} className="text-green-500" />
              <Text className="text-2xl font-bold text-foreground">Vielen Dank!</Text>
              <Text className="text-muted-foreground text-center">Ihr Feedback wurde erfolgreich übermittelt.</Text>
            </View>
          </BlurView>
        </Animated.View>
      )}

      <View className="flex-1 px-5">
        {/* Header Section */}
        <View className="border-b border-border/50">
          <Text className="text-2xl font-bold text-foreground">Feedback teilen</Text>
          <Text className="text-muted-foreground mb-2">Helfen Sie uns, Ihr Erlebnis zu verbessern</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          {/* Category Selector */}
          <View className="space-y-3 mt-8">
            <Text className="text-sm font-medium text-foreground/80">Kategorie</Text>
            <Select
              value={feedbackData.category}
              onValueChange={(option: Option) =>
                setFeedbackData((prev) => ({
                  ...prev,
                  category: option,
                }))
              }
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  // Additional logic if needed when dropdown opens
                }
              }}
            >
              <SelectTrigger className="w-full bg-card/50 border-border">
                <SelectValue className="text-foreground text-base" placeholder="Wählen Sie eine Kategorie" />
              </SelectTrigger>

              <SelectContent
                insets={{ top: insets.top, bottom: insets.bottom }}
                className="w-full rounded-xl overflow-hidden"
              >
                <SelectGroup>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value} label={category.label}>
                      <Text className="text-foreground text-base">{category.label}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          {/* Feedback Input */}
          <View className="space-y-3 mt-8">
            <Text className="text-sm font-medium text-foreground/80">Nachricht</Text>
            <TextInput
              multiline
              value={feedbackData.message}
              onChangeText={(text) => setFeedbackData((prev) => ({ ...prev, message: text }))}
              placeholder="Beschreiben Sie Ihr Feedback im Detail..."
              placeholderTextColor={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
              className="bg-card/50 border border-border rounded-xl p-4 text-foreground text-base min-h-[150px] leading-6"
              textAlignVertical="top"
              style={{
                lineHeight: 24,
                textAlign: "left",
              }}
            />
          </View>

          {/* Image Upload */}
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-foreground/80">Anhänge (optional)</Text>
              <CustomDropdownMenu
                items={imageOptions}
                trigger={
                  <Button disabled={feedbackData.images.length >= 5} size="icon" className="h-10 w-10 bg-card/50">
                    <Plus size={20} className="text-foreground" />
                  </Button>
                }
                side="top"
                align="end"
              />
            </View>

            {feedbackData.images.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {feedbackData.images.map((imageUri, index) => (
                  <View key={index} className="relative">
                    <RNImage source={{ uri: imageUri }} className="w-20 h-20 rounded-lg" />
                    <Button
                      size="icon"
                      variant="default"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onPress={() => {
                        setFeedbackData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      <X size={12} className="text-background" />
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Submit Button at the Bottom */}
        <Button
          onPress={handleSubmit}
          className="w-full h-16  rounded-xl bg-foreground"
          disabled={!feedbackData.message.trim() || feedbackData.isSubmitting}
          style={{ marginTop: "auto", marginBottom: 16 }}
        >
          {feedbackData.isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-background font-medium text-base">Feedback absenden</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
