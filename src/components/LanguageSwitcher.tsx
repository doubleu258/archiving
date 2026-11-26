"use client";
// 현재 보고 있는 페이지 그대로 언어만 바꿔주는 버튼 (/en/archive ↔ /ko/archive)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = { en: "EN", ko: "KO" };

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          aria-current={l === current ? "true" : undefined}
          className={`rounded px-2 py-1 ${
            l === current ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
        >
          {LABELS[l]}
        </Link>
      ))}
    </div>
  );
}
