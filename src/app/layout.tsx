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
import "./globals.css";

export const metadata: Metadata = {
  title: "Aden Guo Portfolio",
  description: "A macOS-inspired portfolio redesign for Aden Guo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <div className="hidden md:block">
            <WindowManagerProvider>
              {/* Desktop shell root — persistent across all route changes */}
              <div
                id="desktop-root"
                className="fixed inset-0 overflow-hidden bg-desktop"
                aria-label="Desktop"
              >
                {/* Wallpaper — simplex-noise canvas over a tahoe-dawn fallback */}
                <Wallpaper />

                {/* Menu bar — 28px pinned to top, z-50 */}
                <MenuBar />

                {/* Desktop shortcut icons — left sidebar column, clears menu bar */}
                <DesktopShortcuts />

                {/* App windows — render the active route content inside window chrome */}
                <WindowRenderer>
                  {children}
                </WindowRenderer>

                {/* Dock — pinned to bottom, z-40 */}
                <Dock />

                <BootScreen />
              </div>
            </WindowManagerProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
