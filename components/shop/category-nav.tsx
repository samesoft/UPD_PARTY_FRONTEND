"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = ["Featured", "New Arrivals", "Apparel", "Accessories"]

interface CategoryNavProps {
  onCategoryChange: (category: string) => void
}

export default function CategoryNav({ onCategoryChange }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState("Featured")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <nav className="mb-8">
      <ul className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <li key={category}>
            <Button
              variant={activeCategory === category ? "default" : "ghost"}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

