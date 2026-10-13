import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import { NoirlyHead, PALETTE_STORAGE_KEY, noirlyFontClassName } from "@noirly-dev/ui";
import { NoirlyExperience } from "@noirly-dev/ui/experience";
import { REMOVED_THEME_IDS } from "@/src/components/themes";
import { AppProviders } from "@/src/components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noirly AlgoLab | Visualize logic. Master algorithms.",
  description: "Visualize logic. Master algorithms.",
  icons: {
    icon: [
      {
        url: "/brand-mark-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand-mark-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts sets a per-request CSP nonce; reading it also renders every page
  // per request, so Next stamps the nonce on its own scripts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" className="dark h-full" data-theme="gold" suppressHydrationWarning>
      <head>
        {/* Runs before NoirlyHead's boot script: a saved palette AlgoLab no
            longer offers is cleared, so it falls back to gold without a flash. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `try{var k=${JSON.stringify(PALETTE_STORAGE_KEY)};if(${JSON.stringify(REMOVED_THEME_IDS)}.indexOf(localStorage.getItem(k))!==-1)localStorage.removeItem(k)}catch(e){}`,
          }}
        />
        <NoirlyHead themeId="gold" nonce={nonce} />
      </head>
      <body className={`${noirlyFontClassName} flex min-h-dvh flex-col antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <NoirlyExperience mark="Noirly AlgoLab" pageTransition={false} cursor={false}>
          <AppProviders>{children}</AppProviders>
        </NoirlyExperience>
      </body>
    </html>
  );
}
