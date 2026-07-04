"use client";

import { LazyMotion, domMax, m, Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];
const ACCENT_BLUE = "#3B82F6";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const PILLARS = [
  {
    title: "Svaki Detalj Je Bitan",
    desc: "Od najsitnijeg detalja do potpunog finiša, ništa ne prepuštamo slučaju. Perfekcija je naš standard u svakom kutku.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Mali i Veliki Projekti",
    desc: "Bilo da renoviramo jednu sobu ili kompletan stan, svakom projektu pristupamo jednako ozbiljno i posvećeno.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11" />
      </svg>
    ),
  },
  {
    title: "Dizajn + Izvedba",
    desc: "Ne samo da gradimo, već dizajniramo prostore koji izgledaju savršeno i funkcionišu besprijekorno za vaš život.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
];

export default function NasaMisija() {
  return (
    <LazyMotion features={domMax} strict>
      <section 
        className="relative w-full overflow-hidden text-black py-24 md:py-32"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #e0ecff 65%, #eaf2ff 100%)",
        }}
      >
        {/* Ambient top glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)"
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

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-16 md:gap-24"
          >
            {/* Header section */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              <div className="flex flex-col gap-6 flex-1 max-w-[800px]">
                {/* Eyebrow */}
                <m.div variants={fadeUp} className="flex items-center gap-4">
                  <div className="w-8 h-[2px]" style={{ background: ACCENT_BLUE }} />
                  <span
                    className="text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase"
                    style={{ color: ACCENT_BLUE, fontFamily: "var(--font-body)" }}
                  >
                    Naša Misija
                  </span>
                </m.div>

                {/* Main Quote */}
                <m.h2
                  variants={fadeUp}
                  className="text-2xl md:text-3xl lg:text-[2.5rem] leading-[1.3] font-light text-black/90"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;Naša misija je da vaše snove pretvorimo u stvarnost. Od najmanjih detalja i najjednostavnijih usluga do kompleksnih projekata i potpunih adaptacija — naš cilj je da rezultat našeg rada <span className="font-semibold" style={{ color: ACCENT_BLUE }}>ostavi osmijeh na vašem licu</span>.&rdquo;
                </m.h2>
              </div>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {PILLARS.map((pillar, idx) => (
                <m.div
                  key={idx}
                  variants={fadeUp}
                  className="flex flex-col gap-6 p-8 rounded-2xl group relative overflow-hidden transition-all duration-500 hover:shadow-lg"
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)"
                    }}
                  />
                  
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl w-14 h-14 shrink-0 transition-transform duration-700 group-hover:scale-110"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      color: ACCENT_BLUE,
                      border: "1px solid rgba(59,130,246,0.2)"
                    }}
                  >
                    {pillar.icon}
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    <h3
                      className="text-xl font-semibold tracking-wide text-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.7] text-black/60 font-light"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
