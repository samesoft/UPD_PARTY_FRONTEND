"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';
import UserMembershipPage from './user-membership';

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

export default function MembershipPage() {
    const userRole = localStorage.getItem('userRole');
    
    // If user is not admin, show user registration form
    if (userRole !== 'ADMIN') {
        return <UserMembershipPage />;
    }

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
        gender: ""
    });
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

    // Dropdown options for the five fields
    const [membLevelsOptions, setMembLevelsOptions] = useState<Option[]>([]);
    const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<Option[]>([]);
    const [eduLevelOptions, setEduLevelOptions] = useState<Option[]>([]);
    const [partyRoleOptions, setPartyRoleOptions] = useState<Option[]>([]);

    // Fetch dropdown options when the component mounts
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const membLevelsRes = await axios.get('/membership-levels');
                setMembLevelsOptions(membLevelsRes.data);
                const districtsRes = await axios.get('/districts');
                setDistrictOptions(districtsRes.data);
                const ageGroupsRes = await axios.get('/age-groups');
                setAgeGroupOptions(ageGroupsRes.data);
                const eduLevelsRes = await axios.get('/edu-levels');
                setEduLevelOptions(eduLevelsRes.data);
                const partyRolesRes = await axios.get('/party-roles');
                setPartyRoleOptions(partyRolesRes.data);
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
            // Assuming the response data structure is: { data, pagination }
            console.log(response);
            const { data, pagination: paginationData } = response.data;
            console.log("<<<<<<<DATABASE>>>>>>>>>>");
            setMembers(data);
            console.log(">>>>>>>DATA>>>>>>>>");
            setPagination({
                total: paginationData.total,
                page: paginationData.page,
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
                total: paginationData.total,
                page: paginationData.page,
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

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Member) => {
        if (editingMember) {
            setEditingMember({ ...editingMember, [field]: e.target.value });
        }
    };

    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Omit<Member, 'id'>) => {
        setNewMember({ ...newMember, [field]: e.target.value });
    };

    const handleAdd = async () => {
        setIsAdding(true);
        try {
            // Call the createMember endpoint (which uses your stored procedure)
            const response = await axios.post(`/members`, {
                first_name: "Kalab",
                last_name: "Solomon",
                email: "kaleabsolomon98",
                middle_name: "Haileslasie",
                mobile: "0945059960",
                password_hash: '123456',
                memb_level_id: 0,
                district_id: 0,
                age_group_id: 0,
                edu_level_id: 0,
                party_role_id: 0,
                gender: "Male"
            });
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
                    gender: ""
                });
                fetchMembers(pagination.page);
            } else {
                alert('Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert('An error occurred while adding the member.');
        } finally {
            setIsAdding(false);
        }
    };

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
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-1/3 rounded border border-gray-300 py-2 px-4"
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-left dark:bg-gray-700 border-b border-[#eee] dark:border-strokedark">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Party Role</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Mobile</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.member_id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {editingMember?.member_id === member.member_id ? (
                                            // Editing full name by concatenating first and last names.
                                            <input
                                                type="text"
                                                value={editingMember.first_name + " " + editingMember.last_name}
                                                onChange={(e) => {
                                                    const [first, ...rest] = e.target.value.split(" ");
                                                    const last = rest.join(" ");
                                                    setEditingMember({ ...editingMember, first_name: first, last_name: last });
                                                }}
                                                className="w-full border rounded py-1 px-2"
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
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={handleUpdate}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Saving...' : 'Save'}
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(member)}>
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingMemberId(member.member_id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    disabled={loadingDeleteId === member.member_id}
                                                >
                                                    {loadingDeleteId === member.member_id ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <FaTrash />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-2">
                        <button
                            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            Prev
                        </button>
                        <div className="flex space-x-2">
                            {pagination.totalPages > 5 && pagination.page > 3 && (
                                <>
                                    <button
                                        className="px-3 py-2 rounded bg-gray-300 text-black"
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
                                        className={`px-3 py-2 rounded ${pagination.page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
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
                                        className="px-3 py-2 rounded bg-gray-300 text-black"
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                    >
                                        {pagination.totalPages}
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal - Three-column grid layout with Gender as radio buttons */}
            {editingMember && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full space-y-4">
                        <h2 className="text-lg font-bold mb-2">Edit Member</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={editingMember.first_name}
                                    onChange={(e) => handleEditInputChange(e, 'first_name')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={editingMember.last_name}
                                    onChange={(e) => handleEditInputChange(e, 'last_name')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Party Role</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={editingMember.party_role}
                                    onChange={(e) => handleEditInputChange(e, 'party_role')}
                                >
                                    <option value="">Select Party Role</option>
                                    {partyRoleOptions.map((option) => (
                                        <option key={option.id} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-3">
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    className="border rounded w-full py-2 px-3"
                                    value={editingMember.email}
                                    onChange={(e) => handleEditInputChange(e, 'email')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Mobile</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={editingMember.mobile}
                                    onChange={(e) => handleEditInputChange(e, 'mobile')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Gender</label>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="editGender"
                                            value="Male"
                                            checked={editingMember.gender === "Male"}
                                            onChange={(e) => handleEditInputChange(e, 'gender')}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="editGender"
                                            value="Female"
                                            checked={editingMember.gender === "Female"}
                                            onChange={(e) => handleEditInputChange(e, 'gender')}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setEditingMember(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Saving...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal - Three-column grid layout with drop-downs and Gender as radio buttons */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full space-y-4">
                        <h2 className="text-lg font-bold mb-2">Add Member</h2>
                        <div className="grid grid-cols-3 gap-6">
                            {/* Row 1: First, Last, Middle Name */}
                            <div>
                                <label className="block mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.first_name}
                                    onChange={(e) => handleNewInputChange(e, 'first_name')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.last_name}
                                    onChange={(e) => handleNewInputChange(e, 'last_name')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.middle_name}
                                    onChange={(e) => handleNewInputChange(e, 'middle_name')}
                                />
                            </div>
                            {/* Row 2: Email */}
                            <div className="col-span-3">
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.email}
                                    onChange={(e) => handleNewInputChange(e, 'email')}
                                />
                            </div>
                            {/* Row 3: Password */}
                            <div className="col-span-3">
                                <label className="block mb-1">Password</label>
                                <input
                                    type="password"
                                    className="border rounded w-full py-2 px-3"
                                    // Map password input to password_hash; adjust as needed.
                                    onChange={(e) => handleNewInputChange(e, 'password_hash' as any)}
                                />
                            </div>
                            {/* Row 5: Mobile, Membership Level (drop-down), District (drop-down) */}
                            <div>
                                <label className="block mb-1">Mobile</label>
                                <input
                                    type="text"
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.mobile}
                                    onChange={(e) => handleNewInputChange(e, 'mobile')}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Membership Level</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.memb_level_id}
                                    onChange={(e) => handleNewInputChange(e, 'memb_level_id')}
                                >
                                    <option value={0}>Select Level</option>
                                    {membLevelsOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">District</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.district_id}
                                    onChange={(e) => handleNewInputChange(e, 'district_id')}
                                >
                                    <option value={0}>Select District</option>
                                    {districtOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Row 6: Age Group (drop-down), Education Level (drop-down), Party Role ID (drop-down) */}
                            <div>
                                <label className="block mb-1">Age Group</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.age_group_id}
                                    onChange={(e) => handleNewInputChange(e, 'age_group_id')}
                                >
                                    <option value={0}>Select Age Group</option>
                                    {ageGroupOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Education Level</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.edu_level_id}
                                    onChange={(e) => handleNewInputChange(e, 'edu_level_id')}
                                >
                                    <option value={0}>Select Education Level</option>
                                    {eduLevelOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Party Role</label>
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    value={newMember.party_role_id}
                                    onChange={(e) => handleNewInputChange(e, 'party_role_id')}
                                >
                                    <option value={0}>Select Party Role</option>
                                    {partyRoleOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Row 7: Gender as radio buttons */}
                            <div className="col-span-3">
                                <label className="block mb-1">Gender</label>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={newMember.gender === "Male"}
                                            onChange={(e) => handleNewInputChange(e, 'gender')}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={newMember.gender === "Female"}
                                            onChange={(e) => handleNewInputChange(e, 'gender')}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowAddModal(false)}
                                disabled={isAdding}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                                onClick={handleAdd}
                                disabled={isAdding}
                            >
                                {isAdding ? 'Adding...' : 'Add'}
                            </button>
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

