// 룩 상세 페이지: 큰 사진 + 피스 정보 + 이전/다음 룩

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LookImage from "@/components/LookImage";
import { getDictionary } from "@/dictionaries";
import { collectionCode, collectionTitle, getBrand, getBrands, getCollection, getLook } from "@/lib/archive";
import { hasLocale, locales } from "@/lib/i18n";

type Props = PageProps<"/[lang]/archive/[brand]/[collection]/[look]">;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getBrands().flatMap((b) =>
      b.collections.flatMap((c) =>
        c.looks.map((l) => ({ lang, brand: b.slug, collection: c.slug, look: String(l.number) })),
      ),
    ),
  );
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
  const prev = getLook(collection, look.number - 1);
  const next = getLook(collection, look.number + 1);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: dict.archive.title, href: `/${lang}/archive` },
          { label: brand.name, href: `/${lang}/archive/${brand.slug}` },
          { label: collectionCode(collection), href: base },
          { label: `${dict.archive.look} ${look.number}` },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
        <LookImage
          src={look.image}
          alt={`${brand.name} ${collectionCode(collection)} ${dict.archive.look} ${look.number}`}
          label={`${dict.archive.look.toUpperCase()} ${String(look.number).padStart(2, "0")}`}
          emptyText={dict.archive.noImage}
          priority
        />

        <div className="space-y-6">
          <header>
            <p className="text-sm text-muted">
              {brand.name} · {collectionTitle(collection, lang)} · {collection.city}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {dict.archive.look} {look.number}
              <span className="ml-2 text-base font-normal text-muted">/ {collection.looks.length}</span>
            </h1>
          </header>

          {look.description && <p className="leading-relaxed">{look.description[lang]}</p>}

          <section className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">{dict.archive.categories}</h2>
            <ul className="flex flex-wrap gap-2">
              {look.categories.map((cat) => (
                <li key={cat} className="rounded-full border border-line px-3 py-1 text-sm">
                  {dict.categories[cat]}
                </li>
              ))}
            </ul>
          </section>

          <nav className="flex gap-2 pt-4">
            {prev ? (
              <Link href={`${base}/${prev.number}`} className="border border-line px-4 py-2 text-sm hover:border-foreground">
                ← {dict.archive.previous}
              </Link>
            ) : null}
            {next ? (
              <Link href={`${base}/${next.number}`} className="border border-line px-4 py-2 text-sm hover:border-foreground">
                {dict.archive.next} →
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
