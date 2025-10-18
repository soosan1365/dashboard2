"use client";
import React, { useEffect, useRef, useState } from "react";
import { CircleX, Search } from "lucide-react";
import { carts } from "@/content/data";

export default function JobHeader() {
  const [query, setQuery] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        const q = String(query || "").trim().toLowerCase();
        // simple, fast filter across visible data fields
        let filteredIds = null;
        if (q) {
          filteredIds = carts
            .map((it, idx) => ({ it, idx }))
            .filter(({ it }) => {
              const title = String(it.title || "").toLowerCase();
              const company = String(it.company || "").toLowerCase();
              const country = String(it.country || "").toLowerCase();
              const experience = String(it.experience || "").toLowerCase();
              return (
                (title && title.includes(q)) ||
                (company && company.includes(q)) ||
                (country && country.includes(q)) ||
                (experience && experience.includes(q))
              );
            })
            .map(({ idx }) => idx);
        }

        const detail = { query: String(query || "").trim(), appliedFilters: [], filteredIds };
        window.dispatchEvent(new CustomEvent("jobsHeaderChanged", { detail }));
      } catch (e) {}
    }, 250);
    return () => clearTimeout(timer.current);
  }, [query]);
  return (
    <div className="w-full pt-4 px-2 flex items-center gap-3">
      <span className="border-2 border-gray-100 rounded-4xl text-black p-3">
        <Search className="text-gray-800" />
      </span>
      <input
        className="text-xl font-semibold text-gray-700 bg-transparent outline-none w-full"
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            try {
              const detail = { query: String(query || "").trim(), appliedFilters: [] };
              window.dispatchEvent(new CustomEvent('jobsHeaderChanged', { detail }));
            } catch (err) {}
          }
        }}
      />
      {/* show a single canonical match button when there is a query */}
      {(() => {
        const qTrim = String(query || "").trim();
        if (!qTrim) return null;
        const q = qTrim.toLowerCase();
        const found = carts.find((it) => {
          const title = String(it.title || "").toLowerCase();
          const company = String(it.company || "").toLowerCase();
          const country = String(it.country || "").toLowerCase();
          const experience = String(it.experience || "").toLowerCase();
          return (
            (title && title.includes(q)) ||
            (company && company.includes(q)) ||
            (country && country.includes(q)) ||
            (experience && experience.includes(q))
          );
        });
        let matchText = "";
        if (found) {
          const title = String(found.title || "");
          const company = String(found.company || "");
          const country = String(found.country || "");
          const experience = String(found.experience || "");
          if (title.toLowerCase().includes(q)) matchText = title;
          else if (company.toLowerCase().includes(q)) matchText = company;
          else if (country.toLowerCase().includes(q)) matchText = country;
          else matchText = experience;
        }

        return (
          <button
            type="button"
            className="ml-2 border-gray-300 border-2 rounded-full px-5 py-1 flex items-center gap-2 text-sm text-gray-600"
            onClick={() => {
              // clear query and notify grid to reset
              setQuery("");
              try {
                const detail = { query: "", appliedFilters: [], filteredIds: null };
                window.dispatchEvent(new CustomEvent("jobsHeaderChanged", { detail }));
              } catch (e) {}
            }}
          >
            
            <span className="max-w-[160px] truncate">{matchText}</span>
          <CircleX className="bg-black text-white rounded-full" />
          </button>
        );
      })()}
    </div>
  );
}
