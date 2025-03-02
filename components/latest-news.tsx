import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    title: "DHISIDDA KALSOONIDA: SIYAASADDEENA CUSUB EE SOCDAALKA",
    excerpt:
      "Qorshaha cusub ee xisbiga UPD ee socdaalka ayaa muujinaya in xisbiga uu dib ugu soo laabtay adeegga dadka Soomaaliyeed",
    date: "6/2/2025",
    image: "/NESW-6.jpg",
    link: "/news/siyaasadda-socdaalka",
  },
  {
    title:
      "KHUDBADDII UGU HORREYSAY EE MADAXWEYNAHA 2025: DIB U DHISIDDA KALSOONIDA",
    excerpt:
      "Madaxweynuhu wuxuu jeediyey khudbad ku saabsan sida loo dhisi doono kalsoonida Xisbiga",
    date: "16/1/2025",
    image: "/HSM2.jpg",
    link: "/news/khudbadda-madaxweynaha-2025",
  },
  {
    title: "Xisbiga UPD OO CODSI U GUDBISAY DIB U EEGIS CASHUURTA QARANKA",
    excerpt:
      "Waxaan aaminsan nahay in la taageero dhibbanayaasha xadgudubka naxdinta leh iyo in ay helaan caddaalad.",
    date: "9/12/2025",
    image: "/NEWS-3.jpg",
    link: "/news/dib-u-eegista-cashuurta",
  },
  {
    title: "QORSHAHA CUSUB EE DHAQAALAHA OO LA SHAACIYEY",
    excerpt:
      "Xisbiga UPD ayaa ku dhawaaqay istaraatiijiyad dhammeystiran oo dhaqaale oo lagu xoojinayo koritaanka iyo yareenayo sicir bararka",
    date: "20/2/2025",
    image: "/NEWS-2.jpg",
    link: "/news/qorshaha-dhaqaalaha",
  },
  {
    title: "DARYEELKA CAAFIMAADKA: HORUMARINTA ADEEGYADA CAAFIMAAD",
    excerpt:
      "Siyaasaddeena cusub ee caafimaadka waxay diiradda saaraysaa kor u qaadista tayada adeegyada caafimaad ee dalka oo dhan",
    date: "3/3/2025",
    image: "/NEWS-7.jpg",
    link: "/news/horumarinta-caafimaadka",
  },
  {
    title: "WAXBARASHADA: MAALGELINTA MUSTAQBALKA",
    excerpt:
      "Xisbiga UPD waxay ballan qaadaysaa inay kor u qaaddo miisaaniyadda waxbarashada si loo hubiyo in dhallinyarada Soomaaliyeed ay helaan waxbarasho tayo sare leh.",
    date: "15/3/2025",
    image: "/News3.jpg",
    link: "/news/maalgelinta-waxbarashada",
  },
];

export default function LatestNews() {
  return (
    <section className="py-16 sm:py-20 bg-gray-100">
      <div className="container">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 text-primary text-balance">
          WARARKA UGU DANBEEYA
        </h2>

        <div className="relative overflow-hidden py-4 mb-12">
          <div className="animate-scroll-text whitespace-nowrap">
            <div className="inline-block">
              <span className="inline-flex text-lg sm:text-xl">
                {Array(10)
                  .fill("Akhri Faahfaahinta")
                  .map((text, i) => (
                    <span
                      key={i}
                      className={
                        i % 2 === 0
                          ? "text-primary mx-4"
                          : "text-secondary mx-4"
                      }
                    >
                      {text}
                    </span>
                  ))}
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto pb-4 mb-12">
          <div className="flex space-x-6 w-max">
            {newsItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group block bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 w-72 sm:w-80 flex-shrink-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary group-hover:text-secondary transition-colors text-balance">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">
                    {item.excerpt}
                  </p>
                  <p className="text-sm text-gray-400">{item.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            asChild
            className="px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            <Link href="/news#top">Arag Dhammaan</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
