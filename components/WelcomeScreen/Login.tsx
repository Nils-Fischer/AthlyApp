import React, { useState } from "react";
import { ActivityIndicator, Platform, Pressable, View, ScrollView } from "react-native";
import { H1, H2, H3, P, Small } from "~/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";
import { Link } from "~/components/ui/typography";
import PrivacyPolicy from "../Legal/PrivacyPolicy";
import TermsOfService from "../Legal/TermsOfService";
import { X } from "~/lib/icons/Icons";

interface LoginProps {
  onNext: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<"terms" | "privacy">("terms");

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
    setIsLegalModalOpen(true);
  };

  const openPrivacyPolicy = () => {
    setActiveDocument("privacy");
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  if (isLegalModalOpen) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between bg-background pb-4">
          {activeDocument === "terms" ? <H3>Nutzungsbedingungen</H3> : <H3>Datenschutzerklärung</H3>}
          <Pressable
            onPress={closeLegalModal}
            className="rounded-2xl bg-muted p-6 w-10 h-10 items-center justify-center"
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
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <H1 className="text-center">Willkommen</H1>
          <P className="text-center text-muted-foreground mt-2">Melde dich an, um fortzufahren</P>
        </CardHeader>

        <CardContent className="gap-3">
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
                  style={{ width: "100%", height: 64 }}
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
