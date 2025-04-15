import React, { useState } from "react";
import { ActivityIndicator, Platform, Pressable, View, ScrollView } from "react-native";
import { H1, H3, Small } from "~/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "~/lib/supabase";
import { User } from "@supabase/auth-js";
import { Link } from "~/components/ui/typography";
import PrivacyPolicy from "../Legal/PrivacyPolicy";
import TermsOfService from "../Legal/TermsOfService";
import { X } from "~/lib/icons/Icons";
import { Separator } from "~/components/ui/separator";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import LoginWithOtpForm from "./LoginWithOTPForm";

interface LoginProps {
  onNext: (user: User, firstName?: string, lastName?: string) => void;
}

type ActiveView = "main" | "legal";
type AuthView = "login" | "register" | "otpLogin";

export const Login: React.FC<LoginProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("main");
  const [authView, setAuthView] = useState<AuthView>("login");
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

      console.log("credential", credential);

      const { givenName, familyName } = credential.fullName ?? { givenName: undefined, familyName: undefined };

      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (!error && user) {
          onNext(user, givenName ?? undefined, familyName ?? undefined);
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

  const closeLegalView = () => {
    setActiveView("main");
  };

  const switchAuthView = (view: AuthView) => {
    setError(null);
    setAuthView(view);
  };

  if (activeView === "legal") {
    return (
      <View className="flex-1 bg-background p-4 pt-6">
        <View className="flex-row items-center justify-between bg-background pb-4">
          {activeDocument === "terms" ? <H3>Nutzungsbedingungen</H3> : <H3>Datenschutzerklärung</H3>}
          <Pressable
            onPress={closeLegalView}
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

  const getTitle = () => {
    switch (authView) {
      case "login":
        return "Willkommen";
      case "register":
        return "Konto erstellen";
      case "otpLogin":
        return "Anmelden mit OTP";
      default:
        return "Willkommen";
    }
  };

  const getSubtitle = () => {
    switch (authView) {
      case "login":
        return (
          <>
            Keinen Account? <Link onPress={() => switchAuthView("register")}>Jetzt erstellen</Link>
          </>
        );
      case "register":
        return (
          <>
            Bereits einen Account? <Link onPress={() => switchAuthView("login")}>Jetzt anmelden</Link>
          </>
        );
      case "otpLogin":
        return (
          <>
            Zurück zur normalen <Link onPress={() => switchAuthView("login")}>Anmeldung</Link>
          </>
        );
      default:
        return null;
    }
  };

  const getFooterText = () => {
    switch (authView) {
      case "login":
        return "Anmeldung";
      case "register":
        return "Registrierung";
      case "otpLogin":
        return "Fortfahren";
      default:
        return "Fortfahren";
    }
  };

  // Nils-Fischer7@web.de
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Card className="w-full">
        <CardHeader className="flex-col gap-2">
          <H1 className="text-center w-full">{getTitle()}</H1>
          {authView !== "otpLogin" && <Small className="text-muted-foreground text-center">{getSubtitle()}</Small>}
          {error && <Small className="text-destructive text-center mt-2">{error}</Small>}
        </CardHeader>

        <CardContent className="gap-4">
          {authView === "login" ? (
            <LoginForm onNext={onNext} onError={setError} onResetPassword={() => switchAuthView("otpLogin")} />
          ) : authView === "register" ? (
            <SignUpForm onNext={onNext} onError={setError} />
          ) : (
            <LoginWithOtpForm onBackToLogin={() => switchAuthView("login")} onError={setError} onNext={onNext} />
          )}

          {authView === "login" && (
            <>
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
            </>
          )}
        </CardContent>

        {authView !== "otpLogin" && (
          <CardFooter className="flex-col space-y-4">
            <View className="w-full flex-row items-center">
              <View className="flex-1 h-px bg-border" />
              <Small className="px-4 text-xs text-muted-foreground text-center">
                Durch die {getFooterText()} akzeptierst du unsere <Link onPress={openTerms}>Nutzungsbedingungen</Link>{" "}
                und <Link onPress={openPrivacyPolicy}>Datenschutzerklärung</Link>.
              </Small>
              <View className="flex-1 h-px bg-border" />
            </View>
          </CardFooter>
        )}
      </Card>
    </View>
  );
};

export default Login;
