// 첫 화면 (홈)

import Link from "next/link";
import { notFound } from "next/navigation";
import { ColumnHeader, SectionHeader } from "@/components/PageHeader";
import { getDictionary } from "@/dictionaries";
import { getBrands, yearRange } from "@/lib/archive";
import { hasLocale } from "@/lib/i18n";

const pad = (n: number) => String(n).padStart(2, "0");

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const brands = getBrands();

  const sections = [
    { href: `/${lang}/archive`, title: dict.home.browseTitle, desc: dict.home.browseDesc },
    { href: `/${lang}/identify`, title: dict.home.identifyTitle, desc: dict.home.identifyDesc },
  ];

  return (
    <>
      <section className="space-y-3 border-b border-line px-[20px] pb-10 pt-12">
        <p className="archive-meta">{dict.home.eyebrow}</p>
        <h1 className="archive-title">{dict.home.title}</h1>
        <p className="archive-body max-w-[520px]">{dict.home.subtitle}</p>
      </section>

      <SectionHeader label={dict.home.indexHeading} meta={pad(sections.length)} />
      {sections.map((s, i) => (
        <Link key={s.href} href={s.href} className="archive-row">
          <span className="archive-index">{pad(i + 1)}</span>
          <span className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="font-medium">{s.title}</span>
            <span className="archive-body">{s.desc}</span>
          </span>
          <span className="archive-meta" aria-hidden="true">
            →
          </span>
        </Link>
      ))}

      <SectionHeader label={dict.home.brandsHeading} meta={pad(brands.length)} />
      <ColumnHeader cols={[dict.archive.columns.no, dict.archive.columns.brand, dict.archive.columns.details]} />
      {brands.map((b, i) => {
        const [from, to] = yearRange(b);
        return (
          <Link key={b.slug} href={`/${lang}/archive/${b.slug}`} className="archive-row">
            <span className="archive-index">{pad(i + 1)}</span>
            <span className="font-medium">{b.name}</span>
            <span className="archive-meta text-right">
              {from}–{to} · {dict.archive.collectionsCount(b.collections.length)}
            </span>
          </Link>
        );
      })}
    </>
  );
}
