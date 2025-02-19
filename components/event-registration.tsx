"use client";

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../commons/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-custom.css";
import { MiddlewareReturn } from '@floating-ui/core';
import { MiddlewareState } from '@floating-ui/dom';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    created_by_member_id: number;
    district_id: number;
    district: String;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface District {
    district_id: number;
    district: string;
    regionid: number;
}

export default function EventRegistration() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        created_by_member_id: 0,
        district: '',
        district_id: 0
    });
    const [districts, setDistricts] = useState<District[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);

    // Fetch events
    const fetchEvents = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/events?page=${page}&limit=${pagination.limit}`);
            const { data, pagination: paginationData } = response.data;
            setEvents(data);
            setPagination({
                total: paginationData.total,
                page: paginationData.page,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit event
    const handleEdit = (event: Event) => {
        setEditingEvent(event);
    };

    // Handle update event
    const handleUpdate = async () => {
        if (!editingEvent) return;
        setIsUpdating(true);
        try {
            const response = await axios.put('/events', editingEvent);
            if (response.status === 200) {
                setEvents(prev =>
                    prev.map(event => (event.id === editingEvent.id ? editingEvent : event))
                );
                alert('Event updated successfully');
                setEditingEvent(null);
            } else {
                alert('Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('An error occurred while updating the event.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle input change for editing
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Event) => {
        if (editingEvent) {
            setEditingEvent({ ...editingEvent, [field]: e.target.value });
        }
    };

    // Handle input change for new event
    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof Omit<Event, 'id'>) => {
        setNewEvent({ ...newEvent, [field]: e.target.value });
    };

    // Handle add event
    const handleAdd = async () => {
        setIsAddingEvent(true);
        const memberId = localStorage.getItem('member_id');
        const created_by_member_id = memberId ? parseInt(memberId) : 0;
        try {
            const response = await axios.post('/events', {
                title: newEvent.title,
                description: newEvent.description,
                location: newEvent.location,
                start_time: newEvent.start_time,
                end_time: newEvent.end_time,
                created_by_member_id: created_by_member_id,
                district_id: newEvent.district_id
            });

            if (response.status === 201) {
                alert('Event added successfully');
                setShowAddModal(false);
                setNewEvent({
                    title: "",
                    description: "",
                    location: "",
                    start_time: "",
                    end_time: "",
                    created_by_member_id: created_by_member_id,
                    district: "",
                    district_id: 0
                });
                fetchEvents(pagination.page);
            } else {
                alert('Failed to add event');
            }
        } catch (error) {
            console.error('Error adding event:', error);
            alert('An error occurred while adding the event.');
        } finally {
            setIsAddingEvent(false);
        }
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (deletingEventId === null) return;
        setLoadingDeleteId(deletingEventId);
        try {
            const response = await axios.delete(`/events/${deletingEventId}`);
            if (response.status === 200) {
                fetchEvents(pagination.page);
                alert('Event deleted successfully');
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event.');
        } finally {
            setLoadingDeleteId(null);
            setShowDeleteModal(false);
            setDeletingEventId(null);
        }
    };

    // Handle register to event
    const handleRegisterToEvent = async (eventId: number) => {
        try {
            const response = await axios.post('/events/register', {
                member_id: 1, // Replace with actual member ID from your auth system
                event_id: eventId
            });

            if (response.status === 201) {
                alert('Successfully registered for the event');
            } else {
                alert('Failed to register for the event');
            }
        } catch (error) {
            console.error('Error registering for event:', error);
            alert('An error occurred while registering for the event.');
        }
    };

    // Search events
    const searchEvents = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/events/search`, {
                params: { page, limit: pagination.limit, title: searchTitle },
            });
            const { data, pagination: paginationData } = response.data;
            setEvents(data);
            setPagination({
                total: paginationData.total,
                page: paginationData.page,
                limit: paginationData.limit,
                totalPages: paginationData.totalPages,
            });
        } catch (error) {
            console.error('Error searching events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Update the table actions buttons to actually trigger edit/delete
    const handleDelete = (eventId: number) => {
        setDeletingEventId(eventId);
        setShowDeleteModal(true);
    };

    // Add a new handler for date changes
    const handleDateChange = (date: Date | null, field: 'start_time' | 'end_time') => {
        if (date) {
            setNewEvent(prev => ({
                ...prev,
                [field]: date.toISOString().slice(0, 16)
            }));
        }
    };

    useEffect(() => {
        if (searchTitle) {
            searchEvents(pagination.page);
        } else {
            fetchEvents(pagination.page);
        }
    }, [pagination.page, searchTitle]);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get('/district');
                setDistricts(response.data.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
        fetchDistricts();
    }, []);

    return (
        <div className="rounded-sm border border-stroke bg-white px-3 sm:px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <button
                    className="w-full sm:w-auto bg-green-500 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center gap-2 font-semibold"
                    onClick={() => setShowAddModal(true)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Event
                </button>
                {/* <input
                    type="text"
                    placeholder="Search by Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-1/3 rounded border border-gray-300 py-2 px-4"
                /> */}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-green-500 text-left">
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">Title</th>
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">District</th>
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">Location</th>
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">Start Time</th>
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">End Time</th>
                                <th className="py-4 px-2 sm:px-4 font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="border-b py-5 px-2 sm:px-4 text-sm sm:text-base">{event.title}</td>
                                    <td className="border-b py-5 px-2 sm:px-4 text-sm sm:text-base">{event.district}</td>
                                    <td className="border-b py-5 px-2 sm:px-4 text-sm sm:text-base">{event.location}</td>
                                    <td className="border-b py-5 px-2 sm:px-4 text-sm sm:text-base">
                                        {new Date(event.start_time).toLocaleString()}
                                    </td>
                                    <td className="border-b py-5 px-2 sm:px-4 text-sm sm:text-base">
                                        {new Date(event.end_time).toLocaleString()}
                                    </td>
                                    <td className="border-b py-5 px-2 sm:px-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="text-green-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-all"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-green-600 mb-1">Edit Event</h2>
                                <p className="text-gray-500 text-sm">Update the event details</p>
                            </div>
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={editingEvent.title}
                                    onChange={(e) => handleEditInputChange(e, 'title')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={editingEvent.location}
                                    onChange={(e) => handleEditInputChange(e, 'location')}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={editingEvent.description}
                                    onChange={(e) => handleEditInputChange(e, 'description')}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <DatePicker
                                    selected={new Date(editingEvent.start_time)}
                                    onChange={(date) => handleEditInputChange({ target: { value: date?.toISOString() || '' } } as any, 'start_time')}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    calendarClassName="shadow-xl border-0 rounded-lg"
                                    popperClassName="custom-popper"
                                    wrapperClassName="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                <DatePicker
                                    selected={new Date(editingEvent.end_time)}
                                    onChange={(date) => handleEditInputChange({ target: { value: date?.toISOString() || '' } } as any, 'end_time')}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    calendarClassName="shadow-xl border-0 rounded-lg"
                                    popperClassName="custom-popper"
                                    wrapperClassName="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={editingEvent.district_id}
                                    onChange={(e) => handleEditInputChange({ target: { value: e.target.value } } as any, 'district_id')}
                                >
                                    <option value={0}>Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.district_id} value={district.district_id}>
                                            {district.district}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm font-medium"
                                onClick={handleUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-green-600 mb-1">Add New Event</h2>
                                <p className="text-gray-500 text-sm">Fill in the details to create a new event</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={newEvent.title}
                                    onChange={(e) => handleNewInputChange(e, 'title')}
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={newEvent.location}
                                    onChange={(e) => handleNewInputChange(e, 'location')}
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={newEvent.description}
                                    onChange={(e) => handleNewInputChange(e, 'description')}
                                    rows={3}
                                    placeholder="Enter event description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <DatePicker
                                    selected={newEvent.start_time ? new Date(newEvent.start_time) : null}
                                    onChange={(date) => handleDateChange(date, 'start_time')}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    placeholderText="Select start date and time"
                                    isClearable
                                    showPopperArrow={false}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    calendarClassName="shadow-xl border-0 rounded-lg"
                                    popperClassName="custom-popper"
                                    wrapperClassName="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                <DatePicker
                                    selected={newEvent.end_time ? new Date(newEvent.end_time) : null}
                                    onChange={(date) => handleDateChange(date, 'end_time')}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={newEvent.start_time ? new Date(newEvent.start_time) : new Date()}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    placeholderText="Select end date and time"
                                    isClearable
                                    showPopperArrow={false}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    calendarClassName="shadow-xl border-0 rounded-lg"
                                    popperClassName="custom-popper"
                                    wrapperClassName="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 bg-white"
                                    value={newEvent.district_id}
                                    onChange={(e) => handleNewInputChange(e, 'district_id')}
                                >
                                    <option value={0}>Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.district_id} value={district.district_id}>
                                            {district.district}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm font-medium"
                                onClick={handleAdd}
                                disabled={!newEvent.title || !newEvent.district_id || !newEvent.start_time || !newEvent.end_time || isAddingEvent}
                            >
                                {isAddingEvent ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Adding Event...</span>
                                    </>
                                ) : (
                                    'Add Event'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingEventId(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
