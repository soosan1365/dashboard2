"use client";
import React, { useEffect, useMemo, useState } from "react";
import { carts } from "@/content/data";
import CartItem from "@/components/global/CartItem";
import Findjob from "@/components/global/Findjob";

export default function JobGrid() {
  const [headerState, setHeaderState] = useState({});
  const [activeFilters, setActiveFilters] = useState(() => (typeof window !== "undefined" ? window.__activeSidebarFilters || {} : {}));

  useEffect(() => {
    const h = (e) => {
      try {
        // eslint-disable-next-line no-console
        console.debug('[JobGrid] received jobsHeaderChanged', e.detail);
      } catch (err) {}
      setHeaderState(e.detail || {});
    };
    const f = (e) => {
      setActiveFilters(e.detail || {});
      try { window.__activeSidebarFilters = e.detail || {}; } catch (e) {}
    };
    window.addEventListener("jobsHeaderChanged", h);
    window.addEventListener("filtersChanged", f);
    return () => {
      window.removeEventListener("jobsHeaderChanged", h);
      window.removeEventListener("filtersChanged", f);
    };
  }, []);

  // debug: log query and carts length to help debugging in browser console
  useEffect(() => {
    try {
      const qDebug = String(headerState.query || "").trim();
      // eslint-disable-next-line no-console
      console.debug('[JobGrid] query="' + qDebug + '", carts=', (carts || []).length);
    } catch (e) {}
  }, [headerState.query]);

  const q = String(headerState.query || "").trim().toLowerCase();

  // small helpers local to this file so beginners can read easily
  const normalize = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  function parseExpRange(expStr) {
    if (!expStr) return { min: 0, max: 0 };
    const s = String(expStr).toLowerCase();
    const plus = s.match(/(\d+)\+/);
    if (plus) return { min: Number(plus[1]), max: Infinity };
    const range = s.match(/(\d+)\s*-\s*(\d+)/);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    const num = s.match(/(\d+)/);
    if (num) return { min: Number(num[1]), max: Number(num[1]) };
    return { min: 0, max: 0 };
  }

  const filtered = useMemo(() => {
    const { schedule = [], employment = [], workStyle = [], salary = {} } = activeFilters || {};
    let list = carts.slice();
    // If header provided explicit filteredIds, use them directly (preserves header-driven filters)
    if (Array.isArray(headerState.filteredIds)) {
      const ids = new Set(headerState.filteredIds);
      list = list.filter((_, idx) => ids.has(idx));
    }

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      // debug: show tokens and a few titles
      try {
        // eslint-disable-next-line no-console
        console.debug('[JobGrid] tokens=', tokens.slice(0,5));
        // eslint-disable-next-line no-console
        console.debug('[JobGrid] sample titles=', (carts||[]).slice(0,5).map(it=>it.title));
      } catch (e) {}

      // if header provided explicit filteredIds, use them directly (preserves order)
      if (Array.isArray(headerState.filteredIds)) {
        const ids = new Set(headerState.filteredIds);
        list = list.filter((_, idx) => ids.has(idx));
      } else {
        // only run token matching when header didn't provide filteredIds (or when q exists)
        list = list.filter((item) => {
          if (item.title === "Find your") return true;
          // for each token, it must match title OR country OR experience OR company
          for (const t of tokens) {
            const token = t.toLowerCase();
            const normToken = normalize(token);
            if (!normToken) {
              // skip tokens that normalize to empty (e.g., punctuation or non-latin script)
              return false;
            }

            const normTitle = normalize(item.title);
            const inTitle = (String(item.title || "").toLowerCase().includes(token)) || (normTitle && normTitle.includes(normToken));

            const normCountry = normalize(item.country);
            const inCountry = normCountry && (normCountry.includes(normToken) || normToken.includes(normCountry));

            const normCompany = normalize(item.company);
            const inCompany = normCompany && (normCompany.includes(normToken) || normToken.includes(normCompany));

            // experience matching: token is numeric (e.g., '5' or '5+') or contains 'year'
            let inExperience = false;
            if (/^\d+\+?$/.test(token) || /years?/.test(token)) {
              const numMatch = token.match(/(\d+)/);
              if (numMatch) {
                const tnum = Number(numMatch[1]);
                const { min, max } = parseExpRange(item.experience);
                inExperience = tnum >= min && tnum <= max;
              }
            }

            if (!(inTitle || inCountry || inExperience || inCompany)) return false;
          }
          return true;
        });
      }
    }
    if ((schedule && schedule.length) || (employment && employment.length) || (workStyle && workStyle.length) || (salary && (salary.min || salary.max))) {
      list = list.filter((item) => {
        if (item.title === "Find your") return true;
        if (schedule && schedule.length && item.workSchedule) if (!schedule.includes(item.workSchedule)) return false;
        if (employment && employment.length && item.employmentType) if (!employment.includes(item.employmentType)) return false;
        if (workStyle && workStyle.length && item.workStyle) if (!workStyle.includes(item.workStyle)) return false;
        if (salary && (salary.min || salary.max)) {
          const price = Number(String(item.price || "").replace(/,/g, "") || 0);
          if (salary.min && price < salary.min) return false;
          if (salary.max && price > salary.max) return false;
        }
        return true;
      });
    }

    // apply header-applied filters (pills added by header) and detectedCompany
    try {
      // copy applied filters so we don't accidentally mutate headerState
      const applied = Array.isArray(headerState.appliedFilters) ? [...headerState.appliedFilters] : [];
      if (q) {
        const tokens = q.split(/\s+/).filter(Boolean);
        // debug: show tokens and a few titles
        try {
          // eslint-disable-next-line no-console
          console.debug('[JobGrid] tokens=', tokens.slice(0,5));
          // eslint-disable-next-line no-console
          console.debug('[JobGrid] sample titles=', (carts||[]).slice(0,5).map(it=>it.title));
        } catch (e) {}

        // scoring: prefer full-title matches, then company contains, then title partial, then country, then experience
        const qRaw = String(headerState.query || "").trim().toLowerCase();
        const normQ = normalize(qRaw);

        list = list
          .map((item) => {
            if (item.title === "Find your") return { item, score: 1000 };
            let score = 0;
            const title = String(item.title || "").toLowerCase();
            const normTitle = normalize(item.title);
            const company = String(item.company || "").toLowerCase();
            const normCompany = normalize(item.company);
            const country = String(item.country || "").toLowerCase();
            const normCountry = normalize(item.country);

            // full-title exact or includes full query
            if (qRaw && title === qRaw) score += 1000;
            else if (qRaw && title.includes(qRaw)) score += 500;

            // company contains full query or normalized
            if (qRaw && company && company.includes(qRaw)) score += 400;
            if (normQ && normCompany && normCompany.includes(normQ)) score += 300;

            // title partial normalized match
            if (normQ && normTitle && normTitle.includes(normQ)) score += 200;

            // country match
            if (normQ && normCountry && (normCountry.includes(normQ) || normQ.includes(normCountry))) score += 100;

            // experience numeric token matches
            for (const t of tokens) {
              const token = t.toLowerCase();
              if (/^\d+\+?$/.test(token) || /years?/.test(token)) {
                const numMatch = token.match(/(\d+)/);
                if (numMatch) {
                  const tnum = Number(numMatch[1]);
                  const { min, max } = parseExpRange(item.experience);
                  if (tnum >= min && tnum <= max) score += 50;
                }
              }
            }

            return { item, score };
          })
          .filter((s) => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((s) => s.item);
      }

      // apply header-applied filters (pills added by header)
      if (applied.length) {
        list = list.filter((item) => {
          for (const f of applied) {
            if (f.type === 'location') {
              const nc = normalize(item.country);
              const nv = normalize(f.value);
              if (!(nc && nv && (nc.includes(nv) || nv.includes(nc)))) return false;
            }
            if (f.type === 'experience') {
              const num = Number(f.value || 0);
              const { min, max } = parseExpRange(item.experience);
              if (max < num) return false;
            }
            if (f.type === 'company') {
              const nc = normalize(item.company);
              const nv = normalize(f.value);
              if (!(nc && nv && (nc.includes(nv) || nv.includes(nc)))) return false;
            }
            if (f.type === 'text') {
              const qn = normalize(String(f.value || ''));
              const matchTitle = normalize(item.title).includes(qn) || String(item.title || '').toLowerCase().includes(String(f.value || '').toLowerCase());
              const matchCompany = normalize(item.company).includes(qn);
              const matchCountry = normalize(item.country).includes(qn);
              let matchExp = false;
              const numMatch = String(f.value || '').match(/(\d+)/);
              if (numMatch) {
                const n = Number(numMatch[1]);
                const { min, max } = parseExpRange(item.experience);
                matchExp = n >= min && n <= max;
              }
              if (!(matchTitle || matchCompany || matchCountry || matchExp)) return false;
            }
          }
          return true;
        });
      }
    } catch (e) {
      // ignore
    }
    return list;
  }, [q, activeFilters, headerState.appliedFilters]);

  return (
    <div className="grid grid-cols-1 max-w-[90%]  mx-auto md:max-w-[100%] md:grid-cols-2 lg:grid-cols-3 gap-2 px-3 py-4">
      {filtered.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">No jobs found</div>
      ) : (
        filtered.map((item, index) => (item.title === "Find your" ? <Findjob key={index} {...item} /> : <CartItem key={index} {...item} />))
      )}
    </div>
  );
}
