"use client";

import Image from "next/image";

export default function ScrollingText() {
  const items = Array(5)
    .fill(null)
    .map((_, i) => (
      <div key={i} className="inline-flex items-center mx-6">
        <span className="text-lg font-bold text-white">Midowga</span>
        <span className="text-lg font-bold text-secondary ml-2">Nabadda</span>
        <span className="text-lg font-bold text-white ml-2">&</span>
        <span className="text-lg font-bold text-white ml-2">Horumarka</span>
        <Image
          src="/updLogo.jpg?height=24&width=24"
          alt=""
          width={24}
          height={24}
          className="ml-3"
        />
      </div>
    ));

  return (
    <div className="bg-primary overflow-hidden py-4">
      <div className="animate-marquee whitespace-nowrap inline-flex">
        {items}
        {items} {/* Duplicate for seamless loop */}
      </div>
    </div>
  );
}
