import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Small, Large, Link, H3, P } from "~/components/ui/typography";
import { Mail, KeySquare } from "~/lib/icons/Icons";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constant for OTP cooldown duration in seconds
const OTP_COOLDOWN_SECONDS = 60;
const OTP_STORAGE_KEY = "lastOtpRequestTime";

interface LoginWithOtpFormProps {
  onBackToLogin: () => void;
  onError: (message: string | null) => void;
  onNext: (user: User, firstName?: string, lastName?: string) => void;
}

const LoginWithOtpForm: React.FC<LoginWithOtpFormProps> = ({ onBackToLogin, onError, onNext }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Initialize and manage the cooldown timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const initCooldown = async () => {
      try {
        const storedTimeStr = await AsyncStorage.getItem(OTP_STORAGE_KEY);
        if (storedTimeStr) {
          const storedTime = parseInt(storedTimeStr, 10);
          const currentTime = Date.now();
          const elapsedSeconds = Math.floor((currentTime - storedTime) / 1000);

          if (elapsedSeconds < OTP_COOLDOWN_SECONDS) {
            const remaining = OTP_COOLDOWN_SECONDS - elapsedSeconds;
            setCooldownRemaining(remaining);
          }
        }
      } catch (error) {
        console.error("Error initializing cooldown:", error);
      }
    };

    initCooldown();

    // If there's a cooldown active, start counting down
    if (cooldownRemaining > 0) {
      intervalId = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [cooldownRemaining]);

  // Format seconds to MM:SS
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Set cooldown after a successful OTP request
  const setCooldown = async () => {
    try {
      const currentTime = Date.now();
      await AsyncStorage.setItem(OTP_STORAGE_KEY, currentTime.toString());
      setCooldownRemaining(OTP_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Error setting cooldown:", error);
    }
  };

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

  const validateToken = () => {
    setTokenError(null);
    if (!token) {
      setTokenError("Token ist erforderlich");
      return false;
    } else if (token.length !== 6 || !/^\d{6}$/.test(token)) {
      setTokenError("Token muss 6 Ziffern lang sein");
      return false;
    }
    return true;
  };

  const handleOtpRequest = async () => {
    const isEmailValid = validateEmail();
    onError(null);

    if (!isEmailValid || isLoading || cooldownRemaining > 0) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {},
      });

      if (error) {
        console.error("OTP request error:", error);
        if (error.message.includes("user not found") || error.message.includes("No user found")) {
          onError("Kein Konto mit dieser E-Mail-Adresse gefunden.");
        } else {
          onError("Fehler beim Anfordern des OTP.");
        }
      } else {
        setConfirmEmail(email);
        await setCooldown();
      }
    } catch (e) {
      console.error(e);
      onError("Ein Fehler ist aufgetreten. Versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!validateToken() || isVerifyingToken || !confirmEmail) return;

    setIsVerifyingToken(true);
    setTokenError(null);
    onError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: confirmEmail,
        token: token,
        type: "email",
      });

      if (error) {
        console.error("Token verification error:", error);
        setTokenError("Ungültiger oder abgelaufener Code. Fordere einen neuen an.");
      } else if (data.user) {
        onNext(data.user);
      } else {
        setTokenError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    } catch (e) {
      console.error(e);
      setTokenError("Ein Fehler ist aufgetreten. Versuche es erneut.");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  if (confirmEmail) {
    return (
      <View className="flex-column gap-4 items-center justify-center w-full">
        <H3 className="text-center">OTP Bestätigung</H3>
        <P className="text-center text-muted-foreground">
          Wir haben einen 6-stelligen Code an <P className="font-semibold">{confirmEmail}</P> gesendet. Bitte gib ihn
          unten ein.
        </P>
        <Input
          placeholder="Code"
          className="bg-muted text-center text-lg tracking-[10px]"
          value={token}
          onChangeText={(text) => {
            setToken(text.replace(/[^0-9]/g, ""));
            if (tokenError) validateToken();
          }}
          onBlur={validateToken}
          keyboardType="numeric"
          maxLength={6}
          editable={!isVerifyingToken}
        />
        {tokenError && <Small className="text-destructive">{tokenError}</Small>}
        <Button
          onPress={handleVerifyToken}
          className="h-12 rounded-md items-center justify-center flex-row gap-2 w-full"
          haptics="medium"
          disabled={isVerifyingToken || token.length !== 6}
        >
          {isVerifyingToken ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Large className="text-primary-foreground font-semibold text-xl">Anmelden</Large>
          )}
        </Button>
        <View className="flex-row justify-center mt-2">
          <Link className="text-muted-foreground active:text-primary" onPress={() => setConfirmEmail(null)}>
            Zurück zur E-Mail Eingabe
          </Link>
        </View>
        <View className="flex-row justify-center mt-2">
          <Link
            className={`${
              cooldownRemaining > 0 ? "text-muted-foreground/50" : "text-muted-foreground active:text-primary"
            }`}
            onPress={cooldownRemaining > 0 ? undefined : handleOtpRequest}
          >
            {isLoading
              ? "Sende erneut..."
              : cooldownRemaining > 0
              ? `Code erneut senden (${formatTimeRemaining(cooldownRemaining)})`
              : "Code erneut senden"}
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4 w-full">
      <P className="text-muted-foreground text-center">
        Passwort vergessen? Kein Problem! Melde dich stattdessen mit einem Einmalpasswort (OTP) an. Du kannst dein
        Passwort später in den Kontoeinstellungen ändern.
      </P>
      <View className="flex-column gap-2">
        <Input
          placeholder="Deine E-Mail-Adresse"
          className="bg-muted"
          value={email}
          onChangeText={(text) => {
            setEmail(text.trim().toLowerCase());
            if (emailError) validateEmail();
          }}
          onBlur={validateEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          startContent={<Mail size={20} className="text-muted-foreground" />}
          editable={!isLoading}
        />
        {emailError && <Small className="text-destructive pl-2">{emailError}</Small>}
        {cooldownRemaining > 0 && (
          <Small className="text-muted-foreground pl-2">
            Nächster Code in {formatTimeRemaining(cooldownRemaining)} verfügbar
          </Small>
        )}
      </View>
      <Button
        onPress={handleOtpRequest}
        className="h-12 rounded-md items-center justify-center flex-row gap-2"
        haptics="medium"
        disabled={isLoading || cooldownRemaining > 0}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <KeySquare size={18} className="text-primary-foreground" strokeWidth={2.5} />
            <Large className="text-primary-foreground font-semibold text-xl">
              {cooldownRemaining > 0 ? `OTP anfordern (${formatTimeRemaining(cooldownRemaining)})` : "OTP anfordern"}
            </Large>
          </>
        )}
      </Button>
      <View className="flex-row justify-center mt-2">
        <Link className="text-muted-foreground active:text-primary" onPress={onBackToLogin}>
          Zurück zur Anmeldung
        </Link>
      </View>
    </View>
  );
};

export default LoginWithOtpForm;
