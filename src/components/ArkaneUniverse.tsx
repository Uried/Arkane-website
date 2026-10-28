import { useRef, type CSSProperties, type ReactElement } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import Logo from "./Logo";
import "./ArkaneUniverse.css";

/* Abstract sound glyphs, drawn around (0, 0) within ~±30 units. */
type Glyph = "wave" | "ring" | "bars" | "arc" | "dots";

const glyphs: Record<Glyph, ReactElement> = {
  wave: <path d="M-30 0 Q-22.5 -14 -15 0 T0 0 T15 0 T30 0" />,
  ring: (
    <>
      <circle r="16" />
      <circle r="4" className="universe__fill" />
    </>
  ),
  bars: (
    <path d="M-20 -5 V5 M-10 -11 V11 M0 -17 V17 M10 -9 V9 M20 -4 V4" />
  ),
  arc: (
    <>
      <path d="M-20 8 A20 20 0 0 1 20 8" />
      <path d="M-26 8 H26" />
    </>
  ),
  dots: (
    <g className="universe__fill">
      {[-12, 0, 12].flatMap((x) =>
        [-12, 0, 12].map((y) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={x === 0 && y === 0 ? 3 : 1.8} />
        )),
      )}
    </g>
  ),
};

const order: Glyph[] = ["wave", "ring", "bars", "arc", "dots"];

interface Layout {
  viewBox: string;
  nodes: { x: number; y: number }[];
  /** Builds the curve from a node to the central ring. */
  link: (x: number, y: number) => string;
  flows: string[];
  center: { x: number; y: number };
}

/* Desktop: sources on the left converge, the signal continues to the right. */
const horizontal: Layout = {
  viewBox: "0 0 1200 520",
  center: { x: 600, y: 260 },
  nodes: [
    { x: 150, y: 70 },
    { x: 80, y: 165 },
    { x: 190, y: 260 },
    { x: 80, y: 355 },
    { x: 150, y: 450 },
  ],
  link: (x, y) => `M${x + 44} ${y} C${x + 220} ${y}, 400 260, 528 260`,
  flows: [
    "M672 260 C760 260, 790 196, 870 196 S970 324, 1050 324 S1150 236, 1200 236",
    "M672 260 C770 260, 800 228, 880 228 S980 292, 1060 292 S1160 248, 1200 248",
    "M672 260 H1200",
  ],
};

/* Mobile: sources across the top converge downward, the signal flows on. */
const vertical: Layout = {
  viewBox: "0 0 400 760",
  center: { x: 200, y: 380 },
  nodes: [
    { x: 44, y: 80 },
    { x: 122, y: 44 },
    { x: 200, y: 104 },
    { x: 278, y: 44 },
    { x: 356, y: 80 },
  ],
  link: (x, y) => `M${x} ${y + 36} C${x} ${y + 150}, 200 200, 200 308`,
  flows: [
    "M200 452 C200 500, 146 520, 146 580 S254 650, 254 700 S200 740, 200 760",
    "M200 452 C200 508, 174 528, 174 588 S226 650, 226 700 S200 740, 200 760",
    "M200 452 V760",
  ],
};

function Composition({ layout, className }: { layout: Layout; className: string }) {
  const { x: cx, y: cy } = layout.center;
  return (
    <svg
      className={`universe__svg ${className}`}
      viewBox={layout.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      {layout.nodes.map(({ x, y }, i) => {
        const d = layout.link(x, y);
        const vars = { "--i": i } as CSSProperties;
        return (
          <g key={i} style={vars}>
            <path className="universe__link" d={d} pathLength={1} />
            <path className="universe__pulse" d={d} pathLength={1} />
            <g className="universe__node" transform={`translate(${x} ${y})`}>
              {glyphs[order[i]]}
            </g>
          </g>
        );
      })}

      <circle className="universe__halo" cx={cx} cy={cy} r={96} />
      <circle className="universe__core" cx={cx} cy={cy} r={72} />

      {layout.flows.map((d, i) => (
        <g key={d} style={{ "--i": i } as CSSProperties}>
          <path className="universe__flow" d={d} pathLength={1} />
          <path className="universe__flow-pulse" d={d} pathLength={1} />
        </g>
      ))}
    </svg>
  );
}

interface ArkaneUniverseProps {
  label: string;
}

/** Convergence: distinct sound sources meet in Arkane, then carry on as one signal. */
export default function ArkaneUniverse({ label }: ArkaneUniverseProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const stage = stageRef.current;

          /* Scroll-drawn convergence: sources appear, links trace into the
           * core, the mark materialises, then the signal carries on. */
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: stage,
              start: "top 82%",
              end: "bottom 58%",
              scrub: 0.8,
              onUpdate: (self) => {
                /* Travelling pulses only once the composition is whole. */
                stage?.classList.toggle(
                  "universe--live",
                  self.progress >= 1,
                );
              },
            },
          });

          tl.from(".universe__node", {
            autoAlpha: 0,
            scale: 0.55,
            transformOrigin: "50% 50%",
            duration: 0.4,
            stagger: 0.07,
          })
            .fromTo(
              ".universe__link",
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power2.inOut",
              },
              0.12,
            )
            .from(".universe__halo, .universe__core", {
              autoAlpha: 0,
              duration: 0.35,
            }, "-=0.4")
            .from(".universe__logo", {
              autoAlpha: 0,
              scale: 0.86,
              duration: 0.5,
            }, "-=0.15")
            .fromTo(
              ".universe__flow",
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 0.85,
                stagger: 0.1,
                ease: "power2.inOut",
              },
              "-=0.25",
            );
        },
        stageRef,
      );

      return () => mm.revert();
    },
    { scope: stageRef },
  );

  return (
    <section className="universe" aria-labelledby="universe-heading">
      <div className="universe__inner container">
        <h2 id="universe-heading" className="label universe__label">
          {label}
        </h2>
      </div>

      <div className="universe__stage" ref={stageRef}>
        <Composition layout={horizontal} className="universe__svg--h" />
        <Composition layout={vertical} className="universe__svg--v" />
        <div className="universe__logo-wrap">
          <Logo className="universe__logo" />
        </div>
      </div>
    </section>
  );
}
