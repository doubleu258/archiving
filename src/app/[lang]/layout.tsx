// 모든 페이지에 공통으로 들어가는 틀: 상단 메뉴 + 하단 문구

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 whitespace-nowrap px-4 sm:px-6">
            <Link href={`/${lang}`} aria-label={dict.siteName} className="text-sm font-semibold uppercase tracking-[0.2em]">
              {/* 작은 화면에서는 짧은 로고 */}
              <span className="sm:hidden" aria-hidden="true">R/A</span>
              <span className="hidden sm:inline">{dict.siteName}</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm sm:gap-5">
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
