import { Reveal, SectionHeader } from "./ui";

const STATS = [
  {
    value: "50–60%",
    label: "of a humanoid robot's bill of materials is its actuators",
    source: "Morgan Stanley, Schaeffler and Hyundai Mobis estimates, 2026",
  },
  {
    value: "~80%",
    label: "of motors and controllers in Indian military drones trace back to Chinese supply",
    source: "Zen Technologies estimate, July 2026",
  },
  {
    value: "0",
    label: "Indian makers of harmonic or cycloidal robot reducers today",
    source: "Cofacto, September 2026",
  },
  {
    value: "₹7,280 cr",
    label: "India's rare-earth magnet scheme. The magnets are coming; someone has to turn them into motion",
    source: "Government of India, November 2025",
  },
];

const PRINCIPLES = [
  {
    title: "Traceable supply",
    body: "Magnet-flexible designs and documented sourcing. No single-country dependency, and nothing a defence buyer can't trace.",
  },
  {
    title: "Honest datasheets",
    body: "Continuous torque at a stated temperature, efficiency maps, backlash and life hours, measured on our rig. Not peak numbers from a brochure.",
  },
  {
    title: "Software included",
    body: "Python and ROS 2 drivers, calibration data and simulation models ship with the hardware, because integration is where projects stall.",
  },
  {
    title: "Engineers next door",
    body: "Design, support and spares from India, in your time zone, invoiced in rupees.",
  },
];

export default function Why() {
  return (
    <section id="why" className="relative overflow-hidden border-b border-line py-28 md:py-36">
      <div
        className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-copper/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <SectionHeader
          index="05"
          eyebrow="Why Hirak, why India"
          title={
            <>
              Cheap made motion common. <span className="text-copper-2">We&apos;ll make it trusted.</span>
            </>
          }
          lead="India has the engineers, the ore and the ambition. What it imports is the layer in between: the motors, drives and actuators that make machines move. We are building that layer here, and we intend to win on trust, not just on price."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 0.06} className="bg-bg">
              <div className="flex h-full flex-col p-7">
                <p className="whitespace-nowrap text-5xl font-semibold tracking-[-0.04em] text-ink">{s.value}</p>
                <p className="mt-4 flex-1 text-pretty leading-relaxed text-ink-2">{s.label}</p>
                <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink-3">{s.source}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="border-t border-line-strong pt-6">
                <p className="font-mono text-xs text-copper-2">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ink-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
