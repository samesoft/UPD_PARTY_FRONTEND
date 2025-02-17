"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary animate-on-scroll opacity-0">
          About Our Party & Vision
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="animate-on-scroll opacity-0">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h3>
              <p className="text-gray-600">
                We are committed to building a society that values equality, sustainability, and prosperity for all. Our
                mission is to implement policies that improve the lives of every citizen and create a brighter future
                for generations to come.
              </p>
            </div>
            <div className="animate-on-scroll opacity-0" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Our Vision</h3>
              <p className="text-gray-600">
                We envision a nation where every individual has the opportunity to thrive, where our communities are
                strong and united, and where we lead the world in innovation and environmental stewardship.
              </p>
            </div>
          </div>
          <div className="relative animate-on-scroll opacity-0" style={{ animationDelay: "400ms" }}>
            <div className="absolute -top-4 -left-4 w-24 h-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UPD-LOGO.jpg-NTcieqWTeByAfsGeFnFFxWNJvDAVrJ.jpeg"
                alt="Party Logo"
                width={96}
                height={96}
                className="opacity-20"
              />
            </div>
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Campaign Image"
              width={400}
              height={400}
              className="rounded-lg shadow-lg mx-auto relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

