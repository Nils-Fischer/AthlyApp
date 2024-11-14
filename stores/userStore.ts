import { create } from 'zustand';
import { supabase } from '~/lib/supabase';
import { UserData, Program } from '~/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (newPrograms: Program[]) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      // First try to get from AsyncStorage
      const cachedData = await AsyncStorage.getItem('userData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as UserData;
        set({ userData: parsedData, isLoading: false });

        // Only proceed with Supabase fetch if cached data is older than 5 minutes
        const lastUpdated = new Date(parsedData.last_updated).getTime();
        const fiveMinutesAgo = new Date().getTime() - 5 * 60 * 1000;
        if (lastUpdated > fiveMinutesAgo) {
          return; // Use cached data if recent
        }
      }

      // Fetch from Supabase if no cache or cache is old
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const userData: UserData = {
        programs: data.programs || [],
        created_at: data.created_at || new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      // Update both store and AsyncStorage
      set({ userData, isLoading: false });
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      });
    }
  },

  updateUserData: async (newPrograms) => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const updatedData: UserData = {
        programs: newPrograms,
        created_at: get().userData?.created_at || new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      // Update Supabase
      const { error } = await supabase.from('user_data').upsert({
        user_id: user.id,
        programs: newPrograms,
        last_updated: updatedData.last_updated,
      });

      if (error) throw error;

      // Update both store and AsyncStorage
      set({ userData: updatedData, isLoading: false });
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      });
    }
  },
}));
