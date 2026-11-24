import CustomCursor from "@/components/common/cursor/CustomCursor";
import Header from "@/components/resort/Header";
import MobileBottomBar from "@/components/resort/MobileBottomBar";
import Footer from "@/components/resort/Footer";
import BackToTop from "@/components/common/button/BackToTop";
import SmoothScroll from "@/components/layout/container/SmoothScroll";

/**
 * Public-site chrome: smooth scrolling, header, footer, back-to-top, mobile
 * action bar and the custom cursor. Used by the (site) route group layout and
 * by the root not-found page. The admin panel (/admin) does not use it.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll>
        <Header />
        <div
          id="main-content"
          className="min-h-[calc(100dvh-338px)] md:min-h-[calc(100dvh-360px)] bg-background"
        >
          {children}
        </div>
        <Footer />
        <BackToTop />
        <MobileBottomBar />
      </SmoothScroll>
      <CustomCursor />
    </>
  );
}
