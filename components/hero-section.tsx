import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden">
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

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in-up text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              U codee xisbiga siyaasadeed ee ugu fiican.
            </h1>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              "Waxaan u dagaallamaa xuquuqda muwaadiniinteena, markaa nagu soo
              biir oo aan wadajir u qurxinno dalkeenna."
            </blockquote>
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80">
              Soomali heshiis ah dunidana heshiis la ah.
            </p>
            <Button className="bg-white text-primary hover:bg-secondary/90 hover:text-white text-base sm:text-lg px-6 sm:px-8">
              Learn More →
            </Button>
          </div>

          <div></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-8 sm:h-12 bg-secondary flex justify-center items-center">
        <div className="animate-scroll-text whitespace-nowrap flex items-center text-secondary-foreground text-xs sm:text-sm md:text-base text-center">
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
