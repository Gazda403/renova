"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domMax,
  m,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

/* ─── Types ─── */
interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  icon: string;
  stat: string;
  statLabel: string;
  angle: number; // base polar angle (deg, clockwise from top) when orbit rotation = 0
  radius: number; // orbital radius percentage
  image: string;
}

/* ─── Data ─── */
// Angles evenly spaced at 0°, 90°, 180°, 270° so the first card starts at left (270°)
// We rotate the whole orbit so that angle-0 maps to 270° visually.
const INNER_RADIUS = 33;
const OUTER_RADIUS = 44;

const SERVICES: Service[] = [
  {
    id: "adaptacija",
    title: "Kompletna Adaptacija",
    subtitle: "Ključ u ruke rješenje",
    description: "Demontaža, izvedba i završna obrada.",
    detail:
      "Od prve linije projekta do finalnog useljenja. Potpuno vodimo sve faze: rušenje, zidanje, izolaciju, gletanje i završni finiš. Jasni rokovi, transparentni troškovi i garancija izvođenja.",
    icon: "◈",
    stat: "500+",
    statLabel: "projekata završeno",
    angle: 0,   // will be placed at 270° (left) when active
    radius: INNER_RADIUS,
    image: "/adaptacija.jpeg",
  },
  {
    id: "molerski",
    title: "Molerski Radovi",
    subtitle: "Boje, teksture, finiš",
    description: "Kvalitetni finiš. Boje i teksture.",
    detail:
      "Precizno nanošenje glet-mase, priprema zidova i nanošenje boja po sistemu RAL ili NCS. Dekorativne teksture, lazure i mineralnih premazi za svaki stil interijera.",
    icon: "◉",
    stat: "100%",
    statLabel: "garancija kvaliteta",
    angle: 90,  // will be placed at 0° (top) when adaptacija is active
    radius: OUTER_RADIUS,
    image: "/molerski-new.png",
  },
  {
    id: "keramika",
    title: "Keramika i Podovi",
    subtitle: "Pločice i podne obloge",
    description: "Ugradnja pločica i podnih obloga.",
    detail:
      "Postavljanje keramike, gresa, vinila, parketa i industrijske epoksidne obloge. Precizno rezanje, ravni spojevi i trajno vezivanje — za svaki prostor.",
    icon: "◇",
    stat: "15 god.",
    statLabel: "iskustva u struci",
    angle: 180, // will be at 90° (right)
    radius: OUTER_RADIUS,
    image: "/keramika.webp",
  },
  {
    id: "elektrika",
    title: "Elektrika i Rasvjeta",
    subtitle: "Instalacije po standardu",
    description: "Instalacije po standardu.",
    detail:
      "Kompletna elektroinstalaterska rješenja: razvodni ormar, kabliranje, utičnice, prekidači i pametna rasvjeta. Sukladnost s bosanskim i EU standardima.",
    icon: "◈",
    stat: "IEC",
    statLabel: "standard instalacija",
    angle: 270, // will be at 180° (bottom)
    radius: INNER_RADIUS,
    image: "/elektrika.png",
  },
];

// The "active" card always lands at the left of the orbit (270° visually).
// We achieve this by rotating the whole orbit container so the active card's base
// angle + orbit rotation = 270.
const TARGET_ANGLE = 270;

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];
const ACCENT = "#3B82F6";
const CANVAS_SIZE = 600; // px

/* ─── Helper: normalise rotation to shortest path (−180 … +180) ─── */
function shortestDelta(from: number, to: number): number {
  const raw = ((to - from) % 360 + 540) % 360 - 180;
  return raw;
}

/* ─── Framer Variants ─── */
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

const expandedPanelVariants: Variants = {
  hidden: { opacity: 0, x: -60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.97,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const orbitalCardVariants: Variants = {
  idle: (isActive: boolean) => ({
    opacity: isActive ? 0 : 0.65,
    scale: isActive ? 0.9 : 1,
    pointerEvents: isActive ? "none" : "auto",
    boxShadow: isActive
      ? `0 0 0 1.5px ${ACCENT}, 0 8px 32px rgba(59,130,246,0.28)`
      : "0 0 0 1px rgba(255,255,255,0.1)",
    transition: { duration: 1.0, ease: EASE },
  }),
  hover: {
    opacity: 1,
    scale: 1.05,
    boxShadow: `0 0 0 1.5px ${ACCENT}88, 0 12px 40px rgba(59,130,246,0.18)`,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/* ─── Polar to CSS position ─── */
// angleDeg: 0 = top, clockwise. radiusPct: 0–50.
function polarToStyle(
  angleDeg: number,
  radiusPct: number
): { top: string; left: string; x: string; y: string } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad);
  const y = 50 + radiusPct * Math.sin(rad);
  return {
    top: `${y}%`,
    left: `${x}%`,
    x: "-50%",
    y: "-50%",
  };
}

/* ─── Orbital Card ─── */
function OrbitalCard({
  service,
  isActive,
  orbitDeg,
  onClick,
}: {
  service: Service;
  isActive: boolean;
  orbitDeg: number; // current total orbit rotation (degrees) so we can counter-rotate
  onClick: () => void;
}) {
  return (
    <m.div
      custom={isActive}
      variants={orbitalCardVariants}
      initial="idle"
      animate="idle"
      whileHover="hover"
      onClick={onClick}
      className="absolute cursor-pointer rounded-xl p-4 w-[175px] h-[175px] select-none"
      style={{
        ...polarToStyle(service.angle, service.radius),
        background: isActive
          ? "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(255,255,255,0.04) 100%)"
          : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isActive
          ? `1.5px solid ${ACCENT}60`
          : "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {/* Counter-rotate the content so text always reads upright */}
      <m.div
        style={{
          rotate: -orbitDeg,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-lg leading-none"
            style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.4)" }}
          >
            {service.icon}
          </span>
          {isActive && (
            <m.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="h-[1px] flex-1 origin-left"
              style={{ background: `${ACCENT}80` }}
            />
          )}
        </div>
        <p
          className="text-sm font-semibold leading-snug text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {service.title}
        </p>
        <p className="text-[10px] font-light tracking-wide text-white/45 mt-1 uppercase">
          {service.description}
        </p>
      </m.div>
    </m.div>
  );
}

/* ─── Expanded Detail Panel ─── */
function ExpandedPanel({ service }: { service: Service }) {
  return (
    <m.div
      key={service.id}
      variants={expandedPanelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-[460px] flex-shrink-0"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Top accent bar */}
      <m.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        className="h-[1.5px] w-full origin-left mb-8"
        style={{
          background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
        }}
      />

      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl" style={{ color: ACCENT }}>
          {service.icon}
        </span>
        <span
          className="text-[10px] font-medium tracking-[0.3em] uppercase"
          style={{ color: ACCENT }}
        >
          ReNova — Usluge
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight text-white mb-3"
        style={{ fontFamily: "var(--font-display-bold)" }}
      >
        {service.title}
      </h3>
      <p
        className="text-base font-medium text-white/50 mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.subtitle}
      </p>

      {/* Preview image */}
      <div
        className="relative w-full h-52 rounded-xl mb-6 overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            priority
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0F1923 0%, #162236 40%, #0B1520 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div
                className="w-40 h-40 rounded-full"
                style={{ border: `1px solid ${ACCENT}` }}
              />
              <div
                className="absolute w-28 h-28 rounded-full"
                style={{ border: `1px solid ${ACCENT}` }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-5xl opacity-30">{service.icon}</span>
              <span
                className="text-[9px] tracking-[0.3em] uppercase opacity-40"
                style={{ color: ACCENT }}
              >
                Referentna slika projekta
              </span>
            </div>
          </>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(8,10,15,0) 60%, rgba(8,10,15,0.7) 100%)",
          }}
        />
      </div>

      {/* Body copy */}
      <p className="text-sm font-light leading-relaxed text-white/65 mb-8">
        {service.detail}
      </p>

      {/* Stat row */}
      <div
        className="flex items-center gap-6 pt-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div>
          <span
            className="text-3xl font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {service.stat}
          </span>
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 mt-0.5">
            {service.statLabel}
          </p>
        </div>
        <div className="w-[1px] h-10" style={{ background: "rgba(255,255,255,0.1)" }} />
        <a
          href="#kontakt"
          className="group flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300"
          style={{ color: ACCENT }}
        >
          <span
            className="border-b pb-0.5 transition-all duration-300"
            style={{ borderColor: `${ACCENT}50` }}
          >
            Zatražite procjenu
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </m.div>
  );
}

/* ─── Main Services Section ─── */
export default function ServicesSection() {
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  // orbitRotation: total degrees the orbit ring has been rotated.
  // First service (angle=0) should appear at TARGET_ANGLE (270°).
  // orbit rotation = TARGET_ANGLE - active.angle
  const [orbitRotation, setOrbitRotation] = useState<number>(TARGET_ANGLE - SERVICES[0].angle);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeService = SERVICES.find((s) => s.id === activeId)!;

  function handleServiceClick(service: Service) {
    if (service.id === activeId) return;
    // We want: service.angle + newOrbitRotation = TARGET_ANGLE (mod 360)
    // newOrbitRotation = TARGET_ANGLE - service.angle
    const desiredRotation = TARGET_ANGLE - service.angle;
    // Find shortest delta from current rotation to desired
    const delta = shortestDelta(orbitRotation, desiredRotation);
    const newRotation = orbitRotation + delta;
    setOrbitRotation(newRotation);
    setActiveId(service.id);
  }

  return (
    <LazyMotion features={domMax} strict>
      <section
        id="usluge"
        className="relative w-full min-h-screen overflow-hidden"
        style={{ background: "#080A0F" }}
      >
        {/* ─── Background decoration ─── */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-[0.07]"
          style={{
            background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`,
          }}
        />

        {/* ─── Section Header ─── */}
        <m.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 flex flex-col items-center pt-24 pb-10 px-6"
        >
          <m.div
            custom={0}
            variants={fadeUpVariants}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-6 h-[1px]" style={{ background: ACCENT }} />
            <span
              className="text-[10px] font-medium tracking-[0.32em] uppercase"
              style={{ color: ACCENT }}
            >
              Naše Usluge
            </span>
            <div className="w-6 h-[1px]" style={{ background: ACCENT }} />
          </m.div>

          <m.h2
            custom={0.1}
            variants={fadeUpVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white text-center"
            style={{ fontFamily: "var(--font-display-bold)" }}
          >
            ŠTA NUDIMO
          </m.h2>
          <m.p
            custom={0.2}
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl font-medium text-center mt-1"
            style={{ fontFamily: "var(--font-display)", color: ACCENT }}
          >
            Kliknite na uslugu
          </m.p>
          <m.p
            custom={0.3}
            variants={fadeUpVariants}
            className="text-sm font-light text-white/40 text-center mt-3 tracking-wide"
          >
            Izaberite oblast i saznajte više o usluzi
          </m.p>
        </m.div>

        {/* ─── DESKTOP LAYOUT ─── */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:flex items-center justify-center relative w-full px-20 pt-16 pb-24"
          style={{ minHeight: "750px" }}
        >
          {/* ─ Left: Expanded Panel ─ */}
          <div className="flex-shrink-0 w-[460px] pr-14 z-20">
            <AnimatePresence mode="wait">
              <ExpandedPanel key={activeId} service={activeService} />
            </AnimatePresence>
          </div>

          {/* ─ Center: Orbital Canvas ─ */}
          <div
            ref={containerRef}
            className="relative flex-shrink-0"
            style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
          >
            {/* Static decorative rings (don't rotate, cards move along them) */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                border: "1px dashed rgba(255,255,255,0.08)",
                top: `${50 - INNER_RADIUS}%`,
                left: `${50 - INNER_RADIUS}%`,
                width: `${INNER_RADIUS * 2}%`,
                height: `${INNER_RADIUS * 2}%`,
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                border: "1px dashed rgba(255,255,255,0.08)",
                top: `${50 - OUTER_RADIUS}%`,
                left: `${50 - OUTER_RADIUS}%`,
                width: `${OUTER_RADIUS * 2}%`,
                height: `${OUTER_RADIUS * 2}%`,
              }}
            />

            {/* ─ Center Brand Image — static, never rotates ─ */}
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ width: "200px", height: "200px" }}
            >
              {/* Glow ring */}
              <div
                className="absolute inset-[-16px] rounded-full opacity-20 blur-xl pointer-events-none"
                style={{ background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)` }}
              />
              {/* Circular clipped image */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  border: `2px solid ${ACCENT}40`,
                  boxShadow: `0 0 50px rgba(59,130,246,0.2), inset 0 0 20px rgba(0,0,0,0.3)`,
                }}
              >
                <Image
                  src="/brand-logo.jpeg"
                  alt="ReNova brand — 3D logo"
                  fill
                  sizes="200px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </m.div>

            {/* ─ Rotating orbit ring + cards ─ */}
            <m.div
              className="absolute inset-0"
              animate={{ rotate: orbitRotation }}
              transition={{ duration: 1.0, ease: EASE }}
            >

              {/* Orbital Cards — positioned at their fixed angles, orbit container rotates */}
              {SERVICES.map((service) => (
                <OrbitalCard
                  key={service.id}
                  service={service}
                  isActive={activeId === service.id}
                  orbitDeg={orbitRotation}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
            </m.div>

            {/* Active indicator glowing dot on the left anchor (270°) */}
            <div
              className="absolute w-2 h-2 rounded-full z-20 pointer-events-none"
              style={{
                ...polarToStyle(270, activeService.radius),
                background: ACCENT,
                boxShadow: `0 0 12px 2px ${ACCENT}`,
              }}
            />
          </div>

          {/* ─ Right: Branding sidebar ─ */}
          <div className="flex-shrink-0 w-[200px] pl-14 z-10">
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="flex flex-col gap-8"
            >
              {/* Brand tag */}
              <div>
                <span
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "var(--font-display-bold)" }}
                >
                  Re<span style={{ color: ACCENT }}>Nova</span>
                </span>
                <p className="text-[9px] tracking-[0.22em] uppercase text-white/35 mt-1">
                  Od zavjese do escajga
                </p>
              </div>

              {/* Mini service list */}
              <div className="flex flex-col gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleServiceClick(s)}
                    className="text-left transition-all duration-300"
                  >
                    <span
                      className="text-[11px] font-medium tracking-wide transition-colors duration-300"
                      style={{
                        color:
                          activeId === s.id ? ACCENT : "rgba(255,255,255,0.35)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {activeId === s.id && "→ "}
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quote */}
              <div
                className="pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-light leading-relaxed text-white/30 italic">
                  Transformišemo prostore, stvaramo dom.
                </p>
              </div>
            </m.div>
          </div>
        </m.div>

        {/* ─── MOBILE LAYOUT (vertical timeline) ─── */}
        <div className="lg:hidden px-5 pb-20">
          {/* Active expanded panel */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <ExpandedPanel key={activeId} service={activeService} />
            </AnimatePresence>
          </div>

          {/* Brand image centered */}
          <div className="flex justify-center mb-8">
            <div
              className="relative w-40 h-40 rounded-full overflow-hidden"
              style={{
                border: `2px solid ${ACCENT}40`,
                boxShadow: "0 0 40px rgba(59,130,246,0.15)",
              }}
            >
              <Image
                src="/brand-logo.jpeg"
                alt="ReNova brand"
                fill
                sizes="160px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Vertical service list */}
          <div className="flex flex-col gap-3">
            {SERVICES.map((service, i) => {
              const isActive = activeId === service.id;
              return (
                <m.button
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  onClick={() => handleServiceClick(service)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(255,255,255,0.03))"
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? `1.5px solid ${ACCENT}60`
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-lg"
                      style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.3)" }}
                    >
                      {service.icon}
                    </span>
                    <div>
                      <p
                        className="text-sm font-semibold text-white"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {service.title}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">
                        {service.description}
                      </p>
                    </div>
                    {isActive && (
                      <span
                        className="ml-auto text-sm font-bold"
                        style={{ color: ACCENT }}
                      >
                        →
                      </span>
                    )}
                  </div>
                </m.button>
              );
            })}
          </div>
        </div>

        {/* ─── Bottom border ─── */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute bottom-0 left-0 right-0 h-[1px] origin-center pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          }}
        />
      </section>
    </LazyMotion>
  );
}
