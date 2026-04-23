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

/* ─── Inline DOB watermark — extremely fine strokes ─────────── */
function DobWatermark() {
  const r = 90;
  const cx = r, cy = r;
  const radii = [0.92, 0.74, 0.56, 0.38, 0.18];
  const spokeCount = 12;
  return (
    <svg
      width={r * 2} height={r * 2}
      viewBox={`0 0 ${r * 2} ${r * 2}`}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {radii.map((ratio, i) => (
        <circle key={i} cx={cx} cy={cy} r={r * ratio}
          fill="none" stroke="#C4A96A" strokeWidth="0.3" />
      ))}
      {Array.from({ length: spokeCount }, (_, i) => {
        const a = (i * Math.PI * 2) / spokeCount;
        return (
          <line key={i}
            x1={cx + r * 0.18 * Math.cos(a)} y1={cy + r * 0.18 * Math.sin(a)}
            x2={cx + r * 0.92 * Math.cos(a)} y2={cy + r * 0.92 * Math.sin(a)}
            stroke="#C4A96A" strokeWidth="0.3"
          />
        );
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI * 2) / 24 + Math.PI / 24;
        return (
          <circle key={i}
            cx={cx + r * 0.64 * Math.cos(a)}
            cy={cy + r * 0.64 * Math.sin(a)}
            r={0.8} fill="#C4A96A"
          />
        );
      })}
    </svg>
  );
}

/* ─── Editorial SVG arrow ────────────────────────────────────── */
function EditorialArrow({ hover, reduced }: { hover: boolean; reduced: boolean }) {
  return (
    <svg width="34" height="10" viewBox="0 0 34 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0, transform: hover && !reduced ? "translateX(4px)" : "translateX(0)", transition: "transform 0.22s ease" }}>
      <path d="M0 5 H28 M24 1.5 L30.5 5 L24 8.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Ceremonial input with animated underline ─────────────── */
function CeremonialInput({ id, type, placeholder, value, onChange, autoComplete, disabled, style, onFocus, onBlur, ariaInvalid, ariaDescribedBy, inputMode }: {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="input-underline-wrapper">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        inputMode={inputMode}
        style={style}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <div className="input-underline" />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const labelStyle: CSSProperties = {
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "13px",
  textTransform: "lowercase",
  letterSpacing: "0.06em",
  color: "#2C2418",
  display: "block",
  marginBottom: "6px",
  fontWeight: 400,
  opacity: 0.72,
  textAlign: "left",
};

const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(122,116,105,0.35)",
  outline: "none",
  fontFamily: "var(--font-inter-var), sans-serif",
  fontSize: "15px",
  color: "#2C2418",
  padding: 0,
  minHeight: "44px",
  borderRadius: 0,
  display: "block",
  textAlign: "left",
};

const defaultVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: EASE },
  }),
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, x: 0 },
  visible: () => ({ opacity: 1, x: 0, transition: { duration: 0 } }),
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
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (browserTimeZone) setTimezone((c) => c || browserTimeZone);
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "name is required";
    if (!dob) e.dob = "date of birth is required";
    if (!unknownTime && !timeOfBirth) e.time = "enter birth time or check unknown";
    if (!placeOfBirth.trim()) e.place = "place of birth is required";
    if (!timezone.trim()) e.timezone = "timezone is required";
    const parsedLat = Number(latitude);
    if (!latitude.trim()) e.latitude = "latitude is required";
    else if (!Number.isFinite(parsedLat) || parsedLat < -90 || parsedLat > 90)
      e.latitude = "latitude must be between -90 and 90";
    const parsedLng = Number(longitude);
    if (!longitude.trim()) e.longitude = "longitude is required";
    else if (!Number.isFinite(parsedLng) || parsedLng < -180 || parsedLng > 180)
      e.longitude = "longitude must be between -180 and 180";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const fieldMap: Record<string, string> = {
        name: "name", dob: "dob", time: "timeOfBirth",
        place: "placeOfBirth", timezone: "timezone",
        latitude: "latitude", longitude: "longitude",
      };
      document.getElementById(fieldMap[Object.keys(errs)[0]] ?? Object.keys(errs)[0])?.focus();
      return;
    }
    setIsSubmitting(true);
    setUserData({ name, dob, timeOfBirth, unknownTime, placeOfBirth, timezone, latitude, longitude });
    router.push("/loading-screen");
  }

  function onFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.style.borderBottom = "1px solid #A34851";
  }

  function onBlur(e: FocusEvent<HTMLInputElement>, hasError: boolean) {
    e.target.style.borderBottom = hasError
      ? "1px solid rgba(181, 86, 62, 0.4)"
      : "1px solid rgba(122, 116, 105, 0.1)";
    e.target.style.boxShadow = "none";
  }

  async function runLookup(query: string) {
    if (query.trim().length < 2) { setLookupResults([]); return; }
    setIsLookupLoading(true);
    setLookupError("");
    try {
      const lookup = await lookupBirthPlace(query);
      if (lookup.results.length === 0) {
        setLookupResults([]);
        setLookupError("no matching locations. you can enter coordinates manually.");
        return;
      }
      setLookupResults(lookup.results);
    } catch (err) {
      setLookupResults([]);
      setLookupError(err instanceof Error ? err.message : "birthplace lookup failed.");
    } finally {
      setIsLookupLoading(false);
    }
  }

  function handlePlaceChange(value: string) {
    setPlaceOfBirth(value);
    setLookupResults([]);
    setLookupError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void runLookup(value); }, 600);
  }

  function handlePlaceBlur() {
    if (lookupResults.length === 1) {
      applyLookupResult(lookupResults[0]);
    } else if (lookupResults.length > 0) {
      const top = lookupResults[0];
      const queryLower = placeOfBirth.toLowerCase().trim();
      const matchScore = top.displayName.toLowerCase().startsWith(queryLower) ? 1 : 0;
      if (matchScore === 1) {
        applyLookupResult(top);
      }
    }
  }

  function formatLocation(result: LocationLookupCandidate): string {
    const parts = [result.name];
    if (result.admin1) parts.push(result.admin1);
    if (result.country) parts.push(result.country);
    return parts.join(", ");
  }

  function applyLookupResult(result: LocationLookupCandidate) {
    setPlaceOfBirth(formatLocation(result));
    setTimezone(result.timezone);
    setLatitude(String(result.latitude));
    setLongitude(String(result.longitude));
    setLookupResults([]);
    setLookupError("");
    setErrors((c) => { const n = { ...c }; delete n.place; delete n.timezone; delete n.latitude; delete n.longitude; return n; });
  }

  const vars = shouldReduce ? reducedVariants : fieldVariants;
  const errStyle = { color: "#8B3620", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" };

return (
    <form onSubmit={handleSubmit} style={{ width: "800px", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "60px", rowGap: "48px" }} noValidate>

      {/* Full Name — left column */}
      <motion.div custom={0} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="name" style={labelStyle}>full name</label>
        <CeremonialInput
          id="name"
          type="text"
          placeholder="john doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={(e) => onBlur(e, !!errors.name)}
          ariaInvalid={!!errors.name}
          ariaDescribedBy={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p id="name-error" role="alert" style={errStyle}>{errors.name}</p>}
      </motion.div>

      {/* Date of Birth — right column */}
      <motion.div custom={2} variants={vars} initial="hidden" animate="visible">
        <div style={{ position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: 0.02, zIndex: 0, width: "280px", height: "280px" }}>
            <DobWatermark />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <label htmlFor="dob" style={labelStyle}>date of birth</label>
            <CeremonialInput
              id="dob"
              type="text"
              placeholder="MM/DD/YYYY"
              value={dob}
              autoComplete="bday"
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9/]/g, "");
                if (val.length === 2 && dob.length <= 2) val += "/";
                if (val.length === 5 && dob.length <= 5) val += "/";
                if (val.length <= 10) setDob(val);
              }}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={(e) => onBlur(e, !!errors.dob)}
              ariaInvalid={!!errors.dob}
              ariaDescribedBy={errors.dob ? "dob-error" : undefined}
            />
            {errors.dob && <p id="dob-error" role="alert" style={errStyle}>{errors.dob}</p>}
          </div>
        </div>
      </motion.div>

      {/* Place of Birth — left column */}
      <motion.div custom={1} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="placeOfBirth" style={labelStyle}>
          place of birth
          {isLookupLoading && <span style={{ marginLeft: "8px", opacity: 0.5, fontStyle: "italic" }}>searching…</span>}
        </label>
        <CeremonialInput
          id="placeOfBirth"
          type="text"
          placeholder="city, country"
          value={placeOfBirth}
          autoComplete="address-level2"
          onChange={(e) => handlePlaceChange(e.target.value)}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={(e) => { handlePlaceBlur(); onBlur(e, !!errors.place); }}
          ariaInvalid={!!errors.place}
          ariaDescribedBy={errors.place ? "place-error" : undefined}
        />
        {errors.place && <p id="place-error" role="alert" style={errStyle}>{errors.place}</p>}
        {lookupError && <p role="alert" style={{ ...errStyle, marginTop: "8px" }}>{lookupError}</p>}
        {lookupResults.length > 0 && (
          <div id="place-results" role="listbox" style={{ display: "grid", gap: "1px", marginTop: "8px", borderTop: "1px solid rgba(122,116,105,0.08)" }}>
            {lookupResults.map((result) => (
              <button key={result.id} type="button" role="option" onClick={() => applyLookupResult(result)} style={{ background: "none", border: "none", borderBottom: "1px solid rgba(122,116,105,0.06)", padding: "10px 0", textAlign: "left", cursor: "pointer", minHeight: "44px", width: "100%" }}>
                <span style={{ display: "block", color: "#2C2418", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontSize: "14px" }}>{result.displayName}</span>
                <span style={{ display: "block", marginTop: "2px", color: "#9C9488", fontFamily: "var(--font-inter-var)", fontSize: "11px", letterSpacing: "0.04em" }}>{result.timezone} · {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Time of Birth — right column */}
      <motion.div custom={3} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="timeOfBirth" style={labelStyle}>time of birth</label>
        <CeremonialInput
          id="timeOfBirth"
          type="text"
          placeholder="HH:MM"
          value={timeOfBirth}
          disabled={unknownTime}
          autoComplete="off"
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9:]/g, "");
            if (val.length === 2 && !val.includes(":")) val += ":";
            if (val.length <= 5) setTimeOfBirth(val);
          }}
          style={{ ...inputStyle, opacity: unknownTime ? 0.35 : 1, cursor: unknownTime ? "not-allowed" : "auto" }}
          onFocus={(e) => { if (!unknownTime) onFocus?.(e); }}
          onBlur={(e) => onBlur(e, !!errors.time)}
          ariaInvalid={!!errors.time}
          ariaDescribedBy={errors.time ? "time-error" : undefined}
        />
        <label htmlFor="unknownTime" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer", fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif", fontSize: "13px", letterSpacing: "0.06em", color: "#2C2418", opacity: 0.6 }}>
          <span style={{ position: "relative", width: "16px", height: "16px", flexShrink: 0, display: "inline-flex" }}>
            <input id="unknownTime" type="checkbox" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTimeOfBirth(""); }} style={{ position: "absolute", inset: 0, margin: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
            <span aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${unknownTime ? "#B5563E" : "rgba(122,116,105,0.45)"}`, backgroundColor: unknownTime ? "#B5563E" : "transparent", transition: "background-color 0.18s ease, border-color 0.18s ease", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              {unknownTime && <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#F5F0E8", display: "block" }} />}
            </span>
          </span>
          i don't know my birth time
        </label>
        {errors.time && <p id="time-error" role="alert" style={errStyle}>{errors.time}</p>}
      </motion.div>

      {/* DOB + Time — stacked vertically */}
      <motion.div custom={1} variants={vars} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

        {/* DOB — watermark centered behind field */}
        <div style={{ position: "relative", width: "450px" }}>
          {/* Wheel of Time watermark */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              opacity: 0.02,
              zIndex: 0,
              width: "280px",
              height: "280px",
            }}
          >
            <DobWatermark />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <label htmlFor="dob" style={labelStyle}>date of birth</label>
            <CeremonialInput
              id="dob"
              type="text"
              placeholder="MM/DD/YYYY"
              value={dob}
              autoComplete="bday"
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9/]/g, "");
                if (val.length === 2 && dob.length <= 2) val += "/";
                if (val.length === 5 && dob.length <= 5) val += "/";
                if (val.length <= 10) setDob(val);
              }}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={(e) => onBlur(e, !!errors.dob)}
              ariaInvalid={!!errors.dob}
              ariaDescribedBy={errors.dob ? "dob-error" : undefined}
            />
            {errors.dob && <p id="dob-error" role="alert" style={errStyle}>{errors.dob}</p>}
          </div>
        </div>

        {/* Time of birth */}
        <div>
          <label htmlFor="timeOfBirth" style={labelStyle}>time of birth</label>
          <CeremonialInput
            id="timeOfBirth"
            type="text"
            placeholder="HH:MM"
            value={timeOfBirth}
            disabled={unknownTime}
            autoComplete="off"
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9:]/g, "");
              if (val.length === 2 && !val.includes(":")) val += ":";
              if (val.length <= 5) setTimeOfBirth(val);
            }}
            style={{ ...inputStyle, opacity: unknownTime ? 0.35 : 1, cursor: unknownTime ? "not-allowed" : "auto" }}
            onFocus={(e) => { if (!unknownTime) onFocus?.(e); }}
            onBlur={(e) => onBlur(e, !!errors.time)}
            ariaInvalid={!!errors.time}
            ariaDescribedBy={errors.time ? "time-error" : undefined}
          />

          {/* Custom circular checkbox toggle */}
          <label
            htmlFor="unknownTime"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              width: "450px", marginTop: "12px", cursor: "pointer",
              fontFamily: "var(--font-quattrocento-sans), var(--font-inter-var), sans-serif",
              fontSize: "14px", letterSpacing: "0.06em",
              color: "#2C2418", opacity: 0.6, textAlign: "center",
            }}
          >
            {/* Hidden real input — keyboard + screen reader accessible */}
            <span style={{ position: "relative", width: "16px", height: "16px", flexShrink: 0, display: "inline-flex" }}>
              <input
                id="unknownTime" type="checkbox" checked={unknownTime}
                onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTimeOfBirth(""); }}
                style={{
                  position: "absolute", inset: 0, margin: 0,
                  opacity: 0, width: "100%", height: "100%",
                  cursor: "pointer",
                }}
              />
              {/* Custom circle visual */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  border: `1px solid ${unknownTime ? "#B5563E" : "rgba(122,116,105,0.45)"}`,
                  backgroundColor: unknownTime ? "#B5563E" : "transparent",
                  transition: "background-color 0.18s ease, border-color 0.18s ease",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                {unknownTime && (
                  <span style={{
                    width: "5px", height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#F5F0E8",
                    display: "block",
                  }} />
                )}
              </span>
            </span>
            i don&apos;t know my birth time
          </label>

          {errors.time && <p id="time-error" role="alert" style={errStyle}>{errors.time}</p>}
      </motion.div>

      {/* Advanced settings
        <button type="button" onClick={() => setShowAdvanced((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter-var)", fontSize: "13px", letterSpacing: "0.06em", color: "#7A7469", padding: "4px 0", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "9px", opacity: 0.7 }}>{showAdvanced ? "▲" : "▼"}</span>
          {showAdvanced ? "hide advanced" : "advanced settings"}
        </button>
        {showAdvanced && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label htmlFor="timezone" style={labelStyle}>birth timezone</label>
              <CeremonialInput
                id="timezone"
                type="text"
                placeholder="America/New_York"
                value={timezone}
                autoComplete="off"
                onChange={(e) => setTimezone(e.target.value)}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={(e) => onBlur(e, !!errors.timezone)}
                ariaInvalid={!!errors.timezone}
                ariaDescribedBy={errors.timezone ? "timezone-error" : undefined}
              />
              {errors.timezone && <p id="timezone-error" role="alert" style={errStyle}>{errors.timezone}</p>}
            </div>
            <div className="grid grid-cols-2" style={{ columnGap: "60px" }}>
              <div>
                <label htmlFor="latitude" style={labelStyle}>latitude</label>
                <CeremonialInput
                  id="latitude"
                  type="number"
                  placeholder="40.7128"
                  value={latitude}
                  autoComplete="off"
                  inputMode="decimal"
                  onChange={(e) => setLatitude(e.target.value)}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={(e) => onBlur(e, !!errors.latitude)}
                  ariaInvalid={!!errors.latitude}
                  ariaDescribedBy={errors.latitude ? "latitude-error" : undefined}
                />
                {errors.latitude && <p id="latitude-error" role="alert" style={errStyle}>{errors.latitude}</p>}
              </div>
              <div>
                <label htmlFor="longitude" style={labelStyle}>longitude</label>
                <CeremonialInput
                  id="longitude"
                  type="number"
                  placeholder="-74.0060"
                  value={longitude}
                  autoComplete="off"
                  inputMode="decimal"
                  onChange={(e) => setLongitude(e.target.value)}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={(e) => onBlur(e, !!errors.longitude)}
                  ariaInvalid={!!errors.longitude}
                  ariaDescribedBy={errors.longitude ? "longitude-error" : undefined}
                />
                {errors.longitude && <p id="longitude-error" role="alert" style={errStyle}>{errors.longitude}</p>}
              </div>
            </div>
            <p style={{ color: "#9C9488", fontSize: "11px", fontFamily: "var(--font-inter-var)", lineHeight: 1.6, letterSpacing: "0.03em" }}>
              place lookup fills these automatically. adjust if the match is wrong.
            </p>
          </div>
        )}
      </motion.div>

      {/* Submit — full width */}
      <motion.div custom={5} variants={vars} initial="hidden" animate="visible" style={{ gridColumn: "1 / -1" }}>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 cursor-pointer"
          style={{
            marginTop: "40px",
            maxWidth: "800px",
            width: "100%",
            backgroundColor: isSubmitting ? "rgba(181,86,62,0.6)" : "#B5563E",
            color: "#F5F0E8",
            fontFamily: "var(--font-playfair-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.02em",
            border: "none",
            borderRadius: "2px",
            minHeight: "44px",
            cursor: isSubmitting ? "wait" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          whileHover={shouldReduce || isSubmitting ? {} : { y: -2, boxShadow: "0 6px 20px rgba(181,86,62,0.35)" }}
          whileTap={shouldReduce || isSubmitting ? {} : { scale: 0.98, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseEnter={() => { if (!isSubmitting) setArrowHover(true); }}
          onMouseLeave={() => setArrowHover(false)}
        >
          {isSubmitting ? (
            "Preparing…"
          ) : (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              Generate Profile
              <EditorialArrow hover={arrowHover} reduced={!!shouldReduce} />
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Footer signature — dimmed to 40% to preserve CTA focus */}
      <motion.p
        custom={5} variants={vars} initial="hidden" animate="visible"
        className="text-center"
        style={{
          color: "#5C574F",
          fontFamily: "var(--font-inter-var)",
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "lowercase",
          opacity: 0.4,
        }}
      >
        built on vedic timing systems
      </motion.p>

    </form>
  );
}
