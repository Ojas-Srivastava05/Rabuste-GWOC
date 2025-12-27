"use client";

import React, { useEffect, useState } from "react";
import { Clock, User, MapPin, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#f8f5f2] p-8 text-[#2e211a]">
      <h1 className="text-4xl font-bold mb-10">Admin • Workshops</h1>

      {/* Add Workshop */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
        <h2 className="text-2xl font-semibold mb-6">Add New Workshop</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Title"
            value={newWorkshop.title}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, title: e.target.value })
            }
          />

          <select
            className="input"
            value={newWorkshop.category}
            onChange={(e) =>
              setNewWorkshop({
                ...newWorkshop,
                category: e.target.value as any,
              })
            }
          >
            <option value="coffee">Coffee</option>
            <option value="painting">Painting</option>
          </select>

          <input
            type="date"
            className="input"
            value={newWorkshop.date}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, date: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Instructor"
            value={newWorkshop.instructor}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, instructor: e.target.value })
            }
          />

          <div className="flex gap-2">
            <input
              className="input"
              placeholder="HH"
              value={newWorkshop.hour}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, hour: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="MM"
              value={newWorkshop.minute}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, minute: e.target.value })
              }
            />
            <select
              className="input"
              value={newWorkshop.ampm}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, ampm: e.target.value })
              }
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          <input
            className="input"
            placeholder="Location"
            value={newWorkshop.location}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, location: e.target.value })
            }
          />
        </div>

        <textarea
          className="input mt-4"
          placeholder="Description"
          value={newWorkshop.description}
          onChange={(e) =>
            setNewWorkshop({ ...newWorkshop, description: e.target.value })
          }
        />

        <button
          onClick={handleAddWorkshop}
          className="mt-6 bg-[#c68642] text-white px-8 py-3 rounded-xl font-semibold"
        >
          Add Workshop
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between mb-6">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
            ←
          </button>
          <h2 className="text-2xl font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3">
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
                className={`h-14 rounded-xl flex items-center justify-center cursor-pointer font-semibold
                ${
                  workshop ? "bg-[#3a2618] text-white" : "bg-[#f8f5f2] border"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedWorkshop && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditing(false);
              }}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            {isEditing ? (
              <>
                <input
                  className="input mb-3"
                  value={editWorkshop?.title || ""}
                  onChange={(e) =>
                    setEditWorkshop((p) => p && { ...p, title: e.target.value })
                  }
                />
                <input
                  className="input mb-3"
                  value={editWorkshop?.time || ""}
                  onChange={(e) =>
                    setEditWorkshop((p) => p && { ...p, time: e.target.value })
                  }
                />
                <input
                  className="input mb-3"
                  value={editWorkshop?.location || ""}
                  onChange={(e) =>
                    setEditWorkshop(
                      (p) => p && { ...p, location: e.target.value }
                    )
                  }
                />
                <input
                  className="input mb-3"
                  value={editWorkshop?.instructor || ""}
                  onChange={(e) =>
                    setEditWorkshop(
                      (p) => p && { ...p, instructor: e.target.value }
                    )
                  }
                />
                <textarea
                  className="input mb-3"
                  value={editWorkshop?.description || ""}
                  onChange={(e) =>
                    setEditWorkshop(
                      (p) => p && { ...p, description: e.target.value }
                    )
                  }
                />

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateWorkshop}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold">{selectedWorkshop.title}</h3>
                <p className="mt-4">{selectedWorkshop.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex gap-2 items-center">
                    <Clock size={16} /> {selectedWorkshop.time}
                  </p>
                  <p className="flex gap-2 items-center">
                    <MapPin size={16} /> {selectedWorkshop.location}
                  </p>
                  <p className="flex gap-2 items-center">
                    <User size={16} /> {selectedWorkshop.instructor}
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#c68642] text-white px-4 py-2 rounded-lg"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDeleteWorkshop(selectedWorkshop._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(74, 51, 37, 0.25);
        }
      `}</style>
    </div>
  );
}
