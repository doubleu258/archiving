// 샘플(확인 안 된) 데이터라는 걸 알려주는 안내 상자

export default function SampleNotice({ badge, text }: { badge: string; text: string }) {
  return (
    <p className="flex items-start gap-3 border border-dashed border-line px-4 py-3 text-sm text-muted">
      <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-foreground">
        {badge}
      </span>
      <span>{text}</span>
    </p>
  );
}
