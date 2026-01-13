"use client";

import React, { useEffect, useState } from "react";
import { Clock, User, MapPin, X, Plus, Calendar, Search, Filter, GraduationCap } from "lucide-react";

const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

type Workshop = {
  _id: string;
  title: string;
  category: "coffee" | "painting";
  date: string;
  time: string;
  description: string;
  instructor: string;
  location: string;
  capacity: number;
  registrations: Array<{ name: string; email: string; registeredAt: Date }>;
  status: "upcoming" | "past";
};

export default function WorkshopsAdminPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past' | 'registrations'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const [newWorkshop, setNewWorkshop] = useState({
    title: "",
    category: "coffee" as "coffee" | "painting",
    date: "",
    hour: "",
    minute: "",
    ampm: "AM",
    description: "",
    instructor: "",
    location: "",
    capacity: 0,
  });

  useEffect(() => {
    const fetchWorkshops = async () => {
      const res = await fetch("/api/workshops");
      const data = await res.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processed = data.map((w: Workshop) => {
        const d = new Date(w.date);
        d.setHours(0, 0, 0, 0);
        return { ...w, status: d < today ? "past" : "upcoming" };
      });

      setWorkshops(processed);
    };

    fetchWorkshops();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      year,
      month,
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      startingDayOfWeek: new Date(year, month, 1).getDay(),
    };
  };

  const getWorkshopForDate = (date: Date) =>
    workshops.find((w) => w.date === formatDate(date));

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const workshop = getWorkshopForDate(date);
    if (workshop) {
      setSelectedWorkshop(workshop);
      setEditWorkshop({ ...workshop });
      setIsEditing(false);
      setIsModalOpen(true);
    }
  };

  const handleAddWorkshop = async () => {
    if (!newWorkshop.title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a workshop title' });
      return;
    }
    if (!newWorkshop.date) {
      setMessage({ type: 'error', text: 'Please select a date' });
      return;
    }
    if (!newWorkshop.hour || !newWorkshop.minute) {
      setMessage({ type: 'error', text: 'Please enter a valid time' });
      return;
    }
    if (!newWorkshop.instructor.trim()) {
      setMessage({ type: 'error', text: 'Please enter instructor name' });
      return;
    }
    if (!newWorkshop.location.trim()) {
      setMessage({ type: 'error', text: 'Please enter location' });
      return;
    }
    if (!newWorkshop.description.trim()) {
      setMessage({ type: 'error', text: 'Please enter description' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/workshops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newWorkshop.title,
          category: newWorkshop.category,
          date: newWorkshop.date,
          time: `${newWorkshop.hour}:${newWorkshop.minute || "00"} ${newWorkshop.ampm}`,
          description: newWorkshop.description,
          instructor: newWorkshop.instructor,
          location: newWorkshop.location,
          capacity: Number(newWorkshop.capacity),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add workshop');
      }

      const saved = await res.json();
      setWorkshops((p) => [...p, saved]);

      setNewWorkshop({
        title: "",
        category: "coffee",
        date: "",
        hour: "",
        minute: "",
        ampm: "AM",
        description: "",
        instructor: "",
        location: "",
        capacity: 0,
      });

      setMessage({ type: 'success', text: 'Workshop added successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to add workshop' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkshop = async () => {
    if (!editWorkshop) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/workshops/${editWorkshop._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editWorkshop),
      });

      if (!res.ok) {
        throw new Error('Failed to update workshop');
      }

      const updated = await res.json();

      setWorkshops((p) => p.map((w) => (w._id === updated._id ? updated : w)));

      setSelectedWorkshop(updated);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Workshop updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update workshop' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/workshops/${id}`, { method: "DELETE" });
      
      if (!res.ok) {
        throw new Error('Failed to delete workshop');
      }

      setWorkshops((p) => p.filter((w) => w._id !== id));
      setIsModalOpen(false);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Workshop deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete workshop' });
    } finally {
      setIsLoading(false);
    }
  };

  const { year, month, daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const upcomingWorkshops = workshops.filter(w => w.status === 'upcoming');
  const pastWorkshops = workshops.filter(w => w.status === 'past');
  const totalRegistrations = workshops.reduce((sum, w) => sum + (w.registrations?.length || 0), 0);

  let filteredWorkshops = filterStatus === 'all'
    ? workshops
    : filterStatus === 'registrations' 
      ? workshops.filter(w => (w.registrations?.length || 0) > 0)
      : filterStatus === 'upcoming' 
        ? upcomingWorkshops 
        : pastWorkshops;

  if (searchQuery) {
    filteredWorkshops = filteredWorkshops.filter(w =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Workshop Management</h1>
          <p className="text-gray-600 mt-1">Manage workshops and registrations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-black">{workshops.length}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <GraduationCap size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-green-600">{upcomingWorkshops.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Past</p>
              <p className="text-2xl font-bold text-gray-600">{pastWorkshops.length}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Registrations</p>
              <p className="text-2xl font-bold text-blue-600">{totalRegistrations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Workshop Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}
        
        <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
          <Plus size={24} />
          Add New Workshop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Title *</label>
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Workshop Title"
              value={newWorkshop.title}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Category *</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              value={newWorkshop.category}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, category: e.target.value as any })}
            >
              <option value="coffee">Coffee</option>
              <option value="painting">Painting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Date *</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              value={newWorkshop.date}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Instructor *</label>
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Instructor Name"
              value={newWorkshop.instructor}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, instructor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Time *</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="HH"
                value={newWorkshop.hour}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, hour: e.target.value })}
              />
              <input
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="MM"
                value={newWorkshop.minute}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, minute: e.target.value })}
              />
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                value={newWorkshop.ampm}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, ampm: e.target.value })}
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Location *</label>
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Workshop Location"
              value={newWorkshop.location}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Capacity</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="0 for unlimited"
              value={newWorkshop.capacity}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, capacity: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-black mb-2">Description *</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
            placeholder="Workshop description"
            rows={4}
            value={newWorkshop.description}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
          />
        </div>

        <button
          onClick={handleAddWorkshop}
          disabled={isLoading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Workshop'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus('past')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'past' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilterStatus('registrations')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'registrations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              With Registrations
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-all"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-black">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <button 
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-all"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={i} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const workshop = getWorkshopForDate(date);

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`h-12 rounded-lg flex items-center justify-center cursor-pointer font-semibold transition-all hover:scale-105 ${
                  workshop 
                    ? "bg-black text-white" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workshops List */}
      {filteredWorkshops.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-black mb-6">
            {filterStatus === 'all' ? 'All Workshops' : 
             filterStatus === 'upcoming' ? 'Upcoming Workshops' : 
             filterStatus === 'past' ? 'Past Workshops' : 
             'Workshops with Registrations'}
          </h2>
          
          <div className="space-y-4">
            {filteredWorkshops.map((ws) => (
              <button
                key={ws._id}
                onClick={() => {
                  setSelectedWorkshop(ws);
                  setEditWorkshop({ ...ws });
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
                className="w-full p-4 rounded-lg transition-all hover:bg-gray-50 text-left border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black mb-2">{ws.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {ws.date} at {ws.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {ws.location} | 👤 {ws.instructor}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                    {ws.registrations?.length || 0}
                    {ws.capacity > 0 && `/${ws.capacity}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedWorkshop && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => {
            setIsModalOpen(false);
            setIsEditing(false);
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-black">Workshop Details</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black hover:bg-red-50 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            {isEditing ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Title</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    value={editWorkshop?.title || ""}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Time</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    value={editWorkshop?.time || ""}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Location</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    value={editWorkshop?.location || ""}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Instructor</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    value={editWorkshop?.instructor || ""}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, instructor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Capacity</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    value={editWorkshop?.capacity || 0}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, capacity: Number(e.target.value) })}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                    rows={4}
                    value={editWorkshop?.description || ""}
                    onChange={(e) => setEditWorkshop((p) => p && { ...p, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleUpdateWorkshop}
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-black mb-4">{selectedWorkshop.title}</h3>
                <p className="text-gray-600 mb-6">{selectedWorkshop.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock size={18} className="text-gray-600" />
                    <span className="text-black">{selectedWorkshop.time}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-gray-600" />
                    <span className="text-black">{selectedWorkshop.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={18} className="text-gray-600" />
                    <span className="text-black">{selectedWorkshop.instructor}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User size={18} className="text-blue-600" />
                    <span className="font-bold text-black">
                      Registrations: {selectedWorkshop.registrations?.length || 0}
                      {selectedWorkshop.capacity > 0 && ` / ${selectedWorkshop.capacity}`}
                      {selectedWorkshop.capacity > 0 && 
                       selectedWorkshop.registrations?.length >= selectedWorkshop.capacity && (
                        <span className="ml-2 text-red-600">(FULL)</span>
                      )}
                    </span>
                  </div>
                </div>

                {selectedWorkshop.registrations && selectedWorkshop.registrations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold mb-3 text-lg text-black">Registered Participants:</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedWorkshop.registrations.map((reg, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="font-semibold text-black mb-1">{reg.name}</p>
                          <p className="text-sm text-gray-600 mb-1">{reg.email}</p>
                          <p className="text-xs text-gray-500">
                            Registered: {new Date(reg.registeredAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDeleteWorkshop(selectedWorkshop._id)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
