"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Reveal, SectionHeader } from "./ui";

type ReducerId = "planetary" | "cycloidal" | "harmonic";

type Reducer = {
  label: string;
  short: string;
  min: number;
  max: number;
  initial: number;
  efficiency: (ratio: number) => number;
  backdriveBase: number;
  shock: number;
  shockLabel: string;
  backlash: string;
  bestFor: string;
};

// Typical, idealised figures for early design exploration.
const REDUCERS: Record<ReducerId, Reducer> = {
  planetary: {
    label: "Planetary (QDD)",
    short: "Planetary",
    min: 3,
    max: 20,
    initial: 9,
    efficiency: (r) => (r <= 10 ? 0.95 : 0.9),
    backdriveBase: 1,
    shock: 0.55,
    shockLabel: "Moderate",
    backlash: "Low to moderate",
    bestFor: "Legged robots and contact-rich joints that sense force through motor current.",
  },
  cycloidal: {
    label: "Cycloidal",
    short: "Cycloidal",
    min: 8,
    max: 60,
    initial: 25,
    efficiency: () => 0.88,
    backdriveBase: 0.65,
    shock: 0.9,
    shockLabel: "High, about 5–10× rated torque",
    backlash: "Very low",
    bestFor: "Shock-heavy joints such as knees and hips that need a high ratio in a compact package.",
  },
  harmonic: {
    label: "Strain-wave (harmonic)",
    short: "Strain-wave",
    min: 30,
    max: 160,
    initial: 100,
    efficiency: () => 0.75,
    backdriveBase: 0.4,
    shock: 0.25,
    shockLabel: "Low, about 2–3× rated torque",
    backlash: "Near zero",
    bestFor: "Arms and wrists that need precise positioning more than impact tolerance.",
  },
};

const fmt = (v: number, digits = 0) =>
  v.toLocaleString("en-IN", { maximumFractionDigits: digits, minimumFractionDigits: digits });

function niceStep(max: number, target = 4) {
  const raw = max / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
}

function backdriveScore(type: ReducerId, ratio: number) {
  return REDUCERS[type].backdriveBase / (1 + (ratio / 15) ** 2);
}

function backdriveWord(s: number) {
  return s >= 0.6 ? "Easy" : s >= 0.3 ? "Moderate" : s >= 0.1 ? "Stiff" : "Effectively locked";
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm text-ink tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Meter({ label, value, word }: { label: string; value: number; word: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-ink-2">{label}</p>
        <p className="text-right text-sm text-ink">{word}</p>
      </div>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-copper/15"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={word}
      >
        <div className="h-full rounded-full bg-copper transition-[width] duration-500" style={{ width: `${Math.max(2, value * 100)}%` }} />
      </div>
    </div>
  );
}

function TorqueSpeedChart({ peak, topSpeed, xMax, yMax }: { peak: number; topSpeed: number; xMax: number; yMax: number }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null); // output rpm under the crosshair
  const height = 276;
  const m = { l: 52, r: 18, t: 34, b: 40 };
  const w = width - m.l - m.r;
  const h = height - m.t - m.b;
  const xStep = niceStep(xMax);
  const yStep = niceStep(yMax);
  const xs = (v: number) => m.l + (v / xMax) * w;
  const ys = (v: number) => m.t + h - (v / yMax) * h;
  const torqueAt = (rpm: number) => Math.max(0, peak * (1 - rpm / topSpeed));

  const xTicks = Array.from({ length: Math.floor(xMax / xStep) + 1 }, (_, i) => i * xStep);
  const yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);

  const linePath = `M${xs(0)} ${ys(peak)}L${xs(topSpeed)} ${ys(0)}`;
  const areaPath = `${linePath}L${xs(0)} ${ys(0)}Z`;

  const fromPointer = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = ((e.clientX - r.left) / r.width) * xMax;
    setHover(Math.min(topSpeed, Math.max(0, v)));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const d = (e.key === "ArrowRight" ? 1 : -1) * (topSpeed / 20);
    setHover((v) => Math.min(topSpeed, Math.max(0, (v ?? 0) + d)));
  };

  const hx = hover === null ? null : xs(hover);
  const ht = hover === null ? 0 : torqueAt(hover);
  const tipLeft = hx === null ? 0 : Math.min(Math.max(hx, 90), width - 90);

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      <svg
        width={width}
        height={height}
        className="block overflow-visible outline-none"
        role="img"
        tabIndex={0}
        aria-label={`Output torque falls linearly from ${fmt(peak, 1)} newton-metres at standstill to zero at ${fmt(topSpeed)} rpm.`}
        onKeyDown={onKey}
        onFocus={() => setHover((v) => v ?? topSpeed / 2)}
        onBlur={() => setHover(null)}
      >
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={m.l} x2={m.l + w} y1={ys(t)} y2={ys(t)} stroke="var(--color-line)" strokeWidth="1" />
            <text x={m.l - 10} y={ys(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 font-mono text-[11px] tabular-nums">
              {fmt(t, t < 10 && yStep < 1 ? 1 : 0)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={`x${t}`} x={xs(t)} y={m.t + h + 22} textAnchor="middle" className="fill-ink-3 font-mono text-[11px] tabular-nums">
            {fmt(t)}
          </text>
        ))}
        <text x={m.l + w} y={height - 2} textAnchor="end" className="fill-ink-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          Output speed, rpm
        </text>
        <text x={m.l - 44} y={12} className="fill-ink-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          Torque, Nm
        </text>

        <path d={areaPath} fill="var(--color-copper)" fillOpacity="0.1" />
        <path d={linePath} stroke="var(--color-copper)" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Selective direct labels: the two ends of the envelope */}
        <circle cx={xs(0)} cy={ys(peak)} r="4" fill="var(--color-copper)" stroke="var(--color-surface)" strokeWidth="2" />
        <text x={xs(0) + 10} y={ys(peak) - 8} className="fill-ink-2 text-[12px]">
          Peak {fmt(peak, 1)} Nm
        </text>
        <circle cx={xs(topSpeed)} cy={ys(0)} r="4" fill="var(--color-copper)" stroke="var(--color-surface)" strokeWidth="2" />
        <text
          x={xs(topSpeed)}
          y={ys(0) - 12}
          textAnchor={xs(topSpeed) > m.l + w - 70 ? "end" : "middle"}
          className="fill-ink-2 text-[12px]"
        >
          {fmt(topSpeed)} rpm
        </text>

        {hx !== null ? (
          <g pointerEvents="none">
            <line x1={hx} x2={hx} y1={m.t} y2={m.t + h} stroke="var(--color-ink-3)" strokeWidth="1" />
            <circle cx={hx} cy={ys(ht)} r="5" fill="var(--color-copper)" stroke="var(--color-surface)" strokeWidth="2" />
          </g>
        ) : null}

        <rect
          x={m.l}
          y={m.t}
          width={w}
          height={h}
          fill="transparent"
          onPointerMove={fromPointer}
          onPointerDown={fromPointer}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hx !== null ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line-strong bg-bg/95 px-3 py-2 shadow-xl"
          style={{ left: tipLeft }}
        >
          <p className="text-sm font-semibold text-ink tabular-nums">{fmt(ht, 1)} Nm</p>
          <p className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className="inline-block h-0.5 w-3 rounded bg-copper" />
            at {fmt(hover ?? 0)} rpm
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function Explorer() {
  const [type, setType] = useState<ReducerId>("cycloidal");
  const [ratio, setRatio] = useState(REDUCERS.cycloidal.initial);
  const [torque, setTorque] = useState(2);
  const [speed, setSpeed] = useState(3000);

  const red = REDUCERS[type];
  const r = useMemo(() => {
    const eff = red.efficiency(ratio);
    const peak = torque * ratio * eff;
    const top = speed / ratio;
    const bd = backdriveScore(type, ratio);
    const xMaxRaw = speed / red.min;
    const yMaxRaw = torque * red.max * red.efficiency(red.max);
    return {
      eff,
      peak,
      top,
      bd,
      inertia: ratio * ratio,
      xMax: Math.ceil(xMaxRaw / niceStep(xMaxRaw)) * niceStep(xMaxRaw),
      yMax: Math.ceil(yMaxRaw / niceStep(yMaxRaw)) * niceStep(yMaxRaw),
    };
  }, [red, ratio, torque, speed, type]);

  const pick = (id: ReducerId) => {
    setType(id);
    setRatio(REDUCERS[id].initial);
  };

  return (
    <section id="explorer" className="relative border-b border-line bg-bg-2 py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="03"
          eyebrow="Actuator explorer"
          title="Every joint is a trade-off. Play with it."
          lead="A higher ratio buys torque and costs speed, backdrivability and inertia. Choose a reducer and a motor and watch the joint change. This is the first conversation we have with every customer."
        />

        <Reveal className="mt-14">
          <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-[380px_minmax(0,1fr)]" style={{ gap: 1 }}>
            {/* Controls */}
            <div className="space-y-8 bg-surface p-6 md:p-8">
              <div>
                <p className="text-sm text-ink-2" id="reducer-label">
                  Reducer
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-line-strong bg-bg p-1" role="radiogroup" aria-labelledby="reducer-label">
                  {(Object.keys(REDUCERS) as ReducerId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={type === id}
                      onClick={() => pick(id)}
                      className={`whitespace-nowrap rounded-lg px-1 py-2 text-[13px] font-medium transition-colors ${
                        type === id ? "bg-copper text-bg" : "text-ink-2 hover:bg-white/[0.04] hover:text-ink"
                      }`}
                    >
                      {REDUCERS[id].short}
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                id="ratio"
                label="Reduction ratio"
                value={ratio}
                min={red.min}
                max={red.max}
                step={1}
                display={`${ratio} : 1`}
                onChange={setRatio}
              />
              <Slider
                id="torque"
                label="Motor peak torque"
                value={torque}
                min={0.2}
                max={5}
                step={0.1}
                display={`${fmt(torque, 1)} Nm`}
                onChange={setTorque}
              />
              <Slider
                id="speed"
                label="Motor no-load speed"
                value={speed}
                min={500}
                max={6000}
                step={100}
                display={`${fmt(speed)} rpm`}
                onChange={setSpeed}
              />

              <div className="rounded-xl border border-line bg-bg/60 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper-2">Best for</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{red.bestFor}</p>
              </div>
            </div>

            {/* Results */}
            <div className="min-w-0 bg-surface p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-sm text-ink-2">Output peak torque</p>
                  <p className="mt-1 text-6xl font-semibold tracking-[-0.04em] text-ink md:text-7xl">
                    {fmt(r.peak, 1)}
                    <span className="ml-2 text-2xl font-normal text-ink-3">Nm</span>
                  </p>
                </div>
                <dl className="grid grid-cols-3 gap-4 text-left sm:gap-6">
                  {/* Values sit on a shared baseline even when a label wraps to two lines. */}
                  <div className="flex flex-col">
                    <dt className="text-xs text-ink-3">Top speed</dt>
                    <dd className="mt-auto pt-1 text-lg font-semibold text-ink sm:text-xl">
                      {fmt(r.top)}
                      <span className="ml-1 text-sm font-normal text-ink-3">rpm</span>
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-xs text-ink-3">Reflected inertia</dt>
                    <dd className="mt-auto pt-1 text-lg font-semibold text-ink sm:text-xl">×{fmt(r.inertia)}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-xs text-ink-3">Efficiency</dt>
                    <dd className="mt-auto pt-1 text-lg font-semibold text-ink sm:text-xl">≈{Math.round(r.eff * 100)}%</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8">
                <p className="text-sm text-ink-2">Torque–speed envelope at the output</p>
                <div className="mt-3">
                  <TorqueSpeedChart peak={r.peak} topSpeed={r.top} xMax={r.xMax} yMax={r.yMax} />
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <Meter label="Backdrivability" value={r.bd} word={backdriveWord(r.bd)} />
                <Meter label="Shock tolerance" value={red.shock} word={red.shockLabel.split(",")[0]} />
                <div>
                  <p className="text-sm text-ink-2">Backlash</p>
                  <p className="mt-1.5 text-sm text-ink">{red.backlash}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-3">Shock tolerance: {red.shockLabel}.</p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3">
            Idealised estimates for early exploration: a linear motor torque–speed line, typical gear efficiencies, and
            qualitative backdrivability. Real numbers come from the test rig, which is why we measure every joint we
            ship.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
