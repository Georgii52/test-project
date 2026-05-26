import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Журнал работ",
  description: "Журнал работ на строительных участках. Тестовое задание.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased max-w-4xl mx-auto`}
    >
      <body className="h-full flex flex-col">
        <QueryProvider>
          <Toaster position="top-center" reverseOrder={true} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
