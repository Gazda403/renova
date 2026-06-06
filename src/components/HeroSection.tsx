"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { LazyMotion, domMax, m, AnimatePresence, type Variants } from "framer-motion";
import { Phone, Plus, Menu, X } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};



/* ─── Circular Scroll Indicator ─── */
function ScrollIndicator() {
  const text = "SCROLL DOWN TO DISCOVER + SCROLL DOWN TO DISCOVER + ";
  const radius = 46;

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
      className="relative flex items-center justify-center w-28 h-28 md:w-36 md:h-36 cursor-pointer group"
    >
      {/* Outer spinning text ring */}
      <m.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <path
              id="circle-text-path"
              d={`M 60,60 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <text
            fill="#3B82F6"
            fontSize="7.5"
            fontFamily="var(--font-inter)"
            letterSpacing="2"
          >
            <textPath href="#circle-text-path" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </m.div>

      {/* Centre circle with plus */}
      <m.div
        whileHover={{ scale: 1.12 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300"
      >
        <Plus
          className="w-6 h-6 text-[#3B82F6]"
          strokeWidth={1.5}
        />
      </m.div>
    </m.div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Usluge", href: "#usluge" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "O nama", href: "#o-nama" },
    { label: "Kontakt", href: "#kontakt" },
  ];

  return (
    <m.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B0C0E]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">

        {/* Brand */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="flex flex-col leading-none"
        >
          <span
            className="text-xl md:text-2xl font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Re<span className="text-[#3B82F6]">Nova</span>
          </span>
          <span className="text-[9px] md:text-[10px] font-light tracking-[0.18em] text-white/40 uppercase mt-0.5">
            Od vizije do stvarnosti
          </span>
        </m.div>

        {/* Desktop Nav */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-light tracking-[0.22em] uppercase text-white/55 hover:text-white transition-all duration-300 ease-in-out hover:tracking-[0.26em]"
            >
              {link.label}
            </a>
          ))}
        </m.div>

        {/* CTA */}
        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="hidden md:flex items-center gap-3"
        >
          <a
            href="tel:+38761000000"
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-white/60 hover:text-[#3B82F6] transition-all duration-300 ease-in-out"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
            Pozovi
          </a>
          <a
            href="#kontakt"
            className="ml-2 px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase bg-[#3B82F6] text-white rounded-sm hover:bg-blue-500 transition-all duration-300 ease-in-out hover:shadow-[0_0_24px_rgba(59,130,246,0.4)]"
          >
            Zatražite Ponudu
          </a>
        </m.div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="md:hidden bg-[#0B0C0E]/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-light tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase bg-[#3B82F6] text-white text-center rounded-sm hover:bg-blue-500 transition-all duration-300"
              >
                Zatražite Ponudu
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}



/* ─── Main Hero Section ─── */
export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <LazyMotion features={domMax} strict>
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#0B0C0E]">

        {/* ─── Background Media Layer ─── */}
        <div className="absolute inset-0 z-0">
          {/* Static Hero Image — always underneath */}
          <Image
            src="/hero-image.png"
            alt="Renoviran prostor — ReNova"
            fill
            priority
            quality={90}
            className="object-cover object-bottom md:object-center"
            sizes="100vw"
          />

          {/* Video on top — fades out on end */}
          <m.video
            ref={videoRef}
            src="/hero-video.mp4"
            muted
            autoPlay
            playsInline
            onEnded={() => setVideoEnded(true)}
            initial={{ opacity: 1 }}
            animate={{ opacity: videoEnded ? 0 : 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-bottom md:object-center"
          />

          {/* Gradient overlays for text legibility (lightened to show more video detail) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0E]/50 via-[#0B0C0E]/20 to-[#0B0C0E]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/55 via-transparent to-[#0B0C0E]/10" />
        </div>

        {/* ─── Navbar ─── */}
        <Navbar />

        {/* ─── Hero Content ─── */}
        <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 md:px-10">

          {/* Massive geometric circle outline */}
          <div className="absolute top-1/2 right-[-25%] md:right-[-15%] -translate-y-[45%] w-[120vw] md:w-[85vw] h-[120vw] md:h-[85vw] rounded-full border border-white/[0.15] pointer-events-none z-0 mix-blend-overlay" />

          {/* Main Grid */}
          <div className="flex flex-col justify-end flex-1 pb-10 md:pb-16 pt-32 md:pt-36">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20 items-center">

              {/* ── Left Block ── */}
              <div className="flex flex-col gap-6 md:gap-8 z-10 relative mt-10 md:mt-20">

                {/* Display headline */}
                <div className="flex flex-col">
                  <m.h1
                    custom={0.5}
                    variants={slideLeft}
                    initial="hidden"
                    animate="visible"
                    className="text-[20vw] md:text-[15vw] font-black leading-[0.75] tracking-tighter text-white"
                    style={{ fontFamily: "var(--font-display-bold)" }}
                  >
                    RENOVA
                  </m.h1>
                  <m.div
                    custom={0.65}
                    variants={slideLeft}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-4 md:mt-0"
                  >
                    <span
                      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium leading-[0.9] tracking-tight text-[#3B82F6]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Adaptacija
                    </span>
                    <span className="text-sm md:text-base font-medium tracking-[0.2em] text-white/50 uppercase md:pt-4">
                      [ Tradicija rada od 2015 ]
                    </span>
                  </m.div>
                </div>

                {/* Value proposition */}
                <m.p
                  custom={0.9}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="max-w-xl text-xs md:text-sm font-light leading-relaxed text-white/70 uppercase tracking-wide mt-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Kompletne usluge adaptacije stanova i poslovnih prostora. Od ideje do useljenja — vrhunski materijali, jasni rokovi i stopostotna garancija. Naša vizija je jednostavna: stvoriti prostore koji inspirišu, pružaju komfor i podižu kvalitet svakodnevnog života.
                </m.p>

              </div>

              {/* ── Right Block — Scroll Indicator ── */}
              <m.div
                custom={1.0}
                variants={slideRight}
                initial="hidden"
                animate="visible"
                className="hidden md:flex flex-col items-center justify-center relative z-10 translate-x-[-15%]"
              >
                <ScrollIndicator />
              </m.div>
            </div>

            {/* ─── Metrics Bar ─── */}
            <m.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-16 md:mt-24 w-full max-w-3xl border border-white/20 rounded-2xl p-6 md:p-10 bg-white/[0.02] backdrop-blur-sm z-10 relative"
            >
              <div className="flex flex-col gap-6">
                <m.div
                  variants={fadeIn}
                  custom={1.3}
                  className="flex items-center gap-4"
                >
                  <span className="text-lg md:text-2xl font-light tracking-wide text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
                    SARAJEVO — KOMPLETNA ADAPTACIJA
                  </span>
                </m.div>

                <m.p
                  variants={fadeUp}
                  className="text-[10px] md:text-xs font-light leading-relaxed text-white/60 uppercase tracking-wide max-w-lg"
                >
                  Moderne i održive metode gradnje sa provjerenim materijalima. 
                  Projekti po sistemu "ključ u ruke" uz potpunu posvećenost kvaliteti i rokovima.
                </m.p>

                {/* Metric numbers */}
                <div className="flex flex-wrap gap-10 md:gap-16 mt-4 items-end">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>10+</span>
                    <span className="text-[9px] md:text-[10px] tracking-[0.1em] text-white/50 uppercase">Godina<br/>Iskustva</span>
                  </div>
                  <div className="w-[1px] h-14 bg-white/20" />
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>500+</span>
                    <span className="text-[9px] md:text-[10px] tracking-[0.1em] text-white/50 uppercase">Završenih<br/>Projekata</span>
                  </div>
                </div>

                <m.div variants={fadeUp} className="mt-6">
                  <a href="#kontakt" className="inline-flex items-center gap-3 text-sm text-[#3B82F6] hover:text-blue-400 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="tracking-[0.15em] uppercase border-b border-[#3B82F6]/30 hover:border-[#3B82F6] transition-colors pb-0.5">
                      Pročitaj Više
                    </span>
                  </a>
                </m.div>
              </div>
            </m.div>
          </div>
        </div>

        {/* ─── Bottom geometric border ─── */}
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.5, ease: EASE }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent z-10 origin-center"
        />
      </section>
    </LazyMotion>
  );
}
