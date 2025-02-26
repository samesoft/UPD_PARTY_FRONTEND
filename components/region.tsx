"use client";

import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useUtilityStore } from "@/models";
import { Region } from "@/types/utilities";

const RegionFormElements = () => {
  const { regions, loading, states, createRegion, deleteRegion, updateRegion } =
    useUtilityStore();

  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const [editingDistrict, setEditingDistrict] = useState<Region | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newDistrict, setNewDistrict] = useState<{
    new_district: string;
    stateid: number;
    regionId: number;
  }>({
    new_district: "",
    stateid: 0,
    regionId: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDistrictId, setDeletingDistrictId] = useState<number | null>(
    null
  );

  const handleEdit = (district: Region) => {
    setEditingDistrict(district);
  };

  const handleUpdate = async () => {
    if (!editingDistrict) return;
    setIsUpdating(true);
    updateRegion(editingDistrict);
    setEditingDistrict(null);
    setIsUpdating(false);
  };

  const handleAdd = async () => {
    if (!newDistrict.stateid || !newDistrict.new_district) {
      alert("Please select a state and enter Region Name");
      return;
    }

    setIsAdding(true);

    createRegion({
      region: newDistrict.new_district,
      stateid: newDistrict.stateid,
    });

    setShowAddModal(false);
    // setNewDistrict({ new_district: "", stateid: 0, regionId: 0 });
    setIsAdding(false);
  };

  const handleDelete = async (districtId: number) => {
    setLoadingDeleteId(districtId);
    deleteRegion(districtId);
    setDeletingDistrictId(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          onClick={() => setShowAddModal(true)}
        >
          Add Region
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-500 text-left border-b border-[#eee] dark:border-strokedark">
                <th className="py-4 px-4 font-medium text-white">
                  Region Name
                </th>
                <th className="py-4 px-4 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((districtItem) => (
                <tr key={districtItem.regionid}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {editingDistrict?.regionid &&
                    editingDistrict?.regionid === districtItem.regionid ? (
                      <input
                        type="text"
                        value={editingDistrict?.region}
                        onChange={(e) =>
                          setEditingDistrict({
                            ...editingDistrict,
                            region: e.target.value,
                          })
                        }
                        className="w-full border rounded py-1 px-2"
                      />
                    ) : (
                      districtItem.region
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-6 px-4 dark:border-strokedark flex gap-2">
                    {editingDistrict?.regionid &&
                    editingDistrict?.regionid === districtItem.regionid ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={handleUpdate}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save"}
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
                            setDeletingDistrictId(
                              Number(districtItem?.regionid)
                            );
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500 hover:text-red-600 transition duration-200"
                          disabled={loadingDeleteId === districtItem.regionid}
                        >
                          {loadingDeleteId === districtItem.regionid ? (
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
                <h2 className="text-2xl font-bold text-green-600">
                  Add New Region
                </h2>
                <p className="text-gray-600 mt-1">Enter region details below</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    name="stateid"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    value={newDistrict.stateid}
                    onChange={(e) => {
                      setNewDistrict({
                        ...newDistrict,
                        stateid: Number(e.target.value),
                      });
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map((option) => (
                      <option key={option.stateid} value={option.stateid}>
                        {option.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    value={newDistrict.new_district}
                    onChange={(e) =>
                      setNewDistrict({
                        ...newDistrict,
                        new_district: e.target.value,
                      })
                    }
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
                  disabled={
                    isAdding ||
                    !newDistrict.stateid ||
                    !newDistrict.new_district
                  }
                >
                  {isAdding ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Add District"
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
                <h2 className="text-2xl font-bold text-red-600">
                  Confirm Delete
                </h2>
                <p className="text-gray-600 mt-1">
                  Are you sure you want to delete this district? This action
                  cannot be undone.
                </p>
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
                  onClick={() =>
                    deletingDistrictId && handleDelete(deletingDistrictId)
                  }
                  disabled={loadingDeleteId !== null}
                >
                  {loadingDeleteId !== null ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Delete"
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

export default RegionFormElements;
