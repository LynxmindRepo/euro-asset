"use client";

import { useId, useRef, useState } from "react";
import { getAssetPath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

const MAX_PHOTOS = 10;
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Local photo picker for listings. Files never leave the browser: each one becomes an object URL
 * (`blob:`) that lives for the current session, which is all a presentation prototype needs.
 * The first photo is the main photo (used on cards and as the gallery's first image).
 */
export function PhotoUploader({
  photos,
  onChange,
  label = "Photos"
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  label?: string;
}) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files);
    const images = list.filter((file) => file.type.startsWith("image/"));
    const tooBig = images.filter((file) => file.size > MAX_BYTES);
    const accepted = images.filter((file) => file.size <= MAX_BYTES).slice(0, MAX_PHOTOS - photos.length);
    const skipped = list.length - accepted.length;

    if (accepted.length > 0) onChange([...photos, ...accepted.map((file) => URL.createObjectURL(file))]);

    const notes = [`${accepted.length} photo${accepted.length === 1 ? "" : "s"} added`];
    if (skipped > 0) {
      notes.push(
        `${skipped} skipped${tooBig.length ? " (max 10 MB each)" : ""}${list.length !== images.length ? " (images only)" : ""}${
          photos.length + accepted.length >= MAX_PHOTOS ? ` (max ${MAX_PHOTOS} photos)` : ""
        }`
      );
    }
    setMessage(notes.join(", ") + ".");
  }

  function remove(index: number) {
    onChange(photos.filter((_, position) => position !== index));
    setMessage(`Photo ${index + 1} removed.`);
  }

  function makeMain(index: number) {
    onChange([photos[index], ...photos.filter((_, position) => position !== index)]);
    setMessage(`Photo ${index + 1} is now the main photo.`);
  }

  return (
    <Localized><div className="grid gap-3">
      <span className="field-label" id={`${inputId}-label`}>
        {label}
      </span>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition",
          dragging ? "border-primary bg-surface-tint" : "border-muted/60 bg-surface-low"
        )}
      >
        <p className="text-sm text-ink">Drag photos here, or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
          aria-describedby={hintId}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add photos
        </button>
        <p id={hintId} className="field-hint">
          {`Up to ${MAX_PHOTOS} images, 10 MB each. The first photo is the main one. Photos stay in this browser (demo).`}
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          aria-labelledby={`${inputId}-label`}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 ? (
        <ul aria-labelledby={`${inputId}-label`} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo} className="overflow-hidden rounded-2xl bg-surface-lowest shadow-ambient tonal-rule">
              <div className="relative">
                <img src={getAssetPath(photo)} alt={`Photo ${index + 1}`} className="h-28 w-full object-cover" />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-primary">
                    Main photo
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1 p-2">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => makeMain(index)}
                    aria-label={`Set photo ${index + 1} as main photo`}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-surface-low"
                  >
                    Set as main
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold text-danger-ink transition hover:bg-danger"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <p role="status" className="sr-only">
        {message}
      </p>
    </div></Localized>
  );
}
