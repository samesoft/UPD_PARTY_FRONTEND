import Image from "next/image";
import VolunteerForm from "@/components/volunteer-form";
import { MarqueeBanner } from "@/components/marquee-banner";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] md:h-[80vh] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/HeroPic.jpg"
            alt="Volunteer Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider text-center animate-fade-in-up">
            VOLUNTEER
          </h1>
          <p className="text-white/90 text-lg md:text-xl text-center mt-4 max-w-2xl mx-auto animate-fade-in-up">
            Join our movement and help build a better future for our community
          </p>
        </div>
      </div>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Form Section */}
      <div className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto">
          <VolunteerForm />
        </div>
      </div>
    </main>
  );
}
