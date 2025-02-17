import { Button } from "@/components/ui/button"

export default function JoinSection() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <h2 className="text-6xl font-bold tracking-tight">
            <span className="text-primary">JOIN THE </span>
            <span className="text-secondary">RENEWAL</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-gray-600">
              Join us today and be part of the change. Together, we can build a better future for all.
            </p>

            <Button className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6">Join Now</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

