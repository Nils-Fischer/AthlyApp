import * as React from "react";
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { H1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "./types";
import { Routine } from "~/lib/types";

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  showRoutine?: (routine: Routine) => void;
}

export default function ChatInterface({ messages, isTyping, onSendMessage, showRoutine }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = React.useState("");
  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRef = React.useRef<TextInput>(null);

  // Keyboard handling
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollToBottom();
    });
    return () => showSubscription.remove();
  }, []);

  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = React.useCallback(() => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim());
    setInputMessage("");
    inputRef.current?.blur();
  }, [inputMessage, onSendMessage]);

  return (
    <View className="flex-1 bg-background relative z-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} showRoutine={showRoutine} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        <View className="px-4 py-2 border-t border-border bg-background">
          <View className="flex-row items-center gap-2">
            <View className="flex-1 bg-muted rounded-lg overflow-hidden">
              <TextInput
                ref={inputRef}
                className="px-4 py-2.5 text-base text-foreground min-h-[44px]"
                placeholder="Schreibe eine Nachricht..."
                placeholderTextColor="#666"
                value={inputMessage}
                onChangeText={setInputMessage}
                multiline={false}
                maxLength={500}
                style={{ maxHeight: 120 }}
                keyboardType="default"
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
            </View>
            <Button
              size="icon"
              variant={inputMessage.trim() ? "default" : "secondary"}
              onPress={handleSend}
              disabled={isTyping || !inputMessage.trim()}
            >
              <Text className={`text-lg ${!inputMessage.trim() ? "opacity-50" : ""}`}>➤</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
