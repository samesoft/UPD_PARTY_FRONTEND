"use client";

import React, { useEffect, useState } from 'react';
import { 
    Calendar,
    Award,
    Clock,
    CreditCard,
    User,
    MapPin,
    BadgeCheck,
    Bell
} from 'lucide-react';
import axios from '../commons/axios';

interface UserStats {
    membershipLevel: string;
    memberSince: string;
    upcomingEvents: number;
    lastPayment: string;
    district: string;
    membershipStatus: string;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    variant?: 'primary' | 'secondary' | 'success';
}

export default function UserDashboard() {
    const [stats, setStats] = useState<UserStats>({
        membershipLevel: '',
        memberSince: '',
        upcomingEvents: 0,
        lastPayment: '',
        district: '',
        membershipStatus: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const StatCard = ({ title, value, icon: Icon, variant = 'primary' }: StatCardProps) => (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                        variant === 'primary' ? 'bg-primary-50 text-primary-600' :
                        variant === 'secondary' ? 'bg-purple-50 text-purple-600' :
                        'bg-emerald-50 text-emerald-600'
                    }`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">{title}</p>
                        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header with User Info */}
            <div className="mb-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-primary-100 p-4 rounded-full">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, John Doe</h1>
                        <p className="text-gray-600">Member ID: #123456</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Membership Level"
                    value="Gold Member"
                    icon={Award}
                    variant="primary"
                />
                <StatCard
                    title="District"
                    value="Addis Ababa"
                    icon={MapPin}
                    variant="secondary"
                />
                <StatCard
                    title="Status"
                    value="Active"
                    icon={BadgeCheck}
                    variant="success"
                />
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                    <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div className="space-y-4">
                    {/* Event Items */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Monthly Member Meeting</h3>
                                <p className="text-sm text-gray-600">December 15, 2023 - 2:00 PM</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Membership Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Membership Details</h2>
                    <CreditCard className="h-6 w-6 text-primary-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Member Since</span>
                            <span className="font-medium">January 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last Payment</span>
                            <span className="font-medium">November 1, 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Next Payment Due</span>
                            <span className="font-medium text-emerald-600">December 1, 2023</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Current Plan</span>
                            <span className="font-medium">Gold Membership</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Monthly Fee</span>
                            <span className="font-medium">$50.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 