// 룩 사진. 사진이 아직 없으면 자리표시(placeholder)를 보여줘요.

import Image from "next/image";

export default function LookImage({
  src,
  alt,
  label,
  emptyText,
  priority = false,
}: {
  src?: string;
  alt: string;
  label: string;
  emptyText: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface">
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" priority={priority} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* 단순한 실루엣 */}
          <svg viewBox="0 0 40 80" className="h-2/5 text-line" aria-hidden="true">
            <circle cx="20" cy="8" r="6" fill="currentColor" />
            <path d="M10 18h20l3 30h-6l-1 30h-4l-2-28-2 28h-4l-1-30h-6z" fill="currentColor" />
          </svg>
          <span className="archive-caption text-center">
            {label}
            <br />
            {emptyText}
          </span>
        </div>
      )}
    </div>
  );
}
