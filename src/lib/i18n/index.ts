// English and Spanish. Text is written in English in the code and looked up with t("…"); the Spanish lives in
// es.ts, keyed by that English text, so anything not translated yet still shows in English. Placeholders like
// {name} are filled from the second argument: t("Welcome, {name}", { name }).
//
// The language starts as the phone's (Spanish if the phone is in Spanish, English otherwise) until the person
// picks one in the app, which is remembered. Changing it re-renders the whole app (see useLanguageKey).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { NativeModules, Platform } from "react-native";
import { es as dateFnsEs } from "date-fns/locale/es";
import { ES } from "./es";

export type Language = "en" | "es";
const STORAGE_KEY = "@app:language";

function deviceLanguage(): Language {
  let tag = "";
  try {
    if (Platform.OS === "ios") {
      const s = NativeModules.SettingsManager?.settings;
      tag = s?.AppleLanguages?.[0] ?? s?.AppleLocale ?? "";
    } else if (Platform.OS === "web") {
      tag = typeof navigator !== "undefined" ? navigator.language : "";
    } else {
      tag = NativeModules.I18nManager?.localeIdentifier ?? "";
    }
  } catch {
    tag = "";
  }
  return /^es\b/i.test(tag) ? "es" : "en";
}

let current: Language = deviceLanguage();
const listeners = new Set<(language: Language) => void>();

// Picks up a language chosen in an earlier session.
export async function loadLanguage() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") setCurrent(saved);
  } catch {
    // Storage unavailable: keep the phone's language.
  }
}

function setCurrent(language: Language) {
  if (language === current) return;
  current = language;
  listeners.forEach((listener) => listener(language));
}

export async function setLanguage(language: Language) {
  setCurrent(language);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Not remembered, but still switched for now.
  }
}

export function language(): Language {
  return current;
}

// State bar-number rules (src/lib/constants.ts) all read "<State> bar number must have … digits."
const BAR_RULE = /^(.+) bar number must have (?:exactly (\d+)|(\d+) or (\d+)) digits\.$/;

function spanish(text: string): string {
  if (ES[text] !== undefined) return ES[text];
  const bar = BAR_RULE.exec(text);
  if (bar) {
    const digits = bar[2] ? `exactamente ${bar[2]}` : `${bar[3]} o ${bar[4]}`;
    return `El número de colegiado de ${bar[1]} debe tener ${digits} dígitos.`;
  }
  return text;
}

export function t(text: string, vars?: Record<string, string | number>): string {
  let out = current === "es" ? spanish(text) : text;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
  return out;
}

// date-fns locale for format(): Spanish month and day names in Spanish.
export function dateLocale() {
  return current === "es" ? dateFnsEs : undefined;
}

// The current language as React state, so the app re-renders when it changes.
export function useLanguage(): Language {
  const [value, setValue] = useState(current);
  useEffect(() => {
    listeners.add(setValue);
    loadLanguage();
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
}
