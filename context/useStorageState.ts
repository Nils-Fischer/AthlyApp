import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return React.useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Initialize state with a consistent initial value
  const [state, setState] = useAsyncState<string>([true, null]);

  // Memoize the setValue callback
  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  // Load initial value
  React.useEffect(() => {
    let mounted = true;

    const loadInitialValue = async () => {
      try {
        let value = null;
        if (Platform.OS === "web") {
          value = localStorage.getItem(key);
        } else {
          value = await SecureStore.getItemAsync(key);
        }
        if (mounted) {
          setState(value);
        }
      } catch (e) {
        console.error("Storage access error:", e);
        if (mounted) {
          setState(null);
        }
      }
    };

    loadInitialValue();

    return () => {
      mounted = false;
    };
  }, [key]);

  return [state, setValue];
}
