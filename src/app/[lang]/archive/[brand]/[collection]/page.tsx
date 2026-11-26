// 컬렉션 페이지: 쇼 정보 + 출처 + 룩 사진 목록

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LookImage from "@/components/LookImage";
import PageHeader from "@/components/PageHeader";
import SampleNotice from "@/components/SampleNotice";
import { getDictionary } from "@/dictionaries";
import {
  collectionCode,
  collectionTitle,
  formatShowDate,
  getBrand,
  getBrands,
  getCollection,
  placeName,
  seasonName,
} from "@/lib/archive";
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
  const a = dict.archive;
  const base = `/${lang}/archive/${brand.slug}/${collection.slug}`;
  const code = collectionCode(collection);
  const photoCount = collection.looks.length;

  const facts: [string, React.ReactNode][] = [
    [a.season, seasonName(collection.season, lang)],
    [a.city, placeName(collection, a.online)],
    [a.showDate, collection.showDate ? formatShowDate(collection.showDate, lang) : "—"],
    [a.look, collection.lookCount ? a.looksKnown(collection.lookCount) : "—"],
  ];
  if (collection.line) facts.push([a.line, a.lines[collection.line]]);

  const meta = [code, photoCount ? a.photosCount(photoCount) : null].filter(Boolean).join(" · ");

  return (
    <>
      <Breadcrumbs
        items={[
          { label: a.title, href: `/${lang}/archive` },
          { label: brand.name, href: `/${lang}/archive/${brand.slug}` },
          { label: code },
        ]}
      />
      <PageHeader
        title={`${brand.name} — ${collectionTitle(collection, lang)}`}
        meta={meta}
        description={collection.notes?.[lang]}
      />

      {/* 쇼 정보: 1px 선으로 나뉜 칸 */}
      <dl className="archive-grid m-0 grid-cols-2 border-l-0 border-t-0 sm:grid-cols-4 [&>*:nth-child(4n)]:sm:border-r-0">
        {facts.map(([k, v]) => (
          <div key={k} className="space-y-1 px-[20px] py-3">
            <dt className="archive-meta">{k}</dt>
            <dd className="m-0">{v}</dd>
          </div>
        ))}
      </dl>

      {/* 출처 */}
      {collection.sources && collection.sources.length > 0 && (
        <div className="archive-row grid-cols-[64px_1fr] hover:bg-transparent">
          <span className="archive-meta">{a.sources}</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {collection.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="archive-link">
                {s.name} ↗
              </a>
            ))}
          </span>
        </div>
      )}

      {collection.status === "sample" && <SampleNotice badge={a.sampleBadge} text={a.sampleNotice} />}
      {collection.status === "unconfirmed" && <SampleNotice badge={a.unconfirmedBadge} text={a.unconfirmedNotice} />}

      {/* 룩 사진 */}
      {photoCount === 0 ? (
        <div className="mt-10 border-y border-line px-[20px] py-8">
          <p className="m-0 font-medium">{a.noPhotosTitle}</p>
          <p className="archive-body mt-1 max-w-[560px]">
            {a.noPhotosHow(`${brand.slug}/${collection.year}-${collection.season.toLowerCase()}`)}
          </p>
        </div>
      ) : (
        <ul className="archive-grid m-0 mt-10 list-none grid-cols-2 border-l-0 p-0 sm:grid-cols-3 lg:grid-cols-6">
          {collection.looks.map((look, i) => (
            <li key={look.number}>
              <Link href={`${base}/${look.number}`} className="group block hover:bg-surface">
                <div className="p-3 transition-opacity group-hover:opacity-80">
                  <LookImage
                    src={look.image}
                    alt={`${brand.name} ${code} ${a.look} ${look.number}`}
                    label={`${code} / ${String(look.number).padStart(2, "0")}`}
                    emptyText={a.noImage}
                    priority={i < 6}
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2 border-t border-line px-3 py-2">
                  <span className="archive-index text-primary">
                    {a.look} {String(look.number).padStart(2, "0")}
                  </span>
                  {look.categories.length > 0 && (
                    <span className="archive-caption truncate">
                      {look.categories.map((c) => dict.categories[c]).join(" · ")}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
