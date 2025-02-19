"use client"

import { useState } from "react"
import DistrictsFormElements from "@/components/district"

export default function DIstrictPage() {
    const [selectedCategory, setSelectedCategory] = useState("Featured")

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2E8B57] mb-6">Districts</h1>
            <DistrictsFormElements />
        </div>
    )
}

