"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";
import DashboardLayout from "@/components/dashboard";
import LoginNavigation from "@/components/login-navigation";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/membership-level",
  "/state",
  "/event-registration",
  "/event-selecting",
  "/selected-events",
  "/donate-form",
  "/memberships",
];

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardRoute = DASHBOARD_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isDashboardRoute) {
    return (
      <>
        {/* <Navigation /> */}
        <LoginNavigation />
        {children}
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
