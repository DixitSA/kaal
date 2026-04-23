"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface BirthFormProps {
  fieldVariants?: Variants;
  shouldReduce?: boolean;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #7A7469",
  outline: "none",
  fontFamily: "var(--font-inter-var)",
  fontSize: "1.125rem",
  color: "#2C2418",
  padding: "10px 0",
  minHeight: "44px",
  borderRadius: 0,
  display: "block",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter-var)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: "#5C574F",
  display: "block",
  marginBottom: "4px",
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

// -----------------------------------------------------------------
// Open-Meteo Geocoding (free, no API key required)
// -----------------------------------------------------------------
interface GeoResult {
  latitude: number;
  longitude: number;
  timezone: string;
  display: string; // "City, Country" for confirmation
}

async function geocodePlace(query: string): Promise<GeoResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return {
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
      display: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
    };
  } catch {
    return null;
  }
}

export default function BirthForm({ fieldVariants = defaultVariants, shouldReduce = false }: BirthFormProps) {
  const router = useRouter();
  const { setUserData } = useUser();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Geocoding state
  const [geoResolved, setGeoResolved] = useState<GeoResult | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Resolve place on blur (if changed since last resolve)
  const resolvePlace = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setGeoResolved(null);
      return;
    }
    // Skip if already resolved for this exact input
    if (geoResolved && geoResolved.display.toLowerCase().includes(trimmed.split(",")[0].toLowerCase())) {
      return;
    }
    setGeoLoading(true);
    const result = await geocodePlace(trimmed);
    setGeoResolved(result);
    setGeoLoading(false);
    if (!result) {
      setErrors(prev => ({ ...prev, place: "Could not find this location. Try a more specific city name." }));
    } else {
      setErrors(prev => {
        const next = { ...prev };
        delete next.place;
        return next;
      });
    }
  }, [geoResolved]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!dob) e.dob = "Date of birth is required";
    if (!unknownTime && !timeOfBirth) e.time = "Enter birth time or check unknown";
    if (!placeOfBirth.trim()) e.place = "Place of birth is required";
    else if (!geoResolved) e.place = "Could not resolve this location. Try a more specific city name.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // If place hasn't been geocoded yet, do it now
    if (!geoResolved && placeOfBirth.trim()) {
      setSubmitting(true);
      setGeoLoading(true);
      const result = await geocodePlace(placeOfBirth.trim());
      setGeoResolved(result);
      setGeoLoading(false);

      if (!result) {
        setErrors(prev => ({ ...prev, place: "Could not find this location. Try a more specific city name." }));
        setSubmitting(false);
        return;
      }

      // Continue with resolved result
      submitWithGeo(result);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const fieldMap: Record<string, string> = { name: "name", dob: "dob", time: "timeOfBirth", place: "placeOfBirth" };
      document.getElementById(fieldMap[firstKey] ?? firstKey)?.focus();
      setSubmitting(false);
      return;
    }

    submitWithGeo(geoResolved!);
  }

  function submitWithGeo(geo: GeoResult) {
    setSubmitting(true);
    setUserData({
      name,
      dob,
      timeOfBirth,
      unknownTime,
      placeOfBirth,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
    });
    router.push("/loading-screen");
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderBottom = "1px solid #B5563E";
    e.target.style.boxShadow = "0 1px 0 0 #B5563E";
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>, hasError: boolean) {
    e.target.style.borderBottom = hasError ? "1px solid #B5563E" : "1px solid #7A7469";
    e.target.style.boxShadow = "none";
  }

  const vars = shouldReduce ? reducedVariants : fieldVariants;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" noValidate>
      {/* Full Name */}
      <motion.div custom={0} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="name" style={labelStyle}>Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="Full Name"
          value={name}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          style={{ ...inputStyle, ...(errors.name ? { borderBottomColor: "#B5563E" } : {}) }}
          onFocus={onFocus}
          onBlur={(e) => onBlur(e, !!errors.name)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" style={{ color: "#B5563E", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
            {errors.name}
          </p>
        )}
      </motion.div>

      {/* DOB + Time */}
      <motion.div custom={1} variants={vars} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dob" style={labelStyle}>Date of Birth</label>
          <input
            id="dob"
            type="date"
            value={dob}
            autoComplete="bday"
            onChange={(e) => setDob(e.target.value)}
            style={{ ...inputStyle, ...(errors.dob ? { borderBottomColor: "#B5563E" } : {}) }}
            onFocus={onFocus}
            onBlur={(e) => onBlur(e, !!errors.dob)}
            aria-invalid={!!errors.dob}
            aria-describedby={errors.dob ? "dob-error" : undefined}
          />
          {errors.dob && (
            <p id="dob-error" role="alert" style={{ color: "#B5563E", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
              {errors.dob}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="timeOfBirth" style={labelStyle}>Time of Birth</label>
          <input
            id="timeOfBirth"
            type="time"
            value={timeOfBirth}
            disabled={unknownTime}
            autoComplete="off"
            onChange={(e) => setTimeOfBirth(e.target.value)}
            style={{ ...inputStyle, opacity: unknownTime ? 0.4 : 1, cursor: unknownTime ? "not-allowed" : "auto", ...(errors.time ? { borderBottomColor: "#B5563E" } : {}) }}
            onFocus={(e) => { if (!unknownTime) onFocus(e); }}
            onBlur={(e) => onBlur(e, !!errors.time)}
            aria-invalid={!!errors.time}
            aria-describedby={errors.time ? "time-error" : undefined}
          />
          <label
            htmlFor="unknownTime"
            style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", cursor: "pointer", fontFamily: "var(--font-inter-var)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5C574F" }}
          >
            <input
              id="unknownTime"
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTimeOfBirth(""); }}
              style={{ accentColor: "#B5563E", width: "16px", height: "16px" }}
            />
            I don&apos;t know my birth time
          </label>
          {errors.time && (
            <p id="time-error" role="alert" style={{ color: "#B5563E", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
              {errors.time}
            </p>
          )}
        </div>
      </motion.div>

      {/* Place of Birth */}
      <motion.div custom={2} variants={vars} initial="hidden" animate="visible">
        <label htmlFor="placeOfBirth" style={labelStyle}>Place of Birth</label>
        <input
          id="placeOfBirth"
          type="text"
          placeholder="City, Country"
          value={placeOfBirth}
          autoComplete="address-level2"
          onChange={(e) => {
            setPlaceOfBirth(e.target.value);
            // Clear resolved geo when user edits the field
            setGeoResolved(null);
          }}
          onBlur={(e) => {
            onBlur(e, !!errors.place);
            // Geocode on blur
            if (e.target.value.trim()) {
              resolvePlace(e.target.value);
            }
          }}
          onFocus={onFocus}
          style={{ ...inputStyle, ...(errors.place ? { borderBottomColor: "#B5563E" } : {}) }}
          aria-invalid={!!errors.place}
          aria-describedby={errors.place ? "place-error" : undefined}
        />
        {/* Geocoding status */}
        {geoLoading && (
          <p style={{ color: "#7A7469", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
            Resolving location…
          </p>
        )}
        {geoResolved && !geoLoading && (
          <p style={{ color: "#5E7A5E", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
            ✓ {geoResolved.display} ({geoResolved.timezone})
          </p>
        )}
        {errors.place && (
          <p id="place-error" role="alert" style={{ color: "#B5563E", fontSize: "12px", marginTop: "4px", fontFamily: "var(--font-inter-var)" }}>
            {errors.place}
          </p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div custom={3} variants={vars} initial="hidden" animate="visible">
        <motion.button
          type="submit"
          disabled={submitting || geoLoading}
          className="w-full py-4 text-sm uppercase tracking-widest cursor-pointer mt-2"
          style={{
            backgroundColor: (submitting || geoLoading) ? "#9C9488" : "#B5563E",
            color: "#F5F0E8",
            fontFamily: "var(--font-inter-var)",
            border: "none",
            borderRadius: "2px",
            minHeight: "44px",
            cursor: (submitting || geoLoading) ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          whileHover={shouldReduce || submitting ? {} : { y: -2, boxShadow: "0 6px 20px rgba(181,86,62,0.35)" }}
          whileTap={shouldReduce || submitting ? {} : { scale: 0.98, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {submitting ? "Generating…" : "Generate Profile →"}
        </motion.button>
      </motion.div>

      <motion.p
        custom={4}
        variants={vars}
        initial="hidden"
        animate="visible"
        className="text-center uppercase tracking-[0.2em]"
        style={{ color: "#5C574F", fontFamily: "var(--font-inter-var)", fontSize: "11px" }}
      >
        Built on Vedic Timing Systems
      </motion.p>
    </form>
  );
}
