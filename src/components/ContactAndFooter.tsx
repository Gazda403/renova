"use client";

import { useState, useCallback } from "react";
import { LazyMotion, domMax, m, type Variants } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Send, X, ArrowRight } from "lucide-react";
import Image from "next/image";

/* ─── Design tokens ─── */
const ACCENT      = "#3B82F6";
const ORANGE      = "#F97316";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Variants ─── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: EASE, delay: d },
  }),
};

const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: d },
  }),
};

const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: (d = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, ease: EASE, delay: d },
  }),
};

/* ─── Contact meta items ─── */
const META = [
  { Icon: Phone,  label: "Telefon",       value: "+387 66 057 780",       href: "tel:+38766057780" },
  { Icon: Mail,   label: "Email",         value: "info@renovabih.com",     href: "mailto:info@renovabih.com" },
  { Icon: Clock,  label: "Radno Vrijeme", value: "Pon–Pet  08:00 — 18:00", href: null },
  { Icon: MapPin, label: "Lokacija",      value: "Dobrovoljnih davalaca krvi 21, Pale", href: "https://maps.google.com/?q=Dobrovoljnih+davalaca+krvi+21,+Pale" },
];

/* ─── Empty form state ─── */
const EMPTY = { name: "", phone: "", email: "", message: "" };

/* ═══════════════════════════════════════════
   Stylised Map Card
═══════════════════════════════════════════ */
function MapCard() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        height:  "clamp(180px, 22vw, 260px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
        background: "#e5e3df", // Placeholder map background color before load
      }}
    >
      <iframe
        src="https://maps.google.com/maps?q=Dobrovoljnih%20davalaca%20krvi%2021,%20Pale&t=&z=16&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Luxury Input
═══════════════════════════════════════════ */
function LuxuryInput({
  label, id, type = "text", placeholder, value, onChange,
  multiline = false, rows = 5,
}: {
  label: string; id: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  const shared = {
    id,
    value,
    placeholder,
    onFocus:  () => setFocused(true),
    onBlur:   () => setFocused(false),
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${focused ? ORANGE : "rgba(255,255,255,0.1)"}`,
      borderRadius: 10,
      padding: "14px 18px",
      color: "#fff",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      letterSpacing: "0.02em",
      outline: "none",
      transition: "border-color 0.22s ease, box-shadow 0.22s ease",
      boxShadow: focused
        ? `0 0 0 3px ${ORANGE}18, 0 4px 20px rgba(0,0,0,0.25)`
        : "0 2px 12px rgba(0,0,0,0.18)",
      resize: multiline ? "vertical" as const : undefined,
    } as React.CSSProperties,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold tracking-[0.28em] uppercase"
        style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main export
═══════════════════════════════════════════ */
export default function ContactAndFooter() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent]   = useState(false);

  const set = useCallback((k: keyof typeof EMPTY) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v })), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to real backend / form service
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm(EMPTY);
  };

  return (
    <LazyMotion features={domMax} strict>
      {/* ══════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════ */}
      <section
        id="kontakt"
        className="relative w-full overflow-hidden"
        style={{ background: "#0B0C0E" }}
      >
        {/* Subtle ambient gradient */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              `radial-gradient(ellipse 55% 60% at 0% 100%, ${ACCENT}0f 0%, transparent 55%),
               radial-gradient(ellipse 40% 45% at 100% 0%, ${ORANGE}09 0%, transparent 50%)`,
          }}
        />

        {/* Top border line */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute top-0 left-0 right-0 h-px origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(59,130,246,0.3) 50%, rgba(255,255,255,0.12) 70%, transparent)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

            {/* ════════════════════════════
                LEFT — Editorial context
            ════════════════════════════ */}
            <m.div
              className="lg:col-span-5 flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Eyebrow */}
              <m.div custom={0} variants={fadeIn} className="flex items-center gap-3">
                <div className="w-5 h-px shrink-0" style={{ background: ACCENT }} />
                <span
                  className="text-[9px] font-bold tracking-[0.38em] uppercase"
                  style={{ color: "rgba(201,185,154,0.7)", fontFamily: "var(--font-body)" }}
                >
                  Kontakt — Zatražite Besplatnu Procjenu
                </span>
              </m.div>

              {/* Main headline */}
              <m.div custom={0.08} variants={fadeUp}>
                <h2
                  className="font-black leading-[0.88] tracking-tight text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  }}
                >
                  POKRENITE
                  <br />
                  <span style={{ color: ACCENT }}>PROJEKAT.</span>
                </h2>
              </m.div>

              {/* Accent rule */}
              <m.div custom={0.14} variants={fadeIn} className="flex items-center gap-4">
                <div
                  className="h-[2px] w-12 shrink-0"
                  style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
                />
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </m.div>

              {/* Contact meta */}
              <m.div custom={0.2} variants={fadeUp} className="flex flex-col gap-0">
                {META.map(({ Icon, label, value, href }, i) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 py-4"
                    style={{
                      borderBottom: i < META.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : undefined,
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 rounded-lg mt-0.5"
                      style={{
                        width: 34, height: 34,
                        background: `${ACCENT}14`,
                        border: `1px solid ${ACCENT}28`,
                      }}
                    >
                      <Icon size={14} color={ACCENT} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[9px] font-semibold tracking-[0.22em] uppercase"
                        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}
                      >
                        {label}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-[14px] font-light transition-colors duration-200"
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: "var(--font-body)",
                            letterSpacing: "0.01em",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                        >
                          {value}
                        </a>
                      ) : (
                        <span
                          className="text-[14px] font-light"
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: "var(--font-body)",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </m.div>

              {/* Map card */}
              <m.div custom={0.3} variants={scaleIn}>
                <MapCard />
              </m.div>
            </m.div>

            {/* ════════════════════════════
                RIGHT — Premium contact form
            ════════════════════════════ */}
            <m.div
              className="lg:col-span-7"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <m.div
                custom={0.1}
                variants={scaleIn}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset",
                  padding: "clamp(1.75rem, 4vw, 3rem)",
                }}
              >
                {/* Corner accent */}
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${ORANGE}12 0%, transparent 65%)`,
                    borderRadius: "0 1rem 0 0",
                  }}
                />

                {/* Form header */}
                <m.div custom={0.18} variants={fadeUp} className="mb-8">
                  <h3
                    className="text-[clamp(1.4rem,2.5vw,2rem)] font-black tracking-tight text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Pošaljite Upit
                  </h3>
                  <p
                    className="text-[13px] font-light"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)" }}
                  >
                    Odgovaramo u roku od 24h — besplatna procjena projekta.
                  </p>
                </m.div>

                {sent ? (
                  /* ── Success state ── */
                  <m.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 60, height: 60,
                        background: `${ACCENT}18`,
                        border: `1px solid ${ACCENT}40`,
                      }}
                    >
                      <Send size={22} color={ACCENT} />
                    </div>
                    <div>
                      <p
                        className="text-[17px] font-semibold text-white mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Upit uspješno poslan!
                      </p>
                      <p
                        className="text-[13px]"
                        style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}
                      >
                        Kontaktirat ćemo vas uskoro.
                      </p>
                    </div>
                  </m.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <m.div
                      custom={0.24}
                      variants={fadeUp}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5"
                    >
                      <LuxuryInput
                        label="Ime i prezime"
                        id="kontakt-name"
                        placeholder=""
                        value={form.name}
                        onChange={set("name")}
                      />
                      <LuxuryInput
                        label="Telefon"
                        id="kontakt-phone"
                        type="tel"
                        placeholder=""
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </m.div>

                    <m.div custom={0.3} variants={fadeUp} className="mb-5">
                      <LuxuryInput
                        label="Email adresa"
                        id="kontakt-email"
                        type="email"
                        placeholder=""
                        value={form.email}
                        onChange={set("email")}
                      />
                    </m.div>

                    <m.div custom={0.36} variants={fadeUp} className="mb-8">
                      <LuxuryInput
                        label="Poruka / opis projekta"
                        id="kontakt-message"
                        placeholder=""
                        value={form.message}
                        onChange={set("message")}
                        multiline
                        rows={5}
                      />
                    </m.div>

                    {/* Action buttons */}
                    <m.div
                      custom={0.42}
                      variants={fadeUp}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                      {/* Primary CTA */}
                      <m.button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold tracking-wider uppercase"
                        style={{
                          padding: "16px 28px",
                          background: ACCENT,
                          color: "#fff",
                          fontSize: 13,
                          letterSpacing: "0.14em",
                          fontFamily: "var(--font-body)",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: `0 6px 28px ${ACCENT}44`,
                        }}
                        whileHover={{
                          scale: 1.025,
                          boxShadow: `0 10px 36px ${ACCENT}66`,
                        }}
                        whileTap={{ scale: 0.975 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <span>Pošalji Upit</span>
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </m.button>

                      {/* Secondary clear */}
                      <button
                        type="button"
                        onClick={() => setForm(EMPTY)}
                        className="flex items-center justify-center gap-2 rounded-xl transition-colors duration-200"
                        style={{
                          padding: "16px 22px",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.38)",
                          fontSize: 12,
                          letterSpacing: "0.14em",
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          cursor: "pointer",
                          textTransform: "uppercase",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                          e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.color = "rgba(255,255,255,0.38)";
                        }}
                      >
                        <X size={13} />
                        Očisti
                      </button>
                    </m.div>

                    {/* Disclaimer */}
                    <m.p
                      custom={0.48}
                      variants={fadeIn}
                      className="mt-5 text-[11px] text-center"
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Vaši podaci su zaštićeni i neće biti dijeljeni s trećim stranama.
                    </m.p>
                  </form>
                )}
              </m.div>
            </m.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer
        style={{
          background: "#0B0C0E",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Brand mark */}
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ background: ACCENT }}
              >
                <span
                  className="font-black text-[9px] text-white"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                >
                  R
                </span>
              </div>
              <span
                className="text-[11px] tracking-[0.22em] uppercase"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)" }}
              >
                © 2026 ReNova. Sva prava zadržana.
              </span>
            </div>

            {/* Separator dot — hidden on mobile */}
            <div
              className="hidden md:block w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />

            {/* Dev credit */}
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-body)" }}
              >
                Developed by
              </span>
              <Image
                src="/ak-logo-gold.jpeg"
                alt="AK Logo"
                width={90}
                height={50}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 object-contain rounded-lg"
              />
            </div>

          </div>
        </div>
      </footer>
    </LazyMotion>
  );
}
