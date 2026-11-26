// 컬렉션 페이지: 쇼 정보 + 전체 룩 목록

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LookImage from "@/components/LookImage";
import SampleNotice from "@/components/SampleNotice";
import { getDictionary } from "@/dictionaries";
import { collectionCode, collectionTitle, getBrand, getBrands, getCollection, seasonName } from "@/lib/archive";
import { hasLocale, locales } from "@/lib/i18n";

type Props = PageProps<"/[lang]/archive/[brand]/[collection]">;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getBrands().flatMap((b) => b.collections.map((c) => ({ lang, brand: b.slug, collection: c.slug }))),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, brand, collection } = await params;
  const b = getBrand(brand);
  const c = getCollection(brand, collection);
  return b && c && hasLocale(lang) ? { title: `${b.name} ${collectionTitle(c, lang)}` } : {};
}

export default async function CollectionPage({ params }: Props) {
  const { lang, brand: brandSlug, collection: collectionSlug } = await params;
  if (!hasLocale(lang)) notFound();
  const brand = getBrand(brandSlug);
  const collection = getCollection(brandSlug, collectionSlug);
  if (!brand || !collection) notFound();
  const dict = getDictionary(lang);
  const base = `/${lang}/archive/${brand.slug}/${collection.slug}`;

  const facts: [string, string][] = [
    [dict.archive.season, seasonName(collection.season, lang)],
    [dict.archive.city, collection.city],
    [dict.archive.line, dict.archive.lines[collection.line]],
  ];
  if (collection.showDate) facts.push([dict.archive.showDate, collection.showDate]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: dict.archive.title, href: `/${lang}/archive` },
          { label: brand.name, href: `/${lang}/archive/${brand.slug}` },
          { label: collectionCode(collection) },
        ]}
      />

      <header className="space-y-4">
        <div>
          <p className="text-sm text-muted">{brand.name}</p>
          <h1 className="text-4xl font-semibold tracking-tight">{collectionTitle(collection, lang)}</h1>
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          {collection.sourceUrl && (
            <div className="flex gap-2">
              <dt className="text-muted">{dict.archive.source}</dt>
              <dd>
                <a href={collection.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {new URL(collection.sourceUrl).hostname}
                </a>
              </dd>
            </div>
          )}
        </dl>
        {collection.notes && <p className="max-w-3xl leading-relaxed text-muted">{collection.notes[lang]}</p>}
      </header>

      {!collection.verified && <SampleNotice badge={dict.archive.sampleBadge} text={dict.archive.sampleNotice} />}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {collection.looks.map((look, i) => (
          <li key={look.number}>
            <Link href={`${base}/${look.number}`} className="group block space-y-2">
              <div className="transition-opacity group-hover:opacity-80">
                <LookImage
                  src={look.image}
                  alt={`${brand.name} ${collectionCode(collection)} ${dict.archive.look} ${look.number}`}
                  label={`${dict.archive.look.toUpperCase()} ${String(look.number).padStart(2, "0")}`}
                  emptyText={dict.archive.noImage}
                  priority={i < 4}
                />
              </div>
              <p className="font-mono text-xs text-muted">
                {dict.archive.look} {look.number}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
