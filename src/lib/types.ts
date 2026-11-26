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

/**
 * 자료 확인 상태
 * - verified: 출처로 시즌·도시를 확인함
 * - unconfirmed: 실제 시즌이지만 세부 정보를 아직 확인 못 함
 * - sample: 사이트 구조 확인용 임시 데이터
 */
export type DataStatus = "verified" | "unconfirmed" | "sample";

export interface Source {
  name: string;
  url: string;
}

export interface Look {
  /** 쇼에서 나온 순서 (Look 1, Look 2 ...) */
  number: number;
  /** 사진 경로 (사진 가져오기 도구가 채워줘요) */
  image?: string;
  /** 이 룩에 포함된 옷 종류 (나중에 직접 입력) */
  categories: GarmentCategory[];
  description?: LocalizedText;
}

/** 컬렉션 정보 (사진 제외). src/data 에 적는 내용 */
export interface CollectionInfo {
  /** 주소에 쓰이는 이름, 예: "fw-1998" */
  slug: string;
  year: number;
  season: SeasonCode;
  /** 쇼가 열린 도시. 온라인 발표는 "Online" */
  city: string;
  /** 발표 방식. 기본은 런웨이 */
  presentation?: "runway" | "online";
  /** 쇼 날짜. 아는 만큼만: "1999-02-16" 또는 "1998-09" */
  showDate?: string;
  /** 알려진 총 룩 수 */
  lookCount?: number;
  line?: "menswear" | "womenswear" | "mixed";
  notes?: LocalizedText;
  sources?: Source[];
  status: DataStatus;
}

/** 화면에서 쓰는 컬렉션 = 정보 + 사진에서 만든 룩 목록 */
export interface Collection extends CollectionInfo {
  looks: Look[];
}

export interface BrandInfo {
  slug: string;
  name: string;
  founded?: number;
  description: LocalizedText;
  collections: CollectionInfo[];
}

export interface Brand extends Omit<BrandInfo, "collections"> {
  collections: Collection[];
}
