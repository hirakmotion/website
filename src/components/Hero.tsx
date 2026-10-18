"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { circlePath, cycloidParams, cycloidPath } from "@/lib/cycloid";
import { ButtonLink, StatusPill } from "./ui";

const CycloidScene = dynamic(() => import("./CycloidScene"), { ssr: false });

const RATIOS = [
  { pins: 12, label: "11:1" },
  { pins: 16, label: "15:1" },
  { pins: 20, label: "19:1" },
];

const BUILT_FOR = [
  "Humanoids",
  "Quadrupeds",
  "Robot arms",
  "Exoskeletons",
  "Drones",
  "Cobots",
  "CNC & automation",
  "Prosthetics",
  "Research labs",
];

function StaticDrive({ pins }: { pins: number }) {
  const p = cycloidParams(pins);
  const s = 150;
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <circle cx="200" cy="200" r={s * 1.3} fill="none" stroke="var(--color-line-strong)" strokeWidth="2" />
      {Array.from({ length: pins }, (_, k) => {
        const a = (k / pins) * Math.PI * 2;
        return (
          <circle key={k} cx={200 + s * Math.cos(a)} cy={200 + s * Math.sin(a)} r={s * p.pinRadius} fill="var(--color-steel)" />
        );
      })}
      <path
        d={cycloidPath(p, s, 200 + s * p.e, 200) + circlePath(200 + s * p.e, 200, s * 0.2)}
        fill="var(--color-copper)"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [pins, setPins] = useState(12);
  const [webglFailed, setWebglFailed] = useState(false);
  const inRef = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback((inputRev: number, outputRev: number) => {
    if (inRef.current) inRef.current.textContent = inputRev.toFixed(2);
    if (outRef.current) outRef.current.textContent = outputRev.toFixed(3);
  }, []);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
        };

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div
        className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[640px] w-[640px] rounded-full bg-copper/20 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-x relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-10">
        <div className="relative z-10">
          <motion.div {...fade(0)}>
            <StatusPill tone="live">Prototyping in India · 2026</StatusPill>
          </motion.div>
          <motion.h1
            {...fade(0.08)}
            className="mt-7 text-balance text-[clamp(2.75rem,6.4vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          >
            We build the <span className="text-copper-2">muscles</span> of machines.
          </motion.h1>
          <motion.p {...fade(0.16)} className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-2 md:text-xl">
            Hirak Motion designs motors, drives and actuators that turn electricity into precise, measurable motion,
            for robots, drones and the machines India will build next.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#custom">Start a custom actuator</ButtonLink>
            <ButtonLink href="#platform" variant="ghost">
              Explore the platform
            </ButtonLink>
          </motion.div>
          <motion.p {...fade(0.32)} className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">
            BLDC · PMSM · FOC drives · Planetary · Cycloidal · Strain-wave
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-[600px]"
        >
          {/* Engineering frame */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map(
              (c) => (
                <span key={c} className={`absolute h-6 w-6 border-ink-3/70 ${c}`} />
              ),
            )}
          </div>

          <div className="absolute inset-0">
            {webglFailed ? (
              <StaticDrive pins={pins} />
            ) : (
              <CycloidScene pins={pins} onFrame={onFrame} onFail={() => setWebglFailed(true)} className="h-full w-full" />
            )}
          </div>

          <div className="absolute left-4 top-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-3">
            <p className="text-ink-2">Cycloidal reducer</p>
            <p>Live kinematics</p>
          </div>

          <div className="absolute right-4 top-4 flex gap-1 rounded-full border border-line-strong bg-bg/70 p-1 backdrop-blur" role="group" aria-label="Reduction ratio">
            {RATIOS.map((r) => (
              <button
                key={r.pins}
                type="button"
                aria-pressed={pins === r.pins}
                onClick={() => setPins(r.pins)}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wider transition-colors ${
                  pins === r.pins ? "bg-copper text-bg" : "text-ink-2 hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <dl className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line font-mono text-[11px] uppercase tracking-[0.12em]">
            <div className="bg-bg/80 px-3 py-2.5 backdrop-blur">
              <dt className="text-ink-3">Input</dt>
              <dd className="mt-1 text-sm normal-case tracking-normal text-ink tabular-nums">
                <span ref={inRef}>0.00</span> rev
              </dd>
            </div>
            <div className="bg-bg/80 px-3 py-2.5 backdrop-blur">
              <dt className="text-ink-3">Output</dt>
              <dd className="mt-1 text-sm normal-case tracking-normal text-copper-2 tabular-nums">
                <span ref={outRef}>0.000</span> rev
              </dd>
            </div>
            <div className="bg-bg/80 px-3 py-2.5 backdrop-blur">
              <dt className="text-ink-3">Ratio</dt>
              <dd className="mt-1 text-sm normal-case tracking-normal text-ink tabular-nums">{pins - 1} : 1</dd>
            </div>
          </dl>
        </motion.div>
      </div>

      <div className="relative border-y border-line bg-bg-2/80">
        <div className="container-x flex items-center gap-6 py-5">
          <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Built for</p>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max gap-10 pr-10">
              {[...BUILT_FOR, ...BUILT_FOR].map((item, i) => (
                <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm text-ink-2" aria-hidden={i >= BUILT_FOR.length}>
                  {item}
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
