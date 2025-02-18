// "use client";

// import { useState, useEffect } from "react";
// import HeroSection from "@/components/hero-section";
// import ActionCards from "@/components/action-cards";
// import LatestNews from "@/components/latest-news";
// import JoinSection from "@/components/join-section";
// import ScrollingText from "@/components/scrolling-text";
// import CampaignPage from "@/components/campaign-page";
// import MembersPage from "@/components/members-page";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const [currentPage, setCurrentPage] = useState("home");

//   const handleMembershipClick = () => {
//     setCurrentPage("members");
//   };

//   useEffect(() => {
//     if (currentPage === "members") {
//       window.scrollTo(0, 0);
//     }
//   }, [currentPage]);

//   const { replace } = useRouter();

//   return (
//     <main className="min-h-screen">
//       <HeroSection />
//       <CampaignPage />
//       <ActionCards onMembershipClick={() => replace("/membership")} />
//       <LatestNews />

//       <JoinSection />
//       <ScrollingText />
//     </main>
//   );
// }




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