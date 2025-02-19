"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<"guest" | "user" | "admin">(
    "guest"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      setAuthStatus(userRole === "ADMIN" ? "admin" : "user");
    } else {
      setAuthStatus("guest");
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setAuthStatus("guest");
    router.push("/sign-in");
  };

  const buttonStyle =
    "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors";

  const renderNavItems = () => {
    switch (authStatus) {
      case "admin":
        return (
          <>
            <button
              onClick={() => handleNavigation("/news")}
              className="nav-item"
            >
              News
            </button>
            <button
              onClick={() => handleNavigation("/volunteer")}
              className="nav-item"
            >
              Volunteer
            </button>
            <button
              onClick={() => handleNavigation("/campaign")}
              className="nav-item"
            >
              Campaign
            </button>
            <button
              onClick={() => handleNavigation("/create-account")}
              className="nav-item"
            >
              Create Account
            </button>
            <button
              onClick={() => handleNavigation("/user-donate-form")}
              className="nav-item"
            >
              Donate
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/memberships")}
                >
                  Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/membership-level")}
                >
                  Members Level
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/event-selecting")}
                >
                  Events
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/event-registration")}
                >
                  Event Registration
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleNavigation("/state")}>
                  States
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleSignOut} className={buttonStyle}>
              Sign Out
            </Button>
          </>
        );
      case "user":
        return (
          <>
            <button
              onClick={() => handleNavigation("/news")}
              className="nav-item"
            >
              News
            </button>
            <button
              onClick={() => handleNavigation("/volunteer")}
              className="nav-item"
            >
              Volunteer
            </button>
            <button
              onClick={() => handleNavigation("/campaign")}
              className="nav-item"
            >
              Campaign
            </button>
            <button
              onClick={() => handleNavigation("/user-donate-form")}
              className="nav-item"
            >
              Donate
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/event-selecting")}
                >
                  Events
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleNavigation("/event-registration")}
                >
                  Event Registration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleSignOut} className={buttonStyle}>
              Sign Out
            </Button>
          </>
        );
      default:
        return (
          <>
            <button
              onClick={() => handleNavigation("/volunteer")}
              className="nav-item"
            >
              Volunteer
            </button>
            <button
              onClick={() => handleNavigation("/campaign")}
              className="nav-item"
            >
              Campaign
            </button>
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
              Donate
            </Button>
            <Button
              onClick={() => handleNavigation("/sign-in")}
              className={buttonStyle}
            >
              Sign In
            </Button>
          </>
        );
    }
  };

  return (
    <nav className="bg-background py-2 px-4 shadow-sm">
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
        <div className="md:hidden mt-4 space-y-4 pb-4">{renderNavItems()}</div>
      )}
    </nav>
  );
}
