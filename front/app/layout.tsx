import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const beaufortBold = localFont({
  src: "./fonts/BeaufortforLOL-Bold.ttf",
  variable: "--font-beaufort-bold",
  weight: "700", // Bold
});

const beaufortMedium = localFont({
  src: "./fonts/BeaufortforLOL-Medium.ttf",
  variable: "--font-beaufort-medium",
  weight: "500", // Medium
});

const spiegelRegular = localFont({
  src: "./fonts/Spiegel_TT_Regular.ttf",
  variable: "--font-spiegel-regular",
  weight: "400", // Regular
});

export const metadata: Metadata = {
  title: "PS challenge",
  description: "Lequel de ses deux dégén explose l'autre ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${beaufortBold.variable} ${beaufortMedium.variable} ${spiegelRegular.variable} ${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
