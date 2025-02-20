"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavItems = () => (
    <>
      <button
        onClick={() => router.push("/")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Home
      </button>
      <button
        onClick={() => router.push("/news")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        News
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Campaign
      </button>
      <button
        onClick={() => router.push("/donate")}
        className="text-[#2E8B57] hover:text-secondary transition-colors"
      >
        Donate
      </button>
      <button
        onClick={() => router.push("/create-account")}
        className="px-4 py-2 rounded-md border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Create Account
      </button>
      <button
        onClick={() => router.push("/sign-in")}
        className="px-4 py-2 rounded-md bg-[#2E8B57] text-white hover:bg-[#236B43] transition-colors"
      >
        Sign In
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
        onClick={() => router.push("/news")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        News
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Campaign
      </button>
      <button
        onClick={() => router.push("/donate")}
        className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
      >
        Donate
      </button>
      <div className="px-4 pt-2 space-y-2">
        <button
          onClick={() => router.push("/register")}
          className="w-full px-4 py-2 rounded-md border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
        >
          Create Account
        </button>
        <button
          onClick={() => router.push("/sign-in")}
          className="w-full px-4 py-2 rounded-md bg-[#2E8B57] text-white hover:bg-[#236B43] transition-colors"
        >
          Sign In
        </button>
      </div>
    </>
  );

  return (
    <nav className="bg-background py-2 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
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
            Union Peace & Dev
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
