import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpBanner() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="bg-secondary py-3 sm:py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-white text-base sm:text-lg md:text-xl font-bold">
            IS DIIWAANGELI NOQO XUBIN..
          </span>
          <button
            onClick={() => handleNavigation("/create-account")}
            
            className="bg-white text-secondary px-6 py-2 rounded-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            NAGU SOO BIIR&apos;HADA
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
