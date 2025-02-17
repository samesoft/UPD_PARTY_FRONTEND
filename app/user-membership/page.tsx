"use client";

// import UserMembershipPage from "@/components/user-membership";

// export default function UserMembershipRoute() {
//   return <UserMembershipPage />;
// }

import dynamic from "next/dynamic";

const UserMembershipPage = dynamic(
  () => import("../../components/user-membership"),
  {
    ssr: false,
  }
);

export default UserMembershipPage;
