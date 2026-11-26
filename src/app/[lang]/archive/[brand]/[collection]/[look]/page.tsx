// 룩 상세 페이지: 큰 사진 + 사양 표 + 이전/다음 룩

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LookImage from "@/components/LookImage";
import PageHeader from "@/components/PageHeader";
import { getDictionary } from "@/dictionaries";
import { adjacentLooks, collectionCode, collectionTitle, getBrand, getBrands, getCollection, getLook, placeName } from "@/lib/archive";
import { hasLocale, locales } from "@/lib/i18n";

type Props = PageProps<"/[lang]/archive/[brand]/[collection]/[look]">;

export function generateStaticParams() {
  const params = locales.flatMap((lang) =>
    getBrands().flatMap((b) =>
      b.collections.flatMap((c) =>
        c.looks.map((l) => ({ lang, brand: b.slug, collection: c.slug, look: String(l.number) })),
      ),
    ),
  );
  // 사진이 하나도 없을 때도 빌드가 되도록 자리표시 하나 (열면 404)
  return params.length > 0 ? params : [{ lang: "en", brand: "helmut-lang", collection: "fw-1998", look: "1" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, brand, collection, look } = await params;
  const b = getBrand(brand);
  const c = getCollection(brand, collection);
  if (!b || !c || !hasLocale(lang)) return {};
  return { title: `${b.name} ${collectionCode(c)} · ${getDictionary(lang).archive.look} ${look}` };
}

export default async function LookPage({ params }: Props) {
  const { lang, brand: brandSlug, collection: collectionSlug, look: lookParam } = await params;
  if (!hasLocale(lang)) notFound();
  const brand = getBrand(brandSlug);
  const collection = getCollection(brandSlug, collectionSlug);
  const look = collection && getLook(collection, Number(lookParam));
  if (!brand || !collection || !look) notFound();
  const dict = getDictionary(lang);

  const base = `/${lang}/archive/${brand.slug}/${collection.slug}`;
  const code = collectionCode(collection);
  const num = String(look.number).padStart(2, "0");
  const [prev, next] = adjacentLooks(collection, look);

  const specs: [string, React.ReactNode][] = [
    [dict.archive.brand, brand.name],
    [dict.archive.collection, <Link key="c" href={base} className="archive-link">{collectionTitle(collection, lang)}</Link>],
    [dict.archive.city, placeName(collection, dict.archive.online)],
  ];
  if (collection.line) specs.push([dict.archive.line, dict.archive.lines[collection.line]]);
  if (look.categories.length > 0) specs.push(
    [
      dict.archive.categories,
      <span key="t" className="flex flex-wrap gap-1.5">
        {look.categories.map((cat) => (
          <span key={cat} className="archive-tag">
            {dict.categories[cat]}
          </span>
        ))}
      </span>,
    ],
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { label: dict.archive.title, href: `/${lang}/archive` },
          { label: brand.name, href: `/${lang}/archive/${brand.slug}` },
          { label: code, href: base },
          { label: `${dict.archive.look} ${look.number}` },
        ]}
      />
      <PageHeader
        title={`${dict.archive.look} ${num}`}
        meta={`${code} · ${num} / ${String(collection.looks.length).padStart(2, "0")}`}
      />

      <div className="grid md:grid-cols-[minmax(0,440px)_1fr]">
        <div className="border-b border-line p-[20px] md:border-b-0 md:border-r">
          <LookImage
            src={look.image}
            alt={`${brand.name} ${code} ${dict.archive.look} ${look.number}`}
            label={`${code} / ${num}`}
            emptyText={dict.archive.noImage}
            priority
          />
        </div>

        <div>
          {look.description && (
            <div className="border-b border-line px-[20px] py-4">
              <p className="archive-body">{look.description[lang]}</p>
            </div>
          )}

          {/* 사양 표 */}
          <dl className="m-0">
            {specs.map(([k, v]) => (
              <div key={k} className="archive-row grid-cols-[120px_1fr] hover:bg-transparent">
                <dt className="archive-meta">{k}</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </dl>

          {/* 이전 / 다음 */}
          <nav className="grid grid-cols-2 border-b border-line">
            {prev ? (
              <Link href={`${base}/${prev.number}`} className="archive-meta border-r border-line px-[20px] py-3 hover:bg-surface hover:text-primary">
                ← {dict.archive.previous} · {String(prev.number).padStart(2, "0")}
              </Link>
            ) : (
              <span className="border-r border-line" />
            )}
            {next ? (
              <Link href={`${base}/${next.number}`} className="archive-meta px-[20px] py-3 text-right hover:bg-surface hover:text-primary">
                {String(next.number).padStart(2, "0")} · {dict.archive.next} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
