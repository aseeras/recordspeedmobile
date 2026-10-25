import { Platform } from "react-native";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

// Speech to text for the assistant's talk mode, done on the iPhone itself.
//
// People may say health details out loud, so the audio must never go to a cloud speech service. Recognition is
// started with requiresOnDeviceRecognition, and patches/expo-speech-recognition+*.patch makes iOS fail rather
// than fall back to Apple's servers when a language can't be recognised on the device. Talk mode is iPhone-only.

export const speechLang = (lang: string) => (lang === "es" ? "es-US" : "en-US");

// Whether talk mode can be offered on this device at all.
export function canTalk(): boolean {
  if (Platform.OS !== "ios") return false;
  try {
    return ExpoSpeechRecognitionModule.supportsOnDeviceRecognition();
  } catch {
    return false;
  }
}

// Asks for the microphone and speech recognition the first time. Call from a tap.
export async function prepareTalk(): Promise<boolean> {
  try {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    return result.granted;
  } catch {
    return false;
  }
}

// Listens for one thing said and resolves with it ("" if nothing was said). Stops when `signal` aborts.
export function listenOnce(
  lang: string,
  { onPartial, signal }: { onPartial?: (text: string) => void; signal?: AbortSignal } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    let heard = "";
    let settled = false;
    const subscriptions = [
      ExpoSpeechRecognitionModule.addListener("result", (e) => {
        heard = e.results[0]?.transcript?.trim() ?? heard;
        if (!e.isFinal) onPartial?.(heard);
      }),
      ExpoSpeechRecognitionModule.addListener("error", (e) =>
        done(() => (["no-speech", "aborted", "speech-timeout"].includes(e.error) ? resolve(heard) : reject(new Error(e.error)))),
      ),
      ExpoSpeechRecognitionModule.addListener("end", () => done(() => resolve(heard))),
    ];
    function done(fn: () => void) {
      if (settled) return;
      settled = true;
      subscriptions.forEach((s) => s.remove());
      signal?.removeEventListener("abort", abort);
      fn();
    }
    function abort() {
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // already stopped
      }
      done(() => resolve(""));
    }
    if (signal?.aborted) return abort();
    signal?.addEventListener("abort", abort);
    try {
      ExpoSpeechRecognitionModule.start({
        lang: speechLang(lang),
        requiresOnDeviceRecognition: true,
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
      });
    } catch (error) {
      done(() => reject(error));
    }
  });
}
