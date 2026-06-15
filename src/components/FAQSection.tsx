"use client";

import { useState } from "react";
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/* ─── Design tokens ─── */
const ACCENT = "#3B82F6";
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

/* ─── FAQ data — locally targeted for long-tail search ─── */
const FAQS = [
  {
    q: "Koliko košta adaptacija stana u Sarajevu?",
    a: "Cijena adaptacije stana u Sarajevu ovisi o veličini prostora, obimu radova i odabranim materijalima. Kompletna adaptacija \"ključ u ruke\" za stan površine 60 m² kreće se od 25.000 KM naviše. Nudimo besplatnu procjenu i detaljnu ponudu bez obaveza — kontaktirajte nas na +387 66 057 780.",
  },
  {
    q: "Da li radite adaptacije u Palama, Jahorini i Istočnom Sarajevu?",
    a: "Da — aktivno izvodimo radove u Sarajevu, Palama, Jahorini, Istočnom Sarajevu i cijeloj regiji. Naša baza je u Palama (Dobrovoljnih davalaca krvi 21), što nam omogućava brz odaziv na cijelom tom području.",
  },
  {
    q: "Šta uključuje paket ključ u ruke?",
    a: "Paket ključ u ruke pokriva sve faze adaptacije: demolaciju postojećeg stanja, građevinske radove (zidanje, izolacija), elektroinstalacije, vodovodne instalacije, gletanje i bojanje zidova, ugradnju keramike i podnih obloga, montažu vrata i prozora te finalno čišćenje. Stanujete ili predate ključ, mi se brinemo za sve.",
  },
  {
    q: "Koliko traje kompletna adaptacija stana?",
    a: "Trajanje ovisi o veličini i obimu radova. Tipična adaptacija stana od 50–80 m² traje 6–10 sedmica. Manji radovi (molerski, keramika) završavaju se za 1–2 sedmice. Svaki projekat dobija precizan terminski plan prije početka radova — i držimo se dogovorenih rokova.",
  },
  {
    q: "Da li dajete garanciju na izvedene radove?",
    a: "Da — ReNova daje pisanu garanciju na sve izvedene radove. U slučaju bilo kakvog nedostatka ili reklamacije, naš tim dolazi bez odlaganja i rješava problem bez dodatnih troškova za klijenta. Naši klijenti su vlasnici stanova, investitori i agencije za nekretnine koji nam se uvijek ponovo vraćaju.",
  },
  {
    q: "Radite li i poslovne prostore i kancelarije?",
    a: "Apsolutno. Pored stambenih prostora, ReNova adaptira poslovne prostore, kancelarije, restorane i maloprodajne objekte u Sarajevu i okolini. Radove po potrebi izvodimo vikendom ili noću kako ne bismo ometali vaše poslovanje.",
  },
];

/* ─── Single accordion item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
      className="border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        {/* Question */}
        <span
          className="text-[15px] md:text-[16px] font-medium leading-snug transition-colors duration-200"
          style={{
            color: open ? "#fff" : "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-body)",
          }}
        >
          {q}
        </span>

        {/* Icon */}
        <span
          className="shrink-0 flex items-center justify-center rounded-full mt-0.5 transition-all duration-300"
          style={{
            width: 28,
            height: 28,
            background: open ? ACCENT : "rgba(255,255,255,0.05)",
            border: `1px solid ${open ? ACCENT : "rgba(255,255,255,0.12)"}`,
          }}
        >
          {open ? (
            <Minus size={12} color="#fff" strokeWidth={2.5} />
          ) : (
            <Plus size={12} color={ACCENT} strokeWidth={2.5} />
          )}
        </span>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className="text-[14px] font-light leading-relaxed pb-6 max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.52)",
                fontFamily: "var(--font-body)",
              }}
            >
              {a}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/* ─── Main FAQ Section ─── */
export default function FAQSection() {
  return (
    <LazyMotion features={domMax} strict>
      <section
        id="faq"
        aria-label="Česta pitanja o adaptaciji stanova u Sarajevu"
        className="relative w-full overflow-hidden"
        style={{ background: "#080A0F" }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 50% at 10% 50%, ${ACCENT}0a 0%, transparent 60%)`,
          }}
        />

        {/* Top border */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, rgba(59,130,246,0.25) 50%, rgba(255,255,255,0.08) 60%, transparent)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* ── Left: header ── */}
            <div className="lg:col-span-4">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="flex flex-col gap-5 lg:sticky lg:top-28"
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-px shrink-0" style={{ background: ACCENT }} />
                  <span
                    className="text-[9.5px] font-bold tracking-[0.35em] uppercase"
                    style={{ color: ACCENT, fontFamily: "var(--font-body)" }}
                  >
                    Česta Pitanja
                  </span>
                </div>

                {/* H2 */}
                <h2
                  className="font-black leading-[0.9] tracking-tighter text-white"
                  style={{
                    fontFamily: "var(--font-display-bold)",
                    fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                  }}
                >
                  IMATE
                  <br />
                  <span style={{ color: ACCENT }}>PITANJA?</span>
                </h2>

                <p
                  className="text-[14px] font-light leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}
                >
                  Sve što trebate znati o adaptaciji stanova i poslovnih prostora u
                  Sarajevu, Palama i Jahorini.
                </p>

                {/* CTA */}
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold transition-colors duration-200 mt-2"
                  style={{ color: ACCENT, fontFamily: "var(--font-body)" }}
                >
                  <span
                    className="border-b border-dashed pb-0.5"
                    style={{ borderColor: `${ACCENT}50` }}
                  >
                    Pošaljite nam upit
                  </span>
                  <span>→</span>
                </a>
              </m.div>
            </div>

            {/* ── Right: accordion ── */}
            <div className="lg:col-span-8">
              {/* Top border of first item */}
              <div
                className="border-t"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              />
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>

          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
