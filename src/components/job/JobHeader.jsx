"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { carts } from "@/content/data";
import { escapeRegExp, extractExperienceFromString, extractLocationFromString as extractLocationFromLib, normalizeValue, detectLocation, detectExperience, getImmediatePills, getNonDetectedTokens, getExtraTokens, getMatchedValues } from "@/lib/jobsUtils";

// tiny debounce helper (local to header)
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function JobHeader() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [filterUnited, setFilterUnited] = useState(false);
  const [filterExp5, setFilterExp5] = useState(false);
  const [clearedPills, setClearedPills] = useState({ location: false, experience: false });
  const [pinnedExperience, setPinnedExperience] = useState(null);
  const [pinnedLocation, setPinnedLocation] = useState(null);

  // small wrappers using shared helpers
  const extractLocationFromString = (str) => extractLocationFromLib(str, carts);

  // detect dynamic pills from the immediate query so pills show instantly and preserve casing
  const detectedLocation = useMemo(() => detectLocation(query, carts), [query]);
  const detectedExperience = useMemo(() => detectExperience(query), [query]);

  // immediate pills (only tokens >=3 chars or numeric experience)
  const immediatePills = useMemo(() => getImmediatePills(query, carts, pinnedLocation, pinnedExperience), [query, pinnedLocation, pinnedExperience]);

  const nonDetectedTokens = useMemo(() => getNonDetectedTokens(query, pinnedLocation, detectedLocation, pinnedExperience, detectedExperience), [query, pinnedLocation, detectedLocation, pinnedExperience, detectedExperience]);

  const extraTokens = useMemo(() => getExtraTokens(nonDetectedTokens), [nonDetectedTokens]);

  // matched values from data (only tokens >=3 or numeric exps)
  const matchedValues = useMemo(() => getMatchedValues(query, carts), [query]);

  // remove handlers
  const removePillToken = (pill) => {
    if (!pill) return;
    let newQ = query || "";
    const tk = pill.token || pill.value;
    newQ = newQ.replace(new RegExp(`\\b${escapeRegExp(tk)}\\b`, "i"), "").replace(/\s+/g, " ").trim();
    setQuery(newQ);
    if (pill.type === "location") {
      setFilterUnited(false);
      setPinnedLocation(null);
      setClearedPills((p) => ({ ...p, location: true }));
    } else if (pill.type === "experience") {
      setFilterExp5(false);
      setPinnedExperience(null);
      setClearedPills((p) => ({ ...p, experience: true }));
    }
  };

  const removeLocationToken = (loc) => {
    if (!loc) return;
    const foundExp = extractExperienceFromString(query);
    if (foundExp) setPinnedExperience(foundExp);
    setPinnedLocation(null);
    setClearedPills((p) => ({ ...p, location: true }));
    const q = query || "";
    const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    let newQ = q.replace(regex, "").replace(/\b(united|usa|us|america)\b/i, "").replace(/\s+/g, " ").trim();
    setQuery(newQ);
    setFilterUnited(false);
  };

  const removeExperienceToken = (years) => {
    if (!years) return;
    const q = query || "";
    const regex = new RegExp(`${years}\\+|${years}\\s*years?|${years}years?`, "i");
    const newQ = q.replace(regex, "").replace(/\s+/g, " ").trim();
    setQuery(newQ);
    setFilterExp5(false);
    setPinnedExperience(null);
    setClearedPills((p) => ({ ...p, experience: true }));
  };

  // auto-pin effects
  useEffect(() => {
    if (detectedLocation && !clearedPills.location) setPinnedLocation(detectedLocation);
  }, [detectedLocation, clearedPills.location]);

  useEffect(() => {
    if (detectedExperience && !clearedPills.experience) setPinnedExperience(detectedExperience);
  }, [detectedExperience, clearedPills.experience]);

  // dispatch header state for JobGrid to consume
  useEffect(() => {
    const MIN_SEARCH_CHARS = 3;
    const raw = String(debouncedQuery || "").trim();
    // allow numeric experience tokens (e.g. '5' or '5+' or '3 years') to pass
    const looksLikeExperience = /^(\d+)(\+)?$|years?/i.test(raw);
    const debouncedForGrid = raw && (raw.length >= MIN_SEARCH_CHARS || looksLikeExperience) ? raw : "";

    const detail = {
      query,
      debouncedQuery: debouncedForGrid,
      filterUnited,
      filterExp5,
      clearedPills,
      pinnedExperience,
      pinnedLocation,
      detectedExperience,
      detectedLocation,
      immediatePills,
      matchedValues,
      nonDetectedTokens,
      extraTokens,
    };
    window.dispatchEvent(new CustomEvent("jobsHeaderChanged", { detail }));
  }, [query, debouncedQuery, filterUnited, filterExp5, clearedPills, pinnedExperience, pinnedLocation, detectedExperience, detectedLocation, immediatePills, matchedValues, nonDetectedTokens, extraTokens]);

  return (
    <div className="w-full pt-4 px-2 flex justify-between items-center">
      <div className=" w-full flex flex-col justify-between sm:flex-row gap-2">
        <div className=" w-full flex items-center gap-3 ">
          <span className="border-2 border-gray-100 rounded-4xl text-black p-3 ">
            <Search className="text-gray-800" />
          </span>
          <div className="w-full max-w-md">
            <div>
              <Input placeholder="Search jobs, companies, locations..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search jobs" />
              {/* hint: show when debounced query is below threshold and not an experience token */}
              {(() => {
                const raw = String(debouncedQuery || "").trim();
                const looksLikeExperience = /^(\d+)(\+)?$|years?/i.test(raw);
                if (raw && raw.length < 3 && !looksLikeExperience) {
                  return <div className="text-xs text-gray-400 mt-1">برای جستجو حداقل 3 حرف وارد کنید</div>;
                }
                return null;
              })()}
            </div>
          </div>
        </div>
        <div className=" w-full flex flex-wrap justify-start max-w-[85%] mx-auto  sm:justify-end items-center gap-3 text-gray-800  ">
          {detectedLocation && !clearedPills.location && (
            <button type="button" className="flex items-center gap-2 bg-gray-100 text-base px-4 py-1.5 rounded-full shadow-sm" onClick={() => { setClearedPills((p) => ({ ...p, location: true })); setFilterUnited(false); removeLocationToken(detectedLocation); }} aria-label={`Detected location ${detectedLocation}. Click to clear.`}>
              <span className="font-medium">{detectedLocation}</span>
              <IoCloseCircleSharp className="text-gray-600" size={18} />
            </button>
          )}

          {detectedExperience && !clearedPills.experience && (
            <button type="button" className="flex items-center gap-2 bg-gray-100 text-base px-4 py-1.5 rounded-full shadow-sm" onClick={() => { setClearedPills((p) => ({ ...p, experience: true })); setFilterExp5(false); removeExperienceToken(detectedExperience); }} aria-label={`Detected experience ${detectedExperience} years. Click to clear.`}>
              <span className="font-medium">{detectedExperience}+ years</span>
              <IoCloseCircleSharp className="text-gray-600" size={18} />
            </button>
          )}

          {pinnedExperience && (
            <button type="button" className="flex items-center gap-2 bg-white text-base px-4 py-1.5 rounded-full border shadow-sm" onClick={() => { setPinnedExperience(null); setFilterExp5(false); setClearedPills((p) => ({ ...p, experience: true })); }} aria-label={`Pinned experience ${pinnedExperience} years. Click to clear.`}>
              <span className="font-medium">{pinnedExperience}+ years</span>
              <IoCloseCircleSharp className="text-gray-600" size={18} />
            </button>
          )}

          {pinnedLocation && (
            <button type="button" className="flex items-center gap-2 bg-white text-base px-4 py-1.5 rounded-full border shadow-sm" onClick={() => { setPinnedLocation(null); setClearedPills((p) => ({ ...p, location: true })); setFilterUnited(false); }} aria-label={`Pinned location ${pinnedLocation}. Click to clear.`}>
              <span className="font-medium">{pinnedLocation}</span>
              <IoCloseCircleSharp className="text-gray-600" size={18} />
            </button>
          )}

            {(() => {
              const rawDeb = String(debouncedQuery || "").trim();
              const looksLikeExperience = /^(\d+)(\+)?$|years?/i.test(rawDeb);
              const showTokenButtons = rawDeb && (rawDeb.length >= 3 || looksLikeExperience);
              if (!showTokenButtons) return null;
              return (
                <>
                  {extraTokens.length > 0 && (
                    <button type="button" className="flex items-center gap-2 bg-gray-50 text-base px-4 py-1.5 rounded-full border shadow-sm" onClick={() => { let newQ = query || ""; for (const tk of extraTokens) newQ = newQ.replace(new RegExp(`\\b${escapeRegExp(tk)}\\b`, "i"), ""); newQ = newQ.replace(/\s+/g, " ").trim(); setQuery(newQ); }} aria-label={`Other filters: ${extraTokens.join(" ")}. Click to clear.`}>
                      <span className="font-medium">{extraTokens.join(" ")}</span>
                      <IoCloseCircleSharp className="text-gray-600" size={18} />
                    </button>
                  )}

                  {matchedValues.length > 0 && matchedValues.map((m) => (
                    <button key={m.key} type="button" className="flex items-center gap-2 bg-indigo-50 text-base px-4 py-1.5 rounded-full border shadow-sm" onClick={() => removePillToken(m)} aria-label={`${m.type} ${m.value}. Click to clear.`}>
                      <span className="font-medium">{m.value}</span>
                      <IoCloseCircleSharp className="text-gray-600" size={18} />
                    </button>
                  ))}
                </>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
