import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignUpBanner() {
  return (
    <div className="bg-secondary py-3 sm:py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-white text-base sm:text-lg md:text-xl font-bold">
            SIGN UP TO HEAR FROM KEMI
          </span>
          <Link
            href="/sign-up"
            className="bg-white text-secondary px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            I&apos;M IN
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
