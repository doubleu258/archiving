// 모든 페이지에 공통으로 들어가는 틀 (일반 웹사이트의 index.html 역할)
// 폰트 링크, 상단 헤더, 하단 푸터가 여기 있어요.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

// Google Fonts: next/font가 빌드할 때 내려받아 사이트에 같이 올려요 (외부 요청 없음, 깜빡임 없음)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: dict.siteName, template: `%s · ${dict.siteName}` },
    description: dict.home.subtitle,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${archivo.variable} ${plexMono.variable} h-full`}>
      <head>
        {/* Pretendard (한글): Google Fonts에 없어서 CDN 링크로 불러와요 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/* 아주 좁은 폰(380px 미만)에서는 메뉴가 로고 아래 줄로 내려가요 */}
        <header className="archive-header sticky top-0 z-10 flex-wrap gap-x-4 gap-y-2 whitespace-nowrap bg-page">
          <Link href={`/${lang}`} className="hl-brand">
            {dict.siteName}
          </Link>
          <nav className="flex items-baseline gap-4 max-[379px]:w-full max-[379px]:justify-between sm:gap-6">
            <Link href={`/${lang}/archive`} className="archive-meta hover:text-primary">
              {dict.nav.archive}
            </Link>
            <Link href={`/${lang}/identify`} className="archive-meta hover:text-primary">
              {dict.nav.identify}
            </Link>
            <LanguageSwitcher current={lang} />
          </nav>
        </header>

        <main className="w-full flex-1">{children}</main>

        <footer className="flex flex-wrap justify-between gap-2 border-t border-line px-[20px] py-3">
          <span className="archive-caption">{dict.siteName}</span>
          <span className="archive-caption normal-case">{dict.footer}</span>
        </footer>
      </body>
    </html>
  );
}
