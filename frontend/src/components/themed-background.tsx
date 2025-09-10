"use client";

import { useTheme } from "next-themes";
import React from "react";

export function ThemedBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full relative transition-colors duration-500 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      {theme === "dark" ? (
        // 🌌 Cosmic Noise (dark)
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%),
              linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)
            `,
          }}
        />
      ) : (
        // 🔵 Cool Blue Glow (light)
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
              radial-gradient(
                circle at top center,
                rgba(70, 130, 180, 0.5),
                transparent 70%
              )
            `,
            filter: "blur(80px)",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Your app content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
