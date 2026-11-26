import type { BrandInfo, CollectionInfo, SeasonCode, Source } from "@/lib/types";

// 헬무트 랭 컬렉션 정보
// - 1997~2001년: 웹에서 출처를 찾아 정리한 실제 정보 (status: verified / unconfirmed)
// - 그 외 연도: 사이트 구조 확인용 샘플 (status: sample) → 다음 조사 때 채울 예정
// 사진은 여기 넣지 않아요. archive-photos 폴더 + `npm run import-photos` 로 연결돼요.

// ── 출처 ──────────────────────────────────────────
const S = {
  ina: { name: "INA", url: "https://mediaclip.ina.fr/en/i23241521-helmut-lang-fashion-show-in-paris.html" },
  met: { name: "The Met", url: "https://www.metmuseum.org/art/collection/search/762094" },
  ssense: { name: "SSENSE", url: "https://www.ssense.com/en-us/editorial/fashion/helmut-lang-guide" },
  vogueSS98: {
    name: "Vogue Runway",
    url: "https://fashionshows-uk.prod.cni.digital/fashion-shows/spring-summer-1998-ready-to-wear/helmut-lang",
  },
  wwdGallery: {
    name: "WWD",
    url: "https://wwd.com/fashion-news/fashion-features/gallery/archive-exploring-helmut-langs-minimalist-collections-from-1986-2005-1238418715/",
  },
  wwdOnline: {
    name: "WWD",
    url: "https://wwd.com/fashion-news/fashion-features/feature/first-online-fashion-show-ever-helmut-lang-lessons-1203626257/",
  },
  hypebeast1998: { name: "Hypebeast", url: "https://hypebeast.com/2020/5/helmut-lang-march-1998-online-fashion-show-interview" },
  hypebeastFacts: { name: "Hypebeast", url: "https://hypebeast.com/2023/5/helmut-lang-fun-facts-5-five-things-fashion-designer-peter-do" },
  fit: { name: "The Museum at FIT", url: "https://fashionmuseum.fitnyc.edu/people/2998/helmut-lang" },
  firstview: { name: "FirstVIEW", url: "https://www.firstview.com/collection_designer.php?page=3&s_d=595" },
  modelsFW01: { name: "models.com", url: "https://models.com/work/helmut-lang-helmut-lang-fw-2001-show" },
} satisfies Record<string, Source>;

// ── 1997~2001 실제 정보 ───────────────────────────
const researched: CollectionInfo[] = [
  {
    slug: "ss-1997",
    year: 1997,
    season: "SS",
    city: "Paris",
    showDate: "1996-10",
    status: "verified",
    notes: {
      en: "Shown in Paris in October 1996. A dress from this collection is in the collection of The Metropolitan Museum of Art.",
      ko: "1996년 10월 파리에서 발표. 이 컬렉션의 드레스 한 점이 메트로폴리탄 미술관에 소장되어 있어요.",
    },
    sources: [S.ina, S.met],
  },
  {
    slug: "fw-1997",
    year: 1997,
    season: "FW",
    city: "Paris",
    status: "verified",
    notes: {
      en: "Shown in Paris. Show date not yet confirmed.",
      ko: "파리에서 발표. 쇼 날짜는 아직 확인하지 못했어요.",
    },
    sources: [S.ssense],
  },
  {
    slug: "ss-1998",
    year: 1998,
    season: "SS",
    city: "Paris",
    showDate: "1997-09-29",
    status: "verified",
    notes: {
      en: "One of the last collections Lang showed in Paris before moving to New York. WWD's archive captions give a different date, so the exact day is still to be checked.",
      ko: "뉴욕으로 옮기기 전 파리에서 마지막으로 발표한 컬렉션 중 하나. WWD 아카이브에는 날짜가 다르게 적혀 있어 정확한 날짜는 추가 확인이 필요해요.",
    },
    sources: [S.vogueSS98, S.wwdGallery],
  },
  {
    slug: "fw-1998",
    year: 1998,
    season: "FW",
    city: "Online",
    presentation: "online",
    showDate: "1998-03",
    lookCount: 81,
    status: "verified",
    notes: {
      en: "Lang cancelled the runway show and presented the collection online as 81 looks, with a CD-ROM sent to press and clients. Widely cited as the first online fashion show. It coincided with the company's move from Europe to New York.",
      ko: "런웨이 쇼를 취소하고 컬렉션 81룩을 온라인으로 공개했고, 언론과 바이어에게는 CD-ROM을 보냈어요. 최초의 온라인 패션쇼로 자주 언급돼요. 회사를 유럽에서 뉴욕으로 옮긴 시기와 겹칩니다.",
    },
    sources: [S.wwdOnline, S.hypebeast1998],
  },
  {
    slug: "ss-1999",
    year: 1999,
    season: "SS",
    city: "New York",
    showDate: "1998-09",
    status: "verified",
    notes: {
      en: "Shown in New York in September 1998, ahead of the European shows. The move led New York Fashion Week to open the season from then on.",
      ko: "1998년 9월, 유럽 컬렉션보다 먼저 뉴욕에서 발표. 이후 뉴욕 패션위크가 시즌의 첫 순서로 자리 잡는 계기가 됐어요.",
    },
    sources: [S.fit, S.hypebeastFacts],
  },
  {
    slug: "fw-1999",
    year: 1999,
    season: "FW",
    city: "New York",
    showDate: "1999-02-16",
    status: "verified",
    sources: [S.wwdGallery],
  },
  {
    slug: "ss-2000",
    year: 2000,
    season: "SS",
    city: "New York",
    status: "unconfirmed",
    notes: {
      en: "The collection is listed in runway archives, but the show date and venue have not been confirmed yet.",
      ko: "런웨이 아카이브에 컬렉션이 올라와 있지만, 쇼 날짜와 장소는 아직 확인하지 못했어요.",
    },
    sources: [S.firstview],
  },
  {
    slug: "fw-2000",
    year: 2000,
    season: "FW",
    city: "New York",
    status: "verified",
    notes: {
      en: "Shown in New York. Show date not yet confirmed.",
      ko: "뉴욕에서 발표. 쇼 날짜는 아직 확인하지 못했어요.",
    },
    sources: [S.ssense],
  },
  {
    slug: "ss-2001",
    year: 2001,
    season: "SS",
    city: "New York",
    showDate: "2000-09-20",
    status: "verified",
    notes: {
      en: "Titled “When Love Comes to Town”, a homage to Azzedine Alaïa, whose retrospective opened the same night at the Guggenheim SoHo.",
      ko: "“When Love Comes to Town”이라는 제목의 쇼. 같은 날 밤 구겐하임 소호에서 회고전을 연 아제딘 알라이아에게 바치는 오마주였어요.",
    },
    sources: [S.wwdGallery],
  },
  {
    slug: "fw-2001",
    year: 2001,
    season: "FW",
    city: "New York",
    showDate: "2001-02",
    status: "verified",
    notes: {
      en: "Shown in New York in mid-February 2001 (sources give 14 or 15 February).",
      ko: "2001년 2월 중순 뉴욕에서 발표 (출처에 따라 14일 또는 15일).",
    },
    sources: [S.wwdGallery, S.modelsFW01],
  },
];

// ── 나머지 연도: 샘플 ─────────────────────────────
function sample(year: number, season: SeasonCode): CollectionInfo {
  return {
    slug: `${season.toLowerCase()}-${year}`,
    year,
    season,
    // 대략적인 기준: 1997년까지 파리, 1998~2001 뉴욕, 2002년부터 다시 파리 (프라다 시기)
    city: year <= 1997 ? "Paris" : year <= 2001 ? "New York" : "Paris",
    status: "sample",
  };
}

const sampleYears = [1994, 1995, 1996, 2002, 2003, 2004];

export const helmutLang: BrandInfo = {
  slug: "helmut-lang",
  name: "Helmut Lang",
  description: {
    en: "Austrian designer Helmut Lang showed his first collection in Paris in 1986 and moved his base to New York in the late 1990s. His work defined 1990s minimalism: sharp tailoring, technical fabrics, and a stripped-back palette.",
    ko: "오스트리아 출신 디자이너 헬무트 랭은 1986년 파리에서 첫 컬렉션을 선보였고, 1990년대 후반 뉴욕으로 거점을 옮겼어요. 날카로운 테일러링, 기능성 소재, 절제된 색감으로 90년대 미니멀리즘을 대표하는 브랜드가 되었습니다.",
  },
  collections: [...researched, ...sampleYears.flatMap((y) => [sample(y, "SS"), sample(y, "FW")])].sort(
    (a, b) => b.year - a.year || (a.season === "FW" ? -1 : 1),
  ),
};
