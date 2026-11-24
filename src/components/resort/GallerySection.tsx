"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";
import { GALLERY, GALLERY_CATEGORIES, galleryPhoto, type GalleryCategory } from "@/config/gallery";
import { cn } from "./lib/cn";
import { useFocusTrap, useScrollLock } from "./lib/hooks";

type Filter = "All" | GalleryCategory;
const FILTERS: Filter[] = ["All", ...GALLERY_CATEGORIES];
/** Photos shown before "Show all" (11 fills four complete rows of the default mosaic). */
const INITIAL_COUNT = 11;
const subscribeNothing = () => () => {};

/** Home page gallery: category tabs, mosaic grid, full-screen lightbox. */
export default function GallerySection() {
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const images = filter === "All" ? GALLERY : GALLERY.filter((g) => g.category === filter);
  const visible = expanded ? images : images.slice(0, INITIAL_COUNT);
  const hidden = images.length - visible.length;

  return (
    <section id="gallery" className="scroll-mt-40 bg-brand-dark text-white">
      <div className="mx-auto max-w-site px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-sand uppercase">Look around</p>
            <h2 className="font-resort-serif text-3xl font-semibold sm:text-4xl">Moments from the resort</h2>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              Lakeside mornings, poolside evenings and everything in between.
            </p>
          </div>

          <div role="group" aria-label="Filter photos" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" data-lenis-prevent>
            <div className="flex w-max gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => {
                    setFilter(f);
                    setExpanded(false);
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand",
                    filter === f ? "bg-sand text-brand-dark" : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:grid-cols-4 lg:auto-rows-[210px]">
          {visible.map((img, i) => (
            <li
              key={img.id}
              className={cn(
                "animate-[resort-fade-in_400ms_ease-out_both]",
                img.shape === "tall" && "row-span-2",
                img.shape === "wide" && "col-span-2",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open photo: ${img.caption}`}
                className="group relative block size-full overflow-hidden rounded-2xl bg-white/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sand/70"
              >
                <Image
                  src={galleryPhoto(img, img.shape === "wide" ? 1200 : 800)}
                  alt={img.alt}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="absolute top-3 right-3 grid size-9 scale-75 place-items-center rounded-full bg-white/90 text-brand-dark opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" aria-hidden />
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-1 p-3 text-left transition-transform duration-300 group-hover:translate-y-0 sm:p-4">
                  <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand uppercase">
                    {img.category}
                  </span>
                  <span className="block truncate text-sm font-medium text-white">{img.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {hidden > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-sand hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
            >
              <Images className="size-4" aria-hidden />
              Show all {images.length} photos
            </button>
          </div>
        )}
      </div>

      <Lightbox
        images={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: typeof GALLERY;
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  useFocusTrap(open, panelRef, onClose);
  useScrollLock(open);

  const count = images.length;
  const go = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + count) % count);
  };

  // Arrow keys move between photos.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (index === null) return;
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  if (!mounted) return null;
  const img = index !== null ? images[index] : null;

  return createPortal(
    <div
      inert={!open}
      className={cn(
        "font-resort fixed inset-0 z-[90] transition-[opacity,visibility] duration-250",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex h-full flex-col text-white focus:outline-none"
      >
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <p className="text-sm text-white/70 tabular-nums">
            {index !== null && `${index + 1} / ${count}`}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="grid size-11 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <X className="size-6" aria-hidden />
          </button>
        </header>

        <div className="relative min-h-0 flex-1">
          {img && (
            <div key={img.id} className="absolute inset-0 animate-[resort-fade-in_250ms_ease-out] px-4 sm:px-20">
              <div className="relative size-full">
                {/* The grid-size copy is already cached, so something shows at once; the sharp one covers it when loaded. */}
                <Image
                  src={galleryPhoto(img, img.shape === "wide" ? 1200 : 800)}
                  alt=""
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain p-2 sm:p-4"
                />
                <Image
                  src={galleryPhoto(img, 1800)}
                  alt={img.alt}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain p-2 sm:p-4"
                />
              </div>
            </div>
          )}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-sand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand sm:left-5"
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-sand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand sm:right-5"
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </>
          )}
        </div>

        <footer className="shrink-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <p id={titleId} className="text-center">
            <span className="mr-2 text-[11px] font-semibold tracking-[0.14em] text-sand uppercase">{img?.category}</span>
            <span className="text-sm font-medium sm:text-base">{img?.caption}</span>
          </p>
          <div
            ref={thumbsRef}
            data-lenis-prevent
            className="mx-auto mt-3 max-w-3xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max gap-2 px-1 py-1">
              {images.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  data-index={i}
                  onClick={() => onIndexChange(i)}
                  aria-label={`Show photo ${i + 1}: ${t.caption}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow] focus-visible:outline-none sm:h-14 sm:w-20",
                    i === index ? "opacity-100 ring-sand" : "opacity-50 ring-transparent hover:opacity-90",
                  )}
                >
                  <Image src={galleryPhoto(t, 200)} alt="" fill unoptimized sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
