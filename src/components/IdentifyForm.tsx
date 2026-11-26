"use client";
// 피스 찾기 화면: 옷 사진 + 라벨 사진 업로드, 카테고리 선택.
// 지금은 사진 미리보기까지만 동작하고, AI 매칭은 3단계에서 연결해요.

import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import type { GarmentCategory } from "@/lib/types";

type Texts = Dictionary["identify"];

/** 번호가 붙은 입력 단계 한 줄 (01 / 02 / 03) */
function Step({ index, title, hint, children }: { index: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="archive-row grid-cols-[40px_1fr] items-start gap-4 py-5 hover:bg-transparent sm:grid-cols-[64px_240px_1fr]">
      <span className="archive-index pt-0.5">{index}</span>
      <div className="space-y-1">
        <p className="m-0 font-medium">{title}</p>
        {hint && <p className="archive-body">{hint}</p>}
      </div>
      <div className="col-span-2 sm:col-span-1">{children}</div>
    </div>
  );
}

function PhotoInput({ id, texts, file, onChange }: { id: string; texts: Texts; file: File | null; onChange: (f: File | null) => void }) {
  // 선택한 사진을 화면에 미리 보여주기 위한 임시 주소 만들기
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  // 사진이 바뀌거나 화면을 떠나면 임시 주소 정리 (메모리 절약)
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <div className="flex items-end gap-4">
      <label
        htmlFor={id}
        className="flex aspect-[3/4] w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-line bg-surface"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- 로컬 미리보기라 next/image가 필요 없음
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="archive-meta" aria-hidden="true">+</span>
        )}
      </label>
      <div className="flex flex-col items-start gap-2">
        {file && <span className="archive-caption max-w-[200px] truncate normal-case">{file.name}</span>}
        {/* capture 속성: 폰에서는 바로 카메라가 열려요 */}
        <input
          id={id}
          type="file"
          accept="image/*"
          capture="environment"
          className="peer sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <label htmlFor={id} className="archive-button peer-focus-visible:outline peer-focus-visible:outline-1">
          {file ? texts.replace : texts.choose}
        </label>
        {file && (
          <button type="button" onClick={() => onChange(null)} className="archive-meta cursor-pointer border-0 bg-transparent p-0 hover:text-primary">
            {texts.remove}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IdentifyForm({ texts, categories }: { texts: Texts; categories: Record<GarmentCategory, string> }) {
  const [garment, setGarment] = useState<File | null>(null);
  const [label, setLabel] = useState<File | null>(null);
  const [category, setCategory] = useState<GarmentCategory | "">("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Step index="01" title={texts.garmentPhoto} hint={texts.garmentHint}>
        <PhotoInput id="garment" texts={texts} file={garment} onChange={setGarment} />
      </Step>

      <Step index="02" title={texts.labelPhoto} hint={texts.labelHint}>
        <PhotoInput id="label" texts={texts} file={label} onChange={setLabel} />
      </Step>

      <Step index="03" title={texts.category}>
        <fieldset className="m-0 flex flex-wrap gap-1.5 border-0 p-0">
          <legend className="sr-only">{texts.category}</legend>
          {([["", texts.anyCategory], ...Object.entries(categories)] as [GarmentCategory | "", string][]).map(([value, name]) => (
            <label key={value || "any"} className="archive-tag cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-1">
              <input
                type="radio"
                name="category"
                value={value}
                checked={category === value}
                onChange={() => setCategory(value)}
                className="sr-only"
              />
              {name}
            </label>
          ))}
        </fieldset>
      </Step>

      <div className="flex flex-wrap items-center gap-4 border-b border-line px-[20px] py-5">
        <button type="submit" disabled={!garment} className="archive-button archive-button--solid">
          {texts.search} →
        </button>
        {submitted && (
          <p role="status" className="archive-body">
            {texts.comingSoon}
          </p>
        )}
      </div>
    </form>
  );
}
