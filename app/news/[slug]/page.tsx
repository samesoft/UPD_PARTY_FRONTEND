import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This is a mock function to simulate fetching article data
// In a real application, you would fetch this data from an API or database
function getArticle(slug: string) {
  // Mock data - in a real app, you'd fetch this based on the slug
  return {
    title: "DHISIDDA KALSOONIDA: SIYAASADDEENA CUSUB EE SOCDAALKA",
    date: "6da Febraayo, 2025",
    image: "/NESW-6.jpg",
    content: `
      <p class="lead">
        Xisbiga Union Peace & Development (UPD) ayaa maanta shaaciyey qorshihiisa cusub ee ku aaddan arrimaha socdaalka, taas oo muujinaysa sida xisbiga ugu soo laabtay adeegga dadka Soomaaliyeed. Qorshahan cusub wuxuu diiradda saarayaa dhowr qodob oo muhiim ah:
      </p>
      
      <h2>1. Nidaamka Socdaalka oo La Fududeeyo</h2>
      <p>
        Xisbiga UPD waxay ballan-qaadaysaa inay si weyn u fududayso nidaamka codsiga fiisaha iyo deganaanshaha, iyada oo la adeegsanayo tignoolajiyada casriga ah si loo yareeyo waqtiga sugitaanka iyo caqabadaha kale ee ay la kulmaan codsadayaasha.
      </p>
      
      <h2>2. Isdhexgalka Bulshada</h2>
      <p>
        Qorshaha cusub wuxuu xoogga saarayaa barnaamijyo lagu caawinayo soo-galootiga cusub inay si dhakhso ah ugu dhexgalaan bulshada Soomaaliyeed, oo ay ku jiraan fasallo luqadda Soomaaliga ah, tababarro dhaqan, iyo barnaamijyo shaqo-helis.
      </p>
      
      <h2>3. Ilaalinta Xuquuqda Aadanaha</h2>
      <p>
        Xisbiga UPD waxay si adag u taageeraysaa ilaalinta xuquuqda aadanaha ee dhammaan soo-galootiga iyo qaxootiga, iyadoo hubinaysa in nidaamka socdaalku waafaqsan yahay heshiisyada caalamiga ah ee xuquuqda aadanaha.
      </p>
      
      <h2>4. La Dagaallanka Tahriibka</h2>
      <p>
        Qorshaha cusub wuxuu sidoo kale xoogga saarayaa tallaabooyinka lagu xakamaynayo tahriibka iyo ganacsiga dadka, iyadoo la adeegsanayo habab casri ah oo lagu ogaanayo iyo lagu joojinayo dhaqdhaqaaqyadan sharci-darrada ah.
      </p>
      
      <h2>5. Iskaashiga Caalamiga ah</h2>
      <p>
        Xisbiga UPD waxay ballan-qaadaysaa inay sii xoojiso iskaashiga caalamiga ah ee ku aaddan maareynta socdaalka, gaar ahaan la-shaqeynta wadamada deriska ah iyo hay'adaha caalamiga ah si loo hubiyo hab isku-duuban oo lagu maareeyo arrimaha socdaalka.
      </p>
      
      <p>
        Ugu dambeyntii, qorshahan cusub ee Xisbiga UPD wuxuu muujinayaa sida xisbiga diiradda u saarayo sidii loo dhisi lahaa nidaam socdaal oo cadaalad ah, waxtar leh, oo waafaqsan baahiyaha dalka iyo qiyamka aadaninimada. Tani waa tallaabo muhiim ah oo ku wajahan dib u soo celinta kalsoonida dadka Soomaaliyeed ee xisbiga iyo dowladda.
      </p>
    `,
  };
}

export default function NewsArticle({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);

  return (
    <article className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/news"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ku laabo Wararka
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-gray-900 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 italic">{article.date}</p>
        </div>

        <div className="relative w-full aspect-video mb-12">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div
          className="prose prose-lg prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Button>
            <Link href="/news">Ku laabo Wararka</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
