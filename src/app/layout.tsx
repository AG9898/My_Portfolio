import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import MenuBar from "./components/MenuBar/MenuBar";
import Dock from "./components/Dock/Dock";
import BootScreen from "./components/Desktop/BootScreen";
import MobileFallback from "./components/Desktop/MobileFallback";
import DesktopShortcuts from "./components/Desktop/DesktopShortcuts";
import Wallpaper from "./components/Desktop/Wallpaper";
import { WindowManagerProvider } from "./components/WindowManager/WindowManagerProvider";
import { WindowRenderer } from "./components/WindowManager/WindowRenderer";
import { WallpaperProvider } from "./components/Desktop/WallpaperProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aden Guo Portfolio",
  description: "A macOS-inspired portfolio redesign for Aden Guo.",
  icons: {
    icon: "/strawberry-logo.png",
    apple: "/strawberry-logo.png",
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
                  <BootScreen />
                </div>
              </div>
              </WallpaperProvider>
            </WindowManagerProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
