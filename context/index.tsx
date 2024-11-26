import React from "react";
import { useStorageState } from "./useStorageState";
import { supabase } from "../lib/supabase";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void | any;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[isUserLoading, user], setUser] = useStorageState("user");

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.log(error);
          return { error };
        }
        setSession(JSON.stringify(data?.session));
        setUser(JSON.stringify(data?.user));
        return true;
      },
      signOut: () => {
        supabase.auth.signOut();
        setSession(null);
      },
      session,
      isLoading,
    }),
    [session, isLoading, setSession, setUser]
  );

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}
