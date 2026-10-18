"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { Reveal, SectionHeader } from "./ui";

type Layer = {
  id: string;
  name: string;
  owner: "partners" | "hirak" | "you";
  what: string;
  role: string;
  icon: ReactNode;
};

const stroke = { stroke: "currentColor", strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const LAYERS: Layer[] = [
  {
    id: "magnet",
    name: "Magnet",
    owner: "partners",
    what: "Rare-earth or ferrite magnets. This is where the force comes from.",
    role: "We design magnet-flexible motors: Indian NdFeB as the new plants come online, Japanese supply, heavy-rare-earth-free grades, or ferrite.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <path {...stroke} d="M9 6v10a7 7 0 0 0 14 0V6M9 6h5v10a2 2 0 0 0 4 0V6h5" />
        <path {...stroke} d="M9 10h5M18 10h5" />
      </svg>
    ),
  },
  {
    id: "motor",
    name: "Motor",
    owner: "hirak",
    what: "Copper windings and magnets turn current into torque.",
    role: "BLDC and PMSM motors, frameless or housed, designed around your torque, speed and heat budget.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <circle {...stroke} cx="16" cy="16" r="11" />
        <circle {...stroke} cx="16" cy="16" r="4" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2;
          return <path key={k} {...stroke} d={`M${16 + 6 * Math.cos(a)} ${16 + 6 * Math.sin(a)}L${16 + 9 * Math.cos(a)} ${16 + 9 * Math.sin(a)}`} />;
        })}
      </svg>
    ),
  },
  {
    id: "drive",
    name: "Drive",
    owner: "hirak",
    what: "Power electronics and firmware decide how that torque is delivered.",
    role: "Field-oriented control drives with CAN-FD today and EtherCAT next, with calibration and thermal models in firmware.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <rect {...stroke} x="7" y="7" width="18" height="18" rx="2" />
        <rect {...stroke} x="12" y="12" width="8" height="8" rx="1" />
        <path {...stroke} d="M12 4v3M16 4v3M20 4v3M12 25v3M16 25v3M20 25v3M4 12h3M4 16h3M4 20h3M25 12h3M25 16h3M25 20h3" />
      </svg>
    ),
  },
  {
    id: "gearbox",
    name: "Gearbox",
    owner: "hirak",
    what: "Trades speed for torque, and shapes stiffness and backlash.",
    role: "Planetary, cycloidal and strain-wave stages, chosen and tuned for each joint rather than picked from a catalogue.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <circle {...stroke} cx="16" cy="16" r="12" />
        <circle {...stroke} cx="16" cy="16" r="3" />
        <circle {...stroke} cx="16" cy="8.5" r="3" />
        <circle {...stroke} cx="22.5" cy="20" r="3" />
        <circle {...stroke} cx="9.5" cy="20" r="3" />
      </svg>
    ),
  },
  {
    id: "actuator",
    name: "Actuator",
    owner: "hirak",
    what: "Motor, drive, gearbox and sensors working as one joint.",
    role: "Integrated joint modules with encoders, brakes and torque sensing, characterised on our test rig before they ship.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <rect {...stroke} x="5" y="9" width="16" height="14" rx="3" />
        <path {...stroke} d="M21 13h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4M9 9V6M13 9V6M17 9V6" />
      </svg>
    ),
  },
  {
    id: "machine",
    name: "Machine",
    owner: "you",
    what: "Robots, drones, exoskeletons, CNC and automation.",
    role: "Your machine. We design around it and support it from India, in your time zone.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <rect {...stroke} x="10" y="4" width="12" height="9" rx="3" />
        <path {...stroke} d="M16 13v4M9 17h14v7H9zM12 24v4M20 24v4M9 19l-4 4M23 19l4 4" />
        <circle cx="14" cy="8.5" r="1" fill="currentColor" />
        <circle cx="18" cy="8.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

const OWNER_LABEL = { partners: "Partners", hirak: "Hirak", you: "You" } as const;

export default function MotionStack() {
  const [active, setActive] = useState("actuator");
  const layer = LAYERS.find((l) => l.id === active)!;

  return (
    <section id="stack" className="relative border-b border-line py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="01"
          eyebrow="Where we sit"
          title={
            <>
              From magnet <span className="text-ink-3">to</span> motion.
            </>
          }
          lead="Every machine that moves runs on the same chain. India mines the ore and is building magnet plants, and machine builders are everywhere. The layer in between, motors, drives, gearboxes and actuators, is almost entirely imported. That is our layer."
        />

        <Reveal className="mt-16">
          <div className="relative">
            {/* Hirak bracket over layers 2-5 (desktop) */}
            <div className="pointer-events-none absolute -top-9 left-[16.66%] right-[16.66%] hidden md:block" aria-hidden="true">
              <div className="h-3 rounded-t-lg border-x border-t border-copper/70" />
              <p className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg px-3 font-mono text-[11px] uppercase tracking-[0.2em] text-copper-2">
                Hirak Motion
              </p>
            </div>

            {/* Current flowing through the chain */}
            <div className="absolute left-[8%] right-[8%] top-[46px] hidden h-px overflow-hidden bg-line-strong md:block" aria-hidden="true">
              <div className="animate-flow h-px w-1/4 bg-gradient-to-r from-transparent via-copper-2 to-transparent" />
            </div>

            <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
              {LAYERS.map((l, i) => {
                const selected = l.id === active;
                const ours = l.owner === "hirak";
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActive(l.id)}
                      onMouseEnter={() => setActive(l.id)}
                      className="group flex w-full flex-col items-center gap-3 rounded-2xl p-2 text-center"
                    >
                      <span
                        className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-full border transition-all duration-300 ${
                          selected
                            ? "border-copper bg-copper text-bg shadow-[0_0_48px_-6px_rgb(224_112_47/0.65)]"
                            : ours
                              ? "border-copper/50 bg-surface text-copper-2 group-hover:border-copper"
                              : "border-line-strong bg-surface text-ink-2 group-hover:border-ink-3"
                        }`}
                      >
                        {l.icon}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                        {String(i + 1).padStart(2, "0")} · {OWNER_LABEL[l.owner]}
                      </span>
                      <span className={`text-lg font-medium ${selected ? "text-ink" : "text-ink-2"}`}>{l.name}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface/60" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid gap-px bg-line md:grid-cols-2"
              >
                <div className="bg-surface p-7 md:p-9">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">What happens here</p>
                  <p className="mt-3 text-xl leading-snug text-ink md:text-2xl">{layer.what}</p>
                </div>
                <div className="bg-surface p-7 md:p-9">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper-2">
                    {layer.owner === "hirak" ? "What Hirak builds" : layer.owner === "you" ? "Where you come in" : "How Hirak works with it"}
                  </p>
                  <p className="mt-3 text-lg leading-relaxed text-ink-2">{layer.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
