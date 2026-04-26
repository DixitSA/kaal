"use client";

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { lookupBirthPlace } from "@/lib/client/kaalApp";
import type { LocationLookupCandidate } from "@/lib/types/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface BirthFormProps {
  fieldVariants?: Variants;
  shouldReduce?: boolean;
}

/* ─── DOB watermark ──────────────────────────────────────────── */
function DobWatermark() {
  const r = 90, cx = r, cy = r;
  const radii = [0.92, 0.74, 0.56, 0.38, 0.18];
  return (
    <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`} aria-hidden="true" style={{ display: "block" }}>
      {radii.map((ratio, i) => <circle key={i} cx={cx} cy={cy} r={r * ratio} fill="none" stroke="#C4A96A" strokeWidth="0.3" />)}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return <line key={i} x1={cx + r * 0.18 * Math.cos(a)} y1={cy + r * 0.18 * Math.sin(a)} x2={cx + r * 0.92 * Math.cos(a)} y2={cy + r * 0.92 * Math.sin(a)} stroke="#C4A96A" strokeWidth="0.3" />;
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI * 2) / 24 + Math.PI / 24;
        return <circle key={i} cx={cx + r * 0.64 * Math.cos(a)} cy={cy + r * 0.64 * Math.sin(a)} r={0.8} fill="#C4A96A" />;
      })}
    </svg>
  );
}

/* ─── Icons ──────────────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <rect x="0.5" y="1.5" width="12" height="11" rx="1.5" />
      <line x1="0.5" y1="4.5" x2="12.5" y2="4.5" />
      <line x1="3.5" y1="0" x2="3.5" y2="3" strokeLinecap="round" />
      <line x1="9.5" y1="0" x2="9.5" y2="3" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="6" cy="6" r="5.5" />
      <polyline points="6,2.5 6,6 8,8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" aria-hidden="true">
      <path d="M5.5 0C2.46 0 0 2.46 0 5.5 0 9.35 5.5 14 5.5 14S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  );
}

/* ─── Editorial arrow ────────────────────────────────────────── */
function EditorialArrow({ hover, reduced }: { hover: boolean; reduced: boolean }) {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, transform: hover && !reduced ? "translateX(4px)" : "translateX(0)", transition: "transform 0.22s ease" }}>
      <path d="M0 5 H22 M18 1.5 L24.5 5 L18 8.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Ceremonial input ───────────────────────────────────────── */
function CeremonialInput({ id, type, placeholder, value, onChange, autoComplete, disabled, style, onFocus, onBlur, ariaInvalid, ariaDescribedBy, inputMode }: {
  id: string; type: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string; disabled?: boolean; style?: React.CSSProperties;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ariaInvalid?: boolean; ariaDescribedBy?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="input-underline-wrapper">
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
        autoComplete={autoComplete} disabled={disabled} inputMode={inputMode}
        style={style} onFocus={onFocus} onBlur={onBlur}
        aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy}
      />
      <div className="input-underline" />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const labelStyle: CSSProperties = {
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#3D3428",
  display: "block",
  marginBottom: "10px",
  fontWeight: 600,
  textAlign: "left",
};

const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #5C574F",
  outline: "none",
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "15px",
  color: "#2C2418",
  padding: 0,
  paddingBottom: "8px",
  minHeight: "36px",
  borderRadius: 0,
  display: "block",
  textAlign: "left",
};

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: EASE },
  }),
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0, transition: { duration: 0 } }),
};

export default function BirthForm({ fieldVariants = defaultVariants, shouldReduce = false }: BirthFormProps) {
  const router = useRouter();
  const { setUserData } = useUser();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [timezone, setTimezone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [lookupResults, setLookupResults] = useState<LocationLookupCandidate[]>([]);
  const [lookupError, setLookupError] = useState("");
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [arrowHover, setArrowHover] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) setTimezone((c) => c || tz);
  }, []);

  /** Converts MM/DD/YYYY → YYYY-MM-DD for the API schema. */
  function toISODate(mmddyyyy: string): string {
    const [mm, dd, yyyy] = mmddyyyy.split("/");
    return `${yyyy ?? ""}-${(mm ?? "").padStart(2, "0")}-${(dd ?? "").padStart(2, "0")}`;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "name is required";
    if (!dob || dob.length < 10) {
      e.dob = "enter a full date — MM/DD/YYYY";
    } else {
      const d = new Date(toISODate(dob));
      if (isNaN(d.getTime())) e.dob = "not a real calendar date";
    }
    if (!unknownTime && !timeOfBirth) e.time = "enter birth time or check unknown";
    if (!placeOfBirth.trim()) e.place = "place of birth is required";
    if (!timezone.trim()) e.timezone = "timezone is required";
    const parsedLat = Number(latitude);
    if (!latitude.trim()) e.latitude = "latitude is required";
    else if (!Number.isFinite(parsedLat) || parsedLat < -90 || parsedLat > 90) e.latitude = "must be −90 to 90";
    const parsedLng = Number(longitude);
    if (!longitude.trim()) e.longitude = "longitude is required";
    else if (!Number.isFinite(parsedLng) || parsedLng < -180 || parsedLng > 180) e.longitude = "must be −180 to 180";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const fieldMap: Record<string, string> = { name: "name", dob: "dob", time: "timeOfBirth", place: "placeOfBirth", timezone: "timezone", latitude: "latitude", longitude: "longitude" };
      document.getElementById(fieldMap[Object.keys(errs)[0]] ?? Object.keys(errs)[0])?.focus();
      return;
    }
    setIsSubmitting(true);
    setUserData({ name, dob: toISODate(dob), timeOfBirth, unknownTime, placeOfBirth, timezone, latitude, longitude });
    router.push("/loading-screen");
  }

  function onFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.style.borderBottom = "1px solid #5C574F";
  }
  function onBlur(e: FocusEvent<HTMLInputElement>, hasError: boolean) {
    e.target.style.borderBottom = hasError ? "1px solid rgba(181,86,62,0.6)" : "1px solid #5C574F";
    e.target.style.boxShadow = "none";
  }

  async function runLookup(query: string) {
    if (query.trim().length < 2) { setLookupResults([]); return; }
    setIsLookupLoading(true); setLookupError("");
    try {
      const lookup = await lookupBirthPlace(query);
      if (lookup.results.length === 0) { setLookupResults([]); setLookupError("no matches. enter coordinates manually."); return; }
      setLookupResults(lookup.results);
    } catch (err) {
      setLookupResults([]); setLookupError(err instanceof Error ? err.message : "lookup failed.");
    } finally { setIsLookupLoading(false); }
  }

  function handlePlaceChange(value: string) {
    setPlaceOfBirth(value); setLookupResults([]); setLookupError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void runLookup(value); }, 600);
  }

  function handlePlaceBlur() {
    if (lookupResults.length === 1) { applyLookupResult(lookupResults[0]); return; }
    if (lookupResults.length > 0) {
      const top = lookupResults[0];
      if (top.displayName.toLowerCase().startsWith(placeOfBirth.toLowerCase().trim())) applyLookupResult(top);
    }
  }

  function formatLocation(r: LocationLookupCandidate) {
    return [r.name, r.admin1, r.country].filter(Boolean).join(", ");
  }

  function applyLookupResult(result: LocationLookupCandidate) {
    setPlaceOfBirth(formatLocation(result));
    setTimezone(result.timezone); setLatitude(String(result.latitude)); setLongitude(String(result.longitude));
    setLookupResults([]); setLookupError("");
    setErrors((c) => { const n = { ...c }; delete n.place; delete n.timezone; delete n.latitude; delete n.longitude; return n; });
  }

  const vars = shouldReduce ? reducedVariants : fieldVariants;
  const errStyle: CSSProperties = { color: "#8B3620", fontSize: "10px", marginTop: "4px", fontFamily: "var(--font-inter-var)", letterSpacing: "0.02em" };

  /* ── Icon helper positioning ── */
  const iconStyle: CSSProperties = { position: "absolute", top: "50%", transform: "translateY(-50%)", color: "#9C9488", pointerEvents: "none", display: "flex", alignItems: "center", zIndex: 1 };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="birth-form-card landing-form"
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        background: "rgba(252, 250, 245, 0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "2.5rem 2.75rem",
        boxShadow: "0 0 0 1px rgba(44, 36, 24, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >

      {/* ── Full Name ── */}
      <motion.div custom={0} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="name" style={labelStyle}>full name</label>
        <CeremonialInput
          id="name" type="text" placeholder="arjun sharma" value={name}
          onChange={(e) => setName(e.target.value)} autoComplete="name"
          style={inputStyle} onFocus={onFocus} onBlur={(e) => onBlur(e, !!errors.name)}
          ariaInvalid={!!errors.name} ariaDescribedBy={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p id="name-error" role="alert" style={errStyle}>{errors.name}</p>}
      </motion.div>

      {/* ── Date of Birth + Time of Birth — 2 columns, stacked on mobile ── */}
      <motion.div
        custom={1} variants={vars} initial="hidden" animate="visible"
        className="dob-time-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}
      >
        <style>{`
          @media (max-width: 767px) {
            .dob-time-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {/* Date of Birth — calendar icon right */}
        <div>
          <label htmlFor="dob" style={labelStyle}>date of birth</label>
          <div style={{ position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", opacity: 0.025, zIndex: 0, width: "160px", height: "160px" }}>
              <DobWatermark />
            </div>
            <CeremonialInput
              id="dob" type="text" placeholder="MM/DD/YYYY" value={dob} autoComplete="bday"
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9/]/g, "");
                if (val.length === 2 && dob.length <= 2) val += "/";
                if (val.length === 5 && dob.length <= 5) val += "/";
                if (val.length <= 10) setDob(val);
              }}
              style={{ ...inputStyle, paddingRight: "22px" }}
              onFocus={onFocus} onBlur={(e) => onBlur(e, !!errors.dob)}
              ariaInvalid={!!errors.dob} ariaDescribedBy={errors.dob ? "dob-error" : undefined}
            />
            <span style={{ ...iconStyle, right: 0 }}><CalendarIcon /></span>
          </div>
          {errors.dob && <p id="dob-error" role="alert" style={errStyle}>{errors.dob}</p>}
        </div>

        {/* Time of Birth — clock icon left, "I don't know" inline right */}
        <div>
          <label htmlFor="timeOfBirth" style={labelStyle}>time of birth</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <CeremonialInput
                id="timeOfBirth" type="text" placeholder="HH:MM" value={timeOfBirth}
                disabled={unknownTime} autoComplete="off"
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9:]/g, "");
                  if (val.length === 2 && !val.includes(":")) val += ":";
                  if (val.length <= 5) setTimeOfBirth(val);
                }}
                style={{ ...inputStyle, paddingRight: "22px", opacity: unknownTime ? 0.35 : 1, cursor: unknownTime ? "not-allowed" : "auto" }}
                onFocus={(e) => { if (!unknownTime) onFocus(e); }}
                onBlur={(e) => onBlur(e, !!errors.time)}
                ariaInvalid={!!errors.time} ariaDescribedBy={errors.time ? "time-error" : undefined}
              />
              <span style={{ ...iconStyle, right: 0 }}><ClockIcon /></span>
            </div>
            {/* "I don't know" inline toggle */}
            <label htmlFor="unknownTime" style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "var(--font-inter-var), sans-serif", fontSize: "11px", letterSpacing: "0.5px", color: "#3D3428" }}>
              <span style={{ position: "relative", width: "22px", height: "22px", minWidth: "44px", minHeight: "44px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <input id="unknownTime" type="checkbox" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTimeOfBirth(""); }}
                  style={{ position: "absolute", inset: 0, margin: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                <span aria-hidden="true" style={{ position: "absolute", width: "18px", height: "18px", borderRadius: "50%", border: `1px solid ${unknownTime ? "#B5563E" : "#5C574F"}`, backgroundColor: unknownTime ? "#B5563E" : "transparent", transition: "background-color 0.18s ease, border-color 0.18s ease", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  {unknownTime && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#F5F0E8", display: "block" }} />}
                </span>
              </span>
              i don&apos;t know
            </label>
          </div>
          {errors.time && <p id="time-error" role="alert" style={errStyle}>{errors.time}</p>}
        </div>
      </motion.div>

      {/* ── Place of Birth — pin icon left ── */}
      <motion.div custom={2} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="placeOfBirth" style={labelStyle}>
          place of birth
          {isLookupLoading && <span style={{ marginLeft: "6px", opacity: 0.4, fontStyle: "italic", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>searching…</span>}
        </label>
        <div style={{ position: "relative" }}>
          <span style={{ ...iconStyle, left: 0 }}><LocationPinIcon /></span>
          <CeremonialInput
            id="placeOfBirth" type="text" placeholder="city, state, country" value={placeOfBirth}
            autoComplete="address-level2" onChange={(e) => handlePlaceChange(e.target.value)}
            style={{ ...inputStyle, paddingLeft: "20px" }}
            onFocus={onFocus} onBlur={(e) => { handlePlaceBlur(); onBlur(e, !!errors.place); }}
            ariaInvalid={!!errors.place} ariaDescribedBy={errors.place ? "place-error" : undefined}
          />
        </div>
        {errors.place && <p id="place-error" role="alert" style={errStyle}>{errors.place}</p>}
        {lookupError && <p role="alert" style={{ ...errStyle, marginTop: "6px" }}>{lookupError}</p>}
        {lookupResults.length > 0 && (
          <div id="place-results" role="listbox" style={{ marginTop: "6px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(122,116,105,0.12)", background: "rgba(255,255,255,0.8)" }}>
            {lookupResults.map((result) => (
              <button key={result.id} type="button" role="option" onClick={() => applyLookupResult(result)}
                style={{ background: "none", border: "none", borderBottom: "1px solid rgba(122,116,105,0.06)", padding: "9px 12px", textAlign: "left", cursor: "pointer", minHeight: "44px", width: "100%", display: "block" }}>
                <span style={{ display: "block", color: "#2C2418", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontSize: "13px" }}>{result.displayName}</span>
                <span style={{ display: "block", marginTop: "2px", color: "#9C9488", fontFamily: "var(--font-inter-var)", fontSize: "10px", letterSpacing: "0.04em" }}>{result.timezone} · {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Advanced Birth Details ── */}
      <motion.div custom={3} variants={vars} initial="hidden" animate="visible">
        <button type="button" onClick={() => setShowAdvanced((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter-var)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#7A7469", padding: "2px 0", display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ display: "inline-block", fontSize: "11px", transition: "transform 0.2s ease", transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
          advanced birth details
        </button>

        {showAdvanced && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label htmlFor="timezone" style={labelStyle}>birth timezone</label>
              <CeremonialInput id="timezone" type="text" placeholder="America/New_York" value={timezone} autoComplete="off"
                onChange={(e) => setTimezone(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={(e) => onBlur(e, !!errors.timezone)}
                ariaInvalid={!!errors.timezone} ariaDescribedBy={errors.timezone ? "timezone-error" : undefined} />
              {errors.timezone && <p id="timezone-error" role="alert" style={errStyle}>{errors.timezone}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "20px" }}>
              <div>
                <label htmlFor="latitude" style={labelStyle}>latitude</label>
                <CeremonialInput id="latitude" type="number" placeholder="40.7128" value={latitude} autoComplete="off" inputMode="decimal"
                  onChange={(e) => setLatitude(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={(e) => onBlur(e, !!errors.latitude)}
                  ariaInvalid={!!errors.latitude} ariaDescribedBy={errors.latitude ? "latitude-error" : undefined} />
                {errors.latitude && <p id="latitude-error" role="alert" style={errStyle}>{errors.latitude}</p>}
              </div>
              <div>
                <label htmlFor="longitude" style={labelStyle}>longitude</label>
                <CeremonialInput id="longitude" type="number" placeholder="-74.0060" value={longitude} autoComplete="off" inputMode="decimal"
                  onChange={(e) => setLongitude(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={(e) => onBlur(e, !!errors.longitude)}
                  ariaInvalid={!!errors.longitude} ariaDescribedBy={errors.longitude ? "longitude-error" : undefined} />
                {errors.longitude && <p id="longitude-error" role="alert" style={errStyle}>{errors.longitude}</p>}
              </div>
            </div>
            <p style={{ color: "#6B6560", fontSize: "11px", fontFamily: "var(--font-inter-var)", lineHeight: 1.7, letterSpacing: "0.03em" }}>
              place lookup fills these automatically. adjust only if the match is wrong.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Submit — centered, not full-width ── */}
      <motion.div custom={4} variants={vars} initial="hidden" animate="visible" style={{ textAlign: "center" }}>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 48px",
            backgroundColor: isSubmitting ? "rgba(181,86,62,0.6)" : "#B5563E",
            color: "#F5F0E8",
            fontFamily: "var(--font-inter-var), sans-serif",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "2px",
            cursor: isSubmitting ? "wait" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          whileHover={shouldReduce || isSubmitting ? {} : { y: -2, boxShadow: "0 8px 24px rgba(181,86,62,0.3)" }}
          whileTap={shouldReduce || isSubmitting ? {} : { scale: 0.97, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseEnter={() => { if (!isSubmitting) setArrowHover(true); }}
          onMouseLeave={() => setArrowHover(false)}
        >
          {isSubmitting ? "Preparing…" : (
            <>
              Generate Profile
              <EditorialArrow hover={arrowHover} reduced={!!shouldReduce} />
            </>
          )}
        </motion.button>
      </motion.div>

    </form>
  );
}
