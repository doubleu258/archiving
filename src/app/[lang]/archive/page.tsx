// 아카이브: 브랜드 목록

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader, { ColumnHeader } from "@/components/PageHeader";
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
  const brands = getBrands();

  return (
    <>
      <PageHeader
        title={dict.archive.title}
        meta={String(brands.length).padStart(2, "0")}
        description={dict.archive.subtitle}
      />
      <ColumnHeader cols={[dict.archive.columns.no, dict.archive.columns.brand, dict.archive.columns.details]} />
      {brands.map((b, i) => {
        const [from, to] = yearRange(b);
        return (
          <Link key={b.slug} href={`/${lang}/archive/${b.slug}`} className="archive-row">
            <span className="archive-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-medium">{b.name}</span>
              <span className="archive-body line-clamp-2 max-w-[640px]">{b.description[lang]}</span>
            </span>
            <span className="archive-meta text-right">
              {from}–{to}
              <br />
              {dict.archive.collectionsCount(b.collections.length)}
            </span>
          </Link>
        );
      })}
    </>
  );
}
