// Cycloidal drive geometry shared by the 3D hero, the logo and the drawings.
//
// A drive with N ring pins and an (N - 1)-lobe disc reduces speed by N - 1.
// The disc profile is the standard curtate-epicycloid offset by the pin radius.
// With the disc centre at e·(cos θ, sin θ) and the disc turned by -θ / (N - 1),
// every ring pin stays tangent to the profile, so the animation is real
// kinematics, not an approximation.

export type CycloidParams = {
  pins: number; // N, number of ring pins
  R: number; // ring pin circle radius
  pinRadius: number; // Rr
  e: number; // eccentricity
};

export function cycloidParams(pins: number, R = 1): CycloidParams {
  const e = (0.7 * R) / pins;
  const pinRadius = (pins <= 12 ? 0.075 : pins <= 16 ? 0.06 : 0.05) * R;
  return { pins, R, pinRadius, e };
}

export function cycloidProfile(
  { pins: N, R, pinRadius: Rr, e }: CycloidParams,
  samples = 720,
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const psi = Math.atan2(
      Math.sin((1 - N) * t),
      R / (e * N) - Math.cos((1 - N) * t),
    );
    const x = R * Math.cos(t) - Rr * Math.cos(t + psi) - e * Math.cos(N * t);
    const y = -R * Math.sin(t) + Rr * Math.sin(t + psi) + e * Math.sin(N * t);
    pts.push([x, y]);
  }
  return pts;
}

/** SVG path data for a disc profile, scaled and centred at (cx, cy). */
export function cycloidPath(
  params: CycloidParams,
  scale: number,
  cx = 0,
  cy = 0,
  samples = 360,
): string {
  const pts = cycloidProfile(params, samples);
  return (
    pts
      .map(([x, y], i) => `${i ? "L" : "M"}${(cx + x * scale).toFixed(2)} ${(cy - y * scale).toFixed(2)}`)
      .join("") + "Z"
  );
}

/** SVG path data for a circle, drawn as two arcs (usable as a hole with evenodd). */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
}
