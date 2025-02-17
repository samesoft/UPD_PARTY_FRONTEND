"use client"

import { useEffect } from "react"
import MembersFormElements from "@/components/membership"
import MembershipFormElements from "@/components/membrship-level"
import StatesFormElements from "@/components/state"

export default function MembersPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Membership</h1>
      <MembersFormElements />
      <MembershipFormElements />
      <StatesFormElements />
    </div>
  )
}

