"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const donationAmounts = [
  { amount: 10, label: "DONATE $10" },
  { amount: 25, label: "DONATE $25" },
  { amount: 50, label: "DONATE $50" },
  { amount: 100, label: "DONATE $100" },
];

export default function DonationModal() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-white p-6 shadow-lg animate-fade-up">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Support Our Campaign</h3>
        <p className="mt-2 text-gray-600">
          Help us build a better future. Your contribution makes a difference.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {donationAmounts.map(({ amount, label }) => (
          <Button
            key={amount}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            {label}
          </Button>
        ))}
      </div>
      <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
        OTHER AMOUNT
      </Button>
    </div>
  );
}
