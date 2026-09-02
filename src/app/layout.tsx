import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BreadBreakers",
  description: "Rebuilding the town square, one table at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
