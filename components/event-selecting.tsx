"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../commons/axios';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    district: String;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function EventListing() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    // Fetch events
    const fetchEvents = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const state_id = localStorage.getItem("state_id");
            const response = await axios.get(`/events/eventsByState/${state_id}`);
            const { data, pagination: paginationData } = response.data;
            setEvents(data);
            setPagination({
                total: paginationData.total,
                page: paginationData.page,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle register to event
    const handleRegisterToEvent = async () => {
        if (!selectedEvent) return;

        // Get member_id from localStorage
        const member_id = localStorage.getItem('member_id');

        if (!member_id) {
            alert('Please sign in to register for events');
            return;
        }

        setIsRegistering(true);
        try {
            const response = await axios.post('/events/register', {
                member_id: parseInt(member_id), // Convert string to number
                event_id: selectedEvent.id,
                status: "registered"  // Added status field as required
            });

            if (response.data.message === "Registered to event successfully") {
                alert('Successfully registered for the event');
                setSelectedEvent(null);
            } else {
                alert('Failed to register for the event');
            }
        } catch (error: any) {
            console.error('Error registering for event:', error);
            alert(error.response?.data?.message || 'An error occurred while registering for the event.');
        } finally {
            setIsRegistering(false);
        }
    };

    // Search events
    const searchEvents = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/events/search`, {
                params: { page, limit: pagination.limit, title: searchTitle },
            });
            const { data, pagination: paginationData } = response.data;
            setEvents(data);
            setPagination({
                total: paginationData.total,
                page: paginationData.page,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error searching events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTitle) {
            searchEvents(pagination.page);
        } else {
            fetchEvents(pagination.page);
        }
    }, [pagination.page, searchTitle]);

    return (
        <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-4 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
            {/* Search Bar */}
            {/* <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-1/3 rounded border border-gray-300 py-2 px-4"
                />
            </div> */}

            {/* Events List */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <CircularProgress className="text-green-500" />
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group p-6 border-2 border-gray-100 rounded-xl cursor-pointer 
                                     hover:shadow-2xl transition-all duration-300 ease-in-out
                                     hover:border-green-400 hover:-translate-y-1
                                     bg-white dark:bg-boxdark dark:border-gray-700
                                     dark:hover:border-green-500 relative overflow-hidden
                                     before:absolute before:inset-0 before:z-0
                                     before:bg-gradient-to-b before:from-green-50 before:to-transparent
                                     before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="flex flex-col h-full relative z-10">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full 
                                          opacity-0 group-hover:opacity-20 transition-all duration-500 
                                          transform group-hover:scale-150"></div>

                                <h3 className="text-xl font-bold text-green-600 mb-3 
                                             group-hover:text-green-700 transition-colors duration-300
                                             relative before:absolute before:bottom-0 before:left-0 
                                             before:w-0 before:h-0.5 before:bg-green-400
                                             group-hover:before:w-full before:transition-all before:duration-300">
                                    {event.title}
                                </h3>

                                <div className="space-y-3 text-gray-600 dark:text-gray-300 flex-grow">
                                    <p className="flex items-center transform transition-transform duration-300 
                                                group-hover:translate-x-1">
                                        <svg className="w-5 h-5 mr-2 text-green-500 transition-transform 
                                                    duration-300 group-hover:scale-110"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="group-hover:text-green-600 transition-colors duration-300">
                                            {event.location}
                                        </span>
                                    </p>

                                    <p className="flex items-center transform transition-transform duration-300 
                                                delay-75 group-hover:translate-x-1">
                                        <svg className="w-5 h-5 mr-2 text-green-500 transition-transform 
                                                    duration-300 group-hover:scale-110"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="group-hover:text-green-600 transition-colors duration-300">
                                            {event.district}
                                        </span>
                                    </p>

                                    <p className="flex items-center transform transition-transform duration-300 
                                                delay-150 group-hover:translate-x-1">
                                        <svg className="w-5 h-5 mr-2 text-green-500 transition-transform 
                                                    duration-300 group-hover:scale-110"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="group-hover:text-green-600 transition-colors duration-300">
                                            {new Date(event.start_time).toLocaleString()}
                                        </span>
                                    </p>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
                                          from-green-300 to-green-500 transform scale-x-0 
                                          group-hover:scale-x-100 transition-transform duration-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="relative w-48 h-48 mb-8">
                        <svg 
                            className="w-full h-full text-green-100" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg 
                                className="w-24 h-24 text-green-500 animate-pulse" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">
                        No Events Found
                    </h3>
                    
                    <div className="max-w-md text-center space-y-4">
                        <p className="text-gray-500 dark:text-gray-400">
                            There are currently no events scheduled for your state. 
                            Check back later for upcoming events!
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center items-center mt-6">
                            <div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-4 py-2 rounded-full">
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Check back soon</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-4 py-2 rounded-full">
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span>Get notified</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="font-semibold">Did you know?</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Events are typically added Most of the time. 
                                Stay tuned for exciting upcoming activities in your area!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 
                        animate-fadeIn backdrop-blur-sm">
                    <div className="bg-white dark:bg-boxdark p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 
                                  transform transition-all duration-300 animate-slideUp
                                  border-t-4 border-green-500 relative
                                  before:absolute before:inset-0 before:bg-gradient-to-b 
                                  before:from-green-50 before:to-transparent before:opacity-30 
                                  before:rounded-2xl dark:before:opacity-5">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute -right-3 -top-3 bg-white dark:bg-gray-800 text-gray-400 
                                     hover:text-green-500 transition-all duration-300 p-2 rounded-full 
                                     hover:bg-green-50 dark:hover:bg-gray-700 shadow-lg
                                     group focus:outline-none"
                        >
                            <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 
                                         relative inline-block">
                                Event Details
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
                                       from-green-400 to-green-600 transform origin-left scale-x-100"></span>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {[
                                {
                                    label: "Title",
                                    value: selectedEvent.title,
                                    icon: (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    label: "Location",
                                    value: selectedEvent.location,
                                    icon: (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    label: "Start Time",
                                    value: new Date(selectedEvent.start_time).toLocaleString(),
                                    icon: (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )
                                },
                                {
                                    label: "End Time",
                                    value: new Date(selectedEvent.end_time).toLocaleString(),
                                    icon: (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                }
                            ].map(({ label, value, icon }) => (
                                <div key={label}
                                    className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg 
                                              hover:bg-green-50 dark:hover:bg-gray-700 
                                              transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="transform transition-transform duration-300 group-hover:scale-110">
                                            {icon}
                                        </div>
                                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 ml-8">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Update buttons section to remove QR code button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white 
                                         px-8 py-3 rounded-lg transition duration-300 
                                         disabled:from-green-300 disabled:to-green-400 
                                         disabled:cursor-not-allowed transform hover:scale-105 
                                         hover:shadow-lg focus:outline-none focus:ring-2 
                                         focus:ring-green-500 focus:ring-opacity-50
                                         relative overflow-hidden group"
                                onClick={handleRegisterToEvent}
                                disabled={isRegistering}
                            >
                                <span className="absolute w-0 h-0 transition-all duration-300 ease-out 
                                               bg-white rounded-full group-hover:w-32 group-hover:h-32 
                                               opacity-10"></span>
                                {isRegistering ? (
                                    <div className="flex items-center">
                                        <CircularProgress size={20} className="mr-2 text-white" />
                                        <span>Registering...</span>
                                    </div>
                                ) : (
                                    'Register for Event'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}