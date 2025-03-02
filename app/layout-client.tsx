"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";
import DashboardLayout from "@/components/dashboard";
import LoginNavigation from "@/components/login-navigation";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import AdminNavigation from "@/components/admin-navigation";
import UserNavigation from "@/components/user-navigation";

const DASHBOARD_ROUTES = [
  "/user-dashboard",
  "/admin-dashboard",
  "/dashboard",
  "/membership-level",
  "/state",
  "/event-registration",
  "/event-selecting",
  "/selected-events",
  "/donate-form",
  "/memberships",
  "/profile",
  '/district',
  // '/NewsPage'
];

const PUBLIC_ROUTES = ['/sign-in', '/register', '/', '/about', '/contact', '/news'];

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  // Handle navigation protection
  const handleNavigation = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token && DASHBOARD_ROUTES.includes(pathname)) {
      window.history.pushState(null, '', '/sign-in');
      router.replace('/sign-in');
      return false;
    }

    // Redirect to role-specific dashboard if accessing generic /dashboard
    if (pathname === '/dashboard' && token) {
      const dashboardPath = role === 'ADMIN' ? '/dashboard' : '/';
      window.history.pushState(null, '', dashboardPath);
      router.replace(dashboardPath);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (token) {
          setIsAuthenticated(true);
          setUserRole(role || '');
        } else {
          setIsAuthenticated(false);
          setUserRole('');
          handleNavigation();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up navigation protection
    window.onpopstate = () => {
      handleNavigation();
    };

    // Set up beforeunload to catch browser navigation
    window.onbeforeunload = () => {
      if (!localStorage.getItem('token') && DASHBOARD_ROUTES.includes(pathname)) {
        return false;
      }
    };

    // Cleanup function
    return () => {
      window.onpopstate = null;
      window.onbeforeunload = null;
    };
  }, [setIsAuthenticated, pathname, router]);

  // Additional protection for route changes
  useEffect(() => {
    if (!isLoading) {
      handleNavigation();
    }
  }, [pathname, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Show TopBar only on public routes and when not authenticated */}
      {!isAuthenticated && <TopBar />}
      {/* Show only one navigation bar based on auth status and role */}
      {isAuthenticated ? (
        userRole === "ADMIN" ? (
          <AdminNavigation />
        ) : (
          <UserNavigation />
        )
      ) : (
          
        <Navigation />
      )}

      {/* Main Content */}
      {children}

      {/* Footer - Only show when not authenticated */}
      {!isAuthenticated && <Footer />}
    </>
  );
}
