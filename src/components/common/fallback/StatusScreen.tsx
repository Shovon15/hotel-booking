import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, type LucideIcon } from "lucide-react";
import { HERO_IMAGE, RESORT, whatsappUrl } from "@/config/resort";
import { PROPERTY_TYPES, propertyTypeHref } from "@/config/propertyTypes";
import { WhatsAppIcon } from "@/components/resort/ui";
import { cn } from "@/components/resort/lib/cn";

/** Same staggered rise-in as the home hero. */
const RISE = "animate-[resort-rise_900ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";
const fade = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** Categories suggested under the message. */
const SUGGESTED = PROPERTY_TYPES.slice(0, 4);

export type StatusAction =
  | { label: string; href: string; onClick?: never; variant?: "primary" | "secondary" }
  | { label: string; onClick: () => void; href?: never; variant?: "primary" | "secondary" };

type StatusScreenProps = {
  /** Large serif text behind the message, e.g. "404". */
  code: string;
  icon: LucideIcon;
  /** Small label above the title, e.g. "Page not found". */
  badge: string;
  title: string;
  description: ReactNode;
  actions: StatusAction[];
  /** Small print at the bottom (e.g. an error reference). */
  footnote?: ReactNode;
};

const buttonClass = (variant: StatusAction["variant"]) =>
  cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none",
    variant === "secondary"
      ? "border border-white/35 bg-white/5 text-white backdrop-blur hover:border-white hover:bg-white/10"
      : "bg-sand text-brand-dark shadow-[0_12px_28px_-12px_rgba(191,146,67,0.95)] hover:bg-sand-dark",
  );

function ActionButton({ action }: { action: StatusAction }) {
  const content = (
    <>
      {action.label}
      {action.variant !== "secondary" && <ArrowRight className="size-4" aria-hidden />}
    </>
  );
  return action.href ? (
    <Link href={action.href} className={buttonClass(action.variant)}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={buttonClass(action.variant)}>
      {content}
    </button>
  );
}

/** Full-screen 404 / error page in the resort theme: photo, deep green overlay, sand accents. */
export default function StatusScreen({ code, icon: Icon, badge, title, description, actions, footnote }: StatusScreenProps) {
  return (
    <section className="font-resort relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-brand-dark text-white">
      <Image src={HERO_IMAGE} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-dark/80 via-brand-dark/90 to-brand-dark" />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -z-10 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand/15 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-32 pb-16 text-center sm:px-6 md:pt-36">
        <div className="relative">
          <p
            aria-hidden
            className={`${RISE} font-resort-serif text-[clamp(7rem,22vw,13rem)] leading-none font-semibold text-transparent select-none [-webkit-text-stroke:1.5px_rgb(217_179_108/0.55)]`}
            style={fade(0)}
          >
            {code}
          </p>
          <span
            className={`${RISE} absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-sand text-brand-dark shadow-[0_18px_40px_-12px_rgba(217,179,108,0.8)] sm:size-20`}
            style={fade(0.1)}
          >
            <Icon className="size-8 sm:size-9" aria-hidden />
          </span>
        </div>

        <p
          className={`${RISE} mt-8 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-sand uppercase ring-1 ring-white/15`}
          style={fade(0.2)}
        >
          {badge}
        </p>

        <h1
          className={`${RISE} font-resort-serif mt-5 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-tight font-semibold text-balance`}
          style={fade(0.3)}
        >
          {title}
        </h1>

        <p className={`${RISE} mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg`} style={fade(0.4)}>
          {description}
        </p>

        <div className={`${RISE} mt-9 flex flex-wrap justify-center gap-3`} style={fade(0.5)}>
          {actions.map((a) => (
            <ActionButton key={a.label} action={a} />
          ))}
        </div>

        {/* Somewhere to go next */}
        <div className={`${RISE} mt-14 w-full border-t border-white/10 pt-8`} style={fade(0.6)}>
          <p className="text-sm text-white/60">Or explore our stays</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTED.map(({ slug, name, icon: TypeIcon }) => (
              <li key={slug}>
                <Link
                  href={propertyTypeHref(slug)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                >
                  <TypeIcon className="size-4 text-sand" aria-hidden />
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/60">
            Need help?
            <a href={`tel:${RESORT.phoneTel}`} className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-sand">
              <Phone className="size-4" aria-hidden /> {RESORT.phoneDisplay}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-sand"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp us
            </a>
          </p>
        </div>

        {footnote && (
          <p className={`${RISE} mt-8 font-mono text-xs text-white/40`} style={fade(0.7)}>
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
