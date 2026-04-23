// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import PreloaderScreen from "./components/PreloaderScreen";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarunvishwakarma.dev"),
  title: "Tarun Vishwakarma | Full Stack Developer & Software Engineer",
  description:
    "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in Next.js, React, and modern web technologies. Building high-performance web applications.",
  keywords: [
    "Tarun Vishwakarma",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Portfolio",
    "Web Development",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Tarun Vishwakarma", url: "https://tarunvishwakarma.dev" }],
  creator: "Tarun Vishwakarma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tarunvishwakarma.dev",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description:
      "Explore the portfolio of Tarun Vishwakarma, building modern web experiences with Next.js and React.",
    siteName: "Tarun Vishwakarma Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/138651451?v=1",
        width: 1200,
        height: 630,
        alt: "Tarun Vishwakarma Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description:
      "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in modern web tech.",
    creator: "@Assassingod5",
    images: ["https://avatars.githubusercontent.com/u/138651451?v=1"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tarun Vishwakarma",
  url: "https://tarunvishwakarma.dev",
  jobTitle: "Senior Software Engineer",
  sameAs: [
    "https://github.com/TarunVishwakarma1",
    "https://www.linkedin.com/in/tarunvishwakarma28/",
    "https://x.com/Assassingod5",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Self-Employed",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Runs before first paint — disables browser scroll restoration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className={`${geistMono.variable} ${cormorant.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PreloaderScreen />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
