import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Twitter, Facebook, Instagram } from "lucide-react"

const newsItems = [
  {
    title: "Campaign Kicks Off with Record Attendance",
    date: "May 1, 2025",
    excerpt: "Our campaign launch event saw unprecedented support from the community...",
    type: "Press Release",
  },
  {
    title: "New Policy Proposal: Green Energy Initiative",
    date: "May 15, 2025",
    excerpt: "We're excited to announce our comprehensive plan for sustainable energy...",
    type: "Press Release",
  },
  {
    title: "Endorsement from Local Labor Union",
    date: "June 1, 2025",
    excerpt: "We're honored to receive the endorsement of the city's largest labor union...",
    type: "News Update",
  },
]

const socialLinks = [
  { name: "Twitter", icon: Twitter, url: "https://twitter.com/campaign" },
  { name: "Facebook", icon: Facebook, url: "https://facebook.com/campaign" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/campaign" },
]

export default function NewsSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest News & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {item.date} - {item.type}
                </p>
                <p>{item.excerpt}</p>
                <Link href="#" className="text-blue-600 hover:underline mt-2 inline-block">
                  Read more
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="#" className="text-blue-600 hover:underline">
            View all news and press releases
          </Link>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Follow Us on Social Media</h3>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <link.icon className="h-6 w-6" />
                <span className="sr-only">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

