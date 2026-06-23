import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ 
  variable: "--font-sans", 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "My Store",
  description: "Your one-stop shop for everything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
