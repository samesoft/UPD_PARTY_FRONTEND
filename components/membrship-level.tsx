"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';

interface MembershipLevel {
  id: number;
  name: string;
  description: string;
  fee_amount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const MembershipLevelFormElements = () => {
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [editingMembershipLevel, setEditingMembershipLevel] = useState<MembershipLevel | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newMembershipLevel, setNewMembershipLevel] = useState<{ name: string; description: string; fee_amount: number }>({
    name: "",
    description: "",
    fee_amount: 0,
  });

  // New state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMembershipId, setDeletingMembershipId] = useState<number | null>(null);

  // Fetch all membership levels
  const fetchMembershipLevels = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/membership-level?page=${page}&limit=${pagination.limit}`);
      // Assuming the response data structure: { data, pagination }
      const { data, pagination: paginationData } = response.data;
      setMembershipLevels(data);
      setPagination({
        total: paginationData.total,
        page: paginationData.page,
        limit: paginationData.limit,
        totalPages: paginationData.totalPages,
      });
    } catch (error) {
      console.error('Error fetching membership levels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search membership levels by name
  const searchMembershipLevels = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/membership-level/search`, {
        params: { page, limit: pagination.limit, name: searchName },
      });
      const { data, pagination: paginationData } = response.data;
      setMembershipLevels(data);
      setPagination({
        total: paginationData.total,
        page: paginationData.page,
        limit: paginationData.limit,
        totalPages: paginationData.totalPages,
      });
    } catch (error) {
      console.error('Error searching membership levels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchName) {
      searchMembershipLevels(pagination.page);
    } else {
      fetchMembershipLevels(pagination.page);
    }
  }, [pagination.page, searchName]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Called from the delete confirmation modal
  const confirmDelete = async () => {
    if (deletingMembershipId === null) return;
    setLoadingDeleteId(deletingMembershipId);
    try {
      const response = await axios.delete(`/membership-level/${deletingMembershipId}`);
      if (response.status === 200) {
        fetchMembershipLevels(pagination.page);
        alert('Membership level deleted successfully');
      } else {
        alert('Failed to delete membership level');
      }
    } catch (error) {
      console.error('Error deleting membership level:', error);
      alert('An error occurred while deleting the membership level.');
    } finally {
      setLoadingDeleteId(null);
      setShowDeleteModal(false);
      setDeletingMembershipId(null);
    }
  };

  const handleEdit = (level: MembershipLevel) => {
    setEditingMembershipLevel(level);
  };

  const handleUpdate = async () => {
    if (!editingMembershipLevel) return;
    setIsUpdating(true);
    try {
      const response = await axios.put(`/membership-level/${editingMembershipLevel.id}`, editingMembershipLevel);
      if (response.status === 200) {
        setMembershipLevels(prev =>
          prev.map(level => (level.id === editingMembershipLevel.id ? editingMembershipLevel : level))
        );
        alert('Membership level updated successfully');
        setEditingMembershipLevel(null);
      } else {
        alert('Failed to update membership level');
      }
    } catch (error) {
      console.error('Error updating membership level:', error);
      alert('An error occurred while updating the membership level.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MembershipLevel) => {
    if (editingMembershipLevel) {
      setEditingMembershipLevel({ ...editingMembershipLevel, [field]: e.target.value });
    }
  };

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof newMembershipLevel) => {
    setNewMembershipLevel({ ...newMembershipLevel, [field]: e.target.value });
  };

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const response = await axios.post(`/membership-level`, newMembershipLevel);
      if (response.status === 201) {
        alert('Membership level added successfully');
        setShowAddModal(false);
        setNewMembershipLevel({ name: "", description: "", fee_amount: 0 });
        fetchMembershipLevels(pagination.page);
      } else {
        alert('Failed to add membership level');
      }
    } catch (error) {
      console.error('Error adding membership level:', error);
      alert('An error occurred while adding the membership level.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-2 sm:px-5 pt-4 sm:pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <button
          className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 text-sm sm:text-base font-medium"
          onClick={() => setShowAddModal(true)}
        >
          Add Membership Level
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <CircularProgress />
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full table-auto min-w-[600px]">
            <thead>
              <tr className="bg-green-500 text-left border-b border-[#eee] dark:border-strokedark">
                <th className="py-4 px-3 sm:px-4 font-medium text-white text-sm sm:text-base whitespace-nowrap">Name</th>
                <th className="py-4 px-3 sm:px-4 font-medium text-white text-sm sm:text-base">Description</th>
                <th className="py-4 px-3 sm:px-4 font-medium text-white text-sm sm:text-base whitespace-nowrap">Fee Amount</th>
                <th className="py-4 px-3 sm:px-4 font-medium text-white text-sm sm:text-base w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {membershipLevels.map((level) => (
                <tr key={level.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="border-b border-[#eee] py-4 px-3 sm:px-4 dark:border-strokedark text-sm sm:text-base">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="text"
                        value={editingMembershipLevel.name}
                        onChange={(e) => handleEditInputChange(e, 'name')}
                        className="w-full border rounded py-2 px-3 text-sm"
                      />
                    ) : (
                      <span className="line-clamp-2">{level.name}</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-4 px-3 sm:px-4 dark:border-strokedark text-sm sm:text-base">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="text"
                        value={editingMembershipLevel.description}
                        onChange={(e) => handleEditInputChange(e, 'description')}
                        className="w-full border rounded py-2 px-3 text-sm"
                      />
                    ) : (
                      <span className="line-clamp-2">{level.description}</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-4 px-3 sm:px-4 dark:border-strokedark text-sm sm:text-base">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="number"
                        value={editingMembershipLevel.fee_amount}
                        onChange={(e) => handleEditInputChange(e, 'fee_amount')}
                        className="w-full border rounded py-2 px-3 text-sm"
                      />
                    ) : (
                      level.fee_amount
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-4 px-3 sm:px-4 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      {editingMembershipLevel?.id === level.id ? (
                        <button
                          className="bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition duration-200 w-full"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEdit(level)} 
                            className="text-green-500 hover:text-green-600 transition duration-200 p-1"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingMembershipId(level.id);
                              setShowDeleteModal(true);
                            }}
                            disabled={loadingDeleteId === level.id}
                            className="text-red-500 hover:text-red-600 transition duration-200 p-1"
                          >
                            {loadingDeleteId === level.id ? (
                              <CircularProgress size={18} />
                            ) : (
                              <FaTrash size={18} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingMembershipLevel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg m-3">
            <h2 className="text-xl font-bold mb-4">Edit Membership Level</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                    value={editingMembershipLevel.name}
                    onChange={(e) => handleEditInputChange(e, 'name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fee Amount</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                    value={editingMembershipLevel.fee_amount}
                    onChange={(e) => handleEditInputChange(e, 'fee_amount')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <input
                  type="text"
                  className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                  value={editingMembershipLevel.description}
                  onChange={(e) => handleEditInputChange(e, 'description')}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200"
                onClick={() => setEditingMembershipLevel(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-200"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg m-3">
            <h2 className="text-xl font-bold mb-4">Add Membership Level</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                    value={newMembershipLevel.name}
                    onChange={(e) => handleNewInputChange(e, 'name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fee Amount</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                    value={newMembershipLevel.fee_amount}
                    onChange={(e) => handleNewInputChange(e, 'fee_amount')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <input
                  type="text"
                  className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500"
                  value={newMembershipLevel.description}
                  onChange={(e) => handleNewInputChange(e, 'description')}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200"
                onClick={() => setShowAddModal(false)}
                disabled={isAdding}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-200"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md m-3">
            <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
            <p className="text-gray-600 mb-4">Do you really want to delete this membership level?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMembershipId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
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

export default MembershipLevelFormElements;
