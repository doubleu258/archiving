"use client";
// 브랜드 페이지의 컬렉션 목록 + 시즌 필터.
// 필터는 주소(?season=FW)에 저장돼서 링크로 공유할 수 있어요.

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LookImage from "./LookImage";

export type CollectionCard = {
  slug: string;
  year: number;
  season: string;
  title: string;
  code: string;
  meta: string;
  image?: string;
};

type Props = {
  base: string;
  items: CollectionCard[];
  seasons: { code: string; name: string }[];
  allLabel: string;
  filterLabel: string;
  emptyImageText: string;
};

function List({ base, items, seasons, allLabel, filterLabel, emptyImageText, active }: Props & { active?: string }) {
  const filtered = active ? items.filter((c) => c.season === active) : items;
  const years = [...new Set(filtered.map((c) => c.year))].sort((a, b) => b - a);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={filterLabel}>
        {[{ code: undefined, name: allLabel }, ...seasons].map((s) => {
          const isActive = s.code === active;
          return (
            <Link
              key={s.code ?? "all"}
              href={s.code ? `${base}?season=${s.code}` : base}
              scroll={false}
              aria-current={isActive ? "true" : undefined}
              className={`rounded-full border px-3 py-1 text-sm ${
                isActive ? "border-foreground bg-foreground text-background" : "border-line text-muted hover:text-foreground"
              }`}
            >
              {s.name}
            </Link>
          );
        })}
      </div>

      <div className="divide-y divide-line border-t border-line">
        {years.map((year) => (
          <section key={year} className="grid gap-4 py-6 sm:grid-cols-[120px_1fr]">
            <h2 className="font-mono text-2xl font-light">{year}</h2>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered
                .filter((c) => c.year === year)
                .map((c) => (
                  <li key={c.slug}>
                    <Link href={`${base}/${c.slug}`} className="group block space-y-2">
                      <div className="transition-opacity group-hover:opacity-80">
                        <LookImage src={c.image} alt={c.title} label={c.code} emptyText={emptyImageText} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted">{c.meta}</p>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function FilteredList(props: Props) {
  const season = useSearchParams().get("season") ?? undefined;
  const active = props.seasons.some((s) => s.code === season) ? season : undefined;
  return <List {...props} active={active} />;
}

export default function CollectionList(props: Props) {
  // 서버에서 미리 만들 때는 "전체" 목록을 보여주고, 브라우저에서 필터를 적용해요.
  return (
    <Suspense fallback={<List {...props} />}>
      <FilteredList {...props} />
    </Suspense>
  );
}
