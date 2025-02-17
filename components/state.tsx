"use client";


import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';

interface StateItem {
    stateid: number;
    state: string;
    // Optionally, if needed: total_count?: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const StatesFormElements = () => {
    const [states, setStates] = useState<StateItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [editingState, setEditingState] = useState<StateItem | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newState, setNewState] = useState<{ new_state: string }>({ new_state: '' });

    // New state for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingStateId, setDeletingStateId] = useState<number | null>(null);

    // Fetch all states
    const fetchStates = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/state?page=${page}&limit=${pagination.limit}`);
            const { data: fetchedStates, pagination: paginationData } = response.data;
            setStates(fetchedStates);
            setPagination({
                total: paginationData.totalRecords,
                page: paginationData.currentPage,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error fetching states:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Search states by name
    const searchStates = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/state/search`, {
                params: { page, limit: pagination.limit, name: searchName },
            });
            const { states: fetchedStates, pagination: paginationData } = response.data;
            setStates(fetchedStates);
            setPagination({
                total: paginationData.totalRecords,
                page: paginationData.currentPage,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error searching states:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchName) {
            searchStates(pagination.page);
        } else {
            fetchStates(pagination.page);
        }
    }, [pagination.page, searchName]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Called from the delete confirmation modal
    const confirmDelete = async () => {
        if (deletingStateId === null) return;
        setLoadingDeleteId(deletingStateId);
        try {
            const response = await axios.delete(`/state/${deletingStateId}`);
            if (response.status === 200) {
                fetchStates(pagination.page);
                alert('State deleted successfully');
            } else {
                alert('Failed to delete state');
            }
        } catch (error) {
            console.error('Error deleting state:', error);
            alert('An error occurred while deleting the state.');
        } finally {
            setLoadingDeleteId(null);
            setShowDeleteModal(false);
            setDeletingStateId(null);
        }
    };

    const handleEdit = (stateItem: StateItem) => {
        setEditingState(stateItem);
    };

    const handleUpdate = async () => {
        if (!editingState) return;
        setIsUpdating(true);
        try {
            const response = await axios.put(`/state/${editingState.stateid}`, { new_state: editingState.state });
            if (response.status === 200) {
                setStates(prev =>
                    prev.map(item => (item.stateid === editingState.stateid ? editingState : item))
                );
                alert('State updated successfully');
                setEditingState(null);
            } else {
                alert('Failed to update state');
            }
        } catch (error) {
            console.error('Error updating state:', error);
            alert('An error occurred while updating the state.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingState) {
            setEditingState({ ...editingState, state: e.target.value });
        }
    };

    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewState({ 'new_state': e.target.value });
    };

    const handleAdd = async () => {
        setIsAdding(true);
        try {
            const response = await axios.post(`/state`, newState);
            if (response.status === 201) {
                alert('State added successfully');
                setShowAddModal(false);
                setNewState({ 'new_state': '' });
                fetchStates(pagination.page);
            } else {
                alert('Failed to add state');
            }
        } catch (error) {
            console.error('Error adding state:', error);
            alert('An error occurred while adding the state.');
        } finally {
            setIsAdding(false);
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
                    Add State
                </button>
                {/* <input
                    type="text"
                    placeholder="Search by State Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-1/3 rounded border border-gray-300 py-2 px-4"
                /> */}
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
                                <th className="py-4 px-4 font-medium text-white">State Name</th>
                                <th className="py-4 px-4 font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {states.map((stateItem) => (
                                <tr key={stateItem.stateid}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {editingState?.stateid === stateItem.stateid ? (
                                            <input
                                                type="text"
                                                value={editingState.state}
                                                onChange={handleInputChange}
                                                className="w-full border rounded py-1 px-2"
                                            />
                                        ) : (
                                            stateItem.state
                                        )}
                                    </td>
                                    <td className="border-b border-[#eee] py-6 px-4 dark:border-strokedark flex gap-2">
                                        {editingState?.stateid === stateItem.stateid ? (
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
                                                    onClick={() => handleEdit(stateItem)} 
                                                    className="text-green-500 hover:text-green-600 transition duration-200"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingStateId(stateItem.stateid);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    disabled={loadingDeleteId === stateItem.stateid}
                                                >
                                                    {loadingDeleteId === stateItem.stateid ? (
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

            {/* Edit Modal */}
            {editingState && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
                        <h2 className="text-lg font-bold mb-2">Edit State</h2>
                        <div className="mb-4">
                            <label className="block mb-1">State Name</label>
                            <input
                                type="text"
                                className="border rounded w-full py-2 px-3"
                                value={editingState.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setEditingState(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                                onClick={handleUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Saving...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
                        <h2 className="text-lg font-bold mb-2">Add State</h2>
                        <div className="mb-4">
                            <label className="block mb-1">State Name</label>
                            <input
                                type="text"
                                className="border rounded w-full py-2 px-3"
                                value={newState.new_state}
                                onChange={handleNewInputChange}
                            />
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
                        <p>Do you really want to delete this state?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingStateId(null);
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
};

export default StatesFormElements;
