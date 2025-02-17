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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          onClick={() => setShowAddModal(true)}
        >
          Add Membership Level
        </button>
        {/* <input
          type="text"
          placeholder="Search by Name"
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
                <th className="py-4 px-4 font-medium text-white">Name</th>
                <th className="py-4 px-4 font-medium text-white">Description</th>
                <th className="py-4 px-4 font-medium text-white">Fee Amount</th>
                <th className="py-4 px-4 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {membershipLevels.map((level) => (
                <tr key={level.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="text"
                        value={editingMembershipLevel.name}
                        onChange={(e) => handleEditInputChange(e, 'name')}
                        className="w-full border rounded py-1 px-2"
                      />
                    ) : (
                      level.name
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="text"
                        value={editingMembershipLevel.description}
                        onChange={(e) => handleEditInputChange(e, 'description')}
                        className="w-full border rounded py-1 px-2"
                      />
                    ) : (
                      level.description
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {editingMembershipLevel?.id === level.id ? (
                      <input
                        type="number"
                        value={editingMembershipLevel.fee_amount}
                        onChange={(e) => handleEditInputChange(e, 'fee_amount')}
                        className="w-full border rounded py-1 px-2"
                      />
                    ) : (
                      level.fee_amount
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-6 px-4 dark:border-strokedark flex gap-2">
                    {editingMembershipLevel?.id === level.id ? (
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
                          onClick={() => handleEdit(level)} 
                          className="text-green-500 hover:text-green-600 transition duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingMembershipId(level.id);
                            setShowDeleteModal(true);
                          }}
                          disabled={loadingDeleteId === level.id}
                        >
                          {loadingDeleteId === level.id ? (
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
      {editingMembershipLevel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold mb-2">Edit Membership Level</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  value={editingMembershipLevel.name}
                  onChange={(e) => handleEditInputChange(e, 'name')}
                />
              </div>
              <div>
                <label className="block mb-1">Fee Amount</label>
                <input
                  type="number"
                  className="border rounded w-full py-2 px-3"
                  value={editingMembershipLevel.fee_amount}
                  onChange={(e) => handleEditInputChange(e, 'fee_amount')}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={editingMembershipLevel.description}
                onChange={(e) => handleEditInputChange(e, 'description')}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditingMembershipLevel(null)}
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
            <h2 className="text-lg font-bold mb-2">Add Membership Level</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  value={newMembershipLevel.name}
                  onChange={(e) => handleNewInputChange(e, 'name')}
                />
              </div>
              <div>
                <label className="block mb-1">Fee Amount</label>
                <input
                  type="number"
                  className="border rounded w-full py-2 px-3"
                  value={newMembershipLevel.fee_amount}
                  onChange={(e) => handleNewInputChange(e, 'fee_amount')}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={newMembershipLevel.description}
                onChange={(e) => handleNewInputChange(e, 'description')}
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
            <p>Do you really want to delete this membership level?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMembershipId(null);
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

export default MembershipLevelFormElements;
