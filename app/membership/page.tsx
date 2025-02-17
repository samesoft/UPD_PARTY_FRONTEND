"use client";

// import MembershipFormElements from "@/components/membership";

// export default function MemberShipPage() {
//   return <MembershipFormElements />;
// }

import dynamic from "next/dynamic";

const MembershipPage = dynamic(() => import("../../components/members-page"), {
  ssr: false,
});

export default MembershipPage;
