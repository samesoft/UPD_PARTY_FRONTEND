import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/HSM2.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/65 to-secondary/65" />
      </div>

      {/* Content Section */}
      <div className="container relative z-10 mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in-up text-left">
            <h1 className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary-foreground leading-tight">
              U codee <span className="italic">xisbiga siyaasadeed</span> ee ugu
              fiican.
            </h1>
            <blockquote className="text-lg sm:text-xl md:text-2xl font-semibold italic text-white">
              "Waxaan u dagaallamaa xuquuqda muwaadiniinteena, markaa nagu soo
              biir oo aan wadajir u qurxinno dalkeenna."
            </blockquote>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 italic">
              Soomali heshiis ah dunidana heshiis la ah.
            </p>
            
          </div>

          <div></div>
        </div>
      </div>

      {/* Scrolling Text Section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-10 sm:h-14 bg-[#2E8B57] flex justify-center text-white items-center">
        <div className="animate-scroll-text whitespace-nowrap flex items-center text-white text-sm sm:text-base md:text-lg font-medium italic">
          <span className="mx-4">
            Nagu soo biir dhismaha mustaqbal wanaagsan
          </span>
          <span className="mx-4">•</span>
          <span className="mx-4">
            Si wadajir ah ayaan isbeddel u samayn karnaa
          </span>
          <span className="mx-4">•</span>
          <span className="mx-4">Codkaagu waa muhiim</span>
          <span className="mx-4">•</span>
          <span className="mx-4">Dhisidda bulshooyinka xooggan</span>
          <span className="mx-4">
            Nagu soo biir dhismaha mustaqbal wanaagsan
          </span>
          <span className="mx-4">•</span>
          <span className="mx-4">
            Si wadajir ah ayaan isbeddel u samayn karnaa
          </span>
          <span className="mx-4">•</span>
          <span className="mx-4">Codkaagu waa muhiim</span>
          <span className="mx-4">•</span>
          <span className="mx-4">Dhisidda bulshooyinka xooggan</span>
        </div>
      </div>
    </div>
  );
}
