import Image from "next/image"
import { Button } from "@/components/ui/button"

const allProducts = [
  {
    id: 1,
    name: "Classic Logo T-Shirt",
    price: 25,
    image: "/placeholder.svg?height=300&width=300",
    category: "Apparel",
  },
  {
    id: 2,
    name: "Campaign Hat",
    price: 20,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
  },
  {
    id: 3,
    name: "Supporter Mug",
    price: 15,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Rally Poster",
    price: 10,
    image: "/placeholder.svg?height=300&width=300",
    category: "New Arrivals",
  },
  {
    id: 5,
    name: "Limited Edition Hoodie",
    price: 45,
    image: "/placeholder.svg?height=300&width=300",
    category: "Featured",
  },
  {
    id: 6,
    name: "Eco-Friendly Water Bottle",
    price: 18,
    image: "/placeholder.svg?height=300&width=300",
    category: "New Arrivals",
  },
  {
    id: 7,
    name: "Vintage-Style Campaign Button",
    price: 5,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
  },
  {
    id: 8,
    name: "Embroidered Polo Shirt",
    price: 35,
    image: "/placeholder.svg?height=300&width=300",
    category: "Apparel",
  },
]

interface ProductGridProps {
  category: string
}

export default function ProductGrid({ category }: ProductGridProps) {
  const filteredProducts =
    category === "Featured"
      ? allProducts.filter((product) => product.category === "Featured" || Math.random() > 0.5)
      : allProducts.filter((product) => product.category === category)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {filteredProducts.map((product) => (
        <div key={product.id} className="flex flex-col">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto object-cover mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
          <Button className="mt-auto">Add to Cart</Button>
        </div>
      ))}
    </div>
  )
}

