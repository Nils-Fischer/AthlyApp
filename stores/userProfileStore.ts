import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, Gender } from "~/lib/types";

interface UserProfileState {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;

  // Field-specific setters
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: Gender) => void;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
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

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({ profile, error: null }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : initialProfile,
          error: null,
        })),

      resetProfile: () => set({ profile: initialProfile, error: null }),

      setFirstName: (firstName) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, firstName } : { ...initialProfile, firstName },
        })),

      setLastName: (lastName) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, lastName } : { ...initialProfile, lastName },
        })),

      setAge: (age) =>
        set((state) => {
          if (age < 0) {
            return { error: "Age must be positive" };
          }
          return {
            profile: state.profile ? { ...state.profile, age } : { ...initialProfile, age },
            error: null,
          };
        }),

      setGender: (gender) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, gender } : { ...initialProfile, gender },
        })),

      setHeight: (height) =>
        set((state) => {
          if (height < 0) {
            return { error: "Height must be positive" };
          }
          return {
            profile: state.profile ? { ...state.profile, height } : { ...initialProfile, height },
            error: null,
          };
        }),

      setWeight: (weight) =>
        set((state) => {
          if (weight < 0) {
            return { error: "Weight must be positive" };
          }
          return {
            profile: state.profile ? { ...state.profile, weight } : { ...initialProfile, weight },
            error: null,
          };
        }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
