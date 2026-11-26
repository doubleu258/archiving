// 아카이브: 브랜드 목록

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { getBrands, yearRange } from "@/lib/archive";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/archive">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).archive.title } : {};
}

export default async function ArchivePage({ params }: PageProps<"/[lang]/archive">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{dict.archive.title}</h1>
        <p className="text-muted">{dict.archive.subtitle}</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getBrands().map((b) => {
          const [from, to] = yearRange(b);
          return (
            <li key={b.slug}>
              <Link
                href={`/${lang}/archive/${b.slug}`}
                className="block h-full border border-line p-6 transition-colors hover:border-foreground"
              >
                <h2 className="text-xl font-medium">{b.name}</h2>
                <p className="mt-1 font-mono text-xs text-muted">
                  {from}–{to} · {dict.archive.collectionsCount(b.collections.length)}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{b.description[lang]}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
