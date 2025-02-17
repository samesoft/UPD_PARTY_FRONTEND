"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';
import { User, Phone, Users } from 'lucide-react';

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
    const [newMember, setNewMember] = useState<Omit<Member, 'member_id'>>({
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
        password_hash: ""
    });
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

    // Dropdown options for the five fields
    const [membLevelsOptions, setMembLevelsOptions] = useState<Option[]>([]);
    const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupOption[]>([]);
    const [eduLevelOptions, setEduLevelOptions] = useState<EduLevelOption[]>([]);
    const [partyRoleOptions, setPartyRoleOptions] = useState<PartyRoleOption[]>([]);
    const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
    const [selectedState, setSelectedState] = useState<number | null>(null);

    const fetchDistrictsByState = async (stateId: number) => {
        try {
          const response = await axios.get(`/district/districtByState/${stateId}`);
          setDistrictOptions(response.data.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      };
      

    // Fetch dropdown options when the component mounts
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const [
                    membLevels,
                    ageGroups,
                    eduLevels,
                    partyRoles,
                    states,
                ] = await Promise.all([
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
                console.error('Error fetching dropdown options:', error);
            }
        };
        fetchDropdownOptions();
    }, []);

    // Fetch all members
    const fetchMembers = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/members?page=${page}&limit=${pagination.limit}`);
            const { data, pagination: paginationData } = response.data;
            setMembers(data);
            setPagination({
                total: paginationData.totalRecords,
                page: paginationData.currentPage,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error fetching members:', error);
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
            console.error('Error searching members:', error);
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
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Delete confirmation modal action
    const confirmDelete = async () => {
        if (deletingMemberId === null) return;
        setLoadingDeleteId(deletingMemberId);
        try {
            const response = await axios.delete(`/members/${deletingMemberId}`);
            if (response.status === 200) {
                fetchMembers(pagination.page);
                alert('Member deleted successfully');
            } else {
                alert('Failed to delete member');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('An error occurred while deleting the member.');
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
            const response = await axios.put(`/members/${editingMember.member_id}`, editingMember);
            if (response.status === 200) {
                setMembers(prev =>
                    prev.map(member => (member.member_id === editingMember.member_id ? editingMember : member))
                );
                alert('Member updated successfully');
                setEditingMember(null);
            } else {
                alert('Failed to update member');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            alert('An error occurred while updating the member.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Modify the state change handlers
    // For Add Modal
    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const field = e.target.name as keyof Omit<Member, 'id'>;
        if (field === 'state_id') {
            const stateId = Number(e.target.value);
            setNewMember({
                ...newMember,
                [field]: stateId,
                district_id: 0 // Reset district when state changes
            });
            if (stateId) {
                fetchDistrictsByState(stateId);
            }
        } else {
            setNewMember({ ...newMember, [field]: e.target.value });
        }
    };

    // For Edit Modal
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Member) => {
        if (!editingMember) return;

        if (field === 'state_id') {
            const stateId = Number(e.target.value);
            setEditingMember({
                ...editingMember,
                [field]: stateId,
                district_id: 0
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
                alert('Member added successfully');
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
                    password_hash: ""
                });
                fetchMembers(pagination.page);
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert('An error occurred while adding the member.');
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [membersResponse, statesResponse] = await Promise.all([
                    axios.get(`/members?page=${pagination.page}&limit=${pagination.limit}`),
                    axios.get('/state')
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
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pagination.page, pagination.limit]);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {/* Top Controls with horizontal gap */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                    onClick={() => setShowAddModal(true)}
                >
                    Add Member
                </button>
                {/* <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-1/3 rounded border border-gray-300 py-2 px-4 focus:border-green-500 focus:outline-none"
                /> */}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <CircularProgress style={{ color: '#22c55e' }} />
                </div>
            ) : (
                <div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-green-500 text-left">
                                <th className="py-4 px-4 font-medium text-white">Name</th>
                                <th className="py-4 px-4 font-medium text-white">Email</th>
                                <th className="py-4 px-4 font-medium text-white">Party Role</th>
                                <th className="py-4 px-4 font-medium text-white">Mobile</th>
                                <th className="py-4 px-4 font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members && members.length > 0 ? (
                                members.map((member) => (
                                    <tr key={member.member_id} className="hover:bg-gray-50">
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            {editingMember?.member_id === member.member_id ? (
                                                <input
                                                    type="text"
                                                    value={editingMember.first_name + " " + editingMember.last_name}
                                                    onChange={(e) => {
                                                        const [first, ...rest] = e.target.value.split(" ");
                                                        const last = rest.join(" ");
                                                        setEditingMember({ ...editingMember, first_name: first, last_name: last });
                                                    }}
                                                    className="w-full border rounded py-1 px-2 focus:border-green-500 focus:outline-none"
                                                />
                                            ) : (
                                                member.first_name + " " + member.last_name
                                            )}
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{member.email}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{member.party_role}</td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{member.mobile}</td>
                                        <td className="border-b border-[#eee] py-6 px-4 dark:border-strokedark flex gap-2">
                                            {editingMember?.member_id === member.member_id ? (
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                    onClick={handleUpdate}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? 'Saving...' : 'Save'}
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(member)}
                                                        className="text-green-500 hover:text-green-600"
                                                    >
                                                        <FaEdit size={20} />
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
                                                            <CircularProgress size={20} style={{ color: '#22c55e' }} />
                                                        ) : (
                                                            <FaTrash size={20} />
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        No members found
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
                            Prev
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
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) =>
                                pagination.page - 2 + index
                            )
                                .filter((page) => page > 0 && page <= pagination.totalPages)
                                .map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`px-3 py-2 rounded ${pagination.page === pageNumber
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
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
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal - Three-column layout */}
            {editingMember && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative w-full max-w-7xl rounded-xl bg-white p-8 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-green-600">Edit Member</h2>
                                <p className="text-gray-600 mt-1">Update member information</p>
                            </div>

                            {/* Edit Modal fields */}
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={editingMember.first_name}
                                        onChange={(e) => handleEditInputChange(e, 'first_name')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={editingMember.last_name}
                                        onChange={(e) => handleEditInputChange(e, 'last_name')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        value={editingMember.middle_name}
                                        onChange={(e) => handleEditInputChange(e, 'middle_name')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select
                                        name="state_id"
                                        value={editingMember.state_id}
                                        onChange={(e) => handleEditInputChange(e, 'state_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select State</option>
                                        {stateOptions.map(option => (
                                            <option key={option.stateid} value={option.stateid}>{option.state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                    <select
                                        name="district_id"
                                        value={editingMember.district_id}
                                        onChange={(e) => handleEditInputChange(e, 'district_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select District</option>
                                        {districtOptions.map(option => (
                                            <option key={option.district_id} value={option.district_id}>{option.district}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Level</label>
                                    <select
                                        name="memb_level_id"
                                        value={editingMember.memb_level_id}
                                        onChange={(e) => handleEditInputChange(e, 'memb_level_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select Level</option>
                                        {membLevelsOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                                    <select
                                        name="age_group_id"
                                        value={editingMember.age_group_id}
                                        onChange={(e) => handleEditInputChange(e, 'age_group_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select Age Group</option>
                                        {ageGroupOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.age_group}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                                    <select
                                        name="edu_level_id"
                                        value={editingMember.edu_level_id}
                                        onChange={(e) => handleEditInputChange(e, 'edu_level_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select Education Level</option>
                                        {eduLevelOptions.map(option => (
                                            <option key={option.edu_level_id} value={option.edu_level_id}>{option.educ_level}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Role</label>
                                    <select
                                        name="party_role_id"
                                        value={editingMember.party_role_id}
                                        onChange={(e) => handleEditInputChange(e, 'party_role_id')}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    >
                                        <option value="">Select Party Role</option>
                                        {partyRoleOptions.map(option => (
                                            <option key={option.party_role_id} value={option.party_role_id}>{option.party_role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-lg font-medium">🔒</span>
                                        </div>
                                        <input
                                            type="password"
                                            name="password_hash"
                                            required
                                            placeholder="Enter password"
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            value={editingMember.password_hash}
                                            onChange={(e) => handleEditInputChange(e, 'password_hash')}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-lg font-medium">+251</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            required
                                            maxLength={9}
                                            placeholder="912345678"
                                            className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            value={editingMember.mobile.replace('+251', '')}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setEditingMember({
                                                    ...editingMember,
                                                    mobile: value ? `+251${value}` : ''
                                                });
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Enter 9 digits after +251</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={editingMember.email}
                                        onChange={(e) => handleEditInputChange(e, 'email')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <div className="flex space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={editingMember.gender === "Male"}
                                                onChange={(e) => handleEditInputChange(e, 'gender')}
                                                className="form-radio text-green-500"
                                            />
                                            <span className="ml-2">Male</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={editingMember.gender === "Female"}
                                                onChange={(e) => handleEditInputChange(e, 'gender')}
                                                className="form-radio text-green-500"
                                            />
                                            <span className="ml-2">Female</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setEditingMember(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Save Changes'
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
                                <h2 className="text-2xl font-bold text-green-600">Add New Member</h2>
                                <p className="text-gray-600 mt-1">Enter member details below</p>
                            </div>

                            {/* All fields in a 3-column grid */}
                            <div className="grid grid-cols-3 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.middle_name}
                                        onChange={handleNewInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select
                                        name="state_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.state_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select State</option>
                                        {stateOptions.map(option => (
                                            <option key={option.stateid} value={option.stateid}>
                                                {option.state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                    <select
                                        name="district_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.district_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select District</option>
                                        {districtOptions.map(option => (
                                            <option key={option.district_id} value={option.district_id}>
                                                {option.district}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Level</label>
                                    <select
                                        name="memb_level_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.memb_level_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select Level</option>
                                        {membLevelsOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                                    <select
                                        name="age_group_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.age_group_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select Age Group</option>
                                        {ageGroupOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.age_group}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                                    <select
                                        name="edu_level_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.edu_level_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select Education Level</option>
                                        {eduLevelOptions.map(option => (
                                            <option key={option.edu_level_id} value={option.edu_level_id}>
                                                {option.educ_level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Role</label>
                                    <select
                                        name="party_role_id"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newMember.party_role_id}
                                        onChange={handleNewInputChange}
                                    >
                                        <option value="">Select Party Role</option>
                                        {partyRoleOptions.map(option => (
                                            <option key={option.party_role_id} value={option.party_role_id}>
                                                {option.party_role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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
                                            <span className="ml-2">Male</span>
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
                                            <span className="ml-2">Female</span>
                                        </label>
                                    </div>
                                </div>
                                {/* Password field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-lg font-medium">🔒</span>
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
                                    <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                                </div>
                                {/* Phone Number field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-lg font-medium">+251</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            required
                                            maxLength={9}
                                            placeholder="912345678"
                                            className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            value={newMember.mobile.replace('+251', '')}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setNewMember({
                                                    ...newMember,
                                                    mobile: value ? `+251${value}` : ''
                                                });
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Enter 9 digits after +251</p>
                                </div>
                                {/* Email field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    onClick={handleAdd}
                                    disabled={isAdding}
                                >
                                    {isAdding ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Add Member'
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
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={confirmDelete}
                                disabled={loadingDeleteId !== null}
                            >
                                {loadingDeleteId !== null ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

