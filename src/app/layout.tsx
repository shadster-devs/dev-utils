import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";
import { Wrench } from "lucide-react";

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

export const metadata: Metadata = {
  title: 'Developer Utils - Simple, Fast, and Free Developer Tools',
  description: 'A collection of free developer tools including JSON formatter, SQL formatter, Base64 encoder/decoder, Unix timestamp converter, and more.',
  keywords: 'developer tools, json formatter, sql formatter, base64 encoder, timestamp converter, diff tool',
  authors: [{ name: 'Developer Utils' }],
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: 'Developer Utils - Simple, Fast, and Free Developer Tools',
    description: 'A collection of free developer tools including JSON formatter, SQL formatter, Base64 encoder/decoder, Unix timestamp converter, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Utils - Simple, Fast, and Free Developer Tools',
    description: 'A collection of free developer tools including JSON formatter, SQL formatter, Base64 encoder/decoder, Unix timestamp converter, and more.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/icon" /><Wrench />
        <title>Developer Utils</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
