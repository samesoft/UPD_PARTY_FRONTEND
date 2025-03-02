import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function JoinSection() {
  const router = useRouter();
   const handleNavigation = (path: string) => {
     router.push(path);
   };
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <h2 className="text-6xl font-bold tracking-tight">
            <span className="text-primary">KU BIIR </span>
            <span className="text-secondary">CUSBOONAYSIINTA</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-sm font-semibold italic text-gray-600">
              KU BIIR MAANTA OO NOQO QAYB KA MID AH ISBEDDELKA. WADAJIR, WAXAAN
              DHISI KARNAA MUSTAQBAL KA WANAGSAN DHAMMAAN.
            </p>

            <Button
              onClick={() => handleNavigation("/sign-in")}
              className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6"
            >
              KU BIIR HADA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

