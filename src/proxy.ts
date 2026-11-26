// 주소에 언어(/en, /ko)가 없으면 브라우저 언어를 보고 자동으로 붙여줘요.
// 예: /archive → 한국어 브라우저면 /ko/archive, 그 외는 /en/archive

import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/i18n";

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  // "ko-KR,ko;q=0.9,en;q=0.8" → ["ko", "ko", "en"]
  const langs = header.split(",").map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  return langs.find(hasLocale) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLang = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLang) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // 내부 파일(_next), 이미지 같은 정적 파일은 건너뛰기
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
