"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, type ElementType, type PointerEvent, type ReactNode } from "react";
import { circlePath, cycloidParams, cycloidPath } from "@/lib/cycloid";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
      <span className="text-copper-2">{index}</span>
      <span className="h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className={centered ? "flex justify-center" : ""}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </div>
      <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-6xl">
        {title}
      </h2>
      {lead ? <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-2 md:text-xl">{lead}</p> : null}
    </Reveal>
  );
}

export function SpotlightCard({
  as: Tag = "div",
  href,
  className = "",
  children,
}: {
  as?: ElementType;
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  const onMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <Tag
      href={href}
      onPointerMove={onMove}
      className={`spotlight rounded-2xl border border-line bg-surface/60 transition-colors duration-300 hover:border-line-strong ${className}`}
    >
      {children}
    </Tag>
  );
}

const MARK_PARAMS = cycloidParams(12);
const MARK_PATH = cycloidPath(MARK_PARAMS, 46, 50, 50) + circlePath(50, 50, 13);

/** Hirak logo mark: an 11-lobe cycloidal disc. */
export function CycloidMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CycloidMark className="h-7 w-7 text-copper" />
      <span className="flex items-baseline gap-1.5">
        <span className="text-[17px] font-semibold tracking-[0.14em] text-ink">HIRAK</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Motion</span>
      </span>
    </span>
  );
}

export function StatusPill({ tone = "neutral", children }: { tone?: "live" | "active" | "neutral"; children: ReactNode }) {
  const dot = tone === "live" ? "bg-copper animate-pulse-dot" : tone === "active" ? "bg-copper-2" : "bg-ink-3";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-copper text-bg hover:bg-copper-2 hover:shadow-[0_0_40px_-8px_rgb(224_112_47/0.7)]"
      : "border border-line-strong text-ink hover:border-ink-3 hover:bg-white/[0.03]";
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}
