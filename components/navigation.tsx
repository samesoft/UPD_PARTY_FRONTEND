"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

export default function Navigation() {
  const router = useRouter();
  const { isAuthenticated } = useIsAuthenticated();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const buttonStyle =
    "bg-[#2E8B57] text-white border-2 border-[#2E8B57] hover:bg-white hover:text-[#2E8B57] transition-colors";

  const handleSignOut = () => {
    localStorage.removeItem("userRole"); // Clear role on sign out
    localStorage.removeItem("token");
    router.push("/sign-in");
  };

  return (
    <nav className="bg-white py-4 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() => handleNavigation("/")}
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
          <span className="text-xl sm:text-2xl font-bold text-[#2E8B57]">
            Union Peace & Dev
          </span>
        </button>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <button
            onClick={() => handleNavigation("/volunteer")}
            className="text-[#2E8B57] hover:text-secondary transition-colors"
          >
            Volunteer
          </button>
          <button
            onClick={() => handleNavigation("/campaign")}
            className="text-[#2E8B57] hover:text-secondary transition-colors"
          >
            Campaign
          </button>

          {!isAuthenticated ? (
            <div className="space-x-4">
              <Button
                onClick={() => handleNavigation("/create-account")}
                className={buttonStyle}
              >
                Create Account
              </Button>
              <Button
                onClick={() => handleNavigation("/donate")}
                className={buttonStyle}
              >
                Donate →
              </Button>
              <Button
                onClick={() => handleNavigation("/sign-in")}
                className={buttonStyle}
              >
                Sign In →
              </Button>
            </div>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => handleNavigation("/event-selecting")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Event Registration
              </button>

              <Button
                onClick={() => handleNavigation("/selected-events")}
                className={buttonStyle}
              >
                Selected Events
              </Button>

              <Button
                onClick={() => handleNavigation("/user-donate-form")}
                className={buttonStyle}
              >
                Donate →
              </Button>

              <Button
                onClick={handleSignOut}
                className="bg-white text-[#2E8B57] border-2 border-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-[#2E8B57]" />
          ) : (
            <Menu className="h-6 w-6 text-[#2E8B57]" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <button
            onClick={() => handleNavigation("/volunteer")}
            className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            VOLUNTEER
          </button>
          <button
            onClick={() => handleNavigation("/campaign")}
            className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            CAMPAIGN
          </button>
          <Button
            onClick={() => handleNavigation("/create-account")}
            className={`w-full ${buttonStyle}`}
          >
            Create Account
          </Button>
          <Button
            onClick={() => handleNavigation("/donate")}
            className={`w-full ${buttonStyle}`}
          >
            Donate Now →
          </Button>
          <Button
            onClick={() => handleNavigation("/sign-in")}
            className={`w-full ${buttonStyle}`}
          >
            Sign In →
          </Button>
        </div>
      )}
    </nav>
  );
}
