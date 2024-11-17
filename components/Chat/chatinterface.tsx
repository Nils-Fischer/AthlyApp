import * as React from "react";
import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { H1, P } from "~/components/ui/typography";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import Animated, { FadeInUp } from "react-native-reanimated";

// Types
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

// Utility Functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Memoized Avatar Component
const MessageAvatar = React.memo<{ isAI: boolean }>(({ isAI }) => (
  <Avatar className="h-8 w-8" alt={""}>
    {isAI ? (
      <>
        <AvatarImage source={{ uri: "/api/placeholder/32/32" }} />
        <AvatarFallback>AI</AvatarFallback>
      </>
    ) : (
      <>
        <AvatarImage source={{ uri: "/api/placeholder/32/32" }} />
        <AvatarFallback>ME</AvatarFallback>
      </>
    )}
  </Avatar>
));

MessageAvatar.displayName = 'MessageAvatar';

// Memoized Chat Message Component
const ChatMessage = React.memo<{ message: Message }>(({ message }) => {
  const isAI = message.sender === "ai";

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).springify()}
      className={`flex-row ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <View className={`flex-row max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <View className={`${isAI ? 'mr-2' : 'ml-2'} justify-end`}>
          <MessageAvatar isAI={isAI} />
        </View>
        
        <View>
          <Card className={`
            ${isAI ? 'bg-secondary/30' : 'bg-primary'} 
            border-0 shadow-sm
          `}>
            <View className="px-4 py-2.5">
              <P className={`${isAI ? 'text-foreground' : 'text-primary-foreground'}`}>
                {message.content}
              </P>
            </View>
          </Card>
          <Text className="text-xs text-muted-foreground mt-1 ml-1">
            {message.timestamp}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

ChatMessage.displayName = 'ChatMessage';

// Memoized Typing Indicator
const TypingIndicator = React.memo(() => (
  <View className="flex-row items-center gap-2 ml-4 mb-4">
    <MessageAvatar isAI={true} />
    <Card className="bg-secondary/30 border-0">
      <View className="px-4 py-2.5 flex-row items-center gap-2">
        <ActivityIndicator size="small" />
        <P className="text-sm text-muted-foreground">schreibt...</P>
      </View>
    </Card>
  </View>
));

TypingIndicator.displayName = 'TypingIndicator';

// Main Chat Component
export default function ChatScreen() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "Hallo! 👋 Ich bin dein AI Personal Trainer. Wie kann ich dir heute helfen?",
      sender: "ai",
      timestamp: formatTime(new Date()),
    },
  ]);
  
  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Keyboard handling
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollToBottom();
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message handler
  const handleSend = React.useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        content: "Ich verstehe dein Anliegen. Lass uns gemeinsam daran arbeiten! 💪",
        sender: "ai",
        timestamp: formatTime(new Date()),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, [inputMessage]);

  const onChangeText = React.useCallback((text: string) => {
    setInputMessage(text);
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-3 border-b border-border bg-background/95">
        <H1 className="text-xl font-bold">AI Personal Trainer</H1>
      </View>

      {/* Chat Area */}
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
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 py-2 border-t border-border bg-background">
          <View className="flex-row items-center gap-2">
            <View className="flex-1 bg-muted rounded-lg overflow-hidden">
              <TextInput
                className="px-4 py-2.5 text-base text-foreground min-h-[44px]"
                placeholder="Schreibe eine Nachricht..."
                placeholderTextColor="#666"
                value={inputMessage}
                onChangeText={onChangeText}
                multiline
                maxLength={500}
                style={{ maxHeight: 120 }}
              />
            </View>
            <Button
              size="icon"
              variant={inputMessage.trim() ? "default" : "secondary"}
              onPress={handleSend}
              disabled={!inputMessage.trim()}
            >
              <Text className={`text-lg ${!inputMessage.trim() ? "opacity-50" : ""}`}>
                ➤
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}