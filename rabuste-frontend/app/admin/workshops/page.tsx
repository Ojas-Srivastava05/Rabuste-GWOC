"use client";

import RotatingText from "../../../components/RotatingText";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Coffee,
  Palette,
  Clock,
  User,
  MapPin,
  X,
  Sparkles,
} from "lucide-react";

// types

// Formats a date as YYYY-MM-DD (local time)
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
  status: "upcoming" | "past";
};

type NextWorkshop = Workshop & {
  daysLeft: number;
};

// page

export default function App() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // data

  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch("/api/workshops");
        if (!res.ok) throw new Error("Failed to fetch workshops");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        console.log("Fetched workshops:", data);

        // setWorkshops(data);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const processed = data.map((w: Workshop) => {
          const workshopDate = new Date(w.date);
          workshopDate.setHours(0, 0, 0, 0);

          return {
            ...w,
            status: workshopDate < today ? "past" : "upcoming",
          };
        });

        setWorkshops(processed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkshops();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);

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

  // helpers

  const getUpcomingWorkshopsWithinMonth = (): NextWorkshop[] => {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    return workshops
      .filter((w) => {
        const workshopDate = new Date(w.date);
        return (
          w.status === "upcoming" &&
          workshopDate > now &&
          workshopDate <= oneMonthFromNow
        );
      })

      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((workshop) => {
        const daysLeft = Math.ceil(
          (new Date(workshop.date).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return { ...workshop, daysLeft };
      });
  };

  const getNextWorkshop = (): NextWorkshop | null => {
    const now = new Date();

    const upcoming = workshops
      .filter((w) => w.status === "upcoming" && new Date(w.date) > now)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

    if (!upcoming) return null;

    const daysLeft = Math.ceil(
      (new Date(upcoming.date).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return { ...upcoming, daysLeft };
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      year,
      month,
    };
  };

  const getWorkshopForDate = (date: Date): Workshop | undefined => {
    const dateStr = formatDate(date);
    return workshops.find((w) => w.date === dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const workshop = getWorkshopForDate(date);

    if (workshop) {
      setSelectedWorkshop(workshop);
      //   setEditWorkshop({ ...workshop });
      setEditWorkshop(workshop);
      setIsEditing(false);
      setIsModalOpen(true);
    }
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const formatInputDate = (dateStr: string) => formatDate(new Date(dateStr));

  const handleAddWorkshop = async () => {
    if (!newWorkshop.title || !newWorkshop.date) {
      alert("Title and date are required");
      return;
    }

    const res = await fetch("/api/workshops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newWorkshop,
        time: `${newWorkshop.hour}:${newWorkshop.minute || "00"} ${
          newWorkshop.ampm
        }`,

        status: "upcoming",
      }),
    });

    if (!res.ok) {
      alert("Failed to add workshop");
      return;
    }

    const saved = await res.json();

    setWorkshops((prev) => [...prev, saved]);

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

  const handleUpdateWorkshop = async (workshopId: string, updatedData: any) => {
    console.log(
      "handleUpdateWorkshop called with workshopId:",
      workshopId,
      "updatedData:",
      updatedData
    );
    const res = await fetch(`/api/workshops/${workshopId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Update failed");

    // Update the workshops state with the new data
    setWorkshops((prev) => prev.map((w) => (w._id === workshopId ? data : w)));
    setSelectedWorkshop(data);
    setIsEditing(false);
  };

  const handleDeleteWorkshop = async (workshopId: string) => {
    try {
      console.log("Deleting workshop ID:", workshopId);

      const res = await fetch(`/api/workshops/${workshopId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        // Try to read error safely
        const errorText = await res.text();
        throw new Error(errorText || "Delete failed");
      }

      // ✅ Update UI immediately
      setWorkshops((prev) => prev.filter((w) => w._id !== workshopId));
      setIsModalOpen(false);
      setSelectedWorkshop(null);
      setEditWorkshop(null);
    } catch (err: any) {
      console.error("Error deleting workshop:", err.message);
      alert(err.message);
    }
  };

  //   calender

  const upcomingWorkshopsWithinMonth = getUpcomingWorkshopsWithinMonth();
  const nextWorkshop = getNextWorkshop();
  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const rotatingWorkshopTexts = upcomingWorkshopsWithinMonth.map(
    (workshop) =>
      `${workshop.category === "coffee" ? "☕" : "🎨"} ${workshop.daysLeft} ${
        workshop.daysLeft === 1 ? "day" : "days"
      } left for ${workshop.title}`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2419] to-[#1a0f0a] px-2 sm:px-0">
      {/* scrolling ticker */}
      {upcomingWorkshopsWithinMonth.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-orange-800 to-amber-950 border-b-8 border-amber-500 shadow-[0_20px_80px_-20px_rgba(251,191,36,0.6)]">
          {/* Glow layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-400/10 to-amber-500/10 blur-2xl"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA4Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

          <div className="relative py-12 md:py-16 px-6 md:px-12">
            {/* Heading */}
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-amber-300 mr-3 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-extrabold text-amber-100 tracking-widest uppercase drop-shadow-lg">
                Upcoming Experiences
              </h2>
              <Sparkles className="w-8 h-8 text-amber-300 ml-3 animate-pulse" />
            </div>

            {/* Rotating text */}
            <div className="flex justify-center items-center">
              <RotatingText
                // texts={rotatingWorkshopTexts}
                texts={
                  rotatingWorkshopTexts.length
                    ? rotatingWorkshopTexts
                    : ["No upcoming workshops"]
                }
                mainClassName="px-2 sm:px-6 md:px-8 py-1 sm:py-3 md:py-4 bg-amber-700/60 text-white text-xs sm:text-lg md:text-2xl font-extrabold rounded-full shadow-lg ring-1 ring-amber-400/30 backdrop-blur-sm whitespace-nowrap overflow-hidden"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={5000}
              />
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Coffee className="w-64 h-64" />
          </div>
          <h1 className="relative text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-extrabold mb-6 bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight text-center px-2">
            The Robusta Assemblée
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="h-1 w-24 bg-linear-to-r from-transparent via-amber-500 to-transparent"></div>
            <Coffee className="w-8 h-8 mx-4 text-amber-400" />
            <div className="h-1 w-24 bg-linear-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
          <p className="relative text-sm sm:text-lg md:text-2xl text-amber-300/90 max-w-3xl mx-auto leading-relaxed font-light italic text-center px-4">
            A curated calendar of intimate workshops and gallery evenings
            <br />
            for connoisseurs who savour art, aroma, and refined conversation.
          </p>
        </div>

        {/* Admin – Add New Workshop */}
        <div className="max-w-5xl mx-auto mb-16 bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-10 border-4 border-amber-200/50">
          <h2 className="text-3xl font-montserrat font-extrabold mb-8 text-amber-900">
            Admin • Add New Workshop
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              value={newWorkshop.title}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, title: e.target.value })
              }
              placeholder="Workshop Title"
              className="p-4 rounded-xl border border-amber-300"
            />

            <select
              value={newWorkshop.category}
              onChange={(e) =>
                setNewWorkshop({
                  ...newWorkshop,
                  category: e.target.value as "coffee" | "painting",
                })
              }
              className="p-4 rounded-xl border border-amber-300"
            >
              <option value="coffee">Coffee</option>
              <option value="painting">Painting</option>
            </select>

            <input
              type="date"
              value={newWorkshop.date}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, date: e.target.value })
              }
              className="p-4 rounded-xl border border-amber-300"
            />

            <div className="flex gap-4">
              <input
                type="number"
                min={1}
                max={12}
                value={newWorkshop.hour}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, hour: e.target.value })
                }
                placeholder="HH"
                className="p-4 rounded-xl border border-amber-300 w-20"
              />
              <span className="flex items-center">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={newWorkshop.minute}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, minute: e.target.value })
                }
                placeholder="MM"
                className="p-4 rounded-xl border border-amber-300 w-20"
              />
              <select
                value={newWorkshop.ampm}
                onChange={(e) =>
                  setNewWorkshop({ ...newWorkshop, ampm: e.target.value })
                }
                className="p-4 rounded-xl border border-amber-300"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <input
              value={newWorkshop.instructor}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, instructor: e.target.value })
              }
              placeholder="Instructor Name"
              className="p-4 rounded-xl border border-amber-300"
            />

            <input
              value={newWorkshop.location}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, location: e.target.value })
              }
              placeholder="Location"
              className="p-4 rounded-xl border border-amber-300"
            />
          </div>

          <textarea
            value={newWorkshop.description}
            onChange={(e) =>
              setNewWorkshop({ ...newWorkshop, description: e.target.value })
            }
            placeholder="Workshop Description"
            className="mt-6 w-full p-4 rounded-xl border border-amber-300"
          />

          <button
            onClick={handleAddWorkshop}
            className="mt-8 px-10 py-4 bg-linear-to-r from-amber-700 to-orange-800 text-white font-bold rounded-2xl hover:scale-105 transition"
          >
            Add Workshop
          </button>
        </div>

        {/* calendar */}
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border-4 border-amber-200/50 backdrop-blur-sm">
          {/* month navigation */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => changeMonth(-1)}
              className="px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-sm sm:text-base md:text-lg"
            >
              ←
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-montserrat font-extrabold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent text-center">
              {monthName}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-sm sm:text-base md:text-lg"
            >
              →
            </button>
          </div>

          {/* calendar grid */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 text-xs sm:text-sm md:text-base">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-montserrat font-bold text-amber-900 pb-6 text-lg sm:text-base md:text-lg"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const workshop = getWorkshopForDate(date);
                const isCoffee = workshop?.category === "coffee";
                const isPainting = workshop?.category === "painting";
                const isPast = workshop?.status === "past";
                const today = isToday(date);

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square min-w-[40px] sm:min-w-[50px] md:min-w-[60px] rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg md:text-xl font-bold
                      ${
                        workshop
                          ? "transform hover:scale-110 hover:shadow-2xl hover:z-10"
                          : "hover:bg-amber-100/50"
                      }
                      ${
                        today && !workshop
                          ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg ring-4 ring-blue-300 today-pulse"
                          : ""
                      }
                      ${
                        today && workshop
                          ? "ring-4 ring-blue-400 today-pulse"
                          : ""
                      }
                      ${
                        isCoffee && !isPast
                          ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-xl coffee-date"
                          : ""
                      }
                      ${
                        isPainting && !isPast
                          ? "bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 text-white shadow-xl painting-date"
                          : ""
                      }
                      ${
                        isPast
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 opacity-60"
                          : ""
                      }
                      ${
                        !workshop && !today
                          ? "bg-white/80 border-2 border-amber-200 text-gray-700"
                          : ""
                      }
                    `}
                  >
                    <span className="relative z-10 drop-shadow-md text-sm sm:text-base md:text-lg">
                      {day}
                    </span>

                    {isCoffee && !isPast && (
                      <Coffee className="absolute w-4 sm:w-6 md:w-10 h-4 sm:h-6 md:h-10 opacity-25 pointer-events-none steam-animation" />
                    )}
                    {isPainting && !isPast && (
                      <Palette className="absolute w-4 sm:w-6 md:w-10 h-4 sm:h-6 md:h-10 opacity-25 pointer-events-none paint-splash" />
                    )}
                    {today && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-10 pt-8 border-t-2 border-amber-300/50">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-400 to-blue-500 shadow-md"></div>
                <span className="font-semibold text-gray-700">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 shadow-md"></div>
                <span className="font-semibold text-gray-700">
                  Coffee Workshop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-pink-400 to-pink-600 shadow-md"></div>
                <span className="font-semibold text-gray-700">
                  Painting Workshop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-gray-300 to-gray-400 shadow-md opacity-60"></div>
                <span className="font-semibold text-gray-700">
                  Past Workshop
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      {isModalOpen && selectedWorkshop && (
        <>
          {(() => {
            const workshopToShow = isEditing ? editWorkshop : selectedWorkshop;

            return (
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl w-full sm:w-[90%] max-w-3xl p-4 sm:p-6 md:p-8 relative modal-content transform shadow-2xl border-4 border-amber-300/50 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-3 hover:bg-amber-200/50 rounded-full transition-all hover:rotate-90 duration-300"
                  >
                    <X className="w-7 h-7 text-amber-900" />
                  </button>

                  <div className="mb-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-amber-200 to-orange-200 mb-6 shadow-lg">
                      {selectedWorkshop.category === "coffee" ? (
                        <Coffee className="w-6 h-6 text-amber-900" />
                      ) : (
                        <Palette className="w-6 h-6 text-amber-900" />
                      )}

                      {isEditing ? (
                        <select
                          value={editWorkshop?.category}
                          onChange={(e) =>
                            setEditWorkshop((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    category: e.target.value as
                                      | "coffee"
                                      | "painting",
                                  }
                                : prev
                            )
                          }
                          className="border rounded-lg p-2"
                        >
                          <option value="coffee">Coffee</option>
                          <option value="painting">Painting</option>
                        </select>
                      ) : (
                        <span className="uppercase font-bold">
                          {workshopToShow?.category}
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <input
                        value={editWorkshop?.title || ""}
                        onChange={(e) =>
                          setEditWorkshop((prev) =>
                            prev ? { ...prev, title: e.target.value } : prev
                          )
                        }
                        className="w-full text-4xl font-bold border-b-2 border-amber-600"
                      />
                    ) : (
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text">
                        {workshopToShow?.title}
                      </h3>
                    )}

                    {selectedWorkshop.status === "past" && (
                      <span className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold shadow-md">
                        Past Workshop
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editWorkshop?.description || ""}
                      onChange={(e) =>
                        setEditWorkshop((prev) =>
                          prev ? { ...prev, description: e.target.value } : prev
                        )
                      }
                      className="w-full text-lg border rounded-xl p-4"
                    />
                  ) : (
                    <p className="text-sm sm:text-base md:text-xl text-gray-800 mb-6 md:mb-8 leading-relaxed break-words">
                      {selectedWorkshop.description}
                    </p>
                  )}

                  <div className="space-y-5 bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-900" />
                      </div>

                      {isEditing ? (
                        <input
                          type="date"
                          value={editWorkshop?.date || ""}
                          onChange={(e) =>
                            setEditWorkshop((prev) =>
                              prev ? { ...prev, date: e.target.value } : prev
                            )
                          }
                          className="border rounded-lg p-2"
                        />
                      ) : (
                        <span className="font-semibold text-lg">
                          {workshopToShow?.date}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-900" />
                      </div>

                      {isEditing ? (
                        <input
                          value={editWorkshop?.time || ""}
                          onChange={(e) =>
                            setEditWorkshop((prev) =>
                              prev ? { ...prev, time: e.target.value } : prev
                            )
                          }
                          placeholder="06:30 PM"
                          className="border rounded-lg p-2"
                        />
                      ) : (
                        <span className="text-lg">{workshopToShow?.time}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-amber-900" />
                      </div>

                      {isEditing ? (
                        <input
                          value={editWorkshop?.instructor || ""}
                          onChange={(e) =>
                            setEditWorkshop((prev) =>
                              prev
                                ? { ...prev, instructor: e.target.value }
                                : prev
                            )
                          }
                          className="border rounded-lg p-2"
                        />
                      ) : (
                        <span className="text-lg">
                          Instructor: {workshopToShow?.instructor}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-amber-900" />
                      </div>

                      {isEditing ? (
                        <input
                          value={editWorkshop?.location || ""}
                          onChange={(e) =>
                            setEditWorkshop((prev) =>
                              prev
                                ? { ...prev, location: e.target.value }
                                : prev
                            )
                          }
                          className="border rounded-lg p-2"
                        />
                      ) : (
                        <span className="text-lg">
                          {workshopToShow?.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end gap-4">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold"
                      >
                        Modify
                      </button>
                    )}

                    {isEditing && (
                      <button
                        onClick={() =>
                          handleUpdateWorkshop(
                            selectedWorkshop._id,
                            editWorkshop
                          )
                        }
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold"
                      >
                        Save
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteWorkshop(selectedWorkshop._id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        @keyframes steam {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) scale(1.1);
            opacity: 0.5;
          }
        }

        .steam-animation {
          animation: steam 3s ease-in-out infinite;
        }

        @keyframes splash {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-5deg) scale(1.05);
          }
          75% {
            transform: rotate(5deg) scale(1.05);
          }
        }

        .paint-splash {
          animation: splash 4s ease-in-out infinite;
        }

        @keyframes todayPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        .today-pulse {
          animation: todayPulse 2s ease-in-out infinite;
        }

        .coffee-date {
          box-shadow: 0 8px 25px rgba(251, 146, 60, 0.5);
        }

        .painting-date {
          box-shadow: 0 8px 25px rgba(236, 72, 153, 0.5);
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          from {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .modal-overlay {
          animation: modalFadeIn 0.3s ease-out;
        }

        .modal-content {
          animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
