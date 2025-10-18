"use client"
import React from "react";
import { DollarSignIcon } from "lucide-react";

export default function SalaryChart({ min = 0, max = 0, onEditMin = () => {}, onEditMax = () => {} }) {
  // simple presentational histogram + two buttons wired to edit handlers
  const heights = [6, 10, 18, 24, 30, 34, 28, 20, 14, 10, 8, 6, 6, 8, 12, 18, 26, 34, 30, 24, 18, 12, 8, 6];
  return (
    <div>
      <div className="w-full bg-transparent py-3">
        <svg className="w-full h-20" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden>
          {heights.map((h, i) => {
            const x = (i / heights.length) * 200;
            return (
              <rect key={i} x={x} y={60 - h} width={6} height={h} fill="#111827" opacity={i % 6 === 0 ? 0.2 : 0.9} />
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 justify-center mt-3">
        <button
          type="button"
          className="px-4 py-2 rounded-full border bg-white flex items-center gap-2 shadow-sm"
          onClick={onEditMin}
          aria-label="Edit min salary"
        >
          <span className="text-sm">{Number(min || 0).toLocaleString()}</span>
          <DollarSignIcon className="text-lg" />
        </button>

        <button
          type="button"
          className="px-4 py-2 rounded-full border bg-white flex items-center gap-2 shadow-sm"
          onClick={onEditMax}
          aria-label="Edit max salary"
        >
          <span className="text-sm">{Number(max || 0).toLocaleString()}</span>
          <DollarSignIcon className="text-lg" />
        </button>
      </div>
    </div>
  );
}
