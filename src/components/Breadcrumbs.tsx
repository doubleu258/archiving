// 현재 위치 표시: ARCHIVE / HELMUT LANG / FW98 / LOOK 3

import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line px-[20px] py-2.5">
      <ol className="archive-meta flex flex-wrap items-baseline gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
