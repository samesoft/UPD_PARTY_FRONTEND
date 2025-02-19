"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function LoginNavigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); // 'ADMIN' or 'USER'

  useEffect(() => {
    // Get user role from localStorage or your auth system
    const role = localStorage.getItem("userRole") || "USER";
    setUserRole(role);

    // Automatically navigate to event registration if user role is USER
    if (role === "USER") {
      router.push("/event-selecting");
    }
  }, [router]);

  const handleLoginNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userRole"); // Clear role on sign out
    router.push("/sign-in");
  };

  return (
    <nav className="bg-white py-4 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <button className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <Image
              src="/updLogo.jpg"
              alt="Zaitical Logo"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-[#2E8B57]">
            Union Peace&Dev
          </span>
        </button>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {userRole === "ADMIN" && (
            <>
<
              <button
                onClick={() => handleLoginNavigation("/NewsPage")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                News
              </button>
              <button
                onClick={() => handleLoginNavigation("/membership-level")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Member Level
              </button>
              <button
                onClick={() => handleLoginNavigation("/state")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Stats
              </button>
              <button
                onClick={() => handleLoginNavigation("/memberships")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Members
              </button>
              <button
                onClick={() => handleLoginNavigation("/event-registration")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Event Registration
              </button>
            </>
          )}
          {userRole === "USER" && (
            <>
             

              <div className="relative group">
                <button
                  className="text-[#2E8B57] hover:text-secondary transition-colors"
                >
                  Members
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-32">
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
                    Membership
                  </button>
                </div>
              </div>
              <div className="relative group">

                <button
                  className="text-[#2E8B57] hover:text-secondary transition-colors"
                >
                  Settings
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-32">
                  <button
                    onClick={() => handleLoginNavigation("/state")}
                    className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                  >
                    State
                  </button>
                  <button
                    onClick={() => handleLoginNavigation("/district")}
                    className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                  >
                    District
                  </button>
                </div>
              </div>
              <div className="relative group">
                <button
                  className="text-[#2E8B57] hover:text-secondary transition-colors"
                >
                  Events
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-32">
                  <button
                    onClick={() => handleLoginNavigation("/event-registration")}
                    className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                  >
                    Event Registration
                  </button>
                </div>
              </div>
            </>
          )}
          {userRole === "USER" && (
            <>
              <button
                onClick={() => handleLoginNavigation("/volunteer")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                VOLUNTEER
              </button>
              <button
                onClick={() => handleLoginNavigation("/campaign")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                CAMPAIGN
              </button>
              <div className="relative group">
                <button
                  className="text-[#2E8B57] hover:text-secondary transition-colors"
                >
                  Events
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-32">
                  <button
                    onClick={() => handleLoginNavigation("/event-selecting")}
                    className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                  >
                    Event Registration
                  </button>
                  <button
                    onClick={() => handleLoginNavigation("/selected-events")}
                    className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                  >
                    Selected Events
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleLoginNavigation("/donate-form")}
                className="text-[#2E8B57] hover:text-secondary transition-colors"
              >
                Donate
              </button>
            </>
          )}
          <Button
            onClick={handleSignOut}
            className="bg-white text-[#2E8B57] border-2 border-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            Sign Out
          </Button>
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
          {userRole === "ADMIN" && (
            <>
              <div className="px-4 py-2">
                <div className="text-[#2E8B57] mb-2">Members</div>
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
                  Membership
                </button>
              </div>
              <div className="px-4 py-2">
                <div className="text-[#2E8B57] mb-2">Settings</div>
                <button
                  onClick={() => handleLoginNavigation("/state")}
                  className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                >
                  State
                </button>
                <button
                  onClick={() => handleLoginNavigation("/district")}
                  className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                >
                  District
                </button>
              </div>
              <div className="px-4 py-2">
                <div className="text-[#2E8B57] mb-2">Events</div>
                <button
                  onClick={() => handleLoginNavigation("/event-registration")}
                  className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                >
                  Event Registration
                </button>
              </div>
            </>
          )}
          {userRole === "USER" && (
            <>
              <button
                onClick={() => handleLoginNavigation("/volunteer")}
                className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
              >
                VOLUNTEER
              </button>
              <button
                onClick={() => handleLoginNavigation("/campaign")}
                className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
              >
                CAMPAIGN
              </button>
              <div className="px-4 py-2">
                <div className="text-[#2E8B57] mb-2">Events</div>
                <button
                  onClick={() => handleLoginNavigation("/event-selecting")}
                  className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                >
                  Event Registration
                </button>
                <button
                  onClick={() => handleLoginNavigation("/selected-events")}
                  className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
                >
                  Selected Events
                </button>
              </div>
              <button
                onClick={() => handleLoginNavigation("/donate-form")}
                className="block w-full text-left px-4 py-2 text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
              >
                Donate
              </button>
            </>
          )}
          <Button
            onClick={handleSignOut}
            className="w-full bg-white text-[#2E8B57] border-2 border-[#2E8B57] hover:bg-[#2E8B57] hover:text-white transition-colors"
          >
            Sign Out →
          </Button>
        </div>
      )}
    </nav>
  );
}
