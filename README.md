# Runway Archive

브랜드별 런웨이 컬렉션을 연도·시즌·룩 단위로 둘러보고, 가지고 있는 옷 사진으로 어느 런웨이 룩에서 나온 피스인지 찾는 웹사이트입니다. 영어(기본)와 한국어를 지원합니다.

현재 상태: **1단계 완료** (아카이브 둘러보기 + 피스 찾기 화면). 데이터는 헬무트 랭 **샘플 데이터**입니다.

---

## Mac에서 실행하기

### 처음 한 번만: 준비물 설치

1. **터미널 열기**: `Cmd + Space` → "터미널" 입력 → Enter
2. **Homebrew 설치** (Mac용 프로그램 설치 도구). https://brew.sh 에 있는 명령어를 터미널에 붙여넣고 Enter
3. **Node.js와 Git 설치**:
   ```bash
   brew install node git
   ```
4. **코드 내려받기** (GitHub 저장소 주소는 본인 것으로):
   ```bash
   git clone https://github.com/<내-아이디>/runway-archive.git
   cd runway-archive
   npm install
   ```

### 매번: 사이트 띄우기

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 됩니다. 코드를 고치면 화면이 자동으로 새로고침돼요. 끌 때는 터미널에서 `Ctrl + C`.

> 코드 편집기는 [VS Code](https://code.visualstudio.com/)를 추천해요.

---

## 폴더 구조

```
src/
├── app/[lang]/            페이지 (주소 구조 그대로)
│   ├── page.tsx           홈                       /en
│   ├── archive/           브랜드 목록              /en/archive
│   │   └── [brand]/       브랜드 (연도별 컬렉션)   /en/archive/helmut-lang
│   │       └── [collection]/          컬렉션       /en/archive/helmut-lang/fw-1998
│   │           └── [look]/            룩 상세      /en/archive/helmut-lang/fw-1998/3
│   └── identify/          피스 찾기                /en/identify
├── components/            여러 페이지에서 같이 쓰는 화면 조각
├── data/helmut-lang.ts    컬렉션 데이터 (지금은 샘플)
├── dictionaries/          영어(en.ts) / 한국어(ko.ts) 문구
├── lib/
│   ├── types.ts           데이터 구조 정의
│   ├── archive.ts         데이터 꺼내 쓰는 함수
│   └── i18n.ts            언어 설정
└── proxy.ts               주소에 언어가 없으면 /en 또는 /ko 붙여주기
```

자주 할 일:
- **문구 바꾸기**: `src/dictionaries/en.ts`, `ko.ts`
- **컬렉션 데이터 고치기**: `src/data/helmut-lang.ts`
- **룩 사진 넣기**: 아래 "런웨이 사진 넣기" 참고

---

## 런웨이 사진 넣기

사진은 **내 컴퓨터에만** 두고 GitHub에는 올리지 않아요(`.gitignore`로 막혀 있음). 런웨이 사진은 저작권이 촬영자와 매체에 있기 때문이에요.

1. 시즌별 빈 폴더 만들기 (처음 한 번):
   ```bash
   npm run import-photos -- --init
   ```
   `archive-photos/helmut-lang/1998-fw/` 같은 폴더가 생겨요.
2. 각 폴더에 그 시즌 사진을 저장해요. **파일 이름 앞의 숫자가 룩 번호**가 돼요 (`01.jpg`, `02.jpg` …). 숫자가 없으면 이름순으로 번호를 붙여요. JPG, PNG, WEBP, 아이폰 HEIC(자동으로 JPG 변환) 모두 돼요.
3. 사이트에 연결:
   ```bash
   npm run import-photos
   ```
4. 브라우저를 새로고침하면 컬렉션 페이지에 사진이 보여요.

사진을 지우거나 바꾼 뒤에는 3번을 다시 실행하면 돼요. 폴더 이름은 `1998-fw`, `fw-1998`, `FW98` 모두 인식해요.

---

## 로드맵

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | 아카이브 둘러보기 사이트 (브랜드 → 연도 → 시즌 → 룩), 영어/한국어 | ✅ |
| 2 | 헬무트 랭 컬렉션 자료: 1997~2001 정보 정리 ✅, 사진 가져오기 도구 ✅, 나머지 연도 조사 ⏳ | ⏳ |
| 3 | 사진 검색: 업로드 → 배경 제거 → AI(CLIP) 유사도 비교 → 후보 룩 Top 10 | |
| 4 | 내 옷장: 찾은 피스 저장 | |
| 5 | 배포 (Vercel + Supabase), 로그인 | |
| 6 | 출시 준비: 사진 저작권 처리, 브랜드 추가, 앱 검토 | |

## 참고

- 개인적, 비상업적 용도의 아카이브입니다. 런웨이 사진의 권리는 각 권리자에게 있습니다.
- 공개 출시 전에는 사진 사용 방식을 다시 정해야 합니다(6단계).
- 기술 스택: Next.js 16, TypeScript, Tailwind CSS 4
