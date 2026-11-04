import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// The keychain on iPhone; the browser's storage for the web preview used in development.
const web = Platform.OS === "web";

export async function secureGet(key: string) {
  if (web) { try { return globalThis.localStorage?.getItem(key) ?? null; } catch { return null; } }
  return SecureStore.getItemAsync(key);
}
export async function secureSet(key: string, value: string) {
  if (web) { try { globalThis.localStorage?.setItem(key, value); } catch { /* private mode */ } return; }
  await SecureStore.setItemAsync(key, value);
}
export async function secureRemove(key: string) {
  if (web) { try { globalThis.localStorage?.removeItem(key); } catch { /* private mode */ } return; }
  await SecureStore.deleteItemAsync(key);
}
