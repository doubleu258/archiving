import type { Locale } from "@/lib/i18n";
import en from "./en";
import ko from "./ko";

const dictionaries = { en, ko };

export function getDictionary(lang: Locale) {
  return dictionaries[lang];
}

export type { Dictionary } from "./en";
