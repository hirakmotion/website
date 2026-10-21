import type { ReactNode } from "react";
import { cycloidParams, cycloidPath, circlePath } from "@/lib/cycloid";
import { ArrowRight, Reveal, SectionHeader, SpotlightCard, StatusPill } from "./ui";

type Product = {
  code: string;
  name: string;
  kind: string;
  body: string;
  status: string;
  tone: "live" | "active" | "neutral";
  points: string[];
  art: ReactNode;
};

const line = { stroke: "currentColor", strokeWidth: 1.2, fill: "none" } as const;

const disc = cycloidParams(16);

const PRODUCTS: Product[] = [
  {
    code: "HJ",
    name: "Hirak Joint",
    kind: "Rotary actuators",
    body: "Quasi-direct-drive and cycloidal joint modules for legs, arms and exoskeletons.",
    status: "Prototyping",
    tone: "live",
    points: ["Backdrivable QDD and high-ratio cycloidal", "Dual encoders, optional brake", "Torque from current, or a sensor"],
    art: (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle {...line} cx="60" cy="60" r="52" />
        {Array.from({ length: 16 }, (_, k) => {
          const a = (k / 16) * Math.PI * 2;
          return <circle key={k} {...line} cx={60 + 40 * Math.cos(a)} cy={60 + 40 * Math.sin(a)} r={40 * disc.pinRadius} />;
        })}
        <path d={cycloidPath(disc, 40, 60 + 40 * disc.e, 60) + circlePath(60 + 40 * disc.e, 60, 8)} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" fillRule="evenodd" />
      </svg>
    ),
  },
  {
    code: "HD",
    name: "Hirak Drive",
    kind: "Servo drives",
    body: "Field-oriented control drives that make any brushless motor smooth, quiet and precise.",
    status: "In development",
    tone: "active",
    points: ["FOC with current, velocity and position loops", "CAN-FD now, EtherCAT next", "Thermal model and fault logging"],
    art: (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <rect {...line} x="18" y="18" width="84" height="84" rx="6" />
        <rect x="42" y="42" width="36" height="36" rx="3" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" />
        {[30, 48, 66, 84].map((v) => (
          <g key={v}>
            <path {...line} d={`M${v} 18v-8M${v} 102v8M18 ${v}h-8M102 ${v}h8`} />
          </g>
        ))}
        <path {...line} d="M42 60h-14M78 60h14M60 42V28M60 78v14" />
      </svg>
    ),
  },
  {
    code: "HC",
    name: "Hirak Core",
    kind: "BLDC & PMSM motors",
    body: "Frameless and housed motors, designed to run on Indian, Japanese or ferrite magnets.",
    status: "Design phase",
    tone: "neutral",
    points: ["Outrunner and inrunner topologies", "Magnet-flexible designs", "Winding options per voltage"],
    art: (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle {...line} cx="60" cy="60" r="52" />
        <circle {...line} cx="60" cy="60" r="44" />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k / 12) * Math.PI * 2;
          const x = 60 + 32 * Math.cos(a);
          const y = 60 + 32 * Math.sin(a);
          return (
            <rect
              key={k}
              x={x - 5}
              y={y - 8}
              width="10"
              height="16"
              rx="2"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
              fill="currentColor"
              fillOpacity={k % 2 ? 0.08 : 0.2}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          );
        })}
        <circle {...line} cx="60" cy="60" r="14" />
      </svg>
    ),
  },
  {
    code: "HL",
    name: "Hirak Linear",
    kind: "Linear actuators & gearmotors",
    body: "Screw-driven linear actuators and compact gearmotors for automation and mobile machines.",
    status: "On the roadmap",
    tone: "neutral",
    points: ["Ball and lead screw stages", "Integrated drive option", "Sealed variants"],
    art: (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <rect {...line} x="10" y="46" width="62" height="28" rx="4" />
        <rect x="72" y="54" width="38" height="12" rx="3" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" />
        {Array.from({ length: 9 }, (_, k) => (
          <path key={k} {...line} d={`M${18 + k * 6} 50l4 20`} />
        ))}
      </svg>
    ),
  },
];

export default function Platform() {
  return (
    <section id="platform" className="relative border-b border-line py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="02"
          eyebrow="Platform"
          title="One motion core. Many products."
          lead="BLDC motors, servos and actuators share the same core: electromagnetics, power electronics, control firmware and gearing. We build that core once, then shape it into whatever your machine needs."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.code} delay={i * 0.06}>
              <SpotlightCard className="flex h-full flex-col p-6 sm:p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="min-w-0 pt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                    {p.code} · {p.kind}
                  </p>
                  <StatusPill tone={p.tone}>{p.status}</StatusPill>
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{p.name}</h3>
                <p className="mt-4 text-pretty leading-relaxed text-ink-2">{p.body}</p>
                <div className="mt-5 grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-end gap-5">
                  <ul className="space-y-2 text-sm text-ink-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-copper" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="h-20 w-20 text-copper-2 opacity-80 sm:h-24 sm:w-24 md:h-28 md:w-28" aria-hidden="true">
                    {p.art}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}

          <Reveal className="lg:col-span-2">
            <SpotlightCard
              as="a"
              href="#custom"
              className="group flex flex-col justify-between gap-6 border-copper/30 bg-gradient-to-br from-copper/[0.08] via-surface/60 to-surface/60 p-7 md:flex-row md:items-center md:p-9"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper-2">HX · Custom</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                  Hirak Custom: actuators designed around your machine.
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
                  Tell us the torque, speed, size and environment. We design, prototype and test the joint so you can get
                  back to building the robot.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-copper px-5 py-3 text-sm font-medium text-bg transition-colors group-hover:bg-copper-2">
                Taking design partners <ArrowRight />
              </span>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal className="mt-4">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Python SDK", "Command, log and tune from a notebook."],
              ["ROS 2 driver", "Drop-in for robot software stacks."],
              ["Simulation models", "Measured friction and thermal parameters, not guesses."],
              ["Calibration data", "Per-unit records shipped with every joint."],
            ].map(([t, d]) => (
              <div key={t} className="bg-bg-2 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Software is part of the actuator. Planned for every Hirak product.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
