import { AudioPlayer, useAudioPlayer } from "expo-audio";
import { View } from "react-native";
import { Button } from "../ui/button";
import { PlayCircle } from "~/lib/icons/Icons";

export default function ChatAudioMessage(audioUrl: string) {
  const player = useAudioPlayer(audioUrl);

  return (
    <View className="flex-row justify-end items-center">
      <Button>
        <PlayCircle
          onPress={() => {
            player.play();
          }}
        />
      </Button>
    </View>
  );
}
