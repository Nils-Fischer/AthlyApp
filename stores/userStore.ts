import { create } from "zustand";
import { UserData, Routine } from "~/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (newPrograms: Routine[]) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUserData: async () => {
    console.log("👤 Starting user data fetch...");
    set({ isLoading: true, error: null });
    try {
      const cachedData = await AsyncStorage.getItem("userData");
      if (cachedData) {
        console.log("📱 Found user data");
        const parsedData = JSON.parse(cachedData) as UserData;
        set({ userData: parsedData, isLoading: false });
        return;
      }

      // If no data exists yet, initialize with empty data
      const initialData: UserData = {
        programs: [],
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(initialData));
      set({ userData: initialData, isLoading: false });
      console.log("✅ Initialized empty user data");
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },

  updateUserData: async (newPrograms) => {
    console.log("📝 Starting user data update...");
    set({ isLoading: true, error: null });
    try {
      const updatedData: UserData = {
        programs: newPrograms,
        created_at: get().userData?.created_at || new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      set({ userData: updatedData, isLoading: false });
      console.log("✅ Successfully updated user data");
    } catch (error) {
      console.error("❌ Error updating user data:", error);
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },
}));
