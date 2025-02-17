"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const events = [
  {
    title: "Town Hall Meeting",
    date: "June 15, 2025",
    location: "City Community Center",
    description:
      "Join us for an open discussion on local issues and our campaign platform.",
  },
  {
    title: "Fundraising Dinner",
    date: "July 1, 2025",
    location: "Grand Hotel Ballroom",
    description:
      "Support our campaign and enjoy an evening with like-minded individuals.",
  },
  {
    title: "Volunteer Training",
    date: "July 10, 2025",
    location: "Campaign Headquarters",
    description:
      "Learn how you can make a difference in our grassroots campaign.",
  },
];

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleRSVP = (event) => {
    // Handle RSVP logic (e.g., send formData to backend)
    console.log("RSVP for:", event);
    console.log("Form Data:", formData);
    setSelectedEvent(null); // Close the dialog after RSVP
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Upcoming Events & Rallies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{event.date}</p>
                <p className="text-gray-600">{event.location}</p>
                <p className="mt-2">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={selectedEvent === event}
                  onOpenChange={() => setSelectedEvent(event)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">RSVP</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>RSVP for {event.title}</DialogTitle>
                      <DialogDescription>
                        Enter your details to RSVP for this event. We'll send
                        you a confirmation email with more information.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRSVP(event);
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Confirm RSVP</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
