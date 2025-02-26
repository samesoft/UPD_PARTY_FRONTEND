"use client";

import { useState } from "react";
import { Camera, Mail, Phone, User, MapPin, Calendar } from "lucide-react";
import { EditProfilePage } from "./edit-profile";
import { MemberData } from "@/types/member";
import { useAuthStore } from "@/models";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const { profile: memberData } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              {/* Profile Photo */}
              <div className="-mt-16 relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-50 shadow-inner">
                  {memberData?.profile_photo_url ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                        "/api",
                        ""
                      )}${memberData?.profile_photo_url}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <User
                          size={48}
                          className="text-gray-400 drop-shadow-sm"
                          strokeWidth={1.5}
                        />
                        <div className="text-xs text-gray-400 mt-1 font-medium">
                          Add Photo
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2.5 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Upload Photo"
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* Name and Role */}
              <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {`${memberData?.first_name} ${memberData?.middle_name} ${memberData?.last_name}`.trim()}
                </h1>
                <p className="text-gray-500">{memberData?.role_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 text-green-600 mr-2" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">
                    {memberData?.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="text-gray-900">{memberData?.mobile}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900">{memberData?.gender}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900">{memberData?.role_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <EditProfilePage
        data={memberData ?? ({} as MemberData)}
        open={open}
        onClose={() => setOpen(!open)}
      />
    </div>
  );
}
