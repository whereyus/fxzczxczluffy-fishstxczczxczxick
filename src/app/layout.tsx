import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Font for our application
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Help Center - Action Needed",
  description: "X Help Center - Account action needed for copyright violation appeals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
