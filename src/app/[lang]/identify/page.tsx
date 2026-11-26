// 피스 찾기 페이지

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IdentifyForm from "@/components/IdentifyForm";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/identify">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).identify.title } : {};
}

export default async function IdentifyPage({ params }: PageProps<"/[lang]/identify">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.identify;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
          <p className="max-w-xl text-muted">{t.subtitle}</p>
        </header>
        <IdentifyForm texts={t} categories={dict.categories} />
      </div>

      <aside className="h-fit space-y-3 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">{t.tipsTitle}</h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-muted">
          {t.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
