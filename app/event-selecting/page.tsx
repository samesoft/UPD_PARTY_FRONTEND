"use client"

import EventSelectingPages from "@/components/event-selecting";

export default function EventSelectingPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2E8B57] mb-6 ">Upcoming Events</h1>
            <EventSelectingPages />
        </div>
    );
}
