import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarunvishwakarma.dev"),
  title: "Tarun Vishwakarma | Full Stack Developer & Software Engineer",
  description: "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in Next.js, React, and modern web technologies. Building high-performance web applications.",
  keywords: ["Tarun Vishwakarma", "Software Engineer", "Full Stack Developer", "Next.js", "React", "Portfolio", "Web Development", "JavaScript", "TypeScript"],
  authors: [{ name: "Tarun Vishwakarma", url: "https://tarunvishwakarma.dev" }],
  creator: "Tarun Vishwakarma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tarunvishwakarma.dev",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description: "Explore the portfolio of Tarun Vishwakarma, building modern web experiences with Next.js and React.",
    siteName: "Tarun Vishwakarma Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/138651451?v=1", // Assuming user might add this later, or we act as placeholder
        width: 1200,
        height: 630,
        alt: "Tarun Vishwakarma Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description: "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in modern web tech.",
    creator: "@Assassingod5", // Placeholder, beneficial if true
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
    "https://github.com/TarunVishwakarma1", // Placeholder: common for devs
    "https://www.linkedin.com/in/tarun-vishwakarma-a97b021b2/", // Placeholder
    "https://x.com/Assassingod5", // Placeholder
  ],
  worksFor: {
    "@type": "Organization",
    name: "Self-Employed",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
