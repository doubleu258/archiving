// 한국어 문구. en.ts와 같은 구조여야 해요 (빠진 항목이 있으면 타입 오류로 알려줘요).
import type { Dictionary } from "./en";

const ko: Dictionary = {
  siteName: "Runway Archive",
  nav: { archive: "아카이브", identify: "피스 찾기" },
  home: {
    eyebrow: "개인 런웨이 아카이브",
    title: "이 옷, 어느 런웨이에서 왔을까.",
    subtitle:
      "브랜드·연도·시즌별로 런웨이 컬렉션을 둘러보거나, 가지고 있는 옷을 찍어서 어느 런웨이 룩에서 나왔는지 찾아보세요.",
    browseTitle: "아카이브 둘러보기",
    browseDesc: "브랜드, 연도, 시즌별 컬렉션을 룩 하나하나까지.",
    identifyTitle: "피스 찾기",
    identifyDesc: "옷 사진을 올리면 가장 비슷한 런웨이 룩을 찾아드려요.",
    brandsHeading: "브랜드",
  },
  archive: {
    title: "아카이브",
    subtitle: "브랜드를 선택해서 컬렉션을 확인하세요.",
    collectionsCount: (n: number) => `컬렉션 ${n}개`,
    looksCount: (n: number) => `${n}개 룩`,
    all: "전체",
    city: "도시",
    line: "라인",
    season: "시즌",
    showDate: "쇼 날짜",
    source: "출처",
    look: "룩",
    previous: "이전",
    next: "다음",
    backTo: (name: string) => `${name}(으)로 돌아가기`,
    categories: "이 룩의 피스",
    noImage: "아직 사진 없음",
    sampleBadge: "샘플",
    sampleNotice:
      "사이트를 만들기 위한 샘플 데이터예요. 룩 개수, 날짜, 사진은 임시값이며 실제 컬렉션 자료로 교체될 예정입니다.",
    lines: { menswear: "남성복", womenswear: "여성복", mixed: "남성·여성" },
  },
  identify: {
    title: "피스 찾기",
    subtitle: "가지고 있는 옷을 찍어서 올리면, 아카이브와 비교해 가장 비슷한 런웨이 룩을 보여드려요.",
    garmentPhoto: "옷 사진",
    garmentHint: "단색 배경에 펼쳐놓거나 걸어서 찍어주세요. JPG, PNG, HEIC.",
    labelPhoto: "라벨 사진 (선택)",
    labelHint: "메인 라벨이나 케어 라벨이 있으면 연대를 좁히는 데 도움이 돼요.",
    choose: "사진 선택",
    replace: "바꾸기",
    remove: "삭제",
    category: "어떤 종류의 옷인가요?",
    anyCategory: "잘 모르겠음",
    search: "비슷한 룩 찾기",
    comingSoon:
      "아직 매칭 기능은 준비 중이에요. 아카이브에 실제 런웨이 사진이 채워지면 3단계에서 연결됩니다.",
    tipsTitle: "더 정확하게 찾으려면",
    tips: [
      "옷 전체가 보이게, 앞면을, 자연광에서 찍어주세요.",
      "무늬 없는 벽이나 바닥 위에서 찍으면 옷이 잘 구분돼요.",
      "단추, 봉제선, 부자재처럼 특징적인 디테일도 가까이 찍어 추가해주세요.",
    ],
  },
  categories: {
    outerwear: "아우터",
    jacket: "재킷",
    shirt: "셔츠",
    top: "상의",
    knitwear: "니트",
    trousers: "팬츠",
    denim: "데님",
    skirt: "스커트",
    dress: "드레스",
    accessory: "액세서리",
  },
  footer: "비상업적 개인 아카이브입니다. 런웨이 사진의 권리는 각 권리자에게 있습니다.",
  notFound: { title: "페이지를 찾을 수 없어요", back: "아카이브로 가기" },
};

export default ko;
