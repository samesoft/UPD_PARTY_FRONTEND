import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Twitter, Facebook, Instagram } from "lucide-react"

const socialPosts = [
  {
    platform: "Twitter",
    icon: Twitter,
    content: "Excited to announce our new education initiative! #BetterSchools",
    date: "2h ago",
  },
  {
    platform: "Facebook",
    icon: Facebook,
    content: "Join us this Saturday for a community clean-up event. Together, we can make a difference!",
    date: "1d ago",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    content: "Behind the scenes at our latest campaign rally. Your energy keeps us going! #CampaignTrail",
    date: "3d ago",
  },
]

export default function SocialMediaFeed() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Social Media Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialPosts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <post.icon className="h-6 w-6" />
                  {post.platform}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">{post.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

