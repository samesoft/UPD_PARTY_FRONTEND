import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BookOpen, Briefcase, Heart, TreesIcon as Tree, Home, Shield } from "lucide-react"

const issues = [
  {
    title: "Education",
    description: "Improving access to quality education and supporting our teachers.",
    icon: BookOpen,
  },
  {
    title: "Economy",
    description: "Creating jobs and fostering a thriving local business environment.",
    icon: Briefcase,
  },
  {
    title: "Healthcare",
    description: "Ensuring affordable and accessible healthcare for all residents.",
    icon: Heart,
  },
  {
    title: "Environment",
    description: "Implementing sustainable practices and protecting our natural resources.",
    icon: Tree,
  },
  {
    title: "Housing",
    description: "Addressing affordability and increasing housing options for all.",
    icon: Home,
  },
  {
    title: "Public Safety",
    description: "Enhancing community safety and police-community relations.",
    icon: Shield,
  },
]

export default function IssuesSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Key Issues & Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <issue.icon className="h-6 w-6" />
                  {issue.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{issue.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

