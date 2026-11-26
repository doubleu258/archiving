#!/usr/bin/env node
// 사진 가져오기 도구
//
// 사용법
//   npm run import-photos            archive-photos 폴더의 사진을 사이트에 연결
//   npm run import-photos -- --init  시즌별 빈 폴더를 미리 만들어줌
//
// 폴더 구조
//   archive-photos/
//     helmut-lang/          ← 브랜드 (src/data/<브랜드>.ts 파일 이름과 같게)
//       1998-fw/            ← 연도-시즌 (fw-1998, FW98 도 인식해요)
//         01.jpg            ← 파일 이름 앞의 숫자 = 룩 번호
//         02.jpg
//
// 파일 이름에 숫자가 없으면 이름순으로 1, 2, 3… 번호를 붙여요.
// 결과:
//   public/looks/…               사이트에서 쓰는 사진 복사본
//   src/data/photos.local.json   어떤 컬렉션에 어떤 사진이 있는지 목록
// 세 곳 모두 GitHub에 올라가지 않아요 (.gitignore).

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "archive-photos");
const OUT = path.join(ROOT, "public", "looks");
const MANIFEST = path.join(ROOT, "src", "data", "photos.local.json");
const DATA_DIR = path.join(ROOT, "src", "data");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const HEIC_EXT = new Set([".heic", ".heif"]);

const log = (...a) => console.log(...a);
const warn = (...a) => console.warn("  ⚠️ ", ...a);

/** "1998-fw" | "fw-1998" | "FW98" | "1998 FW" → "fw-1998" */
function parseSeasonFolder(name) {
  const s = name.toLowerCase();
  let m = s.match(/^(\d{4})[-_ ]?(ss|fw|pf|rs)$/);
  if (m) return `${m[2]}-${m[1]}`;
  m = s.match(/^(ss|fw|pf|rs)[-_ ]?(\d{4}|\d{2})$/);
  if (m) {
    const y = m[2].length === 2 ? (Number(m[2]) >= 50 ? `19${m[2]}` : `20${m[2]}`) : m[2];
    return `${m[1]}-${y}`;
  }
  return null;
}

/** 이름순 정렬 (2.jpg 가 10.jpg 보다 앞에 오도록) */
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

function listDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".")).map((d) => d.name);
}

/** src/data/<brand>.ts 에서 컬렉션 slug 목록 읽기 (예: "fw-1998") */
function knownCollections() {
  const map = {};
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const brand = file.replace(/\.ts$/, "");
    const text = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    map[brand] = [...text.matchAll(/slug: "((?:ss|fw|pf|rs)-\d{4})"/g)].map((m) => m[1]);
  }
  return map;
}

// ── --init: 빈 폴더 만들기 ─────────────────────────
if (process.argv.includes("--init")) {
  const known = knownCollections();
  let made = 0;
  for (const [brand, slugs] of Object.entries(known)) {
    for (const slug of slugs) {
      const [season, year] = slug.split("-");
      const dir = path.join(SRC, brand, `${year}-${season}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        made++;
      }
    }
  }
  log(`📁 archive-photos 아래에 시즌 폴더 ${made}개를 만들었어요.`);
  log(`   사진을 넣은 뒤 \`npm run import-photos\` 를 실행하세요.`);
  process.exit(0);
}

// ── 가져오기 ──────────────────────────────────────
if (!fs.existsSync(SRC)) {
  log("archive-photos 폴더가 없어요. 먼저 `npm run import-photos -- --init` 으로 폴더를 만들어주세요.");
  process.exit(1);
}

const known = knownCollections();
const manifest = {};
let total = 0;

// 이전 결과를 지우고 새로 만들어요 (폴더에서 지운 사진이 사이트에도 반영되도록)
fs.rmSync(OUT, { recursive: true, force: true });

for (const brand of listDirs(SRC).sort(natural)) {
  if (!known[brand]) {
    warn(`"${brand}" 브랜드 정보가 src/data 에 없어서 건너뛰어요.`);
    continue;
  }
  for (const folder of listDirs(path.join(SRC, brand)).sort(natural)) {
    const slug = parseSeasonFolder(folder);
    if (!slug) {
      warn(`${brand}/${folder}: 폴더 이름을 "1998-fw" 형식으로 바꿔주세요. 건너뜀.`);
      continue;
    }
    if (!known[brand].includes(slug)) {
      log(`  ${brand}/${folder}: ${slug} 는 아직 조사 전(샘플) 시즌이에요.`);
    }

    const dir = path.join(SRC, brand, folder);
    const files = fs
      .readdirSync(dir)
      .filter((f) => !f.startsWith(".") && (IMAGE_EXT.has(path.extname(f).toLowerCase()) || HEIC_EXT.has(path.extname(f).toLowerCase())))
      .sort(natural);
    if (files.length === 0) continue;

    // 룩 번호 정하기: 모든 파일 이름이 숫자로 시작하고 겹치지 않으면 그 숫자, 아니면 이름순
    const leading = files.map((f) => f.match(/^(\d+)/)?.[1]).map((n) => (n ? Number(n) : null));
    const useLeading = leading.every((n) => n !== null && n > 0) && new Set(leading).size === leading.length;
    if (!useLeading) log(`  ${brand}/${folder}: 파일 이름순으로 룩 번호를 붙여요.`);

    const outDir = path.join(OUT, brand, slug);
    fs.mkdirSync(outDir, { recursive: true });
    const looks = [];

    files.forEach((file, i) => {
      const number = useLeading ? leading[i] : i + 1;
      const ext = path.extname(file).toLowerCase();
      const base = String(number).padStart(2, "0");
      const from = path.join(dir, file);

      if (HEIC_EXT.has(ext)) {
        // 아이폰 HEIC 사진 → JPG (Mac 기본 프로그램 sips 사용)
        const to = path.join(outDir, `${base}.jpg`);
        try {
          execFileSync("sips", ["-s", "format", "jpeg", from, "--out", to], { stdio: "ignore" });
          looks.push({ number, image: `/looks/${brand}/${slug}/${base}.jpg` });
        } catch {
          warn(`${brand}/${folder}/${file}: HEIC 변환 실패 (Mac에서 실행하거나 JPG로 저장해주세요).`);
        }
        return;
      }

      const outExt = ext === ".jpeg" ? ".jpg" : ext;
      fs.copyFileSync(from, path.join(outDir, `${base}${outExt}`));
      looks.push({ number, image: `/looks/${brand}/${slug}/${base}${outExt}` });
    });

    looks.sort((a, b) => a.number - b.number);
    manifest[`${brand}/${slug}`] = looks;
    total += looks.length;
    log(`  ✓ ${brand}/${slug}: 사진 ${looks.length}장`);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
log(`\n완료: 컬렉션 ${Object.keys(manifest).length}개, 사진 ${total}장을 연결했어요.`);
log("사이트가 켜져 있다면 브라우저를 새로고침하세요.");
