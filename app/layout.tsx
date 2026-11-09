import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { profile } from "@/data/profile";

// Runs before the page paints: if the visitor previously chose light mode,
// set it now so there's no flash of the wrong theme on load.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.dataset.theme='light';}}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.firstName} ${profile.lastName} — ${profile.role}`;
const description =
  "Portfolio of Gianne Marcko G. Aure, a BS Computer Engineering student at Cavite State University. Projects in AI, embedded systems, and software.";

export const metadata: Metadata = {
  // Lets Next turn relative URLs (like the generated OG image) into absolute ones.
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: `${profile.firstName} ${profile.lastName}`,
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
