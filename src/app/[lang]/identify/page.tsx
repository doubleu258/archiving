// 피스 찾기 페이지

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IdentifyForm from "@/components/IdentifyForm";
import PageHeader, { SectionHeader } from "@/components/PageHeader";
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
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <IdentifyForm texts={t} categories={dict.categories} />

      <SectionHeader label={t.tipsTitle} meta={String(t.tips.length).padStart(2, "0")} />
      <ol className="m-0 list-none p-0">
        {t.tips.map((tip, i) => (
          <li key={tip} className="archive-row grid-cols-[64px_1fr] hover:bg-transparent">
            <span className="archive-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="archive-body">{tip}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
