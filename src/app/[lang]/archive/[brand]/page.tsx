// 브랜드 페이지: 연도별 컬렉션 목록 + 시즌 필터 (?season=FW)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CollectionList from "@/components/CollectionList";
import PageHeader from "@/components/PageHeader";
import SampleNotice from "@/components/SampleNotice";
import { getDictionary } from "@/dictionaries";
import { collectionCode, collectionTitle, getBrand, getBrands, seasonName, yearRange } from "@/lib/archive";
import { hasLocale, locales } from "@/lib/i18n";
import type { SeasonCode } from "@/lib/types";

type Props = PageProps<"/[lang]/archive/[brand]">;

// 빌드할 때 모든 브랜드 페이지를 미리 만들어둬요 (빠르게 열림)
export function generateStaticParams() {
  return locales.flatMap((lang) => getBrands().map((b) => ({ lang, brand: b.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  return b ? { title: b.name } : {};
}

export default async function BrandPage({ params }: Props) {
  const { lang, brand: brandSlug } = await params;
  if (!hasLocale(lang)) notFound();
  const brand = getBrand(brandSlug);
  if (!brand) notFound();
  const dict = getDictionary(lang);

  const seasons = [...new Set(brand.collections.map((c) => c.season))] as SeasonCode[];
  const hasUnverified = brand.collections.some((c) => !c.verified);
  const [from, to] = yearRange(brand);

  return (
    <>
      <Breadcrumbs items={[{ label: dict.archive.title, href: `/${lang}/archive` }, { label: brand.name }]} />
      <PageHeader
        title={brand.name}
        meta={`${from}–${to} · ${dict.archive.collectionsCount(brand.collections.length)}`}
        description={brand.description[lang]}
      />
      {hasUnverified && <SampleNotice badge={dict.archive.sampleBadge} text={dict.archive.sampleNotice} />}

      <CollectionList
        base={`/${lang}/archive/${brand.slug}`}
        seasons={seasons.map((s) => ({ code: s, name: seasonName(s, lang) }))}
        labels={{
          all: dict.archive.all,
          filter: dict.archive.filter,
          year: dict.archive.columns.year,
          collection: dict.archive.columns.collection,
          details: dict.archive.columns.details,
        }}
        items={brand.collections.map((c) => ({
          slug: c.slug,
          year: c.year,
          season: c.season,
          title: collectionTitle(c, lang),
          code: collectionCode(c),
          city: c.city,
          looks: dict.archive.looksCount(c.looks.length),
        }))}
      />
    </>
  );
}
