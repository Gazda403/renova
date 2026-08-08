"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domMax,
  m,
  AnimatePresence,
  type Variants,
} from "framer-motion";

/* ─── Types ─── */
interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  svgPath: string;   // SVG path data for icon
  stat: string;
  statLabel: string;
  angle: number;
  image: string;
}

/* ─── Data ─── */
const ORBIT_RADIUS = 38; // single uniform radius %
const CANVAS_SIZE  = 760; // px — scaled up canvas

const SERVICES: Service[] = [
  {
    id: "adaptacija",
    title: "Kompletna Adaptacija",
    subtitle: "Ključ u ruke rješenje",
    description: "Demontaža, izvedba i završna obrada.",
    detail:
      "Od prve linije projekta do finalnog useljenja — Sarajevo, Pale, Jahorina i Istočno Sarajevo. Potpuno vodimo sve faze: rušenje, zidanje, izolaciju, gletanje i završni finiš. Jasni rokovi, transparentni troškovi i garancija izvršenja.",
    svgPath: "M6 6h36v36H6zM6 18h36M18 6v12M12 30l6 6 12-12",
    stat: "500+",
    statLabel: "projekata završeno",
    angle: 0,
    image: "/adaptacija.jpeg",
  },
  {
    id: "molerski",
    title: "Molerski Radovi",
    subtitle: "Boje, teksture, finiš",
    description: "Kvalitetni finiš. Boje i teksture.",
    detail:
      "Precizno nanošenje glet-mase, priprema zidova i nanošenje boja po sistemu RAL ili NCS. Dekorativne teksture, lazure i mineralni premazi za svaki stil interijera.",
    svgPath: "M10 38 L20 18 L28 26 Z M34 8 a6 6 0 1 1 0 12 a6 6 0 0 1 0-12 M28 20 L20 28 M8 40 Q12 36 16 40",
    stat: "100%",
    statLabel: "garancija kvaliteta",
    angle: 60,
    image: "/molerski-new.png",
  },
  {
    id: "keramika",
    title: "Keramika i Podovi",
    subtitle: "Pločice i podne obloge",
    description: "Ugradnja pločica i podnih obloga.",
    detail:
      "Postavljanje keramike, gresa, vinila, parketa i industrijske epoksidne obloge. Precizno rezanje, ravni spojevi i trajno vezivanje — za svaki prostor.",
    svgPath: "M6 6h16v16H6zM26 6h16v16H26zM6 26h16v16H6zM26 26h16v16H26z",
    stat: "15 god.",
    statLabel: "iskustva u struci",
    angle: 120,
    image: "/keramika.webp",
  },
  {
    id: "elektrika",
    title: "Elektrika i Rasvjeta",
    subtitle: "Instalacije po standardu",
    description: "Instalacije po standardu.",
    detail:
      "Kompletna elektroinstalaterska rješenja: razvodni ormar, kabliranje, utičnice, prekidači i pametna rasvjeta. Sukladnost s bosanskim i EU standardima.",
    svgPath: "M26 6 L16 26 H24 L22 42 L36 22 H28 Z",
    stat: "IEC",
    statLabel: "standard instalacija",
    angle: 180,
    image: "/elektrika.png",
  },
  {
    id: "gipsarski",
    title: "Gipsarski Radovi",
    subtitle: "Glatke površine, savršen temelj",
    description: "Gletanje, rigips, špaleti i nivelacija.",
    detail:
      "Profesionalna ugradnja gips-kartonskih ploča, oblaganje špaleta, izrada pregradnih zidova i spuštenih plafona. Finim gletanjem i brušenjem osiguravamo savršenu podlogu za svaki završni sloj.",
    svgPath: "M8 40 L28 10 L40 22 L20 42 Z M28 10 L40 10 L40 22 M14 34 L22 26 M30 30 a6 6 0 1 1 0 12 a6 6 0 0 1 0-12 M30 36 h12 M36 30 v12",
    stat: "A+",
    statLabel: "kvaliteta završne obrade",
    angle: 240,
    image: "/gipsarski.jpg",
  },
  {
    id: "inventar",
    title: "Stavljanje u Funkciju",
    subtitle: "Inventar, aparati i tekstil",
    description: "Kuhinjski sitniš, aparati i tekstil.",
    detail:
      "Brinemo se o svakom detalju useljenja: raspoređujemo posuđe, escajg, šerpe, tanjire i kuhinjski sitniš. Postavljamo male kućanske aparate, organizujemo tekstil — od posteljine do ručnika — i svakom prostoru dajemo funkcionalnost od prvog dana.",
    svgPath: "M8 16 Q8 8 24 8 Q40 8 40 16 L38 36 Q38 40 24 40 Q10 40 10 36 Z M8 16 Q8 24 24 24 Q40 24 40 16 M19 32 Q24 36 29 32",
    stat: "360°",
    statLabel: "usluga useljenja",
    angle: 300,
    image: "/kucanski-inventar.jpg",
  },
];

/* ─── Constants ─── */
const TARGET_ANGLE = 270;
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];
const ACCENT = "#3B82F6";

/* ─── Helper ─── */
function shortestDelta(from: number, to: number): number {
  return ((to - from) % 360 + 540) % 360 - 180;
}

function polarToStyle(angleDeg: number, radiusPct: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad);
  const y = 50 + radiusPct * Math.sin(rad);
  return { top: `${y}%`, left: `${x}%`, x: "-50%", y: "-50%" };
}

/* ─── Inline SVG icon ─── */
function ServiceIcon({ d, color }: { d: string; color: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "100%", height: "100%", transition: "stroke 0.5s ease" }}
    >
      <path d={d} />
    </svg>
  );
}

/* ─── Variants ─── */
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

const expandedPanelVariants: Variants = {
  hidden:  { opacity: 0, x: -60, scale: 0.95 },
  visible: { opacity: 1, x: 0,   scale: 1, transition: { duration: 0.6, ease: EASE } },
  exit:    { opacity: 0, x: -40, scale: 0.97, transition: { duration: 0.35, ease: "easeIn" } },
};

/* ─── Petal Card ─── */
function PetalCard({
  service,
  isActive,
  orbitDeg,
  onClick,
}: {
  service: Service;
  isActive: boolean;
  orbitDeg: number;
  onClick: () => void;
}) {
  const iconColor = isActive ? ACCENT : "rgba(255,255,255,0.50)";
  return (
    <m.div
      onClick={onClick}
      className="absolute cursor-pointer select-none"
      style={{
        ...polarToStyle(service.angle, ORBIT_RADIUS),
        width: "172px",
        height: "172px",
      }}
      animate={{ opacity: isActive ? 1 : 0.75, scale: isActive ? 1.08 : 1 }}
      whileHover={isActive ? {} : { opacity: 1, scale: 1.05 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* Outer active glow */}
      {isActive && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-[-14px] rounded-[34px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${ACCENT}30 0%, transparent 70%)`,
            filter: "blur(12px)",
          }}
        />
      )}

      {/* Card body — counter-rotated so text stays upright */}
      <m.div
        style={{
          rotate: -orbitDeg,
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          background: isActive
            ? `linear-gradient(160deg, rgba(59,130,246,0.22) 0%, rgba(20,30,60,0.90) 100%)`
            : `linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(8,12,22,0.88) 100%)`,
          border: isActive
            ? `1.5px solid ${ACCENT}85`
            : "1px solid rgba(255,255,255,0.11)",
          boxShadow: isActive
            ? `0 0 0 1px ${ACCENT}35, 0 18px 52px rgba(59,130,246,0.30), inset 0 1px 0 rgba(255,255,255,0.16)`
            : "0 8px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "18px 14px",
        }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* Icon */}
        <div style={{ width: "44px", height: "44px" }}>
          <ServiceIcon d={service.svgPath} color={iconColor} />
        </div>

        {/* Title */}
        <p
          className="text-center leading-tight font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "12.5px",
            color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
            letterSpacing: "0.01em",
          }}
        >
          {service.title}
        </p>

        {/* Active dot */}
        {isActive && (
          <m.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full"
            style={{ width: 6, height: 6, background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }}
          />
        )}
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
      className="w-full max-w-[490px] flex-shrink-0"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Accent bar */}
      <m.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        className="h-[1.5px] w-full origin-left mb-8"
        style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
      />

      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <div style={{ width: 22, height: 22 }}>
          <ServiceIcon d={service.svgPath} color={ACCENT} />
        </div>
        <span
          className="text-[11px] font-medium tracking-[0.3em] uppercase"
          style={{ color: ACCENT }}
        >
          ReNova — Usluge
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight text-white mb-3"
        style={{ fontFamily: "var(--font-display-bold)" }}
      >
        {service.title}
      </h3>
      <p
        className="text-lg font-medium text-white/50 mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.subtitle}
      </p>

      {/* Image */}
      <div
        className="relative w-full h-60 rounded-xl mb-6 overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {service.image ? (
          <Image
            src={service.image}
            alt={`${service.title} — ReNova`}
            fill
            sizes="(max-width: 768px) 100vw, 490px"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ color: ACCENT }}>
            <div style={{ width: 54, height: 54 }}>
              <ServiceIcon d={service.svgPath} color={ACCENT} />
            </div>
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(8,10,15,0) 55%, rgba(8,10,15,0.65) 100%)" }}
        />
      </div>

      {/* Detail */}
      <p className="text-base font-light leading-relaxed text-white/70 mb-8">
        {service.detail}
      </p>

      {/* Stat + CTA */}
      <div
        className="flex items-center gap-6 pt-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div>
          <span className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
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
          <span className="border-b pb-0.5" style={{ borderColor: `${ACCENT}50` }}>
            Zatražite procjenu
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </m.div>
  );
}

/* ─── Main Component ─── */
export default function ServicesSection() {
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const [orbitRotation, setOrbitRotation] = useState<number>(TARGET_ANGLE - SERVICES[0].angle);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const activeService = SERVICES.find((s) => s.id === activeId)!;

  function handleServiceClick(service: Service) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    
    if (service.id !== activeId) {
      const desiredRotation = TARGET_ANGLE - service.angle;
      const delta = shortestDelta(orbitRotation, desiredRotation);
      setOrbitRotation(orbitRotation + delta);
      setActiveId(service.id);
    }

    if (isMobile) {
      mobilePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <LazyMotion features={domMax} strict>
      <section
        id="usluge"
        className="relative w-full min-h-screen overflow-hidden"
        style={{ background: "#080A0F" }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
          style={{
            width: "920px", height: "920px",
            background: `radial-gradient(circle, ${ACCENT}12 0%, transparent 65%)`,
          }}
        />

        {/* ─── Section Header ─── */}
        <m.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 flex flex-col items-center pt-24 pb-8 px-6"
        >
          <m.div custom={0} variants={fadeUpVariants} className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px]" style={{ background: ACCENT }} />
            <span className="text-[10px] font-medium tracking-[0.32em] uppercase" style={{ color: ACCENT }}>
              Naše Usluge — Sarajevo, Pale, Jahorina
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
          className="hidden lg:flex items-center justify-center relative w-full px-12 pt-8 pb-24"
          style={{ minHeight: "840px" }}
        >
          {/* Left: Detail Panel */}
          <div className="flex-shrink-0 w-[490px] pr-12 z-20">
            <AnimatePresence mode="wait">
              <ExpandedPanel key={activeId} service={activeService} />
            </AnimatePresence>
          </div>

          {/* Center: Orbital Wheel */}
          <div
            className="relative flex-shrink-0"
            style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
          >
            {/* Ring — subtle single circle at the card orbit radius */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top:    `${50 - ORBIT_RADIUS}%`,
                left:   `${50 - ORBIT_RADIUS}%`,
                width:  `${ORBIT_RADIUS * 2}%`,
                height: `${ORBIT_RADIUS * 2}%`,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 0 80px rgba(59,130,246,0.06), inset 0 0 80px rgba(59,130,246,0.04)`,
              }}
            />
            {/* Outer faint accent ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top:    `${50 - ORBIT_RADIUS - 4.5}%`,
                left:   `${50 - ORBIT_RADIUS - 4.5}%`,
                width:  `${(ORBIT_RADIUS + 4.5) * 2}%`,
                height: `${(ORBIT_RADIUS + 4.5) * 2}%`,
                border: `1px solid ${ACCENT}18`,
              }}
            />

            {/* Center: Brand logo */}
            <m.div
              initial={{ opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ width: "215px", height: "215px" }}
            >
              <div
                className="absolute inset-[-26px] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)`,
                  filter: "blur(16px)",
                }}
              />
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  border: `2px solid ${ACCENT}55`,
                  boxShadow: `0 0 70px rgba(59,130,246,0.25), 0 0 140px rgba(59,130,246,0.10), inset 0 0 24px rgba(0,0,0,0.35)`,
                }}
              >
                <Image
                  src="/brand-logo.jpeg"
                  alt="ReNova brand"
                  fill sizes="215px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </m.div>

            {/* Rotating orbit */}
            <m.div
              className="absolute inset-0"
              animate={{ rotate: orbitRotation }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {SERVICES.map((service) => (
                <PetalCard
                  key={service.id}
                  service={service}
                  isActive={activeId === service.id}
                  orbitDeg={orbitRotation}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
            </m.div>

            <div
              className="absolute z-20 pointer-events-none rounded-full"
              style={{
                ...polarToStyle(270, ORBIT_RADIUS),
                width: 10, height: 10,
                background: ACCENT,
                boxShadow: `0 0 18px 4px ${ACCENT}`,
                marginLeft: "-5px",
                marginTop: "-5px",
              }}
            />
          </div>

          {/* Right: Sidebar */}
          <div className="flex-shrink-0 w-[200px] pl-12 z-10">
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="flex flex-col gap-8"
            >
              <div>
                <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display-bold)" }}>
                  Re<span style={{ color: ACCENT }}>Nova</span>
                </span>
                <p className="text-[9px] tracking-[0.22em] uppercase text-white/35 mt-1">
                  Od vizije do stvarnosti
                </p>
              </div>
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
                        color: activeId === s.id ? ACCENT : "rgba(255,255,255,0.35)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {activeId === s.id && "→ "}{s.title}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-light leading-relaxed text-white/30 italic">
                  Transformišemo prostore, stvaramo dom.
                </p>
              </div>
            </m.div>
          </div>
        </m.div>

        {/* ─── MOBILE LAYOUT ─── */}
        <div className="lg:hidden px-5 pb-20">
          <div className="mb-8 scroll-mt-6" ref={mobilePanelRef}>
            <AnimatePresence mode="wait">
              <ExpandedPanel key={activeId} service={activeService} />
            </AnimatePresence>
          </div>
          <div className="flex justify-center mb-8">
            <div
              className="relative w-36 h-36 rounded-full overflow-hidden"
              style={{ border: `2px solid ${ACCENT}40`, boxShadow: "0 0 40px rgba(59,130,246,0.15)" }}
            >
              <Image src="/brand-logo.jpeg" alt="ReNova brand" fill sizes="144px" className="object-cover object-center" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {SERVICES.map((service, i) => {
              const isActive = activeId === service.id;
              return (
                <m.button
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  onClick={() => handleServiceClick(service)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(59,130,246,0.13), rgba(255,255,255,0.03))"
                      : "rgba(255,255,255,0.02)",
                    border: isActive ? `1.5px solid ${ACCENT}60` : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: 22, height: 22, flexShrink: 0 }}>
                      <ServiceIcon d={service.svgPath} color={isActive ? ACCENT : "rgba(255,255,255,0.35)"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                        {service.title}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">
                        {service.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="ml-auto text-sm font-bold" style={{ color: ACCENT }}>→</span>
                    )}
                  </div>
                </m.button>
              );
            })}
          </div>
        </div>

        {/* Bottom border */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute bottom-0 left-0 right-0 h-[1px] origin-center pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
        />
      </section>
    </LazyMotion>
  );
}

