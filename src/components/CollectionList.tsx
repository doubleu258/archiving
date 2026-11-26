"use client";
// 브랜드 페이지의 컬렉션 목록 + 시즌 필터.
// 필터는 주소(?season=FW)에 저장돼서 링크로 공유할 수 있어요.

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export type CollectionRow = {
  slug: string;
  year: number;
  season: string;
  title: string;
  code: string;
  city: string;
  looks: string;
};

type Props = {
  base: string;
  items: CollectionRow[];
  seasons: { code: string; name: string }[];
  labels: { all: string; filter: string; year: string; collection: string; details: string };
};

function List({ base, items, seasons, labels, active }: Props & { active?: string }) {
  const filtered = active ? items.filter((c) => c.season === active) : items;

  return (
    <>
      {/* 시즌 필터 */}
      <div className="flex flex-wrap items-baseline gap-2 border-b border-line px-[20px] py-3">
        <span className="archive-meta mr-2">{labels.filter}</span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={labels.filter}>
          {[{ code: undefined, name: labels.all }, ...seasons].map((s) => (
            <Link
              key={s.code ?? "all"}
              href={s.code ? `${base}?season=${s.code}` : base}
              scroll={false}
              aria-current={s.code === active ? "true" : undefined}
              className="archive-tag"
            >
              {s.name}
            </Link>
          ))}
        </div>
        <span className="archive-meta ml-auto">{String(filtered.length).padStart(2, "0")}</span>
      </div>

      {/* 열 이름 */}
      <div className="archive-row hover:bg-transparent">
        <span className="archive-meta">{labels.year}</span>
        <span className="archive-meta">{labels.collection}</span>
        <span className="archive-meta text-right">{labels.details}</span>
      </div>

      {filtered.map((c, i) => {
        // 같은 연도의 두 번째 줄부터는 연도를 흐리게 → 연도별 묶음이 눈에 들어와요
        const firstOfYear = i === 0 || filtered[i - 1].year !== c.year;
        return (
          <Link key={c.slug} href={`${base}/${c.slug}`} className="archive-row">
            <span className={`archive-index ${firstOfYear ? "text-primary" : "opacity-40"}`}>{c.year}</span>
            <span className="font-medium">{c.title}</span>
            <span className="archive-meta flex justify-end gap-3 text-right">
              <span>{c.code}</span>
              <span className="hidden sm:inline">{c.city}</span>
              <span>{c.looks}</span>
            </span>
          </Link>
        );
      })}
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
