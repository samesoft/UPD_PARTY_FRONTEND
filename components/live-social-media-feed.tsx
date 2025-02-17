"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Twitter, Facebook, Instagram } from "lucide-react"

// This is a mock function to simulate fetching social media posts
// In a real application, you would replace this with actual API calls
const fetchSocialMediaPosts = async () => {
  // Simulating an API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      platform: "Twitter",
      content: "Excited to announce our new education initiative! #BetterSchools",
      date: "2m ago",
    },
    {
      platform: "Facebook",
      content: "Join us this Saturday for a community clean-up event. Together, we can make a difference!",
      date: "1h ago",
    },
    {
      platform: "Instagram",
      content: "Behind the scenes at our latest campaign rally. Your energy keeps us going! #CampaignTrail",
      date: "3h ago",
    },
  ]
}

const platformIcons = {
  Twitter: Twitter,
  Facebook: Facebook,
  Instagram: Instagram,
}

export default function LiveSocialMediaFeed() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await fetchSocialMediaPosts()
      setPosts(fetchedPosts)
    }
    fetchPosts()
    // Set up a polling interval to fetch new posts every 5 minutes
    const interval = setInterval(fetchPosts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Live Social Media Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const Icon = platformIcons[post.platform]
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    {post.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{post.date}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

