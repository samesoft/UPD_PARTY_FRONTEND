"use client";

import type React from "react";
import { useEffect, useState } from "react";
import axios from "../commons/axios";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import { User, Users, ChevronRight, Phone } from "lucide-react";

interface DistrictOption {
    district_id: number;
    district: string;
    regionid?: number;
}

interface ApiResponse {
    data: DistrictOption[];
}

// interface PartyRoleOption {
//     party_role_id: number;
//     party_role: string;
// }

// interface PartyRoleResponse {
//     data: PartyRoleOption[];
// }

interface EduLevelOption {
    edu_level_id: number;
    educ_level: string;
}

interface EduLevelResponse {
    data: EduLevelOption[];
}

interface AgeGroupOption {
    id: number;
    age_group: string;
}

interface AgeGroupResponse {
    data: AgeGroupOption[];
}

interface MembershipLevelOption {
    id: string;
    name: string;
    description: string;
    fee_amount: string;
}

interface MembershipLevelResponse {
    data: MembershipLevelOption[];
}

interface StateOption {
    stateid: number;
    state: string;
    total_count: number;
}

interface StateResponse {
    data: StateOption[];
}

export default function UserMembershipPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [membLevelsOptions, setMembLevelsOptions] =
        useState<MembershipLevelResponse>({ data: [] });
    const [districtOptions, setDistrictOptions] = useState<ApiResponse>({
        data: [],
    });
    const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupResponse>({
        data: [],
    });
    const [eduLevelOptions, setEduLevelOptions] = useState<EduLevelResponse>({
        data: [],
    });
    // const [partyRoleOptions, setPartyRoleOptions] = useState<PartyRoleResponse>({
    //     data: [],
    // });
    const [stateOptions, setStateOptions] = useState<StateResponse>({ data: [] });
    const [selectedState, setSelectedState] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        password_hash: "",
        mobile: localStorage.getItem("phone") || "",
        memb_level_id: 0,
        district_id: 0,
        age_group_id: 0,
        edu_level_id: 0,
        party_role_id: 1,
        gender: "",
        state_id: 0,
        role_id: 2
    });

    const fetchDistrictsByState = async (stateId: number) => {
        try {
            const response = await axios.get(`/district/districtByState/${stateId}`);
            setDistrictOptions({ data: response.data.data });
            console.log("Districts fetched:", response.data.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "state_id") {
            const stateId = Number(value);
            setSelectedState(stateId);
            setFormData({
                ...formData,
                [name]: stateId,
                district_id: 0 // Reset district when state changes
            });
            if (stateId) {
                fetchDistrictsByState(stateId);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("/members", formData);
            if (response.status === 201) {
                setShowSuccess(true);
            }
        } catch (err: any) {
            console.log(err);
            setError(err.response?.data?.error || "Failed to register. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOkClick = () => {
        setShowSuccess(false);
    };

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const [
                    membLevels,
                    ageGroups,
                    eduLevels,
                    // partyRoles,
                    states,
                ] = await Promise.all([
                    axios.get("/membership-level"),
                    axios.get("/age-groups"),
                    axios.get("/education-level"),
                    // axios.get("/party-role"),
                    axios.get("/state"),
                ]);

                setMembLevelsOptions(membLevels.data);
                setAgeGroupOptions(ageGroups.data);
                setEduLevelOptions(eduLevels.data);
                // setPartyRoleOptions(partyRoles.data);
                setStateOptions(states.data);
            } catch (error) {
                console.error("Error fetching options:", error);
                setError("Failed to load form options");
            }
        };

        fetchDropdownOptions();
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        {/* Success Modal - Made responsive */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-4 sm:p-8 shadow-xl z-10 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Diwaangelinta Waa ku Guuleysatay!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Diwaangelinta xubinimadaada ayaa si guul leh loo
                  dhammeystiray.
                </p>
                <button
                  onClick={handleOkClick}
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm transition-colors"
                >
                  Hagaag.
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ku soo dhowow{" "}
              <span className="text-primary-600">
                Xisbiga Midowga Nabadda & Horumarka
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Dhameystir profile-kaaga si aad ugu biirto bulshada iyo si aad uga
              qayb gasho dhacdooyinka.
            </p>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto"
          >
            {/* Progress Steps */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 sm:p-6 text-white">
              <div className="flex justify-between max-w-2xl mx-auto">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold text-sm sm:text-base">
                    1
                  </div>
                  <span className="ml-2 sm:ml-3 hidden sm:inline">
                    Macluumaadka Shakhsiyeed
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base">
                    2
                  </div>
                  <span className="ml-2 sm:ml-3 hidden sm:inline">Hubinta</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base">
                    3
                  </div>
                  <span className="ml-2 sm:ml-3 hidden sm:inline">
                    Dhameystir
                  </span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                >
                  <p className="text-red-700">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600" />
                    Macluumaadka Shakhsiyeed
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Kowaad
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Saddexaad
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Labaad
                      </label>
                      <input
                        type="text"
                        name="middle_name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.middle_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600" />
                    Macluumaadka Xiriirka
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taleefan Lambarka
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-gray-500 text-lg font-medium">
                            +252
                          </span>
                        </div>
                        <input
                          type="tel"
                          name="mobile"
                          required
                          maxLength={9}
                          placeholder="912345678"
                          className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                          value={formData.mobile.replace("+251", "")}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setFormData({
                              ...formData,
                              mobile: value ? `+251${value}` : "",
                            });
                          }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Geli 9 lambar oo ka dambeeya +252
                      </p>
                    </div>

                    {/* Password field with matching design */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lambarka Sirta
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-gray-500 text-lg font-medium">
                            🔒
                          </span>
                        </div>
                        <input
                          type="password"
                          name="password_hash"
                          required
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                          value={formData.password_hash}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Waa in uu ugu yaraan yahay 8 xaraf
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600" />
                    Macluumaad Dheeraad ah
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maamul Goboleedka
                      </label>
                      <select
                        name="state_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.state_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select State</option>
                        {stateOptions.data?.map((option) => (
                          <option key={option.stateid} value={option.stateid}>
                            {option.state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degmada
                      </label>
                      <select
                        name="district_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.district_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select District</option>
                        {districtOptions.data &&
                          districtOptions.data.map((option) => (
                            <option
                              key={option.district_id}
                              value={option.district_id}
                            >
                              {option.district}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heerka Xubinimo
                      </label>
                      <select
                        name="memb_level_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.memb_level_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Level</option>
                        {membLevelsOptions.data?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} - {option.fee_amount} USD
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Da'da
                      </label>
                      <select
                        name="age_group_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.age_group_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Age Group</option>
                        {ageGroupOptions.data?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.age_group}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heerka Waxbarasho
                      </label>
                      <select
                        name="edu_level_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        value={formData.edu_level_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Education Level</option>
                        {eduLevelOptions.data?.map((option) => (
                          <option
                            key={option.edu_level_id}
                            value={option.edu_level_id}
                          >
                            {option.educ_level}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Party Role
                                        </label>
                                        <select
                                            name="party_role_id"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                            value={formData.party_role_id}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Party Role</option>
                                            {partyRoleOptions.data?.map((option) => (
                                                <option
                                                    key={option.party_role_id}
                                                    value={option.party_role_id}
                                                >
                                                    {option.party_role}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jinsiga
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={handleInputChange}
                            className="form-radio text-primary-500"
                          />
                          <span className="ml-2">Lab</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={handleInputChange}
                            className="form-radio text-primary-500"
                          />
                          <span className="ml-2">Dhedig</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center sm:justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto group bg-[#2E8B57] text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-[#236b43] focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        <span>Waxaa la habeynayaa...</span>
                      </>
                    ) : (
                      <>
                        <span>Dhameystir Diwaangelinta</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
}
