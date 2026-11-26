// 데이터를 꺼내 쓰는 함수 모음 (서버에서만 실행돼요).
// 컬렉션 정보(src/data/*.ts) + 사진 목록(src/data/photos.local.json)을 합쳐서 화면에 넘겨줘요.
// 나중에 Supabase로 바꿀 때 이 파일만 고치면 돼요.

import fs from "node:fs";
import path from "node:path";
import { helmutLang } from "@/data/helmut-lang";
import type { Brand, BrandInfo, Collection, CollectionInfo, Look, SeasonCode } from "./types";
import type { Locale } from "./i18n";

const BRANDS: BrandInfo[] = [helmutLang];

type PhotoManifest = Record<string, { number: number; image: string }[]>;

/** `npm run import-photos` 가 만든 사진 목록 읽기. 없으면 빈 목록 */
function loadPhotos(): PhotoManifest {
  try {
    const file = path.join(process.cwd(), "src", "data", "photos.local.json");
    return JSON.parse(fs.readFileSync(file, "utf8")) as PhotoManifest;
  } catch {
    return {};
  }
}

function withPhotos(brandSlug: string, info: CollectionInfo, photos: PhotoManifest): Collection {
  const looks: Look[] = (photos[`${brandSlug}/${info.slug}`] ?? []).map((p) => ({
    number: p.number,
    image: p.image,
    categories: [],
  }));
  return { ...info, looks };
}

export function getBrands(): Brand[] {
  const photos = loadPhotos();
  return BRANDS.map((b) => ({ ...b, collections: b.collections.map((c) => withPhotos(b.slug, c, photos)) }));
}

export function getBrand(slug: string): Brand | undefined {
  return getBrands().find((b) => b.slug === slug);
}

export function getCollection(brandSlug: string, collectionSlug: string): Collection | undefined {
  return getBrand(brandSlug)?.collections.find((c) => c.slug === collectionSlug);
}

export function getLook(collection: Collection, lookNumber: number): Look | undefined {
  return collection.looks.find((l) => l.number === lookNumber);
}

/** 이전/다음 룩 (번호가 건너뛰어도 사진 순서대로) */
export function adjacentLooks(collection: Collection, look: Look): [Look | undefined, Look | undefined] {
  const i = collection.looks.findIndex((l) => l.number === look.number);
  return [collection.looks[i - 1], collection.looks[i + 1]];
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
export function collectionTitle(c: CollectionInfo, lang: Locale): string {
  return lang === "ko" ? `${c.year} ${seasonName(c.season, lang)}` : `${seasonName(c.season, lang)} ${c.year}`;
}

/** 예: "FW98" */
export function collectionCode(c: CollectionInfo): string {
  return `${c.season}${String(c.year).slice(-2)}`;
}

/** 쇼 장소 표시: 온라인 발표면 "Online"/"온라인" */
export function placeName(c: CollectionInfo, onlineLabel: string): string {
  return c.presentation === "online" ? onlineLabel : c.city;
}

/** "1998-09" → "Sep 1998" / "1998년 9월", "1999-02-16" → "16 Feb 1999" / "1999년 2월 16일" */
export function formatShowDate(value: string, lang: Locale): string {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC", year: "numeric", month: d ? "short" : "long", ...(d ? { day: "numeric" } : {}) };
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-GB", opts).format(date);
}

export function yearRange(brand: { collections: { year: number }[] }): [number, number] {
  const ys = brand.collections.map((c) => c.year);
  return [Math.min(...ys), Math.max(...ys)];
}
