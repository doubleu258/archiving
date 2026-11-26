// 언어 설정. 영어(en)가 기본, 한국어(ko) 지원.
// 새 언어를 추가하려면 locales 배열과 src/dictionaries 에 파일을 추가하면 돼요.

export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
