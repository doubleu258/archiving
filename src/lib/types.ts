// 데이터 구조 정의 (Data model)
// 나중에 Supabase 데이터베이스로 옮길 때도 이 구조를 그대로 테이블로 만들 예정이에요.

/** SS = Spring/Summer, FW = Fall/Winter, PF = Pre-Fall, RS = Resort */
export type SeasonCode = "SS" | "FW" | "PF" | "RS";

/** 영어/한국어 두 가지로 적는 텍스트 */
export type LocalizedText = { en: string; ko: string };

export type GarmentCategory =
  | "outerwear"
  | "jacket"
  | "shirt"
  | "top"
  | "knitwear"
  | "trousers"
  | "denim"
  | "skirt"
  | "dress"
  | "accessory";

export interface Look {
  /** 쇼에서 나온 순서 (Look 1, Look 2 ...) */
  number: number;
  /** 사진 경로. 아직 사진이 없으면 비워둠 → 자리표시 이미지가 보여요 */
  image?: string;
  /** 이 룩에 포함된 옷 종류 */
  categories: GarmentCategory[];
  description?: LocalizedText;
}

export interface Collection {
  /** 주소에 쓰이는 이름, 예: "fw-1998" */
  slug: string;
  year: number;
  season: SeasonCode;
  /** 쇼가 열린 도시 */
  city: string;
  /** 쇼 날짜 (알 때만), 예: "1998-03-01" */
  showDate?: string;
  /** "menswear" | "womenswear" | "mixed" */
  line: "menswear" | "womenswear" | "mixed";
  notes?: LocalizedText;
  /** 자료 출처 링크 */
  sourceUrl?: string;
  /** 사실 확인을 마친 데이터인지 여부. 샘플 데이터는 false */
  verified: boolean;
  looks: Look[];
}

export interface Brand {
  slug: string;
  name: string;
  founded?: number;
  description: LocalizedText;
  collections: Collection[];
}
