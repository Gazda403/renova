"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { LazyMotion, domMax, m, type Variants } from "framer-motion";

/* ─── Design tokens ─── */
const ACCENT_BLUE = "#3B82F6";
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

/* ─── Types ─── */
interface SliderProject {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

/* ─── Static data ─── */
const METRICS = [
  { value: "10+",       label: "Godina iskustva"       },
  { value: "500+",      label: "Završenih projekata"   },
  { value: "Garancija", label: "Na sve radove"         },
] as const;

const PROJECTS: SliderProject[] = [
  {
    id:        "salon",
    category:  "01 — DNEVNA SOBA",
    title:     "Salon / Dnevna Soba",
    subtitle:  "Kompletna adaptacija i uređenje",
    beforeSrc: "/new-segment-before.jpeg",
    afterSrc:  "/new-segment-after.jpeg",
    beforeAlt: "Dnevna soba prije adaptacije",
    afterAlt:  "Luksuzna dnevna soba poslije adaptacije",
  },
  {
    id:        "molerski",
    category:  "02 — ZIDOVI & TEKSTURE",
    title:     "Molerski Radovi",
    subtitle:  "Dekorativne teksture i premium finiš",
    beforeSrc: "/segment2-before.jpeg",
    afterSrc:  "/segment2-after.jpeg",
    beforeAlt: "Prostor prije molerskih radova",
    afterAlt:  "Prostor poslije molerskih radova",
  },
  {
    id:        "keramika",
    category:  "03 — PODOVI & KERAMIKA",
    title:     "Podovi i Keramika",
    subtitle:  "Premium podne obloge i oblaganje",
    beforeSrc: "/seg3-before.jpeg",
    afterSrc:  "/seg3-after.jpeg",
    beforeAlt: "Pod prije ugradnje keramike",
    afterAlt:  "Premium mramorni pod poslije ugradnje",
  },
];

/* ─── Framer Motion variants ─── */
const sectionVariants: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

const cardEntry: Variants = {
  hidden:  { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay },
  }),
};

/* ═══════════════════════════════════════════════
   SliderCard — individual pre/posle comparison
═══════════════════════════════════════════════ */
function SliderCard({
  project,
  index,
}: {
  project: SliderProject;
  index: number;
}) {
  const [pos, setPos]           = useState(50);      // 0–100 %
  const [dragging, setDragging] = useState(false);
  const containerRef            = useRef<HTMLDivElement>(null);

  /* Convert raw clientX → percentage within the slider container */
  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = ((clientX - left) / width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      setDragging(true);
      updatePos(e.clientX);
    },
    [updatePos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      updatePos(e.clientX);
    },
    [dragging, updatePos]
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  /* Keyboard accessibility: ←/→ nudges the handle */
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft")  setPos((p) => Math.max(0,   p - 2));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
  }, []);

  return (
    <m.article
      custom={index * 0.18}
      variants={cardEntry}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="flex flex-col gap-3"
    >
      {/* Category label row */}
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] font-semibold tracking-[0.3em] uppercase shrink-0"
          style={{ color: ACCENT_BLUE, fontFamily: "var(--font-body)" }}
        >
          {project.category}
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "rgba(0,0,0,0.06)" }}
        />
        <span
          className="text-[9px] font-light tracking-[0.18em] uppercase shrink-0 text-black/40"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Povucite za otkrivanje
        </span>
      </div>

      {/* ── Interactive slider canvas ── */}
      <div
        ref={containerRef}
        role="slider"
        aria-label={`${project.title} — Pre/Posle poređenje`}
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="relative w-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 select-none"
        style={{
          height:     "clamp(240px, 30vw, 400px)",
          cursor:     dragging ? "grabbing" : "grab",
          border:     "1px solid rgba(0,0,0,0.07)",
          boxShadow:  "0 32px 80px rgba(0,0,0,0.12), 0 2px 0 rgba(0,0,0,0.04) inset",
          "--tw-ring-color": ACCENT_BLUE,
        } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {/* ── AFTER layer (base — always fully visible) ── */}
        <div className="absolute inset-0">
          <Image
            src={project.afterSrc}
            alt={project.afterAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-center"
            priority={index === 0}
            draggable={false}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 55%, rgba(255,255,255,0.85) 100%)",
            }}
          />
        </div>

        {/* ── BEFORE layer (top — visually clipped by clip-path) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            /* clip-path animates smoothly without any layout thrashing */
          }}
        >
          <Image
            src={project.beforeSrc}
            alt={project.beforeAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-center"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 55%, rgba(255,255,255,0.85) 100%)",
            }}
          />
          {/* Slight monochrome desaturation on the "before" via overlay */}
          <div
            className="absolute inset-0 mix-blend-color pointer-events-none"
            style={{ background: "rgba(200,200,200,0.25)" }}
          />
        </div>

        {/* ── Divider line + drag handle ── */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{
            left:      `${pos}%`,
            width:     "2px",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, rgba(59,130,246,0.0) 0%, rgba(59,130,246,0.8) 15%, rgba(59,130,246,0.8) 85%, rgba(59,130,246,0.0) 100%)",
            boxShadow: "0 0 16px rgba(0,0,0,0.22)",
          }}
        >
          {/* Handle button */}
          <div
            className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full"
            aria-hidden
            style={{
              width:      "50px",
              height:     "50px",
              background: ACCENT_BLUE,
              boxShadow:  `0 6px 28px rgba(59,130,246,0.55), 0 0 0 4px rgba(59,130,246,0.18)`,
              transform:  `translate(-50%, -50%) scale(${dragging ? 1.14 : 1})`,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            <svg
              width="22"
              height="14"
              viewBox="0 0 22 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block", flexShrink: 0 }}
            >
              {/* Left arrow */}
              <path d="M7 1L1 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Right arrow */}
              <path d="M15 1L21 7L15 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── PRE badge (top-left) ── */}
        <div
          className="absolute top-4 left-4 z-20 pointer-events-none"
          style={{
            background:    "rgba(255,255,255,0.85)",
            backdropFilter:"blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border:        "1px solid rgba(0,0,0,0.14)",
            borderRadius:  "7px",
            padding:       "4px 11px",
          }}
        >
          <span
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-black/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            PRE
          </span>
        </div>

        {/* ── POSLE badge (top-right) ── */}
        <div
          className="absolute top-4 right-4 z-20 pointer-events-none"
          style={{
            background:    `rgba(59,130,246,0.14)`,
            backdropFilter:"blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border:        `1px solid rgba(59,130,246,0.45)`,
            borderRadius:  "7px",
            padding:       "4px 11px",
          }}
        >
          <span
            className="text-[10px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: ACCENT_BLUE, fontFamily: "var(--font-body)" }}
          >
            POSLE
          </span>
        </div>


      </div>
    </m.article>
  );
}

/* ═══════════════════════════════════════════════
   Main export — AboutAndTransformations section
═══════════════════════════════════════════════ */
export default function AboutAndTransformations() {
  return (
    <LazyMotion features={domMax} strict>
      <section
        id="o-nama"
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #e0ecff 65%, #eaf2ff 100%)",
        }}
      >
        {/* ── Blue gradient ambient layer ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 85% 5%, rgba(59,130,246,0.28) 0%, transparent 55%), " +
              "radial-gradient(ellipse 60% 50% at 5% 95%, rgba(59,130,246,0.22) 0%, transparent 55%), " +
              "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(59,130,246,0.14) 0%, transparent 70%)",
          }}
        />


        {/* ── Top divider ── */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute top-0 left-0 right-0 h-px origin-center pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.35) 30%, rgba(0,0,0,0.12) 50%, rgba(59,130,246,0.35) 70%, transparent)",
          }}
        />

        {/* ── Content wrapper ── */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-24 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24">

            {/* ══════════════════════════════
                LEFT COLUMN — sticky text panel
            ══════════════════════════════ */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
              <m.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="flex flex-col gap-9"
              >
                {/* Label */}
                <m.div custom={0} variants={fadeUp} className="flex items-center gap-3">
                  <div
                    className="w-5 h-px shrink-0"
                    style={{ background: ACCENT_BLUE }}
                  />
                  <span
                    className="text-[9.5px] font-bold tracking-[0.35em] uppercase"
                    style={{ color: ACCENT_BLUE, fontFamily: "var(--font-body)" }}
                  >
                    O Nama — Profesionalna Adaptacija
                  </span>
                </m.div>

                {/* Editorial headline */}
                <m.div custom={0.07} variants={fadeUp}>
                  <h2
                    className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.9] tracking-tight text-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    KVALITET
                    <br />
                    <span style={{ color: ACCENT_BLUE, WebkitTextStroke: "0px" }}>
                      BEZ
                    </span>
                    <br />
                    KOMPROMISA.
                  </h2>
                </m.div>

                {/* Animated accent bar */}
                <m.div
                  custom={0.14}
                  variants={fadeUp}
                  className="flex items-center gap-4"
                >
                  <div
                    className="h-[2px] w-14"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT_BLUE}, transparent)`,
                    }}
                  />
                  <div
                    className="h-px flex-1"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  />
                </m.div>

                {/* Body copy */}
                <m.p
                  custom={0.2}
                  variants={fadeUp}
                  className="text-[15px] font-light leading-[1.85] text-black/70 max-w-[420px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Iskusni majstori sa godinama rada u adaptacijama stanova. Radimo
                  s jasnim rokovima i garancijom. Naši klijenti su vlasnici
                  stanova, investitori i agencije za nekretnine.
                </m.p>

                {/* ── Metrics strip ── */}
                <m.div custom={0.28} variants={fadeUp} className="w-full">
                  {METRICS.map((m_, i) => (
                    <div
                      key={m_.value}
                      className="flex items-center gap-5 py-[18px]"
                      style={{
                        borderTop:
                          "1px solid rgba(0,0,0,0.07)",
                        borderBottom:
                          i === METRICS.length - 1
                            ? "1px solid rgba(0,0,0,0.07)"
                            : undefined,
                      }}
                    >
                      {/* Metric value */}
                      <span
                        className="font-black text-[2.25rem] leading-none w-[190px] shrink-0"
                        style={{
                          fontFamily:    "var(--font-display)",
                          color:         ACCENT_BLUE,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {m_.value}
                      </span>

                      {/* Thin separator */}
                      <div
                        className="w-px h-9 shrink-0"
                        style={{ background: "rgba(0,0,0,0.09)" }}
                      />

                      {/* Label */}
                      <span
                        className="text-[11px] font-light tracking-[0.14em] uppercase text-black/60"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {m_.label}
                      </span>
                    </div>
                  ))}
                </m.div>

                {/* CTA link */}
                <m.div custom={0.36} variants={fadeUp}>
                  <a
                    href="#kontakt"
                    className="group inline-flex items-center gap-3 text-[13px] font-semibold tracking-wide transition-colors duration-300"
                    style={{ color: ACCENT_BLUE, fontFamily: "var(--font-body)" }}
                  >
                    <span
                      className="border-b border-dashed pb-0.5 transition-all duration-300 group-hover:border-solid"
                      style={{ borderColor: `rgba(59,130,246,0.45)` }}
                    >
                      Zatražite besplatnu procjenu
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1 text-base">
                      →
                    </span>
                  </a>
                </m.div>
              </m.div>
            </div>

            {/* ══════════════════════════════
                RIGHT COLUMN — slider cards
            ══════════════════════════════ */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
              {PROJECTS.map((project, i) => (
                <SliderCard key={project.id} project={project} index={i} />
              ))}
            </div>

          </div>
        </div>

        {/* ── Bottom divider ── */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute bottom-0 left-0 right-0 h-px origin-center pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,0,0,0.10), transparent)",
          }}
        />
      </section>
    </LazyMotion>
  );
}
