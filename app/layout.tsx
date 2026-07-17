import type { ReactNode } from "react";

// Root layout exists only to provide the base HTML structure.
// All locale-specific rendering happens in app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
