import React, { useState } from "react";
import { Pressable, View, ActivityIndicator } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Small, Large } from "~/components/ui/typography";
import { Mail, Lock, Eye, EyeOff } from "~/lib/icons/Icons";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";

interface LoginFormProps {
  onNext: (user: User) => void;
  onError: (message: string | null) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onNext, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = () => {
    setEmailError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("E-Mail ist erforderlich");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Ungültige E-Mail-Adresse");
      return false;
    }
    return true;
  };
  // Nils-Fischer7@web.de

  const validatePassword = () => {
    setPasswordError(null);
    if (!password) {
      setPasswordError("Passwort ist erforderlich");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid || isLoading) return;

    setIsLoading(true);
    onError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        onNext(data.user);
      } else if (error) {
        console.error("Auth error:", error);
        onError("Anmeldung fehlgeschlagen. Prüfe E-Mail/Passwort.");
      }
    } catch (e) {
      console.error(e);
      onError("Ein Fehler ist aufgetreten. Versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-4">
      <View className="flex-column gap-2">
        <Input
          placeholder="E-Mail"
          className="bg-muted"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) validateEmail(); // Re-validate on change if error exists
          }}
          onBlur={validateEmail} // Validate on blur
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          startContent={<Mail size={20} className="text-muted-foreground" />}
        />
        {emailError && <Small className="text-destructive pl-2">{emailError}</Small>}

        <Input
          placeholder="Passwort"
          className="bg-muted"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) validatePassword(); // Re-validate on change if error exists
          }}
          onBlur={validatePassword} // Validate on blur
          secureTextEntry={!showPassword}
          autoComplete="password"
          startContent={<Lock size={20} className="text-muted-foreground" />}
          endContent={
            <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
              {showPassword ? (
                <EyeOff size={20} className="text-muted-foreground" />
              ) : (
                <Eye size={20} className="text-muted-foreground" />
              )}
            </Pressable>
          }
        />
        {passwordError && <Small className="text-destructive pl-2">{passwordError}</Small>}
      </View>
      <Button
        onPress={handleSignIn}
        className="h-12 rounded-md items-center justify-center flex-row gap-2"
        haptics="medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Mail size={18} className="text-primary-foreground" strokeWidth={2.5} />
            <Large className="text-primary-foreground font-semibold text-xl">Mit E-Mail anmelden</Large>
          </>
        )}
      </Button>
    </View>
  );
};

export default LoginForm;
