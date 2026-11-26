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
    <div className="archive-meta flex items-baseline gap-1.5">
      {locales.map((l, i) => (
        <span key={l} className="flex items-baseline gap-1.5">
          {i > 0 && <span aria-hidden="true">/</span>}
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            aria-current={l === current ? "true" : undefined}
            className={l === current ? "text-primary" : "hover:text-primary"}
          >
            {LABELS[l]}
          </Link>
        </span>
      ))}
    </div>
  );
}
