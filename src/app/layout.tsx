import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import MenuBar from "./components/MenuBar/MenuBar";
import Dock from "./components/Dock/Dock";
import StartupSequence from "./components/Desktop/StartupSequence";
import MobileFallback from "./components/Desktop/MobileFallback";
import DesktopShortcuts from "./components/Desktop/DesktopShortcuts";
import Wallpaper from "./components/Desktop/Wallpaper";
import { WindowManagerProvider } from "./components/WindowManager/WindowManagerProvider";
import { WindowRenderer } from "./components/WindowManager/WindowRenderer";
import { WallpaperProvider } from "./components/Desktop/WallpaperProvider";
import { DesktopProvider } from "./components/Desktop/DesktopProvider";
import DesktopSurface from "./components/Desktop/DesktopSurface";
import DesktopMenuLayer from "./components/Desktop/DesktopMenuLayer";
import { PORTFOLIO_LOGO_SRC } from "./components/logoAssets";
import "./globals.css";

const SITE_TITLE = "Aden Guo Portfolio";
const SITE_DESCRIPTION =
  "A macOS desktop in the browser — the portfolio of Aden Guo, software engineer building full-stack web apps, AI/LLM tools, and spatial systems.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: PORTFOLIO_LOGO_SRC,
    apple: PORTFOLIO_LOGO_SRC,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout(_props: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
        }}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MobileFallback />
          <div className="hidden md:block" data-desktop-shell="true">
            <WindowManagerProvider>
              <WallpaperProvider>
               <DesktopProvider>
                {/* Desktop shell root — persistent across all route changes */}
                <div
                  id="desktop-root"
                  className="fixed inset-0 overflow-hidden bg-desktop"
                  aria-label="Desktop"
                >
                  {/* Wallpaper — simplex-noise canvas over a tahoe-dawn fallback */}
                  <div data-desktop-layer="wallpaper">
                    <Wallpaper />
                  </div>

                  {/* Empty-desktop interaction layer — marquee select + context menu */}
                  <div data-desktop-layer="surface">
                    <DesktopSurface />
                  </div>

                  {/* Menu bar — 28px pinned to top, z-50 */}
                  <div data-desktop-layer="menubar">
                    <MenuBar />
                  </div>

                  {/* Desktop shortcut icons — left sidebar column, clears menu bar */}
                  <div data-desktop-layer="shortcuts">
                    <DesktopShortcuts />
                  </div>

                  {/* App windows — each window renders its own content independently */}
                  <div
                    data-desktop-layer="windows"
                    className="pointer-events-none absolute inset-0"
                  >
                    <WindowRenderer />
                  </div>

                  {/* Dock — pinned to bottom, z-40 */}
                  <div data-desktop-layer="dock">
                    <Dock />
                  </div>

                  <div data-desktop-layer="boot">
                    <StartupSequence />
                  </div>

                  {/* Context menu + Get Info panel — stacks above everything */}
                  <DesktopMenuLayer />
                </div>
               </DesktopProvider>
              </WallpaperProvider>
            </WindowManagerProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
