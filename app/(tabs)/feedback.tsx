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
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from "~/components/ui/select";
import { BlurView } from "expo-blur";
import { cn } from "~/lib/utils";
import { useColorScheme } from "nativewind";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
    image: any;
    isSubmitting: boolean;
    showSuccess: boolean;
  }>({
    category: CATEGORIES[1],
    message: "",
    image: null,
    isSubmitting: false,
    showSuccess: false,
  });

  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Reset success message after 3 seconds
  useEffect(() => {
    if (feedbackData.showSuccess) {
      const timer = setTimeout(() => {
        setFeedbackData((prev) => ({ ...prev, showSuccess: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [feedbackData.showSuccess]);

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await processImage(result.assets[0].uri);
    }
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await processImage(result.assets[0].uri);
    }
  }

  const processImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });

      if (!manipResult.base64) throw new Error("Image processing failed");

      setFeedbackData((prev) => ({
        ...prev,
        image: {
          uri: `data:image/jpeg;base64,${manipResult.base64}`,
          base64: manipResult.base64,
        },
      }));
    } catch (error) {
      console.error("Image processing failed", error);
    }
  };

  const imageOptions = [
    {
      name: "Foto aufnehmen",
      icon: Camera,
      onPress: openCamera,
    },
    {
      name: "Bild hochladen",
      icon: Image,
      onPress: openGallery,
    },
  ];

  const handleSubmit = async () => {
    try {
      setFeedbackData((prev) => ({ ...prev, isSubmitting: true }));

      if (!feedbackData.message.trim()) return;

      // Simulate successful submission
      console.log("Simulating successful submission");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Setting showSuccess to true");

      setFeedbackData((prev) => ({
        ...prev,
        category: CATEGORIES[1],
        message: "",
        image: null,
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

  return (
    <SafeAreaView className="flex-1 bg-background">
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
                <BlurView intensity={90} className={cn("rounded-xl", Platform.OS === "android" && "bg-card/90")}>
                  <SelectGroup>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        label={category.label}
                        className="flex-row items-center py-3"
                      >
                        <Text className="text-xl mr-3">{category.icon}</Text>
                        <Text className="text-foreground text-base">{category.label}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </BlurView>
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
                  <Button size="icon" variant="outline" className="h-10 w-10 bg-card/50 border-border">
                    <Plus size={20} className="text-foreground" />
                  </Button>
                }
                side="top"
                align="end"
              />
            </View>

            {feedbackData.image && (
              <View className="relative rounded-xl overflow-hidden border border-border">
                <RNImage source={{ uri: feedbackData.image.uri }} className="w-full aspect-square" />
                <TouchableOpacity
                  onPress={() => setFeedbackData((prev) => ({ ...prev, image: null }))}
                  className="absolute top-2 right-2 bg-foreground/80 rounded-full p-1.5"
                >
                  <X size={16} className="text-background" />
                </TouchableOpacity>
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
    </SafeAreaView>
  );
}
