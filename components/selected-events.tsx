"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../commons/axios';
import { QRCodeCanvas } from 'qrcode.react';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    district: String;
}

export default function SelectedEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Fetch selected events
    const fetchSelectedEvents = async () => {
        setIsLoading(true);
        try {
            const member_id = localStorage.getItem('member_id');
            // const district_id = localStorage.getItem('district_id');

            if (!member_id) {
                console.error('Member ID not found');
                return;
            }

            const response = await axios.get(`/events/member${member_id}`);
            // Add validation to ensure we're working with an array
            const eventData = Array.isArray(response.data) ? response.data : [];
            console.log('Received events data:', eventData); // For debugging
            setEvents(eventData);
        } catch (error) {
            console.error('Error fetching selected events:', error);
            setEvents([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Add QR code download function
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `event-${selectedEvent?.id}-${localStorage.getItem('member_id')}-qr.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    useEffect(() => {
        fetchSelectedEvents();
    }, []);

    return (
        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h2 className="text-2xl font-bold text-green-600 mb-8 border-b border-green-100 pb-4">
                My Registered Events
            </h2>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <CircularProgress style={{ color: '#059669' }} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="p-6 rounded-lg border border-green-200 bg-white hover:shadow-md transition-all duration-300 hover:border-green-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                            {/* Add QR Code Button */}
                            <button
                                onClick={() => {
                                    setSelectedEvent(event);
                                    setShowQRCode(true);
                                }}
                                className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white 
                                         rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
                                         hover:bg-green-600 flex items-center gap-2 group"
                                title="Show QR Code"
                            >
                                <svg 
                                    className="w-5 h-5 text-white transform transition-transform 
                                             duration-300 group-hover:scale-110" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M8 4H6a2 2 0 00-2 2v2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M7 8h4v4H7V8zm6 0h4v4h-4V8zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">QR Code</span>
                            </button>

                            <h3 className="text-xl font-semibold text-green-600 mb-4 line-clamp-2">
                                {event.title}
                            </h3>

                            <div className="space-y-3">
                                <p className="text-gray-700 flex items-start">
                                    <span className="font-medium min-w-[90px] text-green-700">Location:</span>
                                    <span className="text-gray-600">{event.location}</span>
                                </p>

                                <p className="text-gray-700 flex items-start">
                                    <span className="font-medium min-w-[90px] text-green-700">Start:</span>
                                    <span className="text-gray-600">{new Date(event.start_time).toLocaleString()}</span>
                                </p>

                                <p className="text-gray-700 flex items-start">
                                    <span className="font-medium min-w-[90px] text-green-700">End:</span>
                                    <span className="text-gray-600">{new Date(event.end_time).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                            <svg
                                className="w-16 h-16 text-green-100 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <p className="text-lg font-medium">No registered events found</p>
                            <p className="text-sm text-gray-400">Your registered events will appear here</p>
                        </div>
                    )}
                </div>
            )}

            {/* QR Code Modal */}
            {showQRCode && selectedEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[60]">
                    <div className="bg-white dark:bg-boxdark p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 
                                  transform transition-all duration-300 animate-slideUp space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Event QR Code</h3>
                            <button
                                onClick={() => setShowQRCode(false)}
                                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex justify-center bg-white p-6 rounded-lg">
                            <QRCodeCanvas
                                id="qr-code"
                                value={`${selectedEvent.id}/${localStorage.getItem('member_id')}`}
                                size={300}
                                level="H"
                                includeMargin={true}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={downloadQRCode}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg
                                         transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2
                                         text-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download</span>
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
                                        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                                        if (blob) {
                                            const file = new File([blob], `event-${selectedEvent.id}-${localStorage.getItem('member_id')}-qr.png`, { type: 'image/png' });
                                            const shareData = {
                                                title: `QR Code for ${selectedEvent.title}`,
                                                text: 'Here is your event QR code',
                                                files: [file]
                                            };
                                            if (navigator.share && navigator.canShare(shareData)) {
                                                await navigator.share(shareData);
                                            } else {
                                                await navigator.share({
                                                    title: `QR Code for ${selectedEvent.title}`,
                                                    text: 'Here is your event QR code'
                                                });
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error sharing:', error);
                                    }
                                }}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg
                                         transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2
                                         text-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}