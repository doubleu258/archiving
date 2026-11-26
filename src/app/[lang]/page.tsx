// 첫 화면 (홈)

import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { getBrands, yearRange } from "@/lib/archive";
import { hasLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const brands = getBrands();

  return (
    <div className="space-y-16">
      <section className="max-w-2xl space-y-4 pt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">{dict.home.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{dict.home.title}</h1>
        <p className="text-base leading-relaxed text-muted">{dict.home.subtitle}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href={`/${lang}/archive`} className="group border border-line p-6 transition-colors hover:border-foreground">
          <h2 className="text-lg font-medium">{dict.home.browseTitle} →</h2>
          <p className="mt-2 text-sm text-muted">{dict.home.browseDesc}</p>
        </Link>
        <Link href={`/${lang}/identify`} className="group border border-line p-6 transition-colors hover:border-foreground">
          <h2 className="text-lg font-medium">{dict.home.identifyTitle} →</h2>
          <p className="mt-2 text-sm text-muted">{dict.home.identifyDesc}</p>
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">{dict.home.brandsHeading}</h2>
        <ul className="divide-y divide-line border-y border-line">
          {brands.map((b) => {
            const [from, to] = yearRange(b);
            return (
              <li key={b.slug}>
                <Link href={`/${lang}/archive/${b.slug}`} className="flex items-baseline justify-between py-4 hover:opacity-70">
                  <span className="text-xl font-medium">{b.name}</span>
                  <span className="font-mono text-xs text-muted">
                    {from}–{to} · {dict.archive.collectionsCount(b.collections.length)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
