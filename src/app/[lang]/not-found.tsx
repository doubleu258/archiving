import Link from "next/link";

// 없는 주소로 들어왔을 때 보이는 화면 (언어를 알 수 없어서 두 언어로 표시)
export default function NotFound() {
  return (
    <>
      <div className="archive-header py-5">
        <h1 className="archive-title">Page not found · 페이지를 찾을 수 없어요</h1>
        <span className="archive-meta">404</span>
      </div>
      <div className="px-[20px] py-5">
        <Link href="/" className="archive-button">
          ← Home · 홈으로
        </Link>
      </div>
    </>
  );
}
