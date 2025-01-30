import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const beaufort = localFont({
  src: "./fonts/BeaufortforLOL-Bold.ttf",
  variable: "--font-beaufort",
  weight: "100 900",
});
const spiegel = localFont({
  src: "./fonts/SpiegelSans.woff2",
  variable: "--font-spiegel",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Skinventory",
  description: "League of Legends Skin Inventory Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beaufort.variable} ${spiegel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
