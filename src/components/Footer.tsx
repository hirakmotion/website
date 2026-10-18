import { nav, site } from "@/lib/site";
import { Logo } from "./ui";

export default function Footer() {
  const socials = site.socials.filter((s) => s.href);
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs leading-relaxed text-ink-3">{site.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Explore</p>
          <ul className="mt-4 grid gap-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-ink-2 transition-colors hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Connect</p>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <a href={`mailto:${site.email}`} className="text-ink-2 transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-ink-2 transition-colors hover:text-ink" target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="text-ink-2 transition-colors hover:text-ink">
                Start a project
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>Designed and built in {site.location}</p>
        </div>
      </div>
    </footer>
  );
}
