"use client";

import HeroSection from "@/components/hero-section";

import LatestNews from "@/components/latest-news";
import JoinSection from "@/components/join-section";
import ScrollingText from "@/components/scrolling-text";
import CampaignPage from "@/components/campaign-page";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CampaignPage />
      <LatestNews />
      <JoinSection />
      <ScrollingText />
    </main>
  );
}
