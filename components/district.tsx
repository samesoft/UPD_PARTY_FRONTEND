"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';

interface DistrictItem {
    district_id: number;
    district: string;
    stateid: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface StateOption {
    stateid: number;
    state: string;
}

const DistrictsFormElements = () => {
    const [districts, setDistricts] = useState<DistrictItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [editingDistrict, setEditingDistrict] = useState<DistrictItem | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newDistrict, setNewDistrict] = useState<{ new_district: string; stateid: number }>({
        new_district: '',
        stateid: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDistrictId, setDeletingDistrictId] = useState<number | null>(null);
    const [stateOptions, setStateOptions] = useState<StateOption[]>([]);

    useEffect(() => {
        if (searchName) {
            // If you implement search functionality
            // searchDistricts(pagination.page);
        } else {
            fetchDistricts(pagination.page);
        }
    }, [pagination.page, searchName]);

    useEffect(() => {
        fetchStates();
    }, []);

    // Fetch all districts
    const fetchDistricts = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/district`);
            const { data: fetchedDistricts, pagination: paginationData } = response.data;
            setDistricts(fetchedDistricts);
            setPagination({
                total: paginationData.totalRecords,
                page: paginationData.currentPage,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error fetching districts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await axios.get('/state');
            setStateOptions(response.data.data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleEdit = (district: DistrictItem) => {
        setEditingDistrict(district);
    };

    const handleUpdate = async () => {
        if (!editingDistrict) return;
        setIsUpdating(true);
        try {
            const response = await axios.put(`/district/${editingDistrict.district_id}`, editingDistrict);
            if (response.status === 200) {
                setDistricts(prev =>
                    prev.map(d => (d.district_id === editingDistrict.district_id ? editingDistrict : d))
                );
                setEditingDistrict(null);
            }
        } catch (error) {
            console.error('Error updating district:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAdd = async () => {
        if (!newDistrict.stateid || !newDistrict.new_district) {
            alert('Please select a state and enter district name');
            return;
        }
        
        setIsAdding(true);
        try {
            const response = await axios.post('/district', {
                district: newDistrict.new_district,
                stateid: newDistrict.stateid
            });
            
            if (response.status === 201) {
                alert('District added successfully');
                setShowAddModal(false);
                setNewDistrict({ new_district: '', stateid: 0 });
                fetchDistricts();
            }
        } catch (error) {
            console.error('Error adding district:', error);
            alert('Failed to add district');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (districtId: number) => {
        setLoadingDeleteId(districtId);
        try {
            const response = await axios.delete(`/district/${districtId}`);
            if (response.status === 200) {
                setDistricts(prev => prev.filter(d => d.district_id !== districtId));
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Error deleting district:', error);
            alert('Failed to delete district');
        } finally {
            setLoadingDeleteId(null);
            setDeletingDistrictId(null);
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                    onClick={() => setShowAddModal(true)}
                >
                    Add District
                </button>
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
                            <tr className="bg-green-500 text-left border-b border-[#eee] dark:border-strokedark">
                                <th className="py-4 px-4 font-medium text-white">District Name</th>
                                <th className="py-4 px-4 font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {districts.map((districtItem) => (
                                <tr key={districtItem.district_id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {editingDistrict?.district_id === districtItem.district_id ? (
                                            <input
                                                type="text"
                                                value={editingDistrict.district}
                                                onChange={(e) => setEditingDistrict({
                                                    ...editingDistrict,
                                                    district: e.target.value
                                                })}
                                                className="w-full border rounded py-1 px-2"
                                            />
                                        ) : (
                                            districtItem.district
                                        )}
                                    </td>
                                    <td className="border-b border-[#eee] py-6 px-4 dark:border-strokedark flex gap-2">
                                        {editingDistrict?.district_id === districtItem.district_id ? (
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                                                onClick={handleUpdate}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Saving...' : 'Save'}
                                            </button>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleEdit(districtItem)} 
                                                    className="text-green-500 hover:text-green-600 transition duration-200"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingDistrictId(districtItem.district_id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-500 hover:text-red-600 transition duration-200"
                                                    disabled={loadingDeleteId === districtItem.district_id}
                                                >
                                                    {loadingDeleteId === districtItem.district_id ? (
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
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-green-600">Add New District</h2>
                                <p className="text-gray-600 mt-1">Enter district details below</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select
                                        name="stateid"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newDistrict.stateid}
                                        onChange={(e) => setNewDistrict({
                                            ...newDistrict,
                                            stateid: Number(e.target.value)
                                        })}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">District Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        value={newDistrict.new_district}
                                        onChange={(e) => setNewDistrict({
                                            ...newDistrict,
                                            new_district: e.target.value
                                        })}
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
                                    disabled={isAdding || !newDistrict.stateid || !newDistrict.new_district}
                                >
                                    {isAdding ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Add District'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-red-600">Confirm Delete</h2>
                                <p className="text-gray-600 mt-1">Are you sure you want to delete this district? This action cannot be undone.</p>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingDistrictId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                    onClick={() => deletingDistrictId && handleDelete(deletingDistrictId)}
                                    disabled={loadingDeleteId !== null}
                                >
                                    {loadingDeleteId !== null ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DistrictsFormElements;
