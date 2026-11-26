import type { Brand, Collection, GarmentCategory, Look, SeasonCode } from "@/lib/types";

// ⚠️ 샘플 데이터 (SAMPLE DATA)
// 사이트 구조를 확인하기 위한 임시 데이터예요. 룩 개수, 쇼 날짜, 사진은 실제와 다릅니다.
// 2단계(자료 수집)에서 실제 컬렉션 정보로 교체하고, 확인한 항목은 verified: true 로 바꿀 거예요.

const CATEGORY_ROTATION: GarmentCategory[][] = [
  ["outerwear", "trousers"],
  ["jacket", "shirt", "trousers"],
  ["top", "skirt"],
  ["knitwear", "trousers"],
  ["shirt", "denim"],
  ["dress"],
  ["jacket", "top", "trousers"],
  ["outerwear", "knitwear", "denim"],
];

function placeholderLooks(count: number, offset: number): Look[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    categories: CATEGORY_ROTATION[(i + offset) % CATEGORY_ROTATION.length],
  }));
}

function sampleCollection(year: number, season: SeasonCode): Collection {
  return {
    slug: `${season.toLowerCase()}-${year}`,
    year,
    season,
    // 대략적인 기준: 1990년대 후반 이전은 파리, 이후는 뉴욕. 2단계에서 시즌별로 확인 예정.
    city: year >= 1998 ? "New York" : "Paris",
    line: "mixed",
    verified: false,
    looks: placeholderLooks(12, year + (season === "FW" ? 3 : 0)),
  };
}

const years = Array.from({ length: 2004 - 1994 + 1 }, (_, i) => 1994 + i);

export const helmutLang: Brand = {
  slug: "helmut-lang",
  name: "Helmut Lang",
  description: {
    en: "Austrian designer Helmut Lang showed his first collection in Paris in 1986 and moved his base to New York in the late 1990s. His work defined 1990s minimalism: sharp tailoring, technical fabrics, and a stripped-back palette.",
    ko: "오스트리아 출신 디자이너 헬무트 랭은 1986년 파리에서 첫 컬렉션을 선보였고, 1990년대 후반 뉴욕으로 거점을 옮겼어요. 날카로운 테일러링, 기능성 소재, 절제된 색감으로 90년대 미니멀리즘을 대표하는 브랜드가 되었습니다.",
  },
  collections: years
    .flatMap((y) => [sampleCollection(y, "SS"), sampleCollection(y, "FW")])
    .sort((a, b) => b.year - a.year || (a.season === "FW" ? -1 : 1)),
};
