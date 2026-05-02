import type { Metadata, Viewport } from "next";
import "./globals.css";
import ScentGuide from "@/components/ScentGuide";
import { LangProvider } from "@/components/LangProvider";
import LangToggle from "@/components/LangToggle";

/**
 * Scent Guide chat is disabled at launch — keeps /api/chat from racking
 * up Anthropic bills before the IG campaign has any usage signal. The
 * component code, the route, and the i18n strings are all intact; flip
 * the env var to re-enable in one step.
 *
 *   Re-enable:  Vercel → Project → Settings → Env Variables
 *               NEXT_PUBLIC_SCENT_GUIDE_ENABLED = true
 *               then trigger a redeploy.
 */
const SCENT_GUIDE_ENABLED =
  process.env.NEXT_PUBLIC_SCENT_GUIDE_ENABLED === "true";

const SITE_URL = "https://game.etienneperfumes.com";
const TITLE = "Discover Your Signature Scent – Etienne Perfumes";
const DESCRIPTION =
  "Play the game and find the fragrance that defines you.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Etienne Perfumes",
  },
  description: DESCRIPTION,
  applicationName: "Etienne Perfumes",
  keywords: [
    "Etienne Perfumes",
    "perfume quiz",
    "scent personality",
    "signature scent",
    "fragrance game",
  ],
  authors: [{ name: "Etienne Perfumes" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Etienne Perfumes",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@etienneperfumes",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <LangProvider>
          <LangToggle />
          <main className="mx-auto max-w-[480px] min-h-[100dvh] relative">
            {children}
          </main>
          {SCENT_GUIDE_ENABLED && <ScentGuide />}
        </LangProvider>
      </body>
    </html>
  );
}
