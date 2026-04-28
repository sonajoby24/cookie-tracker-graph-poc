import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Tracker Graph Intelligence",
  description: "DEXTERE-style cookie intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}