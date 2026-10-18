"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal, SectionHeader } from "./ui";

const MILESTONES = [
  {
    year: "2026",
    title: "The bench",
    body: "Prototypes, a back-to-back test rig and our first honest measurements.",
    now: true,
  },
  {
    year: "2027",
    title: "Hirak Dev Kit",
    body: "An actuator, a drive and Python and ROS 2 software for labs and robot builders. Our first design partners.",
  },
  {
    year: "2028",
    title: "Hirak Core motors",
    body: "Our own magnet-flexible BLDC and PMSM line, ready for magnets made in India.",
  },
  {
    year: "2029+",
    title: "Motion at scale",
    body: "Servo systems for Indian industry, linear actuators and gearmotors, and joints for the robots India builds.",
  },
];

export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="roadmap" className="relative border-b border-line py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="07"
          eyebrow="Roadmap"
          title={
            <>
              Plans, <span className="text-ink-3">not promises.</span>
            </>
          }
          lead="Where we are going, in the order we intend to get there. We will update this page as each step is earned."
        />

        <div ref={ref} className="relative mt-16">
          {/* Progress track: vertical on mobile, horizontal on desktop */}
          <div className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-line-strong md:hidden" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-copper" style={reduce ? undefined : { scaleY: progress }} />
          </div>
          <div className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-line-strong md:block" aria-hidden="true">
            <motion.div className="h-full w-full origin-left bg-copper" style={reduce ? undefined : { scaleX: progress }} />
          </div>
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 0.08} className="relative grid grid-cols-[24px_1fr] gap-5 md:block">
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border ${
                    m.now ? "border-copper bg-copper" : "border-line-strong bg-bg"
                  }`}
                  aria-hidden="true"
                >
                  <span className={`h-2 w-2 rounded-full ${m.now ? "animate-pulse-dot bg-bg" : "bg-line-strong"}`} />
                </span>
                <div className="md:mt-7">
                  <p className="font-mono text-sm text-copper-2">
                    {m.year}
                    {m.now ? <span className="ml-2 text-ink-3">· now</span> : null}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{m.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
