"use client"

import { useState } from "react"
import DashBoard from "@/components/dashboard"

export default function DashBoardPage() {
    const [selectedCategory, setSelectedCategory] = useState("Featured")

    return (
         <main >
            <DashBoard />
        </main>
    )
}

