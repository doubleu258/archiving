// 페이지 맨 위 제목 줄: 왼쪽 제목, 오른쪽 메타 정보, 아래 설명(선택)

export default function PageHeader({
  title,
  meta,
  description,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <>
      <div className="archive-header gap-4 py-5">
        <h1 className="archive-title">{title}</h1>
        {meta && <span className="archive-meta shrink-0 text-right">{meta}</span>}
      </div>
      {description && (
        <div className="border-b border-line px-[20px] py-4">
          <p className="archive-body max-w-[640px]">{description}</p>
        </div>
      )}
    </>
  );
}

/** 섹션 구분 줄: 왼쪽 라벨, 오른쪽 개수 등 */
export function SectionHeader({ label, meta }: { label: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="archive-header mt-10">
      <span className="archive-meta">{label}</span>
      {meta !== undefined && <span className="archive-meta">{meta}</span>}
    </div>
  );
}

/** 리스트 위의 열 이름 줄 */
export function ColumnHeader({ cols }: { cols: [React.ReactNode, React.ReactNode, React.ReactNode] }) {
  return (
    <div className="archive-row hover:bg-transparent">
      {cols.map((c, i) => (
        <span key={i} className={`archive-meta ${i === 2 ? "text-right" : ""}`}>
          {c}
        </span>
      ))}
    </div>
  );
}
