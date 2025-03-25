import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, Gender } from "~/lib/types";
import { supabase } from "~/lib/supabase";

interface UserProfileState {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => Promise<void>;
  isProfileComplete: () => boolean;
}

const initialProfile: UserProfile = {
  language: "german",
  id: "",
  firstName: "",
  lastName: "",
  birthday: new Date(),
  gender: "other" as Gender,
  height: 0,
  weight: 0,
};

/**
 * Converts UserProfile to Supabase format
 */
const toSupabaseFormat = (profile: UserProfile) => {
  return {
    id: profile.id,
    first_name: profile.firstName,
    last_name: profile.lastName,
    birthday:
      profile.birthday instanceof Date ? profile.birthday.toISOString() : new Date(profile.birthday).toISOString(),
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    language: profile.language,
  };
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      isLoading: false,
      error: null,
      isSyncing: false,

      isProfileComplete: () => {
        const { profile } = get();

        // Check if any required fields are missing
        return !!(
          profile.id &&
          profile.firstName &&
          profile.lastName &&
          profile.birthday &&
          profile.gender &&
          profile.height > 0 &&
          profile.weight > 0
        );
      },

      updateProfile: async (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : { ...initialProfile, ...updates },
          isSyncing: true,
          error: null,
        }));

        try {
          const updatedProfile = get().profile;

          if (updatedProfile.id) {
            const { error } = await supabase.from("user_profiles").upsert(toSupabaseFormat(updatedProfile));

            if (error) {
              set({ error: error.message, isSyncing: false });
              return;
            }
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Unknown error", isSyncing: false });
        } finally {
          set({ isSyncing: false });
        }
      },

      resetProfile: async () => {
        set({ profile: initialProfile, error: null, isSyncing: true });

        try {
          const { id } = get().profile;
          if (id) {
            await supabase.from("user_profiles").delete().eq("id", id);
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Unknown error" });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
