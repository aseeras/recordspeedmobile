import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const VOICE_KEY = "rs-assistant-voice";

// Spoken assistant replies in the "Jennifer" voice: off until the user turns them on, remembered on this device.
// Each reply carries a signed token, so only the assistant's own words can be spoken; anything going wrong just
// leaves the reply as text.
export function useSpokenReplies() {
  const [voice, setVoice] = useState(false);
  const player = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(VOICE_KEY)
      .then((v) => setVoice(v === "on"))
      .catch(() => {});
  }, []);

  const stop = useCallback(() => {
    const current = player.current;
    player.current = null;
    if (!current) return;
    try {
      current.pause();
      current.remove();
    } catch {
      // already released
    }
  }, []);
  useEffect(() => stop, [stop]);

  const toggle = useCallback(() => {
    setVoice((on) => {
      const next = !on;
      AsyncStorage.setItem(VOICE_KEY, next ? "on" : "off").catch(() => {});
      if (!next) stop();
      return next;
    });
  }, [stop]);

  const speak = useCallback(
    async (token: string) => {
      stop();
      try {
        // They asked to hear replies, so play even with the ring/silent switch on silent.
        await setAudioModeAsync({ playsInSilentMode: true });
        const next = createAudioPlayer({ uri: `${API_BASE_URL}/assistant_speeches?token=${encodeURIComponent(token)}` });
        player.current = next;
        next.addListener("playbackStatusUpdate", (status) => {
          if (status.didJustFinish && player.current === next) stop();
        });
        next.play();
      } catch {
        // stays text only
      }
    },
    [stop],
  );

  return { voice, toggle, speak, stop };
}
