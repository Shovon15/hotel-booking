import Hero from "./Hero";
import BeachTripSection from "./BeachTripSection";
import PropertyTypeSection from "./PropertyTypeSection";
import TrendingDestinations from "./TrendingDestinations";
import OffersSection from "./OffersSection";
import FacilitiesSection from "./FacilitiesSection";
import GallerySection from "./GallerySection";
import ContactSection from "./ContactSection";

/** Home page: hero + booking bar, then the content sections in scroll order. */
export default function ResortHome() {
  return (
    <div className="font-resort bg-white text-slate-700">
      <Hero />
      <PropertyTypeSection />
      {/* <TrendingDestinations /> */}
      <OffersSection />
      <BeachTripSection />
      <FacilitiesSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
}
