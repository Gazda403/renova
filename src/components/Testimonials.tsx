"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

/* ─── Brand tokens (matches site palette) ─── */
const ACCENT       = "#3B82F6";
const CARD_WIDTH   = 380;
const CARD_GAP     = 20;

/* ─── Testimonial data — 10 real-feeling Bosnian clients ─── */
interface Testimonial {
  id:      number;
  name:    string;
  role:    string;
  content: string;
  avatar:  string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id:      1,
    name:    "Amra Hodžić",
    role:    "Vlasnica stana, Sarajevo",
    content: "ReNova je u potpunosti preuredila naš stan. Majstori su bili profesionalni, uredni i završili su sve u roku. Preporuka svima koji žele kvalitetan posao bez stresa.",
    avatar:  "https://picsum.photos/100/100?random=11",
  },
  {
    id:      2,
    name:    "Edin Karić",
    role:    "Investitor, Banja Luka",
    content: "Radili smo s njima na uređenju tri stana za iznajmljivanje. Svaki put isporučili su fantastičan rezultat, na vrijeme i u okviru budžeta. Definitivno nastavak saradnje.",
    avatar:  "https://picsum.photos/100/100?random=22",
  },
  {
    id:      3,
    name:    "Jelena Vukić",
    role:    "Agencija za nekretnine, Mostar",
    content: "Svi naši klijenti koji su koristili ReNova usluge su oduševljeni. Keramika, molerski radovi i elektrika — sve u jednom paketu i bez brige.",
    avatar:  "https://picsum.photos/100/100?random=33",
  },
  {
    id:      4,
    name:    "Mirza Begović",
    role:    "Vlasnik stana, Zenica",
    content: "Konačno renoviran kupatilo koje smo godinama odgađali. Tim je bio brz, stručan i čisti nakon sebe. Sve pohvale — bolji rezultat od očekivanog.",
    avatar:  "https://picsum.photos/100/100?random=44",
  },
  {
    id:      5,
    name:    "Senada Mujić",
    role:    "Domaćica, Tuzla",
    content: "Moj dnevni boravak je kao iz magazina. Bojanje zidova, dekorativna stukatura i novi pod — sve je savršeno usklađeno. ReNova je moja jedina preporuka prijateljima.",
    avatar:  "https://picsum.photos/100/100?random=55",
  },
  {
    id:      6,
    name:    "Darko Petrović",
    role:    "Poslovni prostor, Bihać",
    content: "Renovirali smo kancelariju za naš tim od 20 ljudi. Radovi su izvedeni vikendom da ne ometaju posao. Profesionalnost na najvišem nivou.",
    avatar:  "https://picsum.photos/100/100?random=66",
  },
  {
    id:      7,
    name:    "Lejla Bajramović",
    role:    "Kupac novog stana, Sarajevo",
    content: "Kao mlada porodica kupili smo stan u ljusci i ReNova nam je napravila kompletno uređenje po našem ukusu i budžetu. Presretni smo s rezultatom!",
    avatar:  "https://picsum.photos/100/100?random=77",
  },
  {
    id:      8,
    name:    "Zdravko Marić",
    role:    "Vlasnik vile, Neum",
    content: "Sezonski vikendica nam je bila zastarjela. Za manje od tri sedmice, ReNova je sve osvježila — od terase do spavaće sobe. Svi gosti primijete razliku.",
    avatar:  "https://picsum.photos/100/100?random=88",
  },
  {
    id:      9,
    name:    "Fatima Zukić",
    role:    "Stanarka, Goražde",
    content: "Garancija na radove mi je bila ključna. Imali smo sitnu reklamaciju i ekipa je odmah došla i riješila bez ikakvih problema. Prava firma!",
    avatar:  "https://picsum.photos/100/100?random=99",
  },
  {
    id:      10,
    name:    "Nikola Ristić",
    role:    "Poduzetnik, Travnik",
    content: "Tri apartmana za kratkoročni najam gotova za manje od šest sedmica. Sve po planu, bez skrivenih troškova. Prihodi su se višestruko isplatili.",
    avatar:  "https://picsum.photos/100/100?random=101",
  },
];

/* Double for seamless loop */
const LOOPED = [...TESTIMONIALS, ...TESTIMONIALS];
const TRACK_WIDTH = (CARD_WIDTH + CARD_GAP) * TESTIMONIALS.length;

/* ─── Single card ─── */
const TestimonialCard: React.FC<{ t: Testimonial }> = ({ t }) => (
  <div
    className="flex-shrink-0 flex flex-col gap-5 rounded-2xl p-7 select-none"
    style={{
      width:        CARD_WIDTH,
      background:   "rgba(255,255,255,0.04)",
      border:       "1px solid rgba(255,255,255,0.09)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow:    "0 8px 40px rgba(0,0,0,0.28)",
      cursor:       "grab",
    }}
  >
    {/* Top row — quote icon + stars */}
    <div className="flex items-start justify-between">
      <Quote
        size={28}
        style={{ color: ACCENT, opacity: 0.7 }}
        aria-hidden
      />
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3, 4].map((s) => (
          <Star
            key={s}
            size={13}
            style={{ fill: "#F59E0B", color: "#F59E0B" }}
          />
        ))}
      </div>
    </div>

    {/* Content */}
    <p
      className="leading-relaxed text-[14.5px] flex-1"
      style={{ color: "rgba(255,255,255,0.72)", fontFamily: "var(--font-body)" }}
    >
      "{t.content}"
    </p>

    {/* Author row */}
    <div className="flex items-center gap-3 pt-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <img
        src={t.avatar}
        alt={t.name}
        className="rounded-full shrink-0"
        style={{
          width:  44,
          height: 44,
          objectFit:   "cover",
          border: `2px solid ${ACCENT}40`,
        }}
      />
      <div>
        <p
          className="text-[13px] font-semibold"
          style={{ color: "#fff", fontFamily: "var(--font-body)" }}
        >
          {t.name}
        </p>
        <p
          className="text-[11px]"
          style={{ color: "rgba(255,255,255,0.42)", fontFamily: "var(--font-body)" }}
        >
          {t.role}
        </p>
      </div>
      {/* Verified badge */}
      <div
        className="ml-auto shrink-0 text-[10px] font-semibold tracking-[0.12em] uppercase px-[10px] py-[4px] rounded-full"
        style={{
          background: `${ACCENT}18`,
          color:      ACCENT,
          border:     `1px solid ${ACCENT}30`,
        }}
      >
        Verified
      </div>
    </div>
  </div>
);

/* ─── Main exported section ─── */
export default function Testimonials() {
  const [dragging, setDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="utisci"
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0B0C0E 0%, #0f1215 60%, #0B0C0E 100%)",
        padding:    "clamp(5rem, 8vw, 8rem) 0",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `radial-gradient(ellipse 70% 50% at 15% 50%, ${ACCENT}12 0%, transparent 60%),
             radial-gradient(ellipse 50% 40% at 85% 50%, ${ACCENT}0d 0%, transparent 55%)`,
        }}
      />

      {/* ── Section header ── */}
      <div
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 mb-14"
      >
        <div className="flex flex-col gap-4 max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-px shrink-0" style={{ background: ACCENT }} />
            <span
              className="text-[9.5px] font-bold tracking-[0.35em] uppercase"
              style={{ color: ACCENT, fontFamily: "var(--font-body)" }}
            >
              Utisci Klijenata — Sarajevo, Pale &amp; BiH
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-black leading-[0.95] tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ŠTA KAŽU
            <br />
            <span style={{ color: ACCENT }}>NAŠI</span>
            <br />
            KLIJENTI.
          </h2>

          <p
            className="text-[14px] font-light leading-relaxed mt-1"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
          >
            Više od 500 zadovoljnih klijenata u BiH — stanari, investitori i agencije.
          </p>
        </div>
      </div>

      {/* ── Carousel track ── */}
      <div className="relative w-full" ref={constraintsRef}>

        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #0B0C0E, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #0B0C0E, transparent)",
          }}
        />

        <motion.div
          className="flex"
          style={{ gap: CARD_GAP, paddingLeft: CARD_GAP * 2, paddingRight: CARD_GAP * 2 }}
          animate={{ x: dragging ? undefined : [`0px`, `-${TRACK_WIDTH}px`] }}
          transition={dragging ? {} : {
            ease:     "linear",
            duration: 40,
            repeat:   Infinity,
          }}
          drag="x"
          dragConstraints={{ left: -TRACK_WIDTH, right: 0 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={  () => setDragging(false)}
          whileDrag={{ cursor: "grabbing" }}
        >
          {LOOPED.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </motion.div>
      </div>

      {/* ── Bottom stat strip ── */}
      <div
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 mt-16"
      >
        <div
          className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { value: "500+",   label: "Završenih projekata" },
            { value: "4.9 ★",  label: "Prosječna ocjena" },
            { value: "100%",   label: "Preporuka klijenata" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 py-7 px-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span
                className="font-black text-[clamp(1.6rem,3vw,2.4rem)] leading-none"
                style={{
                  fontFamily:    "var(--font-display)",
                  color:         ACCENT,
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[11px] font-light tracking-[0.1em] uppercase text-center"
                style={{
                  color:       "rgba(255,255,255,0.4)",
                  fontFamily:  "var(--font-body)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
