"use client";

import React, { useEffect, useState } from "react";
import { Clock, User, MapPin, X, Plus } from "lucide-react";

/* -------------------- Helpers -------------------- */
const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

/* -------------------- Types -------------------- */
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

/* -------------------- Page -------------------- */
export default function WorkshopsAdminPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [newWorkshop, setNewWorkshop] = useState({
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

  /* -------------------- Fetch -------------------- */
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

  /* -------------------- Calendar Helpers -------------------- */
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

  /* -------------------- CRUD -------------------- */
  const handleAddWorkshop = async () => {
    const res = await fetch("/api/workshops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newWorkshop.title,
        category: newWorkshop.category,
        date: newWorkshop.date,
        time: `${newWorkshop.hour}:${newWorkshop.minute || "00"} ${
          newWorkshop.ampm
        }`,
        description: newWorkshop.description,
        instructor: newWorkshop.instructor,
        location: newWorkshop.location,
        capacity: Number(newWorkshop.capacity),
      }),
    });

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
  };

  const handleUpdateWorkshop = async () => {
    if (!editWorkshop) return;

    const res = await fetch(`/api/workshops/${editWorkshop._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editWorkshop),
    });

    const updated = await res.json();

    setWorkshops((p) => p.map((w) => (w._id === updated._id ? updated : w)));

    setSelectedWorkshop(updated);
    setIsEditing(false);
  };

  const handleDeleteWorkshop = async (id: string) => {
    await fetch(`/api/workshops/${id}`, { method: "DELETE" });
    setWorkshops((p) => p.filter((w) => w._id !== id));
    setIsModalOpen(false);
    setIsEditing(false);
  };

  /* -------------------- UI -------------------- */
  const { year, month, daysInMonth, startingDayOfWeek } =
    getDaysInMonth(currentMonth);

  const upcomingWorkshops = workshops.filter(w => w.status === 'upcoming');
  const pastWorkshops = workshops.filter(w => w.status === 'past');
  const totalRegistrations = workshops.reduce((sum, w) => sum + (w.registrations?.length || 0), 0);

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)',
        color: '#F5F1E8',
      }}
    >
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <div className="copper-line" />
          <span className="section-label text-sm sm:text-base">ADMIN PANEL</span>
          <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
          style={{
            fontFamily: 'var(--font-heading)',
            lineHeight: 0.9,
          }}
        >
          WORKSHOP <span className="gradient-text">MANAGEMENT</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-[#B87333]" />
            <span className="section-label text-xs">TOTAL</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {workshops.length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-[#5E7D4C]" />
            <span className="section-label text-xs">UPCOMING</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}>
            {upcomingWorkshops.length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-[#8B6F47]" />
            <span className="section-label text-xs">PAST</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#8B6F47' }}>
            {pastWorkshops.length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-[#D4A574]" />
            <span className="section-label text-xs">REGISTRATIONS</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#D4A574' }}>
            {totalRegistrations}
          </p>
        </div>
      </div>

      {/* Add Workshop */}
      <div className="brutal-card p-6 sm:p-8 mb-8 sm:mb-12">
        <h2 
          className="text-2xl sm:text-3xl mb-6 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <Plus size={28} className="text-[#B87333]" />
          ADD NEW WORKSHOP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Title *
            </label>
            <input
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
              placeholder="Workshop Title"
              value={newWorkshop.title}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Category *
            </label>
            <select
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] cursor-pointer"
              value={newWorkshop.category}
              onChange={(e) =>
                setNewWorkshop({
                  ...newWorkshop,
                  category: e.target.value as any,
                })
              }
            >
              <option value="coffee" className="bg-[#1A1110]">Coffee</option>
              <option value="painting" className="bg-[#1A1110]">Painting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Date *
            </label>
            <input
              type="date"
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
              value={newWorkshop.date}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Instructor *
            </label>
            <input
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
              placeholder="Instructor Name"
              value={newWorkshop.instructor}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, instructor: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Time *
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
                placeholder="HH"
                value={newWorkshop.hour}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, hour: e.target.value })
                }
              />
              <input
                className="flex-1 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
                placeholder="MM"
                value={newWorkshop.minute}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, minute: e.target.value })
                }
              />
              <select
                className="bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] cursor-pointer"
                value={newWorkshop.ampm}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, ampm: e.target.value })
                }
              >
                <option className="bg-[#1A1110]">AM</option>
                <option className="bg-[#1A1110]">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Location *
            </label>
            <input
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
              placeholder="Workshop Location"
              value={newWorkshop.location}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, location: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
              Capacity
            </label>
            <input
              type="number"
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
              placeholder="0 for unlimited"
              value={newWorkshop.capacity}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, capacity: Number(e.target.value) })
              }
              min="0"
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
            Description *
          </label>
          <textarea
            className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47] resize-none"
            placeholder="Workshop description"
            rows={4}
            value={newWorkshop.description}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, description: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddWorkshop}
          className="mt-6 btn btn-primary w-full sm:w-auto"
        >
          <Plus size={20} />
          ADD WORKSHOP
        </button>
      </div>

      {/* Calendar */}
      <div className="brutal-card p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(184, 115, 51, 0.2)',
              border: '2px solid rgba(184, 115, 51, 0.4)',
              color: '#D4A574',
            }}
          >
            ←
          </button>
          <h2 
            className="text-xl sm:text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#F5F1E8',
            }}
          >
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button 
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(184, 115, 51, 0.2)',
              border: '2px solid rgba(184, 115, 51, 0.4)',
              color: '#D4A574',
            }}
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold uppercase py-2" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
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
                className={`h-12 sm:h-14 rounded-lg flex items-center justify-center cursor-pointer font-semibold transition-all hover:scale-105
                ${
                  workshop 
                    ? "text-white" 
                    : "text-[#8B6F47]"
                }`}
                style={{
                  background: workshop
                    ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(184, 115, 51, 0.2))'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: workshop
                    ? '2px solid rgba(184, 115, 51, 0.6)'
                    : '2px solid rgba(184, 115, 51, 0.2)',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedWorkshop && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div 
            className="brutal-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
            }}
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditing(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
              }}
            >
              <X size={20} />
            </button>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Title
                  </label>
                  <input
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
                    value={editWorkshop?.title || ""}
                    onChange={(e) =>
                      setEditWorkshop((p) => p && { ...p, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Time
                  </label>
                  <input
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
                    value={editWorkshop?.time || ""}
                    onChange={(e) =>
                      setEditWorkshop((p) => p && { ...p, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Location
                  </label>
                  <input
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
                    value={editWorkshop?.location || ""}
                    onChange={(e) =>
                      setEditWorkshop(
                        (p) => p && { ...p, location: e.target.value }
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Instructor
                  </label>
                  <input
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
                    value={editWorkshop?.instructor || ""}
                    onChange={(e) =>
                      setEditWorkshop(
                        (p) => p && { ...p, instructor: e.target.value }
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
                    placeholder="Capacity"
                    value={editWorkshop?.capacity || 0}
                    onChange={(e) =>
                      setEditWorkshop(
                        (p) => p && { ...p, capacity: Number(e.target.value) }
                      )
                    }
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] resize-none"
                    rows={4}
                    value={editWorkshop?.description || ""}
                    onChange={(e) =>
                      setEditWorkshop(
                        (p) => p && { ...p, description: e.target.value }
                      )
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleUpdateWorkshop}
                    className="btn btn-primary flex-1"
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                  }}
                >
                  {selectedWorkshop.title}
                </h3>
                <p className="mb-6" style={{ color: '#D4A574' }}>{selectedWorkshop.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.1)' }}>
                    <Clock size={18} style={{ color: '#B87333' }} />
                    <span style={{ color: '#F5F1E8' }}>{selectedWorkshop.time}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.1)' }}>
                    <MapPin size={18} style={{ color: '#B87333' }} />
                    <span style={{ color: '#F5F1E8' }}>{selectedWorkshop.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.1)' }}>
                    <User size={18} style={{ color: '#B87333' }} />
                    <span style={{ color: '#F5F1E8' }}>{selectedWorkshop.instructor}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(94, 125, 76, 0.1)' }}>
                    <User size={18} style={{ color: '#5E7D4C' }} />
                    <span className="font-bold" style={{ color: '#F5F1E8' }}>
                      Registrations: {selectedWorkshop.registrations?.length || 0}
                      {selectedWorkshop.capacity > 0 && ` / ${selectedWorkshop.capacity}`}
                      {selectedWorkshop.capacity > 0 && 
                       selectedWorkshop.registrations?.length >= selectedWorkshop.capacity && (
                        <span className="ml-2" style={{ color: '#EF4444' }}>(FULL)</span>
                      )}
                    </span>
                  </div>
                </div>

                {selectedWorkshop.registrations && selectedWorkshop.registrations.length > 0 && (
                  <div className="mt-6">
                    <h4 
                      className="font-bold mb-3 text-lg"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#B87333',
                      }}
                    >
                      Registered Participants:
                    </h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedWorkshop.registrations.map((reg, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg"
                          style={{
                            background: 'rgba(184, 115, 51, 0.1)',
                            border: '1px solid rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <p className="font-semibold mb-1" style={{ color: '#F5F1E8' }}>{reg.name}</p>
                          <p className="text-sm mb-1" style={{ color: '#D4A574' }}>{reg.email}</p>
                          <p className="text-xs" style={{ color: '#8B6F47' }}>
                            Registered: {new Date(reg.registeredAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary flex-1"
                  >
                    MODIFY
                  </button>
                  <button
                    onClick={() => handleDeleteWorkshop(selectedWorkshop._id)}
                    className="btn"
                    style={{
                      background: 'rgba(220, 38, 38, 0.2)',
                      border: '2px solid rgba(220, 38, 38, 0.5)',
                      color: '#FCA5A5',
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
