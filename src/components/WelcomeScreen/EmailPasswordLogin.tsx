import React, { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { H3, P, Small } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";
import { ArrowLeft } from "~/lib/icons/Icons";

interface EmailPasswordLoginProps {
  onNext: (user: User) => void;
  onBack: () => void;
}

export const EmailPasswordLogin: React.FC<EmailPasswordLoginProps> = ({ onNext, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailPasswordLogin = async () => {
    if (emailLoading) return;
    setEmailLoading(true);
    setEmailError(null);

    try {
      // Try signing in first
      const {
        data: { user: signInUser },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInUser) {
        onNext(signInUser);
        // No need to reset state here as component will unmount/remount
        return; // Exit early on success
      }

      // If sign-in fails, check if it's due to invalid credentials (user might not exist)
      if (signInError && signInError.message === "Invalid login credentials") {
        // Try signing up
        const {
          data: { user: signUpUser },
          error: signUpError,
        } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (signUpUser) {
          // TODO: Handle email confirmation if enabled in Supabase settings
          // For now, assume auto-confirmation or treat as logged in
          onNext(signUpUser);
          // No need to reset state here
          return; // Exit early on success
        } else if (signUpError) {
          console.error("Sign up error:", signUpError);
          setEmailError(signUpError.message || "Registrierung fehlgeschlagen. Bitte prüfe deine Eingaben.");
        }
      } else if (signInError) {
        console.error("Sign in error:", signInError);
        setEmailError(signInError.message || "Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch (e) {
      console.error("Email/Password Auth error:", e);
      setEmailError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 pt-6">
      <View className="flex-row items-center justify-between bg-background pb-4 mb-4">
        <Pressable onPress={onBack} className="rounded-2xl bg-muted p-2 w-10 h-10 items-center justify-center mr-2">
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <H3>Mit E-Mail anmelden</H3>
        <View className="w-10" />
      </View>

      <Input
        placeholder="Deine E-Mail Adresse"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        className="mb-3"
        editable={!emailLoading}
      />
      <Input
        placeholder="Dein Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        className="mb-4"
        editable={!emailLoading}
      />
      {emailError && <Small className="text-destructive mb-4">{emailError}</Small>}
      {emailLoading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Button
          onPress={handleEmailPasswordLogin}
          size="lg"
          className="w-full"
          disabled={!email || !password || emailLoading}
        >
          <P>Anmelden oder Registrieren</P>
        </Button>
      )}
      {/* Optional: Add forgot password link here later */}
    </View>
  );
};

export default EmailPasswordLogin;
