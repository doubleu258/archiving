// 모든 페이지에 공통으로 들어가는 틀: 상단 메뉴 + 하단 문구

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archivo_Narrow, Geist, Geist_Mono } from "next/font/google";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// 로고 전용 폰트 (.hl-logo 에서 사용)
const archivoNarrow = Archivo_Narrow({ variable: "--font-archivo-narrow", subsets: ["latin"], weight: "700" });

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
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} ${archivoNarrow.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 whitespace-nowrap px-3 min-[360px]:px-4 sm:px-6">
            <Link href={`/${lang}`} className="hl-logo">
              {dict.siteName}
            </Link>
            <nav className="flex items-center gap-2.5 text-[13px] sm:gap-5 sm:text-sm">
              <Link href={`/${lang}/archive`} className="text-muted hover:text-foreground">
                {dict.nav.archive}
              </Link>
              <Link href={`/${lang}/identify`} className="text-muted hover:text-foreground">
                {dict.nav.identify}
              </Link>
              <LanguageSwitcher current={lang} />
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>

        <footer className="border-t border-line">
          <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">{dict.footer}</p>
        </footer>
      </body>
    </html>
  );
}
