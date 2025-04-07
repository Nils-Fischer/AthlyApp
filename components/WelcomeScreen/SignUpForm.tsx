import React, { useState } from "react";
import { Pressable, View, ActivityIndicator } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Small, Large, H1, P } from "~/components/ui/typography";
import { Mail, Lock, Eye, EyeOff, Users } from "~/lib/icons/Icons";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";

interface SignUpFormProps {
  onNext: (user: User) => void;
  onError: (message: string | null) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onNext, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

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

  const validatePassword = () => {
    setPasswordError(null);
    if (!password) {
      setPasswordError("Passwort ist erforderlich");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Passwort muss mindestens 8 Zeichen lang sein");
      return false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwörter stimmen nicht überein");
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

  const handleSignUp = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid || isLoading) return;

    setIsLoading(true);
    onError(null); // Clear parent error

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log(data);

      if (!error && data.user) {
        setConfirmEmail(email);
      } else if (error) {
        console.error("Sign up error:", error);
        if (error.message.includes("User already registered")) {
          onError("Diese E-Mail-Adresse ist bereits registriert.");
        } else {
          onError("Registrierung fehlgeschlagen. Versuche es erneut.");
        }
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
        type: "signup",
      });

      if (error) {
        console.error("Token verification error:", error);
        setTokenError("Verifizierung fehlgeschlagen. Versuche es erneut.");
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
      <View className="flex-column gap-4 items-center justify-center">
        <P className="text-center">E-Mail Bestätigung</P>
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
            <Large className="text-primary-foreground font-semibold text-xl">Bestätigen</Large>
          )}
        </Button>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <View className="flex-column gap-2">
        <Input
          placeholder="E-Mail"
          className="bg-muted"
          value={email}
          onChangeText={(text) => {
            setEmail(text.trim().toLowerCase());
            if (emailError) validateEmail(); // Re-validate on change
          }}
          onBlur={validateEmail} // Validate on blur
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          startContent={<Mail size={20} className="text-muted-foreground" />}
        />
        {emailError && <Small className="text-destructive pl-2">{emailError}</Small>}

        <Input
          placeholder="Passwort (min. 8 Zeichen)"
          className="bg-muted"
          value={password}
          onChangeText={(text) => {
            setPassword(text.trim());
            if (passwordError) validatePassword(); // Re-validate on change
          }}
          onBlur={validatePassword} // Validate on blur
          secureTextEntry={!showPassword}
          autoComplete="new-password" // Use new-password for sign up
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
        {/* Password error displayed below confirm password */}

        <Input
          placeholder="Passwort bestätigen"
          className="bg-muted"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (passwordError) validatePassword(); // Re-validate when confirm changes
          }}
          onBlur={validatePassword} // Also validate on blur here
          secureTextEntry={!showPassword}
          autoComplete="new-password"
          startContent={<Lock size={20} className="text-muted-foreground" />}
        />
        {passwordError && <Small className="text-destructive pl-2">{passwordError}</Small>}
      </View>
      <Button
        onPress={handleSignUp}
        className="h-12 rounded-md items-center justify-center flex-row gap-2"
        haptics="medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Users size={18} className="text-primary-foreground" strokeWidth={2.5} />
            <Large className="text-primary-foreground font-semibold text-xl">Account erstellen</Large>
          </>
        )}
      </Button>
    </View>
  );
};

export default SignUpForm;
