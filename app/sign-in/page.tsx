"use client"

import { useState } from "react"
import SignInPages from "@/components/sign-in"

export default function SignInPage() {
    const [selectedCategory, setSelectedCategory] = useState("Featured")

    return (
        <main >
            <SignInPages />
        </main>
    )
}

