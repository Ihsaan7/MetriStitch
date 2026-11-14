'use client';

import { useEffect, useRef, useState } from 'react';

export interface GalleryPiece {
  id: string;
  category: 'ornate' | 'logo';
  title: string;
  before: string;
  after: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Preview builds only: shows a clearly marked frame instead of a photo. */
  placeholder: boolean;
}

interface Labels {
  filterLabel: string;
  filterAll: string;
  filterOrnate: string;
  filterLogos: string;
  empty: string;
  open: string;
  close: string;
  before: string;
  after: string;
  placeholderFrame: string;
}

type Filter = 'all' | 'ornate' | 'logo';

export default function WorkGallery({ pieces, labels }: { pieces: GalleryPiece[]; labels: Labels }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: labels.filterAll },
    { id: 'ornate', label: labels.filterOrnate },
    { id: 'logo', label: labels.filterLogos },
  ];
  const visible = pieces.filter((piece) => filter === 'all' || piece.category === filter);
  const active = pieces.find((piece) => piece.id === activeId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && active && !dialog.open) dialog.showModal();
  }, [active]);

  return (
    <div>
      <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`min-h-11 border px-4 text-[0.9375rem] font-semibold ${
              filter === item.id
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-transparent text-ink hover:border-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-muted">{labels.empty}</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((piece) => (
            <li key={piece.id}>
              <button
                type="button"
                className="group block w-full text-left"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setActiveId(piece.id);
                }}
              >
                {piece.placeholder ? (
                  <span className="ph-frame aspect-[4/3] w-full">{labels.placeholderFrame}</span>
                ) : (
                  <img
                    src={piece.after}
                    alt={piece.alt}
                    width={piece.width}
                    height={piece.height}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full border border-line bg-white object-cover transition-opacity group-hover:opacity-90"
                  />
                )}
                <span className="mt-2 block text-[0.9375rem] font-medium leading-snug group-hover:underline group-hover:decoration-gold group-hover:decoration-2 group-hover:underline-offset-4">
                  {piece.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

{/*Backdrop click is a mouse convenience only. Keyboard users close with Esc or the Close button. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <dialog
        ref={dialogRef}
        aria-labelledby="work-dialog-title"
        className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[1000px] overflow-auto border border-line bg-paper p-0 text-ink backdrop:bg-ink/70"
        onClose={() => {
          setActiveId(null);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {active && (
          <div className="p-5 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 id="work-dialog-title" className="text-[1.5rem] md:text-[2rem]">
                {active.title}
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm shrink-0"
                onClick={() => dialogRef.current?.close()}
              >
                {labels.close}
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { src: active.before, label: labels.before, alt: `${labels.before}: ${active.alt}` },
                { src: active.after, label: labels.after, alt: `${labels.after}: ${active.alt}` },
              ].map((image) => (
                <figure key={image.label}>
                  {active.placeholder ? (
                    <div className="ph-frame aspect-[4/3] w-full">{labels.placeholderFrame}</div>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={active.width}
                      height={active.height}
                      decoding="async"
                      className="aspect-[4/3] w-full border border-line bg-white object-contain"
                    />
                  )}
                  <figcaption className="mt-2 text-[0.9375rem] text-muted">{image.label}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 measure">{active.caption}</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
