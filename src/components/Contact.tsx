"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { ArrowRight, CycloidMark, Reveal } from "./ui";

const BUILDING = [
  "Humanoid robot",
  "Quadruped",
  "Robot arm or cobot",
  "Exoskeleton or prosthetic",
  "Drone",
  "Industrial machine",
  "Research or teaching",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-ink placeholder:text-ink-3/70 transition-colors focus:border-copper focus:outline-none";

export function NameStory() {
  return (
    <section className="relative overflow-hidden border-b border-line py-28 md:py-36" aria-labelledby="name-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p lang="sa" className="font-deva text-[clamp(6rem,18vw,13rem)] leading-none text-copper-2">
            हीरक
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">The name</p>
          <h2 id="name-title" className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
            Hirak means diamond.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            In Sanskrit, hīraka is the diamond: hard, precise and built to last. That is what a joint should be. Hirak
            Motion is precision that moves.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    if (site.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(site.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
        form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }

    // No form backend configured: open the visitor's email app instead.
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organisation: ${data.org || "-"}`,
      `Building: ${data.building}`,
      `Torque / speed needs: ${data.specs || "-"}`,
      "",
      data.message,
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry: ${data.building}`)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_20%_30%,black,transparent)]" aria-hidden="true" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
            <span className="text-copper-2">08</span>
            <span className="h-px w-8 bg-line-strong" />
            Contact
          </p>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">
            Building something that needs to move?
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Robot makers, labs, drone teams and machine builders: tell us about your joint. We reply to every message.
          </p>
          <a href={`mailto:${site.email}`} className="mt-8 inline-flex items-center gap-2 text-lg text-ink underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-copper">
            {site.email}
          </a>
          <CycloidMark className="mt-16 hidden h-40 w-40 text-line-strong lg:block" />
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface/70 p-6 backdrop-blur md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm text-ink-2">
                  Name
                </label>
                <input id="name" name="name" required autoComplete="name" className={`${field} mt-2`} />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-ink-2">
                  Email
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className={`${field} mt-2`} />
              </div>
              <div>
                <label htmlFor="org" className="text-sm text-ink-2">
                  Organisation <span className="text-ink-3">(optional)</span>
                </label>
                <input id="org" name="org" autoComplete="organization" className={`${field} mt-2`} />
              </div>
              <div>
                <label htmlFor="building" className="text-sm text-ink-2">
                  What are you building?
                </label>
                <select id="building" name="building" required defaultValue="" className={`${field} mt-2 appearance-none`}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {BUILDING.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="specs" className="text-sm text-ink-2">
                  Torque and speed needs <span className="text-ink-3">(optional)</span>
                </label>
                <input id="specs" name="specs" placeholder="e.g. 40 Nm peak, 120 rpm" className={`${field} mt-2`} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm text-ink-2">
                  Tell us about the project
                </label>
                <textarea id="message" name="message" required rows={5} className={`${field} mt-2 resize-y`} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink-3" role="status" aria-live="polite">
                {status === "sending" && "Sending…"}
                {status === "sent" && "Thank you. We'll be in touch soon."}
                {status === "error" && `Something went wrong. Please email ${site.email}.`}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-copper-2 disabled:opacity-60"
              >
                Send message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
