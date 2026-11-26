"use client";
// 피스 찾기 화면: 옷 사진 + 라벨 사진 업로드, 카테고리 선택.
// 지금은 사진 미리보기까지만 동작하고, AI 매칭은 3단계에서 연결해요.

import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import type { GarmentCategory } from "@/lib/types";

type Texts = Dictionary["identify"];

function PhotoInput({
  id,
  label,
  hint,
  texts,
  file,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  texts: Texts;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  // 선택한 사진을 화면에 미리 보여주기 위한 임시 주소 만들기
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  // 사진이 바뀌거나 화면을 떠나면 임시 주소 정리 (메모리 절약)
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <p className="text-xs text-muted">{hint}</p>
      <div className="flex items-center gap-4">
        <div className="flex aspect-[3/4] w-28 shrink-0 items-center justify-center overflow-hidden border border-dashed border-line bg-surface">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- 로컬 미리보기라 next/image가 필요 없음
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl text-muted" aria-hidden="true">
              +
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {/* capture 속성: 폰에서는 바로 카메라가 열려요 */}
          <input
            id={id}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor={id}
            className="cursor-pointer border border-foreground px-4 py-2 text-center text-sm hover:bg-foreground hover:text-background"
          >
            {file ? texts.replace : texts.choose}
          </label>
          {file && (
            <button type="button" onClick={() => onChange(null)} className="text-sm text-muted hover:text-foreground">
              {texts.remove}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IdentifyForm({
  texts,
  categories,
}: {
  texts: Texts;
  categories: Record<GarmentCategory, string>;
}) {
  const [garment, setGarment] = useState<File | null>(null);
  const [label, setLabel] = useState<File | null>(null);
  const [category, setCategory] = useState<GarmentCategory | "">("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <PhotoInput id="garment" label={texts.garmentPhoto} hint={texts.garmentHint} texts={texts} file={garment} onChange={setGarment} />
        <PhotoInput id="label" label={texts.labelPhoto} hint={texts.labelHint} texts={texts} file={label} onChange={setLabel} />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{texts.category}</legend>
        <div className="flex flex-wrap gap-2">
          {([["", texts.anyCategory], ...Object.entries(categories)] as [GarmentCategory | "", string][]).map(
            ([value, name]) => (
              <label
                key={value || "any"}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm has-[:focus-visible]:outline-2 ${
                  category === value ? "border-foreground bg-foreground text-background" : "border-line text-muted hover:text-foreground"
                }`}
              >
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
            ),
          )}
        </div>
      </fieldset>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={!garment}
          className="bg-foreground px-6 py-3 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-30"
        >
          {texts.search}
        </button>
        {submitted && (
          <p role="status" className="border border-dashed border-line px-4 py-3 text-sm text-muted">
            {texts.comingSoon}
          </p>
        )}
      </div>
    </form>
  );
}
