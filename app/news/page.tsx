import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    title: "REBUILDING TRUST: OUR NEW IMMIGRATION POLICY",
    excerpt:
      "UPD PARTY new plan for immigration shows the Party is back in the service of the British people",
    date: "6/2/2025",
    image: "/NESW-6.jpg",
    link: "/news/immigration-policy",
  },
  {
    title: "HSM FIRST SPEECH OF 2025: REBUILDING TRUST",
    excerpt:
      "HSM gave a speech on how she'll rebuild trust in the Conservative Party",
    date: "16/1/2025",
    image: "/HSM2.jpg",
    link: "/news/kemi-speech-2025",
  },
  {
    title: "UPD FORCE VOTE ON NATIONAL INSURANCE",
    excerpt:
      "We Conservatives strongly believe in supporting the victims of this appalling abuse and deserve justice.",
    date: "9/12/2025",
    image: "/NEWS-3.jpg",
    link: "/news/national-insurance",
  },
  {
    title: "NEW ECONOMIC PLAN UNVEILED",
    excerpt:
      "UPD Party announces comprehensive economic strategy to boost growth and reduce inflation",
    date: "20/2/2025",
    image: "/NEWS-2.jpg",
    link: "/news/economic-plan",
  },
  {
    title: "EDUCATION REFORM: BACK TO BASICS",
    excerpt:
      "Our new education policy focuses on core skills and preparing students for the jobs of tomorrow",
    date: "3/3/2025",
    image: "/NEWS-7.jpg",
    link: "/news/education-reform",
  },
  {
    title: "CLIMATE ACTION: GREEN ENERGY INITIATIVE",
    excerpt:
      "UPD Party commits to ambitious renewable energy targets and green job creation",
    date: "15/3/2025",
    image: "/News3.jpg",
    link: "/news/green-initiative",
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth" id="top">
      <main className="container py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 text-primary text-balance">
          ALL NEWS
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group block bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
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
        <div className="text-center mt-12">
          <Button
            asChild
            className="px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
