import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-instrument", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

const title = "H-02 cycloidal actuator · Hirak Motion";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  keywords: ["cycloidal actuator", "cycloidal drive", "robot actuator", "quasi-direct drive", "BLDC actuator", "robotics India", "Hirak Motion", "H-02"],
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "The H-02 cycloidal actuator on a dark background" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@hirakmotion", title, description: site.description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#121314",
  colorScheme: "dark",
};

// three.js for the 3D viewer is loaded as an ES module; the import map tells the browser where "three" lives.
const importMap = JSON.stringify({
  imports: {
    three: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
  },
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script type="importmap" dangerouslySetInnerHTML={{ __html: importMap }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
