// 샘플(확인 안 된) 데이터라는 걸 알려주는 한 줄 안내

export default function SampleNotice({ badge, text }: { badge: string; text: string }) {
  return (
    <p className="archive-row m-0 hover:bg-transparent">
      <span className="archive-index">[{badge}]</span>
      <span className="archive-body">{text}</span>
      <span />
    </p>
  );
}
