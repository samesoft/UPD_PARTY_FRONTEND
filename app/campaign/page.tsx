import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Campaign() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="relative py-20 bg-[url('/HSMHERO.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
              Soomaali Heshiis Ah Dunidana Heshiis La Ah.
            </h1>
            <p
              className="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Dhisidda Mustaqbal Cagaaran Wadajir.
            </p>
          </div>
        </section>

        <section id="issues" className="py-16 bg-accent overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Arrimahayaga Muhiimka ah
            </h2>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-visible">
                <div className="flex space-x-4 animate-scroll-cards">
                  {[
                    "Koboca Dhaqaalaha",
                    "Hagaajinta Caafimaadka",
                    "Waxbarashada",
                    "Kaabayaasha dhaqaalaha",
                    "Amniga Qaranka",
                    "Ilaalinta Deegaanka",
                    "Caddaaladda Bulshada",
                    "Horumarinta Tiknoolajiyada",
                  ].map((issue) => (
                    <Card
                      key={issue}
                      className="w-64 flex-shrink-0 bg-card border-primary/20"
                    >
                      <CardHeader>
                        <CardTitle className="text-primary">{issue}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Qorshahayaga {issue.toLowerCase()} wuxuu diiradda
                          saarayaa xalalka waara iyo fursadaha loo siman yahay
                          ee dhammaan muwaadiniinta.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Kulan Dadweyne",
                "Isu-soo-bax Bulshada",
                "Aqoon-is-weydaarsi Siyaasadeed",
              ].map((event, index) => (
                <Card
                  key={event}
                  className="animate-fade-in-up bg-card border-primary/20"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-primary">{event}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Nagu soo biir {event.toLowerCase()} xiisaha leh si aan uga
                      wada hadalno aragtidayada mustaqbalka wanaagsan.
                    </CardDescription>
                    
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="candidates" className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Hogaamiyeyaasha Xisbiga
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Xasan Sheekh Maxamuud", image: "/HSMPIC1.jpg" },
                { name: "Cabdiraxmaan Odowaa", image: "/Odowaa.jpg" },
                { name: "Xamse Cabdi Barre", image: "/PM-Hamze.jpg" },
              ].map((candidate, index) => (
                <Card
                  key={candidate.name}
                  className="animate-fade-in-up bg-card border-primary/20"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <CardHeader>
                    <div className="relative w-48 h-48 mx-auto">
                      <Image
                        src={candidate.image || "/placeholder.svg"}
                        alt={candidate.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-center mt-4 text-primary">
                      {candidate.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      U heellan horumarinta dhaqaalaha iyo horumarka waara.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="volunteer"
          className="relative py-16 bg-[url('/HSMPIC2.jpg')] bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center text-primary-foreground mb-8">
              Ka qeybqaado
            </h2>
            <p className="text-center text-primary-foreground text-xl mb-8">
              Ku soo biir dhaqdhaqaaqayaga oo naga caawi inaan dhisno mustaqbal
              wanaagsan oo dadka oo dhan. Iska diiwaan geli si aad u noqoto
              mutadawac ama aad u hesho wararkii ugu dambeeyay.
            </p>
            {/* <form className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Email"
                  className="flex-grow bg-background text-foreground"
                />
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-white w-40"
                >
                  Sign Up
                </Button>
              </div>
            </form> */}
          </div>
        </section>
      </main>
    </div>
  );
}
