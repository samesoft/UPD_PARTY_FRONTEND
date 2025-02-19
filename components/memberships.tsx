"use client";

import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "../commons/axios";
import { User, Phone, Users } from "lucide-react";

interface Member {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  party_role: string; // now will hold the selected party role name
  middle_name: string;
  mobile: string;
  memb_level_id: number;
  district_id: number;
  age_group_id: number;
  edu_level_id: number;
  party_role_id: number;
  gender: string;
  state_id: number;
  password_hash: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Option {
  id: number;
  name: string;
}

interface StateOption {
  stateid: number;
  state: string;
  total_count: number;
}

interface DistrictOption {
  district_id: number;
  district: string;
}

interface AgeGroupOption {
  id: number;
  age_group: string;
}

interface EduLevelOption {
  edu_level_id: number;
  educ_level: string;
}

interface PartyRoleOption {
  party_role_id: number;
  party_role: string;
}

export default function MembershipPage() {
  // const userRole = localStorage.getItem('userRole');

  // // If user is not admin, show user registration form
  // if (userRole !== 'ADMIN') {
  //     return <UserMembershipPage />;
  // }

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newMember, setNewMember] = useState<Omit<Member, "member_id">>({
    first_name: "",
    last_name: "",
    email: "",
    party_role: "",
    middle_name: "",
    mobile: "",
    memb_level_id: 0,
    district_id: 0,
    age_group_id: 0,
    edu_level_id: 0,
    party_role_id: 0,
    gender: "",
    state_id: 0,
    password_hash: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

  // Dropdown options for the five fields
  const [membLevelsOptions, setMembLevelsOptions] = useState<Option[]>([]);
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupOption[]>([]);
  const [eduLevelOptions, setEduLevelOptions] = useState<EduLevelOption[]>([]);
  const [partyRoleOptions, setPartyRoleOptions] = useState<PartyRoleOption[]>(
    []
  );
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  // Add new state for the state popup
  const [showStatePopup, setShowStatePopup] = useState<boolean>(false);
  const [selectedStateInfo, setSelectedStateInfo] =
    useState<StateOption | null>(null);

  const fetchDistrictsByState = async (stateId: number) => {
    try {
      const response = await axios.get(`/district/districtByState/${stateId}`);
      setDistrictOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Fetch dropdown options when the component mounts
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const [membLevels, ageGroups, eduLevels, partyRoles, states] =
          await Promise.all([
            axios.get("/membership-level"),
            axios.get("/age-groups"),
            axios.get("/education-level"),
            axios.get("/party-role"),
            axios.get("/state"),
          ]);

        setMembLevelsOptions(membLevels.data.data);
        setAgeGroupOptions(ageGroups.data.data);
        setEduLevelOptions(eduLevels.data.data);
        setPartyRoleOptions(partyRoles.data.data);
        setStateOptions(states.data.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };
    fetchDropdownOptions();
  }, []);

  // Fetch all members
  const fetchMembers = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/members?page=${page}&limit=${pagination.limit}`
      );
      const { data, pagination: paginationData } = response.data;
      setMembers(data);
      setPagination({
        total: paginationData.totalRecords,
        page: paginationData.currentPage,
        limit: paginationData.limit,
        totalPages: paginationData.totalPages,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search members by name
  const searchMembers = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/members/search`, {
        params: { page, limit: pagination.limit, name: searchName },
      });
      const { data, pagination: paginationData } = response.data;
      setMembers(data);
      setPagination({
        total: paginationData.totalRecords,
        page: paginationData.currentPage,
        limit: paginationData.limit,
        totalPages: paginationData.totalPages,
      });
    } catch (error) {
      console.error("Error searching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchName) {
      searchMembers(pagination.page);
    } else {
      fetchMembers(pagination.page);
    }
  }, [pagination.page, searchName]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Delete confirmation modal action
  const confirmDelete = async () => {
    if (deletingMemberId === null) return;
    setLoadingDeleteId(deletingMemberId);
    try {
      const response = await axios.delete(`/members/${deletingMemberId}`);
      console.log(response);
      if (response.status === 200) {
        fetchMembers(pagination.page);
        alert("Member deleted successfully");
      } else {
        alert("Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred while deleting the member.");
    } finally {
      setLoadingDeleteId(null);
      setShowDeleteModal(false);
      setDeletingMemberId(null);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/members/${editingMember.member_id}`,
        editingMember
      );
      if (response.status === 200) {
        setMembers((prev) =>
          prev.map((member) =>
            member.member_id === editingMember.member_id
              ? editingMember
              : member
          )
        );
        alert("Member updated successfully");
        setEditingMember(null);
      } else {
        alert("Failed to update member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("An error occurred while updating the member.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Modify the state change handlers
  // For Add Modal
  const handleNewInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = e.target.name as keyof Omit<Member, "id">;
    if (field === "state_id") {
      const stateId = Number(e.target.value);
      setNewMember({
        ...newMember,
        [field]: stateId,
        district_id: 0, // Reset district when state changes
      });
      if (stateId) {
        fetchDistrictsByState(stateId);
      }
    } else {
      setNewMember({ ...newMember, [field]: e.target.value });
    }
  };

  // For Edit Modal
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Member
  ) => {
    if (!editingMember) return;

    if (field === "state_id") {
      const stateId = Number(e.target.value);
      setEditingMember({
        ...editingMember,
        [field]: stateId,
        district_id: 0,
      });
      if (stateId) {
        fetchDistrictsByState(stateId);
      }
    } else {
      setEditingMember({ ...editingMember, [field]: e.target.value });
    }
  };

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const response = await axios.post(`/members`, newMember);
      if (response.status === 201) {
        alert("Member added successfully");
        setShowAddModal(false);
        setNewMember({
          first_name: "",
          last_name: "",
          email: "",
          party_role: "",
          middle_name: "",
          mobile: "",
          memb_level_id: 0,
          district_id: 0,
          age_group_id: 0,
          edu_level_id: 0,
          party_role_id: 0,
          gender: "",
          state_id: 0,
          password_hash: "",
        });
        fetchMembers(pagination.page);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("An error occurred while adding the member.");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [membersResponse, statesResponse] = await Promise.all([
          axios.get(
            `/members?page=${pagination.page}&limit=${pagination.limit}`
          ),
          axios.get("/state"),
        ]);

        const { data, pagination: paginationData } = membersResponse.data;
        setMembers(data);
        setPagination({
          total: paginationData.totalRecords,
          page: paginationData.currentPage,
          limit: paginationData.limit,
          totalPages: paginationData.totalPages,
        });

        setStateOptions(statesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit]);

  // Add this function to handle state click
  const handleStateClick = (stateId: number) => {
    const stateInfo = stateOptions.find((state) => state.stateid === stateId);
    if (stateInfo) {
      setSelectedStateInfo(stateInfo);
      setShowStatePopup(true);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-2 sm:px-5 pt-4 sm:pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Top Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 whitespace-nowrap"
          onClick={() => setShowAddModal(true)}
        >
          Ku Dar Xubin
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <CircularProgress style={{ color: "#22c55e" }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto whitespace-nowrap">
            <thead>
              <tr className="bg-green-500 text-left">
                <th className="py-4 px-4 font-medium text-white">Name</th>
                <th className="py-4 px-4 font-medium text-white">Email</th>
                <th className="py-4 px-4 font-medium text-white">Party Role</th>
                <th className="py-4 px-4 font-medium text-white">Mobile</th>
                <th className="py-4 px-4 font-medium text-white w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members && members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div className="max-w-[150px] truncate">
                        {editingMember?.member_id === member.member_id ? (
                          <input
                            type="text"
                            value={
                              editingMember.first_name +
                              " " +
                              editingMember.last_name
                            }
                            onChange={(e) => {
                              const [first, ...rest] =
                                e.target.value.split(" ");
                              const last = rest.join(" ");
                              setEditingMember({
                                ...editingMember,
                                first_name: first,
                                last_name: last,
                              });
                            }}
                            className="w-full border rounded py-1 px-2"
                          />
                        ) : (
                          <span
                            title={member.first_name + " " + member.last_name}
                          >
                            {member.first_name + " " + member.last_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div
                        className="max-w-[130px] truncate"
                        title={member.email}
                      >
                        {member.email}
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div
                        className="max-w-[150px] truncate"
                        title={member.party_role}
                      >
                        {member.party_role}
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div
                        className="max-w-[120px] truncate"
                        title={member.mobile}
                      >
                        {member.mobile}
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        {editingMember?.member_id === member.member_id ? (
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 whitespace-nowrap"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(member)}
                              className="text-green-500 hover:text-green-600"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingMemberId(member.member_id);
                                setShowDeleteModal(true);
                              }}
                              disabled={loadingDeleteId === member.member_id}
                              className="text-red-500 hover:text-red-600"
                            >
                              {loadingDeleteId === member.member_id ? (
                                <CircularProgress
                                  size={20}
                                  style={{ color: "#22c55e" }}
                                />
                              ) : (
                                <FaTrash className="w-5 h-5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Xubno lama helin
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-600"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Hore
            </button>
            <div className="flex space-x-2">
              {pagination.totalPages > 5 && pagination.page > 3 && (
                <>
                  <button
                    className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  <span className="px-2">...</span>
                </>
              )}
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, index) => pagination.page - 2 + index
              )
                .filter((page) => page > 0 && page <= pagination.totalPages)
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`px-3 py-2 rounded ${
                      pagination.page === pageNumber
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              {pagination.totalPages > 5 &&
                pagination.page < pagination.totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handlePageChange(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-600"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Xiga
            </button>
          </div>

          {/* Edit Modal - Three-column layout */}
          {editingMember && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative w-full max-w-7xl rounded-xl bg-white p-8 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-green-600">
                      Tafatir Xubin
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Cusboonaysii macluumaadka xubinta
                    </p>
                  </div>

                  {/* Edit Modal fields */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Koowaad
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={editingMember.first_name}
                        onChange={(e) => handleEditInputChange(e, "first_name")}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magac Saddexaad
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={editingMember.last_name}
                        onChange={(e) => handleEditInputChange(e, "last_name")}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Labaad
                      </label>
                      <input
                        type="text"
                        name="middle_name"
                        value={editingMember.middle_name}
                        onChange={(e) =>
                          handleEditInputChange(e, "middle_name")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maamul Goboleed
                      </label>
                      <select
                        name="state_id"
                        value={editingMember.state_id}
                        onChange={(e) => handleEditInputChange(e, "state_id")}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Maamul Goboleed</option>
                        {stateOptions.map((option) => (
                          <option key={option.stateid} value={option.stateid}>
                            {option.state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degmada
                      </label>
                      <select
                        name="district_id"
                        value={editingMember.district_id}
                        onChange={(e) =>
                          handleEditInputChange(e, "district_id")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Degmada</option>
                        {districtOptions.map((option) => (
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
                        value={editingMember.memb_level_id}
                        onChange={(e) =>
                          handleEditInputChange(e, "memb_level_id")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Heerka Xubinimo</option>
                        {membLevelsOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
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
                        value={editingMember.age_group_id}
                        onChange={(e) =>
                          handleEditInputChange(e, "age_group_id")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Da'da</option>
                        {ageGroupOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.age_group}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heer Waxbarasho
                      </label>
                      <select
                        name="edu_level_id"
                        value={editingMember.edu_level_id}
                        onChange={(e) =>
                          handleEditInputChange(e, "edu_level_id")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Heer Waxbarasho</option>
                        {eduLevelOptions.map((option) => (
                          <option
                            key={option.edu_level_id}
                            value={option.edu_level_id}
                          >
                            {option.educ_level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doorka Xisbiga
                      </label>
                      <select
                        name="party_role_id"
                        value={editingMember.party_role_id}
                        onChange={(e) =>
                          handleEditInputChange(e, "party_role_id")
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Dooro Doorka Xisbiga</option>
                        {partyRoleOptions.map((option) => (
                          <option
                            key={option.party_role_id}
                            value={option.party_role_id}
                          >
                            {option.party_role}
                          </option>
                        ))}
                      </select>
                    </div>
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
                          placeholder="Enter password"
                          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          value={editingMember.password_hash}
                          onChange={(e) =>
                            handleEditInputChange(e, "password_hash")
                          }
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Waa in ay ugu yaraan 8 xaraf tahay
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lambarka Telefoonka
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
                          className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          value={editingMember.mobile.replace("+251", "")}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setEditingMember({
                              ...editingMember,
                              mobile: value ? `+251${value}` : "",
                            });
                          }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Gali 9 lambar ka dib +252
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={editingMember.email}
                        onChange={(e) => handleEditInputChange(e, "email")}
                      />
                    </div>
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
                            checked={editingMember.gender === "Male"}
                            onChange={(e) => handleEditInputChange(e, "gender")}
                            className="form-radio text-green-500"
                          />
                          <span className="ml-2">Lab</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={editingMember.gender === "Female"}
                            onChange={(e) => handleEditInputChange(e, "gender")}
                            className="form-radio text-green-500"
                          />
                          <span className="ml-2">Dhedig</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setEditingMember(null)}
                    >
                      Jooji
                    </button>
                    <button
                      className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Keydi Isbeddelada"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal - Three-column layout */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative w-full max-w-7xl rounded-xl bg-white p-8 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-green-600">
                      Ku Dar Xubin Cusub
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Gali faahfaahinta xubinta hoos
                    </p>
                  </div>

                  {/* All fields in a 3-column grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Kowaad
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.first_name}
                        onChange={handleNewInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Saddexaad
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.last_name}
                        onChange={handleNewInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Magaca Labaad
                      </label>
                      <input
                        type="text"
                        name="middle_name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.middle_name}
                        onChange={handleNewInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maamul Goboleed
                      </label>
                      <select
                        name="state_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.state_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Dooro Maamul Goboleed</option>
                        {stateOptions.map((option) => (
                          <option key={option.stateid} value={option.stateid}>
                            {option.state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degmada
                      </label>
                      <select
                        name="district_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.district_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Dooro Degmada</option>
                        {districtOptions.map((option) => (
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
                        Doorka Xubinimo
                      </label>
                      <select
                        name="memb_level_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.memb_level_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Select Level</option>
                        {membLevelsOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
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
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.age_group_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Dooro Da'da</option>
                        {ageGroupOptions.map((option) => (
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
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.edu_level_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Dooro Heer Waxbarasho</option>
                        {eduLevelOptions.map((option) => (
                          <option
                            key={option.edu_level_id}
                            value={option.edu_level_id}
                          >
                            {option.educ_level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doorka Xisbiga
                      </label>
                      <select
                        name="party_role_id"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.party_role_id}
                        onChange={handleNewInputChange}
                      >
                        <option value="">Dooro Doorka Xisbiga</option>
                        {partyRoleOptions.map((option) => (
                          <option
                            key={option.party_role_id}
                            value={option.party_role_id}
                          >
                            {option.party_role}
                          </option>
                        ))}
                      </select>
                    </div>
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
                            checked={newMember.gender === "Male"}
                            onChange={handleNewInputChange}
                            className="form-radio text-green-500"
                          />
                          <span className="ml-2">Lab</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={newMember.gender === "Female"}
                            onChange={handleNewInputChange}
                            className="form-radio text-green-500"
                          />
                          <span className="ml-2">Dhedig</span>
                        </label>
                      </div>
                    </div>
                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lambar sirta
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
                          placeholder="Enter password"
                          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          value={newMember.password_hash}
                          onChange={handleNewInputChange}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Waa in ay ugu yaraan 8 xaraf tahay
                      </p>
                    </div>
                    {/* Phone Number field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lambarka Telefoonka
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
                          className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          value={newMember.mobile.replace("+251", "")}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setNewMember({
                              ...newMember,
                              mobile: value ? `+251${value}` : "",
                            });
                          }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Gali 9 lambar ka dib +252
                      </p>
                    </div>
                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        value={newMember.email}
                        onChange={handleNewInputChange}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAddModal(false)}
                    >
                      Jooji
                    </button>
                    <button
                      className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                      onClick={handleAdd}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Ku Dar Xubin"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4">
                <h2 className="text-lg font-bold">Are you sure?</h2>
                <p>Do you really want to delete this member?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletingMemberId(null);
                    }}
                  >
                    Jooji
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={confirmDelete}
                    disabled={loadingDeleteId !== null}
                  >
                    {loadingDeleteId !== null ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showStatePopup && selectedStateInfo && (
            <div className="fixed inset-0 z-50 overflow-y-auto md:overflow-hidden">
              <div className="flex min-h-screen items-end justify-center md:items-center p-0 md:p-4">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowStatePopup(false)}
                ></div>

                <div
                  className="relative w-full md:max-w-lg transform bg-white 
                            rounded-t-2xl md:rounded-2xl shadow-xl transition-all scale-in-center
                            h-[90vh] md:h-auto overflow-y-auto
                            p-4 md:p-6"
                >
                  {/* Mobile Pull Bar */}
                  <div className="md:hidden w-full flex justify-center mb-2">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Header */}
                  <div className="sticky top-0 bg-white mb-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-bold text-green-600">
                        {selectedStateInfo.state}
                      </h2>
                      <button
                        onClick={() => setShowStatePopup(false)}
                        className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                      State Information
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* State Statistics */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500">
                          Total Members
                        </div>
                        <div className="text-lg sm:text-2xl font-semibold text-green-600">
                          {selectedStateInfo.total_count}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500">
                          Active Members
                        </div>
                        <div className="text-lg sm:text-2xl font-semibold text-green-600">
                          {selectedStateInfo.total_count}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          Last Updated
                        </span>
                        <span className="text-sm text-gray-700">Today</span>
                      </div>
                    </div>

                    {/* More Details Section */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-gray-700">
                        Additional Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Region Code</span>
                          <span className="text-gray-700">
                            ETH-{selectedStateInfo.stateid}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Districts</span>
                          <span className="text-gray-700">12</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Fixed at bottom on mobile */}
                  <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t">
                    <div className="flex gap-3">
                      <button
                        className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg 
                                            hover:bg-gray-50 transition-colors"
                        onClick={() => setShowStatePopup(false)}
                      >
                        Close
                      </button>
                      <button
                        className="flex-1 px-4 py-3 text-sm bg-green-500 text-white rounded-lg 
                                            hover:bg-green-600 transition-colors"
                        onClick={() => {
                          // Add any action you want here
                          setShowStatePopup(false);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Add these styles to your CSS
const styles = `
@keyframes scale-in-center {
    0% {
        transform: scale(0.95);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.scale-in-center {
    animation: scale-in-center 0.2s ease-out both;
}

@media (max-width: 768px) {
    .scale-in-center {
        animation: slide-up 0.3s ease-out both;
    }
}

@keyframes slide-up {
    0% {
        transform: translateY(100%);
    }
    100% {
        transform: translateY(0);
    }
}
`;
