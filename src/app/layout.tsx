// this is the root layout for the app
// it is used by nextjs directly without invoking

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "../components/theme";

const manrope = Manrope({
subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LoomClone-Web",
  description: "Share videos with your team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.className} bg-[#171717]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </ThemeProvider> 
      </body>
    </html>
  );
}
