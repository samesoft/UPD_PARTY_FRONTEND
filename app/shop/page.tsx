"use client"

import { useState } from "react"
import ShopHero from "@/components/shop/shop-hero"
import ProductGrid from "@/components/shop/product-grid"
import CategoryNav from "@/components/shop/category-nav"

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Featured")

  return (
    <main className="min-h-screen">
      <ShopHero />
      <div className="container mx-auto px-4 py-12">
        <CategoryNav onCategoryChange={setSelectedCategory} />
        <ProductGrid category={selectedCategory} />
      </div>
    </main>
  )
}

