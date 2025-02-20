"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, User, Camera, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function AdminNavigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const handleLoginNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.history.pushState(null, '', '/sign-in');
    router.replace('/');
  };

  const renderNavItems = () => (
    <>
      <button
        onClick={() => router.push("/")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Home
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Campaign
      </button>
      <button
        onClick={() => router.push("/profile")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Profile
      </button>
      <button
        onClick={() => handleLoginNavigation("/news")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        News
      </button>
      
      <div className="relative group">
        <button className="text-[#2E8B57] hover:text-secondary transition-colors">
          Members
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-40 z-50">
          <button
            onClick={() => handleLoginNavigation("/membership-level")}
            className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            Member Level
          </button>
          <button
            onClick={() => handleLoginNavigation("/memberships")}
            className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            Members List
          </button>
        </div>
      </div>

      <div className="relative group">
        <button className="text-[#2E8B57] hover:text-secondary transition-colors">
          Events
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-40 z-50">
          <button
            onClick={() => handleLoginNavigation("/event-registration")}
            className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            Event Registration
          </button>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </>
  );

  const renderMobileNavItems = () => (
    <>
      <button
        onClick={() => router.push("/")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Home
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Campaign
      </button>
      <button
        onClick={() => router.push("/profile")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Profile
      </button>
      {/* ... existing mobile nav items ... */}
    </>
  );

  return (
    <nav className="bg-background py-2 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() => handleLoginNavigation("/")}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8">
            <Image
              src="/updLogo.jpg"
              alt="UPD Logo"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <span className="text-xl sm:text-sm font-bold text-primary">
            Admin Dashboard
          </span>
        </button>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {renderNavItems()}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 pb-4">
          {renderMobileNavItems()}
        </div>
      )}
    </nav>
  );
} 