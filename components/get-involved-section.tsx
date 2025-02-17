import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Heart, DollarSign, Users } from "lucide-react";

const involvementOptions = [
  {
    title: "Volunteer",
    description:
      "Join our team of dedicated volunteers and make a difference in your community. We have various roles available, from phone banking to canvassing.",
    icon: Heart,
    action: "Sign Up to Volunteer",
  },
  {
    title: "Donate",
    description:
      "Support our campaign with a financial contribution. Every dollar counts and helps us spread our message further. Donations of all sizes are appreciated.",
    icon: DollarSign,
    action: "Donate Now",
  },
  {
    title: "Join the Party",
    description:
      "Become a member of our political party and help shape our policies. Get involved in local meetings and have your voice heard.",
    icon: Users,
    action: "Join Us",
  },
];

export default function GetInvolvedSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Get Involved</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {involvementOptions.map((option, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <option.icon className="h-6 w-6" />
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{option.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button>{option.action}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
