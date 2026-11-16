import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="wrap notfound">
      <p className="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <p className="lede">The link may be old. The H-02 page has the drawings, the datasheet and the contact form.</p>
      <p>
        <a className="btn" href="/">
          Go to H-02
        </a>
      </p>
    </main>
  );
}
