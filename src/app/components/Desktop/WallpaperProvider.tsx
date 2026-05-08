"use client";

import { createContext, useContext, useState } from "react";

export type WallpaperType = "flow-field" | "tahoe-dawn";

interface WallpaperContextValue {
  wallpaper: WallpaperType;
  setWallpaper: (w: WallpaperType) => void;
}

const WallpaperContext = createContext<WallpaperContextValue>({
  wallpaper: "flow-field",
  setWallpaper: () => {},
});

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [wallpaper, setWallpaper] = useState<WallpaperType>("tahoe-dawn");
  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
