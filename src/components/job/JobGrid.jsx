"use client"
import React from "react";
import CartItem from "@/components/global/CartItem";
import Findjob from "@/components/global/Findjob";
import { useEffect, useMemo, useState } from "react";
import { carts } from "@/content/data";
import { isUSCountry, parseExpRange } from "@/lib/jobsUtils";

export default function JobGrid() {
  const [headerState, setHeaderState] = useState({});
  const [activeSidebarFilters, setActiveSidebarFilters] = useState({});

  useEffect(() => {
    const handler = (e) => setHeaderState(e.detail || {});
    const sf = (ev) => {
      const detail = ev.detail || {};
      // keep a copy on window for any legacy code, but also keep component state
      try { window.__activeSidebarFilters = detail; } catch (e) {}
      setActiveSidebarFilters(detail);
    };
    window.addEventListener("jobsHeaderChanged", handler);
    window.addEventListener("filtersChanged", sf);
    return () => {
      window.removeEventListener("jobsHeaderChanged", handler);
      window.removeEventListener("filtersChanged", sf);
    };
  }, []);

  const filtered = useMemo(() => {
    const {
      debouncedQuery = "",
      filterUnited = false,
      filterExp5 = false,
      clearedPills = {},
      pinnedExperience = null,
      pinnedLocation = null,
      detectedExperience = null,
      detectedLocation = null,
      // active sidebar filters are supplied via the global 'filtersChanged' event
    } = headerState || {};

  const q = String(debouncedQuery || "").trim().toLowerCase();

  // try to read active sidebar filters emitted by AppSidebar (kept in component state)
  const activeFilters = activeSidebarFilters || {};
    const hasSidebarFilters = (activeFilters.schedule && activeFilters.schedule.length) || (activeFilters.employment && activeFilters.employment.length) || (activeFilters.workStyle && activeFilters.workStyle.length) || (activeFilters.salary && (activeFilters.salary.min || activeFilters.salary.max));

    if (!q && !filterUnited && !filterExp5 && !hasSidebarFilters && !pinnedLocation && !pinnedExperience) {
      return carts.slice();
    }

    let list = carts.slice();
    if (q) {
      list = list.filter((item) => {
        if (item.title === "Find your") return true;
        const hay = [item.title, item.company, item.country, item.workSchedule, item.experience]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

  const sidebarFilters = activeSidebarFilters || {};
  const { schedule = [], employment = [], workStyle = [], salary } = sidebarFilters;
    list = list.filter((item) => {
      if (item.title === "Find your") return true;
      if (schedule.length && item.workSchedule) if (!schedule.includes(item.workSchedule)) return false;
      if (employment.length && item.employmentType) if (!employment.includes(item.employmentType)) return false;
      if (workStyle.length && item.workStyle) if (!workStyle.includes(item.workStyle)) return false;
      if (salary && (salary.min || salary.max)) {
        const price = Number(String(item.price || "").replace(/,/g, "") || 0);
        if (salary.min && price < salary.min) return false;
        if (salary.max && price > salary.max) return false;
      }

      const effectiveDetectedExperience = pinnedExperience ?? detectedExperience;
      const effectiveLocation = pinnedLocation ?? detectedLocation;
      const applyExperience = filterExp5 || (effectiveDetectedExperience && !clearedPills.experience && effectiveDetectedExperience >= 0);
      if (applyExperience) {
        const { min: expMin, max: expMax } = parseExpRange(item.experience);
        const required = filterExp5 ? 5 : (effectiveDetectedExperience || 0);
        if (expMax < required) return false;
      }

      const applyLocation = filterUnited || (effectiveLocation && !clearedPills.location);
      if (applyLocation && !isUSCountry(item.country)) return false;
      return true;
    });

    return list;
  }, [headerState]);

  return (
    <div className="grid grid-cols-1 max-w-[85%]  mx-auto md:max-w-[100%] md:grid-cols-2 lg:grid-cols-3 gap-2 px-3 py-4">
      {filtered.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">No jobs found</div>
      ) : (
        filtered.map((item, index) => item.title === "Find your" ? <Findjob key={index} {...item} /> : <CartItem key={index} {...item} />)
      )}
    </div>
  );
}
