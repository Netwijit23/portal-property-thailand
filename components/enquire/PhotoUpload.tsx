"use client";
import { useRef, useState } from "react";
import { ImagePlus, X, Loader2, Check } from "lucide-react";

export type UploadedPhoto = { url: string; preview: string };

// Downscale a large phone photo in the browser before upload so we stay well
// under the serverless body limit and uploads are fast.
function compress(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result as string; };
    reader.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
        else { width = Math.round((width * maxDim) / height); height = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("compress failed")), "image/jpeg", quality);
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUpload({
  photos,
  onChange,
  max = 12,
}: {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const room = max - photos.length;
    const list = Array.from(files).slice(0, room);
    setBusy((b) => b + list.length);

    for (const file of list) {
      try {
        const blob = file.size > 1_500_000 ? await compress(file) : file;
        const preview = URL.createObjectURL(blob);
        const fd = new FormData();
        fd.append("file", new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        const res = await fetch("/api/owner-photo", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        onChange([...photosRef.current, { url: json.url, preview }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy((b) => b - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  // Keep a live ref so sequential uploads append correctly
  const photosRef = useRef(photos);
  photosRef.current = photos;

  function remove(url: string) {
    onChange(photos.filter((p) => p.url !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {photos.map((p) => (
          <div key={p.url} className="relative aspect-square rounded-xl overflow-hidden group bg-[#F5F2EC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#1A3A2A] flex items-center justify-center">
              <Check size={11} className="text-white" strokeWidth={3} />
            </div>
            <button
              type="button"
              onClick={() => remove(p.url)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove photo"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}

        {Array.from({ length: busy }).map((_, i) => (
          <div key={`b${i}`} className="aspect-square rounded-xl bg-[#F5F2EC] flex items-center justify-center">
            <Loader2 size={18} className="animate-spin text-[#B8935A]" />
          </div>
        ))}

        {photos.length + busy < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#DDD6CC] flex flex-col items-center justify-center gap-1 text-[#B0AAA2] hover:border-[#B8935A] hover:text-[#B8935A] transition-colors"
          >
            <ImagePlus size={20} />
            <span className="font-sans text-[10px] uppercase tracking-wider">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="font-sans text-[11px] text-[#B0AAA2] mt-2.5">
        {photos.length}/{max} photos · JPG or PNG · we optimise them automatically
      </p>
      {error && <p className="font-sans text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
