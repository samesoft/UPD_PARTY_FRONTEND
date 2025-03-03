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
        className="px-2 py-1.5 text-[#2E8B57] hover:text-[#1a6e3f] font-medium text-sm lg:text-base transition-colors duration-300"
      >
        Hoyga
      </button>
      <button
        onClick={() => router.push("/news")}
        className="px-2 py-1.5 text-[#2E8B57] hover:text-[#1a6e3f] font-medium text-sm lg:text-base transition-colors duration-300"
      >
        Wararka
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="px-2 py-1.5 text-[#2E8B57] hover:text-[#1a6e3f] font-medium text-sm lg:text-base transition-colors duration-300"
      >
        Ololaha
      </button>
      <button
        onClick={() => router.push("/donate")}
        className="px-2 py-1.5 text-[#2E8B57] hover:text-[#1a6e3f] font-medium text-sm lg:text-base transition-colors duration-300"
      >
        Ku Deeq
      </button>
      <button
        onClick={() => router.push("/create-account")}
        className="px-4 py-2 rounded-md border-2 border-[#2E8B57] text-[#2E8B57] font-semibold text-sm lg:text-base hover:bg-[#2E8B57] hover:text-white transition-all duration-300"
      >
        Samee Akoon
      </button>
      <button
        onClick={() => router.push("/sign-in")}
        className="px-4 py-2 rounded-md bg-[#2E8B57] text-white font-semibold text-sm lg:text-base hover:bg-[#236B43] transition-all duration-300 shadow-sm"
      >
        Gelid
      </button>
    </>
  );

  const renderMobileNavItems = () => (
    <>
      <button
        onClick={() => router.push("/")}
        className="block w-full text-left px-4 py-2.5 text-[#2E8B57] font-medium text-lg hover:bg-[#e6f5ee] hover:text-[#1a6e3f] transition-colors duration-300 rounded-md"
      >
        Hoyga
      </button>
      <button
        onClick={() => router.push("/news")}
        className="block w-full text-left px-4 py-2.5 text-[#2E8B57] font-medium text-lg hover:bg-[#e6f5ee] hover:text-[#1a6e3f] transition-colors duration-300 rounded-md"
      >
        Wararka
      </button>
      <button
        onClick={() => router.push("/campaign")}
        className="block w-full text-left px-4 py-2.5 text-[#2E8B57] font-medium text-lg hover:bg-[#e6f5ee] hover:text-[#1a6e3f] transition-colors duration-300 rounded-md"
      >
        Ololaha
      </button>
      <button
        onClick={() => router.push("/donate")}
        className="block w-full text-left px-4 py-2.5 text-[#2E8B57] font-medium text-lg hover:bg-[#e6f5ee] hover:text-[#1a6e3f] transition-colors duration-300 rounded-md"
      >
        Ku Deeq
      </button>
      <div className="px-4 pt-4 pb-2 space-y-3">
        <button
          onClick={() => router.push("/register")}
          className="w-full px-5 py-3 rounded-md border-2 border-[#2E8B57] text-[#2E8B57] font-semibold text-base hover:bg-[#2E8B57] hover:text-white transition-all duration-300"
        >
          Samee Akoon
        </button>
        <button
          onClick={() => router.push("/sign-in")}
          className="w-full px-5 py-3 rounded-md bg-[#2E8B57] text-white font-semibold text-base hover:bg-[#236B43] transition-all duration-300 shadow-sm"
        >
          Gelid
        </button>
      </div>
    </>
  );

  return (
    <nav className="bg-white py-6 shadow-md h-auto min-h-20 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10">
            <Image
              src="/updLogo.jpg"
              alt="UPD Logo"
              width={50}
              height={50}
              className="object-contain rounded-sm"
            />
          </div>
          <span className="text-lg sm:text-xl md:text-xl font-bold text-[#2E8B57] cursor-pointer font-['Poppins',sans-serif]">
            Midowga Nabadda & Horumarka
          </span>
        </button>

        <div className="hidden md:flex items-center ml-auto space-x-3 lg:space-x-4">
          {renderNavItems()}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-[#f0f9f5] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Xir bogga" : "Fur bogga"}
        >
          {isMenuOpen ? (
            <X className="h-7 w-7 text-[#2E8B57]" />
          ) : (
            <Menu className="h-7 w-7 text-[#2E8B57]" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-1 pb-4 px-2 bg-white rounded-lg">
          {renderMobileNavItems()}
        </div>
      )}
    </nav>
  );
}
