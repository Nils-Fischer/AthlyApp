import { create } from "zustand";
import { UserData, Routine } from "~/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (newroutines: Routine[]) => Promise<void>;
  addRoutine: (routine: Routine) => Promise<void>;
  removeRoutine: (routineId: number) => Promise<void>;
  updateRoutine: (updatedRoutine: Routine) => Promise<void>;
  getActiveRoutine: () => Routine | null;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUserData: async () => {
    console.log("👤 Starting user data fetch...");
    set({ isLoading: true, error: null });
    try {
      // First, try to ensure storage is accessible
      try {
        await AsyncStorage.setItem("test", "test");
        await AsyncStorage.removeItem("test");
      } catch (e) {
        throw new Error("Storage is not accessible. Please restart the app.");
      }

      const cachedData = await AsyncStorage.getItem("userData");
      if (cachedData) {
        console.log("📱 Found user data");
        const parsedData = JSON.parse(cachedData) as UserData;
        set({ userData: parsedData, isLoading: false });
        return;
      }

      // If no data exists yet, initialize with empty data
      const initialData: UserData = {
        routines: [],
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(initialData));
      set({ userData: initialData, isLoading: false });
      console.log("✅ Initialized empty user data");
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      set({
        error: error instanceof Error ? error : new Error("❓ Unknown error"),
        isLoading: false,
      });
    }
  },

  updateUserData: async (newroutines) => {
    console.log("📝 Starting user data update...");
    set({ isLoading: true, error: null });
    try {
      const updatedData: UserData = {
        routines: newroutines,
        created_at: get().userData?.created_at || new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      set({ userData: updatedData, isLoading: false });
      console.log("✅ Successfully updated user data");
    } catch (error) {
      console.error("❌ Error updating user data:", error);
      set({
        error: error instanceof Error ? error : new Error("❓ Unknown error"),
        isLoading: false,
      });
    }
  },

  addRoutine: async (routine: Routine) => {
    console.log("📝 Starting routine addition...");
    set({ isLoading: true, error: null });
    try {
      const currentData = get().userData;
      if (!currentData) throw new Error("❌ No user data found");

      const updatedData: UserData = {
        ...currentData,
        routines: [...currentData.routines, routine],
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      set({ userData: updatedData, isLoading: false });
      console.log("✅ Successfully added routine");
    } catch (error) {
      console.error("❌ Error adding routine:", error);
      set({
        error: error instanceof Error ? error : new Error("❓ Unknown error"),
        isLoading: false,
      });
    }
  },

  removeRoutine: async (routineId: number) => {
    console.log("📝 Starting routine removal...");
    set({ isLoading: true, error: null });
    try {
      const currentData = get().userData;
      if (!currentData) throw new Error("❌ No user data found");

      const updatedData: UserData = {
        ...currentData,
        routines: currentData.routines.filter((p) => p.id !== routineId),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      set({ userData: updatedData, isLoading: false });
      console.log("✅ Successfully removed routine");
    } catch (error) {
      console.error("❌ Error removing routine:", error);
      set({
        error: error instanceof Error ? error : new Error("❓ Unknown error"),
        isLoading: false,
      });
    }
  },

  updateRoutine: async (updatedRoutine: Routine) => {
    console.log("📝 Starting routine update...");
    set({ isLoading: true, error: null });
    try {
      const currentData = get().userData;
      if (!currentData) throw new Error("❌ No user data found");

      const updatedData: UserData = {
        ...currentData,
        routines: currentData.routines.map((routine) => (routine.id === updatedRoutine.id ? updatedRoutine : routine)),
        last_updated: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      set({ userData: updatedData, isLoading: false });
      console.log("✅ Successfully updated routine");
    } catch (error) {
      console.error("❌ Error updating routine:", error);
      set({
        error: error instanceof Error ? error : new Error("❓ Unknown error"),
        isLoading: false,
      });
    }
  },
  getActiveRoutine: () => {
    const currentData = get().userData;
    if (!currentData) {
      console.log("❌ No user data found");
      return null;
    }
    return currentData.routines.find((routine) => routine.active) || null;
  },
}));
