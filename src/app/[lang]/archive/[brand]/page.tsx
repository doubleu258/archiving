// 브랜드 페이지: 연도별 컬렉션 목록 + 시즌 필터 (?season=FW)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CollectionList from "@/components/CollectionList";
import SampleNotice from "@/components/SampleNotice";
import { getDictionary } from "@/dictionaries";
import { collectionCode, collectionTitle, getBrand, getBrands, seasonName } from "@/lib/archive";
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

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: dict.archive.title, href: `/${lang}/archive` }, { label: brand.name }]} />

      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{brand.name}</h1>
        <p className="leading-relaxed text-muted">{brand.description[lang]}</p>
      </header>

      {hasUnverified && <SampleNotice badge={dict.archive.sampleBadge} text={dict.archive.sampleNotice} />}

      <CollectionList
        base={`/${lang}/archive/${brand.slug}`}
        seasons={seasons.map((s) => ({ code: s, name: seasonName(s, lang) }))}
        allLabel={dict.archive.all}
        filterLabel={dict.archive.season}
        emptyImageText={dict.archive.noImage}
        items={brand.collections.map((c) => ({
          slug: c.slug,
          year: c.year,
          season: c.season,
          title: collectionTitle(c, lang),
          code: collectionCode(c),
          meta: `${c.city} · ${dict.archive.looksCount(c.looks.length)}`,
          image: c.looks[0]?.image,
        }))}
      />
    </div>
  );
}
