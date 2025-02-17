import Image from "next/image";

export default function DonateHero() {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="HSMPIC2.jpg"
          alt="Support our campaign"
          fill
          priority
          className="object-cover object-left md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
      </div>

      {/* Decorative Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-200 600 C100 400, 400 700, 800 500 C1200 300, 1500 600, 1800 400"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M-200 400 C200 600, 500 300, 900 500 C1300 700, 1600 400, 1900 600"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight">
          DONATE
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wider">
          POWER THE RENEWAL
        </h2>
        <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
          Your contribution helps us build a stronger, more prosperous future
          for all. Every donation, big or small, makes a difference in our
          campaign.
        </p>
      </div>
    </div>
  );
}
