"use client";

import axiosInstance from "@/commons/axios";
import TopBar from "@/components/top-bar";
import UserDonateForm from "@/components/user-donate-form";
import { IMember } from "@/types/member";
import { useEffect, useState } from "react";

export default function DonatesFormPage() {
  const [memberData, setMemberData] = useState<IMember>({} as IMember);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.localStorage != undefined) {
      (async () => {
        const memberId = localStorage.getItem("member_id");

        setLoading(true);
        const response = await axiosInstance.get(`/members/${memberId}`);
        setMemberData(response.data as IMember);
        setLoading(false);
      })();
    }
  }, []);

  console.log(memberData);

  return (
    <div className="max-w-[900px] py-6 mx-auto">
      {loading ? (
        <div>loading................</div>
      ) : (
        <UserDonateForm memberData={memberData} />
      )}
    </div>
  );
}
