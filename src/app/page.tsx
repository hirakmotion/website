import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";

// The page markup lives in src/content/home.html (ported 1:1 from design round 4) and is read at build time.
// The interactive parts are small framework-free scripts in public/js.
const html = readFileSync(join(process.cwd(), "src/content/home.html"), "utf8");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      email: site.email,
      logo: `${site.url}/icon.svg`,
      sameAs: site.socials.map((s) => s.href).filter(Boolean),
    },
    {
      "@type": "Product",
      name: "H-02 cycloidal actuator",
      description:
        "A 40:1 cycloidal actuator with a 5010 outrunner motor, two opposed cycloidal discs and 41 pins in a 70 mm housing. Prototype, designed and printed in India.",
      brand: { "@id": `${site.url}/#org` },
      image: `${site.url}/assets/h02_hero_dark.webp`,
      additionalProperty: [
        { "@type": "PropertyValue", name: "Reduction ratio", value: "40:1" },
        { "@type": "PropertyValue", name: "Housing", value: "Ø70 × 62 mm" },
        { "@type": "PropertyValue", name: "Eccentricity", value: "0.65 mm" },
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
