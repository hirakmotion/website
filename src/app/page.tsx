import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";

// The page markup lives in src/content/home.html (ported 1:1 from design round 4) and is read at build time.
// The interactive parts are small framework-free scripts in public/js.
const html = readFileSync(join(process.cwd(), "src/content/home.html"), "utf8");

const title = "H-02 cycloidal actuator for robot joints · Hirak Motion";
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "The H-02 cycloidal actuator, a black 70 mm cylinder with a steel bearing ring, on a dark background",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { title, description: site.description, url: "/", siteName: site.name, images: [ogImage], locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image", site: "@hirakmotion", title, description: site.description, images: [ogImage] },
};

const u = site.url;
// Structured data. There is deliberately no offers/review/aggregateRating on the Product: H-02 has no price yet.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${u}/#org`,
      name: site.name,
      alternateName: site.shortName,
      url: `${u}/`,
      logo: { "@type": "ImageObject", url: `${u}/logo.png`, width: 512, height: 512 },
      description: "Hirak Motion designs and builds actuators and drives for robots, in India.",
      email: site.email,
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, availableLanguage: "en" },
      sameAs: site.socials.map((s) => s.href).filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": `${u}/#website`,
      name: site.name,
      alternateName: [site.shortName, "hirakmotion.com"],
      url: `${u}/`,
      inLanguage: "en",
      publisher: { "@id": `${u}/#org` },
    },
    {
      "@type": "WebPage",
      "@id": `${u}/#webpage`,
      url: `${u}/`,
      name: title,
      description: site.description,
      inLanguage: "en",
      isPartOf: { "@id": `${u}/#website` },
      about: { "@id": `${u}/#org` },
      mainEntity: { "@id": `${u}/#h-02` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${u}/og.png`, width: 1200, height: 630 },
    },
    {
      "@type": "Product",
      "@id": `${u}/#h-02`,
      name: "H-02 cycloidal actuator",
      model: "H-02",
      category: "Robot joint actuator",
      url: `${u}/`,
      description:
        "A 40:1 single-stage cycloidal actuator for robot joints: a 5010 outrunner motor, two opposed cycloidal discs and 41 ring pins in a 70 mm housing. Working prototype with FDM-printed PLA parts. Torque, backlash and mass are not yet measured.",
      image: [`${u}/og.png`, `${u}/assets/h02_hero_dark.webp`, `${u}/assets/h02_cutaway_dark.webp`],
      brand: { "@type": "Brand", name: site.name },
      manufacturer: { "@id": `${u}/#org` },
      countryOfOrigin: { "@type": "Country", name: "India" },
      material: "PLA (FDM printed) with steel bearings and screws",
      additionalProperty: [
        { "@type": "PropertyValue", name: "Reduction ratio", value: "40:1" },
        { "@type": "PropertyValue", name: "Reducer", value: "Single-stage cycloidal, two opposed discs, 41 ring pins, 40 lobes" },
        { "@type": "PropertyValue", name: "Eccentricity", value: 0.65, unitText: "mm" },
        { "@type": "PropertyValue", name: "Housing diameter", value: 70, unitText: "mm" },
        { "@type": "PropertyValue", name: "Length", value: 61.9, unitText: "mm" },
        { "@type": "PropertyValue", name: "Motor", value: "5010 outrunner, 360 KV" },
        { "@type": "PropertyValue", name: "Output interface", value: "6 × M3 on Ø34 mm" },
        { "@type": "PropertyValue", name: "Bearings", value: "2 × 6809ZZ, 2 × 6701-2RS, 13 × MR106-2RS" },
        { "@type": "PropertyValue", name: "Development status", value: "Working prototype, first run 31 October 2026" },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        dangerouslySetInnerHTML={{ __html: `window.HIRAK=${JSON.stringify({ endpoint: site.formEndpoint, email: site.email })};` }}
      />
      <div dangerouslySetInnerHTML={{ __html: html }} style={{ display: "contents" }} />
    </>
  );
}
