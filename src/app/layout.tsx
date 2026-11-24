// import type { Metadata } from "next";
import "./globals.css";
import { FONT_VARIABLE_CLASSES } from "./font";
import { buildFontThemeCss, fontInitScript } from "@/config/fonts";
import ReduxProvider from "@/store/provider";
import ToastListener from "@/components/common/toast/toastListener";
// import { SITE_INFORMATION } from "@/config/seo";

// Metadata disabled for now.
// export const metadata: Metadata = {
//   title: SITE_INFORMATION.metaTitle,
//   description: SITE_INFORMATION.metaDescription,
//   keywords: SITE_INFORMATION.keywords,
//   metadataBase: new URL(SITE_INFORMATION.url || "http://localhost:4004"),
//   applicationName: SITE_INFORMATION.appName,
//   // Favicon (src/app/icon.svg), apple-icon and opengraph-image are picked up
//   // automatically from the app folder.
//   openGraph: {
//     title: SITE_INFORMATION.socialTitle,
//     description: SITE_INFORMATION.socialDescription,
//     siteName: SITE_INFORMATION.appName,
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: SITE_INFORMATION.socialTitle,
//     description: SITE_INFORMATION.socialDescription,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: fontInitScript may set data-font before React hydrates.
    <html lang="en" className={FONT_VARIABLE_CLASSES} suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock"></meta>
        {/* Font presets (src/config/fonts.ts) + apply the saved one before paint */}
        <style dangerouslySetInnerHTML={{ __html: buildFontThemeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: fontInitScript }} />
      </head>
      <body
        className="font-body antialiased"
      >
        {/* End Google Tag Manager (noscript) */}
        <ReduxProvider>
          {/* Site chrome (header, footer, smooth scroll, cursor) lives in
              (site)/layout.tsx so the /admin panel renders without it. */}
          {children}
          <ToastListener />
        </ReduxProvider>
      </body>
    </html>
  );
}
