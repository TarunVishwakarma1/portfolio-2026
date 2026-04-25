// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import PreloaderScreen from "./components/PreloaderScreen";
import ScrollProgressBar from "./components/ScrollProgressBar";

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

const BASE_URL = "https://tarunvishwakarma.dev";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Tarun Vishwakarma — Full Stack Developer",
    template: "%s | Tarun Vishwakarma",
  },
  description:
    "Senior full stack developer based in Delhi, India. Building fast, precise software with Next.js, React, Node.js, and Go. 4+ years shipping products that scale.",

  keywords: [
    "Tarun Vishwakarma",
    "Full Stack Developer",
    "Senior Software Engineer",
    "Next.js Developer",
    "React Developer",
    "Node.js",
    "Go Developer",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Portfolio",
    "Delhi India Developer",
    "Frontend Developer",
    "Backend Developer",
    "Freelance Developer India",
    "Three.js",
    "PostgreSQL",
    "Vercel",
    "AWS",
    "Docker",
  ],

  authors: [{ name: "Tarun Vishwakarma", url: BASE_URL }],
  creator: "Tarun Vishwakarma",
  publisher: "Tarun Vishwakarma",
  category: "technology",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Tarun Vishwakarma — Full Stack Developer",
    description:
      "Senior full stack developer based in Delhi, India. Building fast, precise software with Next.js, React, Node.js, and Go.",
    siteName: "Tarun Vishwakarma",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tarun Vishwakarma — Full Stack Developer",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@Assassingod5",
    creator: "@Assassingod5",
    title: "Tarun Vishwakarma — Full Stack Developer",
    description:
      "Senior full stack developer in Delhi. Next.js, React, Node.js, Go. 4+ years shipping products that scale.",
    images: [
      {
        url: OG_IMAGE,
        alt: "Tarun Vishwakarma — Full Stack Developer",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Tarun Vishwakarma",
    url: BASE_URL,
    email: "hello@tarunvishwakarma.dev",
    jobTitle: "Senior Full Stack Developer",
    description:
      "Senior full stack developer based in Delhi, India. Building fast, precise software with Next.js, React, Node.js, and Go.",
    image: `${BASE_URL}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Next.js", "React", "TypeScript", "JavaScript", "Node.js", "Go",
      "PostgreSQL", "Redis", "Docker", "AWS", "Vercel", "Three.js", "GSAP",
    ],
    sameAs: [
      "https://github.com/TarunVishwakarma1",
      "https://www.linkedin.com/in/tarunvishwakarma28/",
      "https://x.com/Assassingod5",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Self-Employed",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Tarun Vishwakarma",
    description: "Portfolio of Tarun Vishwakarma, Senior Full Stack Developer.",
    author: { "@id": `${BASE_URL}/#person` },
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: "Tarun Vishwakarma — Full Stack Developer",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#person` },
    description:
      "Senior full stack developer based in Delhi, India. Building fast, precise software with Next.js, React, Node.js, and Go.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "ReadAction",
      target: [BASE_URL],
    },
  },
];

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
        <ScrollProgressBar />
        <PreloaderScreen />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
