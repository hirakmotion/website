import type { ReactNode } from "react";
import { circlePath, cycloidParams, cycloidPath } from "@/lib/cycloid";
import { Reveal, SectionHeader, SpotlightCard, StatusPill } from "./ui";

type Entry = {
  id: string;
  title: string;
  specs: [string, string][];
  status: string;
  tone: "live" | "active" | "neutral";
  note: string;
  art: ReactNode;
};

const ink = { stroke: "currentColor", strokeWidth: 1.2, fill: "none" } as const;

function CycloidDrawing({ pins }: { pins: number }) {
  const p = cycloidParams(pins);
  const s = 58;
  const c = 80;
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full">
      <circle {...ink} cx={c} cy={c} r={s * 1.25} strokeDasharray="2 4" opacity="0.6" />
      {Array.from({ length: pins }, (_, k) => {
        const a = (k / pins) * Math.PI * 2;
        return <circle key={k} {...ink} cx={c + s * Math.cos(a)} cy={c + s * Math.sin(a)} r={s * p.pinRadius} />;
      })}
      <path
        d={cycloidPath(p, s, c + s * p.e, c) + circlePath(c + s * p.e, c, s * 0.2)}
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.2"
        fillRule="evenodd"
      />
      <path {...ink} d={`M${c - 76} ${c}h12M${c + 64} ${c}h12M${c} ${c - 76}v12M${c} ${c + 64}v12`} opacity="0.6" />
    </svg>
  );
}

const ENTRIES: Entry[] = [
  {
    id: "H-01",
    title: "Cycloidal actuator, stepper driven",
    specs: [
      ["Reducer", "Cycloidal, 49 : 1"],
      ["Motor", "Stepper"],
      ["Build", "3D printed"],
    ],
    status: "Built",
    tone: "active",
    note: "Our first working joint, and the first proof that our cycloid profiles mesh and carry load.",
    art: <CycloidDrawing pins={50} />,
  },
  {
    id: "H-02",
    title: "Cycloidal actuator, BLDC driven",
    specs: [
      ["Reducer", "Cycloidal, 45 : 1"],
      ["Motor", "BLDC, FOC"],
      ["Base", "Berkeley Humanoid Lite"],
    ],
    status: "Iterating",
    tone: "live",
    note: "Pushed an open design to 45 : 1. Backlash was high and it would not turn. Now reworking profile clearance, pin design and print tolerances.",
    art: <CycloidDrawing pins={46} />,
  },
  {
    id: "H-03",
    title: "Quasi-direct-drive joint",
    specs: [
      ["Reducer", "Planetary, single stage"],
      ["Motor", "BLDC, FOC"],
      ["Goal", "Backdrivable, torque from current"],
    ],
    status: "Next",
    tone: "neutral",
    note: "A low-ratio joint that feels force through motor current, for legged robots and exoskeletons.",
    art: (
      <svg viewBox="0 0 160 160" className="h-full w-full">
        <circle {...ink} cx="80" cy="80" r="66" />
        <circle cx="80" cy="80" r="16" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />
        {[0, 1, 2].map((k) => {
          const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
          return <circle key={k} {...ink} cx={80 + 38 * Math.cos(a)} cy={80 + 38 * Math.sin(a)} r="22" />;
        })}
        <circle {...ink} cx="80" cy="80" r="38" strokeDasharray="2 4" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "TR-1",
    title: "Back-to-back test rig",
    specs: [
      ["Method", "Actuator vs. actuator"],
      ["Measures", "Torque, efficiency, heat"],
      ["Output", "Public datasheets"],
    ],
    status: "Next",
    tone: "neutral",
    note: "One actuator drives, a second brakes, load cells measure. Every number we publish will come from here.",
    art: (
      <svg viewBox="0 0 160 160" className="h-full w-full">
        <rect {...ink} x="14" y="54" width="48" height="52" rx="6" />
        <rect {...ink} x="98" y="54" width="48" height="52" rx="6" />
        <rect x="62" y="74" width="36" height="12" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />
        <path {...ink} d="M80 74V44M72 44h16" />
        <path {...ink} d="M10 120h140" opacity="0.6" />
      </svg>
    ),
  },
];

export default function Lab() {
  return (
    <section id="lab" className="relative border-b border-line bg-bg-2 py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="06"
          eyebrow="From the bench"
          title="We publish what we build, including what didn't work."
          lead="Hardware is earned one iteration at a time. This is our build log, kept in the open."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {ENTRIES.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <SpotlightCard className="grid h-full grid-cols-1 gap-6 p-6 sm:grid-cols-[140px_minmax(0,1fr)] md:p-7">
                <div className="mx-auto h-36 w-36 text-copper-2 sm:h-[140px] sm:w-[140px]" aria-hidden="true">
                  {e.art}
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-xs tracking-[0.14em] text-ink-3">{e.id}</p>
                    <StatusPill tone={e.tone}>{e.status}</StatusPill>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">{e.title}</h3>
                  <dl className="mt-4 grid gap-1.5 text-sm">
                    {e.specs.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
                        <dt className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">{k}</dt>
                        <dd className="text-ink-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-ink-3">{e.note}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
