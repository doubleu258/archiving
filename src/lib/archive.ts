// 데이터를 꺼내 쓰는 함수 모음.
// 지금은 파일(src/data)에서 읽지만, 나중에 Supabase로 바꿀 때 이 파일만 고치면 돼요.

import { helmutLang } from "@/data/helmut-lang";
import type { Brand, Collection, Look, SeasonCode } from "./types";
import type { Locale } from "./i18n";

const BRANDS: Brand[] = [helmutLang];

export function getBrands(): Brand[] {
  return BRANDS;
}

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getCollection(brandSlug: string, collectionSlug: string): Collection | undefined {
  return getBrand(brandSlug)?.collections.find((c) => c.slug === collectionSlug);
}

export function getLook(collection: Collection, lookNumber: number): Look | undefined {
  return collection.looks.find((l) => l.number === lookNumber);
}

/** 연도별로 묶기: { 2004: [FW, SS], 2003: [...] } */
export function groupByYear(collections: Collection[]): [number, Collection[]][] {
  const map = new Map<number, Collection[]>();
  for (const c of collections) {
    map.set(c.year, [...(map.get(c.year) ?? []), c]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

const SEASON_NAMES: Record<SeasonCode, { en: string; ko: string }> = {
  SS: { en: "Spring/Summer", ko: "봄/여름" },
  FW: { en: "Fall/Winter", ko: "가을/겨울" },
  PF: { en: "Pre-Fall", ko: "프리폴" },
  RS: { en: "Resort", ko: "리조트" },
};

export function seasonName(season: SeasonCode, lang: Locale): string {
  return SEASON_NAMES[season][lang];
}

/** 예: "Fall/Winter 1998" / "1998 가을/겨울" */
export function collectionTitle(c: Collection, lang: Locale): string {
  return lang === "ko"
    ? `${c.year} ${seasonName(c.season, lang)}`
    : `${seasonName(c.season, lang)} ${c.year}`;
}

/** 예: "FW98" */
export function collectionCode(c: Collection): string {
  return `${c.season}${String(c.year).slice(-2)}`;
}

export function yearRange(brand: Brand): [number, number] {
  const ys = brand.collections.map((c) => c.year);
  return [Math.min(...ys), Math.max(...ys)];
}
