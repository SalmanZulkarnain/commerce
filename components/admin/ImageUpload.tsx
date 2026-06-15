"use client";

import { useRef, ChangeEvent } from "react";
import Image from "next/image";
import { ImagePreview } from "@/app/(admin)/admin/products/types";

interface Props {
  images: ImagePreview[];
  setImages: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
  maxImages?: number;
}

export default function ImageUpload({ images, setImages, maxImages = 9 }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    
    const files = Array.from(e.target.files);
    const availableSlots = maxImages - images.length;
    const selected = files.slice(0, availableSlots);

    const newImages = selected.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {images.map((img, i) => (
          <div key={img.id} className="relative aspect-square">
            <Image
              src={img.previewUrl}
              alt="product"
              fill
              className="object-cover rounded"
            />

            {i === 0 && (
              <div className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-1 rounded">
                Main
              </div>
            )}

            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-black text-white px-1 rounded"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed p-4"
          >
            + Add
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}