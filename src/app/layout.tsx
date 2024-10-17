import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "../lib/SessionProvider";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

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

const QuickSandLight = localFont({
  src: "./fonts/Quicksand-Light.ttf",
  variable: "--font-quicksand-Light",
  weight: "100 300",
});

const QuickSandRegular = localFont({
  src: "./fonts/Quicksand-Regular.ttf",
  variable: "--font-quicksand-Regular",
  weight: "400",
});

const QuickSandMedium = localFont({
  src: "./fonts/Quicksand-Medium.ttf",
  variable: "--font-quicksand-Medium",
  weight: "500 600",
});

const QuickSandSemiBold = localFont({
  src: "./fonts/Quicksand-SemiBold.ttf",
  variable: "--font-quicksand-SemiBold",
  weight: "700 800",
});

const QuickSandBold = localFont({
  src: "./fonts/Quicksand-Bold.ttf",
  variable: "--font-quicksand-Bold",
  weight: "900",
});

export const metadata: Metadata = {
  title: "GLA Codify",
  description: "Code editor for GLA students",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${QuickSandLight.variable} ${QuickSandRegular.variable} ${QuickSandMedium.variable} ${QuickSandSemiBold.variable} ${QuickSandBold.variable} font-quicksandRegular antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
