"use client";
import { useEffect, useMemo, useState } from "react";
import JobHeader from "@/components/job/JobHeader";
import JobGrid from "@/components/job/JobGrid";

export default function Jobs() {
  return (
    <div className="w-full">
      <JobHeader />
      <JobGrid />
    </div>
  );
}
