import * as React from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DietInterface from "~/components/Diet/DietInterface";
import MealSuggestions from "~/components/Diet/MealSuggestions";
import { Text } from "~/components/ui/text";

export default function Screen() {
  const [activeTab, setActiveTab] = React.useState("tracker");

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold mb-4">Ernährung</Text>
      </View>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1"
      >
        <View className="px-4">
          <TabsList className="flex-row h-12 bg-muted rounded-lg p-1 w-full mb-4">
            <TabsTrigger 
              value="tracker" 
              className="flex-1 rounded-md data-[state=active]:bg-background"
            >
              <Text className="text-sm font-medium">Tracker</Text>
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="flex-1 rounded-md data-[state=active]:bg-background"
            >
              <Text className="text-sm font-medium">Vorschläge</Text>
            </TabsTrigger>
          </TabsList>
        </View>

        <View className="flex-1">
          <TabsContent value="tracker" className="flex-1 h-full">
            <DietInterface />
          </TabsContent>

          <TabsContent value="suggestions" className="flex-1 h-full">
            <MealSuggestions />
          </TabsContent>
        </View>
      </Tabs>
    </View>
  );
}