"use client";

import React, { useEffect } from "react";
import {
  Users,
  UserPlus,
  Map,
  Award,
  TrendingUp,
  Calendar,
  Activity,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useStatStore } from "@/models/stat-store";

interface DashboardStats {
  totalMembers: number;
  newMembersThisMonth: number;
  totalStates: number;
  membershipLevels: number;
  activeMembers: number;
  monthlyGrowth: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number | null;
}

export default function Dashboard() {
  const {
    getStats,
    stats,
    recentActivity,
    getMembersGrowth,
    getMembersStateGrowth,
    getRecentActivity,
    membersGrowth: membershipGrowthData,
    membersStateGrowth: stateDistributionData,
  } = useStatStore();

  useEffect(() => {
    (async () => {
      await Promise.all([
        getStats(),
        getMembersGrowth(),
        getMembersStateGrowth(),
        getRecentActivity(),
      ]);
    })();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend = null,
  }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-green-100 rounded-full">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Peace and Development Party Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to the party management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers ?? 0}
          icon={Users}
        />
        <StatCard
          title="New Members"
          value={stats?.newMembersThisMonth ?? 0}
          icon={UserPlus}
        />
        <StatCard title="States" value={stats?.totalStates ?? 0} icon={Map} />
        <StatCard
          title="Membership Levels"
          value={stats?.membershipLevels ?? 0}
          icon={Award}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Member Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Membership Growth
            </h2>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={membershipGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="membershipGrowth"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#membershipGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Members by State
            </h2>
            <BarChart2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateDistributionData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="state"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="members"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Number of Members"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Activities
          </h2>
          <Activity className="h-5 w-5 text-green-600" />
        </div>
        <div className="space-y-4">
          {/* Activity Items */}

          {recentActivity.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    {item.type === "member" ? (
                      <UserPlus className="h-4 w-4 text-green-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{item.timeAgo}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
