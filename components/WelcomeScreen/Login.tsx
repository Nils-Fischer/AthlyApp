import React, { useState } from "react";
import { ActivityIndicator, Platform, Pressable, View, ScrollView } from "react-native";
import { H1, H2, H3, Large, P, Small } from "~/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";
import { Link } from "~/components/ui/typography";
import PrivacyPolicy from "../Legal/PrivacyPolicy";
import TermsOfService from "../Legal/TermsOfService";
import { Mail, X, Lock, Eye, EyeOff } from "~/lib/icons/Icons";
import { Button } from "~/components/ui/button";
import { Input } from "../ui/input";
import { Separator } from "~/components/ui/separator";

interface LoginProps {
  onNext: (user: User) => void;
}

type ActiveView = "main" | "legal" | "register";

export const Login: React.FC<LoginProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("main");
  const [activeDocument, setActiveDocument] = useState<"terms" | "privacy">("terms");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string, isRegistering = false) => {
    if (!password) {
      setPasswordError("Passwort ist erforderlich");
      return false;
    } else if (isRegistering && password.length < 8) {
      setPasswordError("Passwort muss mindestens 8 Zeichen lang sein");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSignIn = async () => {
    if (isLoading) return;

    const isPasswordValid = validatePassword(password);

    if (!isPasswordValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        onNext(data.user);
      } else if (error) {
        console.error("Auth error:", error);
        setError("Bei der Anmeldung ist ein Fehler aufgetreten. Bitte überprüfe deine E-Mail und dein Passwort.");
      }
    } catch (e) {
      console.error(e);
      setError("Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (isLoading) return;

    const isPasswordValid = validatePassword(password, true);

    if (!isPasswordValid) return;

    if (password !== confirmPassword) {
      setPasswordError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && data.user) {
        setError(null);
        onNext(data.user);
      } else if (error) {
        console.error("Sign up error:", error);
        setError("Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      }
    } catch (e) {
      console.error(e);
      setError("Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (!error && user) {
          // User is signed in.
          onNext(user);
        } else if (error) {
          console.error("Auth error:", error);
          setError("Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e) {
      if (e instanceof Error && e.message === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        // Don't show error for user cancellation
      } else {
        console.error(e);
        setError("Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openTerms = () => {
    setActiveDocument("terms");
    setActiveView("legal");
  };

  const openPrivacyPolicy = () => {
    setActiveDocument("privacy");
    setActiveView("legal");
  };

  const closeLegalOrEmailView = () => {
    setActiveView("main");
  };

  if (activeView === "legal") {
    return (
      <View className="flex-1 bg-background p-4 pt-6">
        <View className="flex-row items-center justify-between bg-background pb-4">
          {activeDocument === "terms" ? <H3>Nutzungsbedingungen</H3> : <H3>Datenschutzerklärung</H3>}
          <Pressable
            onPress={closeLegalOrEmailView}
            className="rounded-2xl bg-muted p-2 w-10 h-10 items-center justify-center"
          >
            <X size={24} className="text-foreground" />
          </Pressable>
        </View>
        <ScrollView className="p-4">
          {activeDocument === "terms" ? <TermsOfService showHeader={false} /> : <PrivacyPolicy showHeader={false} />}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Card className="w-full">
        <CardHeader className="flex-col gap-2">
          <H1 className="text-center">Willkommen</H1>
          <Small className="text-muted-foreground text-center">
            Keinen Account? <Link onPress={() => setActiveView("register")}>Jetzt erstellen</Link>
          </Small>
          {error && <Small className="text-destructive text-center mt-2">{error}</Small>}
        </CardHeader>

        <CardContent className="gap-4">
          <View className="flex-column gap-2">
            <Input
              placeholder="E-Mail"
              className="bg-muted"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              startContent={<Mail size={20} className="text-muted-foreground" />}
            />
            {emailError && <Small className="text-destructive pl-2">{emailError}</Small>}

            <Input
              placeholder="Passwort"
              className="bg-muted"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) validatePassword(text);
              }}
              onBlur={() => validatePassword(password)}
              secureTextEntry={!showPassword}
              startContent={<Lock size={20} className="text-muted-foreground" />}
              endContent={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
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
            <Mail size={18} className="text-primary-foreground" strokeWidth={2.5} />
            <Large className="text-primary-foreground font-semibold text-xl">Mit E-Mail anmelden</Large>
          </Button>
          <Separator text="oder" />
          {Platform.OS === "ios" && (
            <>
              {isLoading ? (
                <View className="h-16 items-center justify-center">
                  <ActivityIndicator size="large" color="#000" />
                  <Small className="text-muted-foreground mt-2">Anmeldung läuft...</Small>
                </View>
              ) : (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={5}
                  style={{ width: "100%", height: 48 }}
                  onPress={handleAppleLogin}
                />
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <View className="w-full flex-row items-center">
            <View className="flex-1 h-px bg-border" />
            <Small className="px-4 text-xs text-muted-foreground text-center">
              Durch die Anmeldung akzeptierst du unsere <Link onPress={openTerms}>Nutzungsbedingungen</Link> und{" "}
              <Link onPress={openPrivacyPolicy}>Datenschutzerklärung</Link>{" "}
            </Small>
            <View className="flex-1 h-px bg-border" />
          </View>
        </CardFooter>
      </Card>
    </View>
  );
};

export default Login;
