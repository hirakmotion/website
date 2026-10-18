import { ButtonLink, Reveal, SectionHeader } from "./ui";

const STEPS = [
  {
    n: "01",
    title: "Define",
    body: "Torque, speed, size, mass, voltage, bus and environment. We turn your machine's needs into a joint specification.",
  },
  {
    n: "02",
    title: "Model",
    body: "Electromagnetic, thermal and gear sizing, so the first prototype is already close.",
  },
  {
    n: "03",
    title: "Prototype",
    body: "Printed and machined iterations on our bench. A good actuator takes hundreds of them, and we do them so you don't have to.",
  },
  {
    n: "04",
    title: "Prove",
    body: "Torque–speed and efficiency maps, thermal plateau, backlash, stiffness and life hours, measured on our test rig and shared with you.",
  },
  {
    n: "05",
    title: "Build",
    body: "Small batches with calibration records, documentation, spares and support from India.",
  },
];

const NEEDS = [
  "Peak and continuous torque",
  "Speed range",
  "Size envelope and mass budget",
  "Supply voltage",
  "Communication bus",
  "Environment: dust, water, temperature",
  "Quantity and timeline",
];

export default function Custom() {
  return (
    <section id="custom" className="relative border-b border-line py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="04"
          eyebrow="Custom actuators"
          title={
            <>
              Every joint, a thousand iterations. <span className="text-ink-3">We do them for you.</span>
            </>
          }
          lead="Off-the-shelf actuators force your robot around their limits. We design the joint around your machine instead, from the first spec sheet to a tested batch."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="relative">
            <span className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-copper via-line-strong to-line" aria-hidden="true" />
            <ol className="relative">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.05} className="relative grid grid-cols-[40px_1fr] gap-6 pb-10 last:pb-0">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-xs text-copper-2">
                  {s.n}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </Reveal>
            ))}
            </ol>
          </div>

          <Reveal delay={0.1}>
            <aside className="sticky top-24 rounded-2xl border border-line bg-surface/70 p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper-2">To start, send us</p>
              <ul className="mt-5 space-y-3">
                {NEEDS.map((n) => (
                  <li key={n} className="flex gap-3 text-sm text-ink-2">
                    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink-3">Don&apos;t have all of it yet? That&apos;s normal. We&apos;ll work it out together.</p>
              <div className="mt-6">
                <ButtonLink href="#contact">Start a project</ButtonLink>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
