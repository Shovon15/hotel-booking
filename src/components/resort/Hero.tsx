import Image from "next/image";
import { MapPin } from "lucide-react";
import { HERO_IMAGE, RESORT } from "@/config/resort";
import BookingBar from "./BookingBar";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-[640px] flex-col md:min-h-[720px] lg:h-[100svh] lg:max-h-[940px]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Infinity pool at the resort surrounded by palm trees"
          fill
          priority
          // Unsplash already serves a sized, compressed image (see the URL params).
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradients keep the header (top) and booking bar (bottom) readable. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/75" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-site flex-1 flex-col items-center justify-center px-4 pt-28 text-center pb-10 sm:px-6 md:pb-14 lg:px-8 lg:pb-16">
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/85">
          <MapPin className="size-4" aria-hidden />
          {RESORT.location}
        </p>
        <h1
          id="hero-title"
          className="font-resort-serif max-w-4xl text-4xl leading-[1.08] font-semibold text-balance text-white sm:text-5xl lg:text-6xl"
        >
          Slow mornings by the water, starlit evenings in the hills.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Lakeside villas, an infinity pool and tea-garden trails — two and a
          half hours from Dhaka.
        </p>

        <div className="mt-8 w-full text-left md:mt-10">
          <BookingBar />
        </div>
      </div>
    </section>
  );
}
