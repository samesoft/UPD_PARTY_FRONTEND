import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Campaign() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg?height=40&width=40" alt="Party Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-primary">Green Party</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="#issues" className="text-muted-foreground hover:text-primary">
              Issues
            </Link>
            <Link href="#events" className="text-muted-foreground hover:text-primary">
              Events
            </Link>
            <Link href="#candidates" className="text-muted-foreground hover:text-primary">
              Candidates
            </Link>
            <Link href="#volunteer" className="text-muted-foreground hover:text-primary">
              Get Involved
            </Link>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Donate</Button>
        </div>
      </header> */}

      <main className="flex-grow">
        <section className="relative py-20 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center">
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
              Building a Greener Future Togetherr
            </h1>
            <p
              className="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Join our mission to create sustainable change and build a more environmentally conscious nation for all.
            </p>
            <Button
              className="bg-background text-primary hover:bg-accent text-lg px-8 py-3 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Learn More
            </Button>
          </div>
        </section>

        <section id="issues" className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Key Issues</h2>
            <div className="flex overflow-x-auto pb-4 animate-scroll-text">
              {[
                "Climate Action",
                "Renewable Energy",
                "Sustainable Agriculture",
                "Green Economy",
                "Environmental Justice",
              ].map((issue) => (
                <Card key={issue} className="flex-shrink-0 w-64 mx-4 bg-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">{issue}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Our plan for {issue.toLowerCase()} focuses on sustainable solutions and equal opportunities for
                      all citizens.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Green Town Hall", "Eco-Friendly Rally", "Sustainability Workshop"].map((event, index) => (
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
                      Join us for an engaging {event.toLowerCase()} to discuss our vision for a sustainable future.
                    </CardDescription>
                    <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">RSVP</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="candidates" className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Green Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["NAME", "NAME", "NAME"].map((candidate, index) => (
                <Card
                  key={candidate}
                  className="animate-fade-in-up bg-card border-primary/20"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <CardHeader>
                    <Image
                      src="/NEWS-4.jpg"
                      alt={candidate}
                      width={200}
                      height={200}
                      className="rounded-full mx-auto"
                    />
                    <CardTitle className="text-center mt-4 text-primary">{candidate}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      Dedicated to promoting environmental policies and sustainable development.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="volunteer"
          className="relative py-16 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center text-primary-foreground mb-8">Get Involved</h2>
            <p className="text-center text-primary-foreground text-xl mb-8">
              Join our green movement and help us build a sustainable future for all. Sign up to volunteer or receive
              updates.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow bg-background text-foreground"
                />
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white ">
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

     
    </div>
  )
}

