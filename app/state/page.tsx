"use client"

import { useState } from "react"
import StatesFormElements from "@/components/state"

export default function DashBoardPage() {
    const [selectedCategory, setSelectedCategory] = useState("Featured")

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2E8B57] mb-6">States</h1>
            <StatesFormElements />
        </div>
    )
}

