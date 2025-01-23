import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image as RNImage } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "~/components/ui/button";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from '~/lib/supabase';
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { Camera, Image, Plus } from "~/lib/icons/Icons";
import { LOADING_SPINNER } from "~/assets/svgs";
import { Select, SelectLabel, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

export default function FeedbackScreen() {
  const [feedbackData, setFeedbackData] = useState({
    category: 'feedback',
    message: '',
    image: null as any
  });


  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.5,
      exif: false,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      addPictureToMessage(result.assets[0].uri);
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

      setFeedbackData(prev => ({
        ...prev,
        image: {
          uri: `data:image/jpeg;base64,${manipResult.base64}`,
          base64: manipResult.base64
        }
      }));
    } catch (error) {
      console.error("Image manipulation failed", error);
    }
  };

  const imageOptions = [
    {
      name: "Foto aufnehmen",
      icon: Camera,
      onPress: () => {
        console.log("Camera functionality can be added here");
      },
    },
    {
      name: "Bild hochladen",
      icon: Image,
      onPress: openGallery,
    },
  ];

  const handleSubmit = async () => {
    try {
      if (!feedbackData.message.trim()) return;

      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          category: feedbackData.category,
          message: feedbackData.message.trim(),
          image_base64: feedbackData.image?.base64 || null
        }]);

      if (error) throw error;

      setFeedbackData({
        category: 'feedback',
        message: '',
        image: null
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <SafeAreaView className="flex-1 bg-background">

      {/* Main Content */}
      <ScrollView className="flex-1 px-6">
        <View className="space-y-6">
        <Select defaultValue={{value: "bug", label: "Bug melden"}}>
      <SelectTrigger className='w-[250px]'>
        <SelectValue
          className='text-foreground text-sm native:text-lg'
          placeholder='Wähle eine Kategorie'
        />
      </SelectTrigger>
      </Select>
      <SelectContent insets={contentInsets} className='w-[250px]'>
        <SelectGroup>
          <SelectLabel>Kategorie</SelectLabel>
          <SelectItem label='Bug' value='apple'>
            Bug
          </SelectItem>
          <SelectItem label='Feedback' value='banana'>
            Feedback
          </SelectItem>
          <SelectItem label='Feature' value='blueberry'>
            Feature
          </SelectItem>
          <SelectItem label='Sonstiges' value='grapes'>
            Sonstiges
          </SelectItem>
        </SelectGroup>
      </SelectContent>

          {/* Feedback Message */}
          <View className="space-y-2">
            <Text className="text-base font-semibold text-muted-foreground">
              Ihre Nachricht
            </Text>
            <TextInput
              multiline
              value={feedbackData.message}
              onChangeText={(text) => setFeedbackData(prev => ({...prev, message: text}))}
              placeholder="Beschreiben Sie Ihr Anliegen..."
              className="bg-card border border-border rounded-lg p-4 text-foreground min-h-[200px] text-base"
              textAlignVertical="top"
            />
          </View>

          {/* Image Upload Section */}
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-muted-foreground">
                Bild hinzufügen (optional)
              </Text>
              <CustomDropdownMenu
                items={imageOptions}
                trigger={
                  <Button size="icon" variant="outline" className="h-10 w-10">
                    <Plus size={24} className="text-foreground" />
                  </Button>
                }
                side="top"
                align="end"
              />
            </View>
            
            {feedbackData.image && (
              <View className="mb-2 flex-row items-center">
                <View className="relative">
                  <RNImage
                    source={{
                      uri: feedbackData.image.uri !== "" ? feedbackData.image.uri : LOADING_SPINNER,
                    }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="default"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onPress={() => setFeedbackData(prev => ({...prev, image: null}))}
                  >
                    <Text className="text-xs">✕</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <Button
            onPress={handleSubmit}
            className="w-full h-12 mt-4"
            disabled={!feedbackData.message.trim()}
          >
            <Text className="text-primary-foreground font-semibold text-base">
              Feedback senden
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}