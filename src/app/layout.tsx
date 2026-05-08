import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import MenuBar from "./components/MenuBar/MenuBar";
import Dock from "./components/Dock/Dock";
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
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <WindowManagerProvider>
            {/* Desktop shell root — persistent across all route changes */}
            <div
              id="desktop-root"
              className="fixed inset-0 overflow-hidden bg-desktop"
              aria-label="Desktop"
            >
              {/* Wallpaper — tahoe-dawn gradient with animated blobs and grain overlay */}
              <Wallpaper />

              {/* Menu bar — 28px pinned to top, z-50 */}
              <MenuBar />

              {/* Desktop shortcut icons — left sidebar column, clears menu bar */}
              <DesktopShortcuts />

              {/* App windows — rendered above wallpaper/shortcuts, below menu bar/dock */}
              <WindowRenderer />

              {/* Page content area — between menu bar (28px) and dock (~80px) */}
              <main
                className="absolute left-0 right-0 overflow-hidden"
                style={{ top: 28, bottom: 80 }}
                aria-label="Desktop content area"
              >
                {children}
              </main>

              {/* Dock — pinned to bottom, z-40 */}
              <Dock />
            </div>
          </WindowManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
