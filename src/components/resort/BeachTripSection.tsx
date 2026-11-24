"use client";

import CardSlider from "@/components/common/slider/CardSlider";
import { BEACH_STAYS } from "@/config/resort";
import StayCard from "./StayCard";

/** Home page: "Looking for a beach trip?" — rooms & villas slider. Data lives in BEACH_STAYS (src/config/resort.ts). */
export default function BeachTripSection() {
  return (
    <section
      id="beach-trip"
      aria-labelledby="beach-trip-title"
      className="relative scroll-mt-40 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white"
    >
      <div className="mx-auto max-w-site px-4 pt-20 pb-5 sm:px-6 lg:px-8 lg:pt-24">
        <CardSlider
          items={BEACH_STAYS}
          getKey={(stay) => stay.id}
          renderItem={(stay) => <StayCard stay={stay} />}
          eyebrow="Sun, sand & sea"
          title="Looking for a beach trip?"
          ariaLabel="Beach rooms and villas"
        />
      </div>
    </section>
  );
}
