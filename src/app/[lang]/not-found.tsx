import Link from "next/link";

// 없는 주소로 들어왔을 때 보이는 화면 (언어를 알 수 없어서 두 언어로 표시)
export default function NotFound() {
  return (
    <div className="space-y-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">404</p>
      <h1 className="text-2xl font-semibold">Page not found · 페이지를 찾을 수 없어요</h1>
      <Link href="/" className="inline-block border border-line px-4 py-2 text-sm hover:border-foreground">
        Home · 홈으로
      </Link>
    </div>
  );
}
