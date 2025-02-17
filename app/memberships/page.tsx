"use client";

// import MembershipFormElements from "@/components/membership";

// export default function MemberShipPage() {
//   return <MembershipFormElements />;
// }

import MembershipFormElements from "@/components/memberships";

export default function MembershipsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2E8B57] mb-6">Membership Level</h1>
            <MembershipFormElements />
        </div>
    );
}


