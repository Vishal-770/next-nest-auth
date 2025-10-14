import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Auth App",
  description: "Secure authentication system with Next.js and NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
