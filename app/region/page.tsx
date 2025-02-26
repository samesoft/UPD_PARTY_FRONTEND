"use client";

import { useEffect, useState } from "react";
import RegionFormElements from "@/components/region";
import { useUtilityStore } from "@/models";

export default function RegionPage() {
  const { getRegions, getStates } = useUtilityStore();

  useEffect(() => {
    (async () => {
      getRegions().then(() => {
        getStates();
      });
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2E8B57] mb-6">Regions</h1>
      <RegionFormElements />
    </div>
  );
}
