"use client";

import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Coffee,
  Palette,
  Clock,
  User,
  MapPin,
  X,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  List,
} from "lucide-react";
import Footer from "@/components/sections/footer";
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
  price?: number;
  registrations: Array<{ name: string; email: string; registeredAt: Date }>;
  status: "upcoming" | "past";
};

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationForm, setRegistrationForm] = useState({ name: "", email: "" });
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch("/api/workshops");
        if (!res.ok) throw new Error("Failed to fetch workshops");
        const data = await res.json();
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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCalendar = (workshop: Workshop) => {
    // Format date and time for Google Calendar
    const workshopDate = new Date(workshop.date);
    const [hours, minutes] = workshop.time.split(':').map(num => parseInt(num));
    
    // Set start time
    const startTime = new Date(workshopDate);
    startTime.setHours(hours, minutes, 0);
    
    // Set end time (assuming 2 hour duration)
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 2);
    
    // Format dates for Google Calendar (YYYYMMDDTHHmmss)
    const formatGoogleDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hour}${minute}${second}`;
    };
    
    const startDateFormatted = formatGoogleDate(startTime);
    const endDateFormatted = formatGoogleDate(endTime);
    
    // Build Google Calendar URL
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', workshop.title);
    googleCalendarUrl.searchParams.append('dates', `${startDateFormatted}/${endDateFormatted}`);
    googleCalendarUrl.searchParams.append('details', `${workshop.description}\n\nInstructor: ${workshop.instructor}`);
    googleCalendarUrl.searchParams.append('location', workshop.location);
    
    
    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const handleRegister = async () => {
    if (!selectedWorkshop || !registrationForm.name || !registrationForm.email) {
      setRegistrationMessage("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`/api/workshops/${selectedWorkshop._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegistrationMessage(data.error || "Registration failed");
        return;
      }

      // Show success popup
      setShowSuccessPopup(true);
      setRegistrationForm({ name: "", email: "" });
      setIsRegistering(false);
      setIsModalOpen(false);

      const workshopsRes = await fetch("/api/workshops");
      const workshopsData = await workshopsRes.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processed = workshopsData.map((w: Workshop) => {
        const workshopDate = new Date(w.date);
        workshopDate.setHours(0, 0, 0, 0);
        return {
          ...w,
          status: workshopDate < today ? "past" : "upcoming",
        };
      });

      setWorkshops(processed);
      const updatedWorkshop = processed.find((w: Workshop) => w._id === selectedWorkshop._id);
      if (updatedWorkshop) setSelectedWorkshop(updatedWorkshop);

      // Auto-close success popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setRegistrationMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setRegistrationMessage("An error occurred. Please try again.");
    }
  };

  const isWorkshopFull = (workshop: Workshop) => {
    return workshop.capacity > 0 && workshop.registrations?.length >= workshop.capacity;
  };

  // Filter workshops
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || workshop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get workshops for selected date
  const workshopsOnSelectedDate = filteredWorkshops.filter((workshop) => {
    const workshopDate = new Date(workshop.date);
    return (
      workshopDate.getDate() === selectedDate.getDate() &&
      workshopDate.getMonth() === selectedDate.getMonth() &&
      workshopDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const hasWorkshopOnDate = (day: number) => {
    return workshops.some((workshop) => {
      const workshopDate = new Date(workshop.date);
      return (
        workshopDate.getDate() === day &&
        workshopDate.getMonth() === currentMonth.getMonth() &&
        workshopDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const isSelectedDate = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen" style={{ paddingTop: '140px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                LEARN & CREATE
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#FFFEF9',
                letterSpacing: '0.05em',
              }}
            >
              WORKSHOPS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl"
              style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}
            >
              Discover hands-on experiences in coffee and art
            </motion.p>
          </div>

          {/* View Toggle & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 rounded-xl"
            style={{
              background: 'rgba(61, 43, 31, 0.4)',
              border: '2px solid rgba(184, 115, 51, 0.3)',
            }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* View Toggle */}
              <div className="flex gap-2 p-1 rounded-lg" style={{ background: 'rgba(26, 17, 16, 0.6)' }}>
                <button
                  onClick={() => setViewMode("calendar")}
                  className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                  style={{
                    background: viewMode === "calendar" ? 'linear-gradient(135deg, #B87333, #CD7F32)' : 'transparent',
                    color: viewMode === "calendar" ? '#000' : '#B87333',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  <CalendarCheck size={18} />
                  CALENDAR VIEW
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                  style={{
                    background: viewMode === "list" ? 'linear-gradient(135deg, #B87333, #CD7F32)' : 'transparent',
                    color: viewMode === "list" ? '#000' : '#B87333',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  <List size={18} />
                  LIST VIEW
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:min-w-[300px]">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#B87333' }} />
                  <input
                    type="text"
                    placeholder="Search events, cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
                    style={{
                      background: 'rgba(26, 17, 16, 0.8)',
                      border: '2px solid rgba(184, 115, 51, 0.3)',
                      color: '#F5F1E8',
                    }}
                  />
                </div>
                
                <div className="flex gap-2">
                  <button className="p-3 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(26, 17, 16, 0.8)', border: '2px solid rgba(184, 115, 51, 0.3)', color: '#B87333' }}>
                    <Filter size={18} />
                  </button>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg outline-none cursor-pointer"
                    style={{
                      background: 'rgba(26, 17, 16, 0.8)',
                      border: '2px solid rgba(184, 115, 51, 0.3)',
                      color: '#F5F1E8',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="coffee">Coffee</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar Section - Left Half */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl lg:sticky lg:top-32"
                style={{
                  background: 'rgba(61, 43, 31, 0.6)',
                  border: '2px solid rgba(184, 115, 51, 0.4)',
                  ...(isDesktop
                    ? { height: 'fit-content', maxHeight: 'calc(100vh - 180px)' }
                    : { height: 'auto', maxHeight: 'none' }),
                }}
              >
                <div className="mb-4">
                  <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#D4A574', letterSpacing: '0.1em' }}>
                    SELECT DATE
                  </h3>
                  <div className="h-px bg-gradient-to-r from-[#B87333] to-transparent" />
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-[#B87333]/20 rounded-lg transition-all"
                    style={{ color: '#B87333' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <h4 className="text-sm md:text-base" style={{ fontFamily: 'var(--font-heading)', color: '#FFFEF9', letterSpacing: '0.1em' }}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h4>
                  
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-[#B87333]/20 rounded-lg transition-all"
                    style={{ color: '#B87333' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] py-1"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
                    >
                      {day.slice(0, 1)}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} />;
                    }

                    const hasWorkshop = hasWorkshopOnDate(day);
                    const isSelected = isSelectedDate(day);
                    const isToday = day === new Date().getDate() && 
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear();

                    return (
                      <motion.button
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateClick(day)}
                        className="aspect-square flex items-center justify-center rounded-md relative transition-all text-sm"
                        style={{
                          background: isSelected 
                            ? 'linear-gradient(135deg, #B87333, #CD7F32)'
                            : hasWorkshop 
                            ? 'rgba(184, 115, 51, 0.2)' 
                            : 'transparent',
                          border: isSelected 
                            ? '2px solid #D4A574'
                            : isToday
                            ? '2px solid rgba(184, 115, 51, 0.6)'
                            : '1px solid rgba(184, 115, 51, 0.1)',
                          color: isSelected ? '#000' : '#F5F1E8',
                          fontFamily: 'var(--font-heading)',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        {day}
                        {hasWorkshop && !isSelected && (
                          <div 
                            className="absolute bottom-0.5 w-1 h-1 rounded-full"
                            style={{ background: '#B87333' }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-8 pt-5 border-t border-[#B87333]/20 space-y-3">
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8B6F47' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(184, 115, 51, 0.2)' }} />
                    <span>Has workshops</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8B6F47' }}>
                    <div className="w-3 h-3 rounded-full" style={{ border: '2px solid rgba(184, 115, 51, 0.6)' }} />
                    <span>Today</span>
                  </div>
                </div>
              </motion.div>

              {/* Events Section - Right Half */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#B87333 transparent',
                }}
              >
                <div className="mb-6 sticky top-0 z-10 pb-4" style={{ background: 'linear-gradient(180deg, #1A1110 90%, transparent)' }}>
                  <h3 className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-heading)', color: '#D4A574', letterSpacing: '0.1em' }}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#8B6F47' }}>
                    {workshopsOnSelectedDate.length} {workshopsOnSelectedDate.length === 1 ? 'workshop' : 'workshops'} scheduled
                  </p>
                </div>

                {workshopsOnSelectedDate.length === 0 ? (
                  <div 
                    className="p-12 rounded-xl text-center"
                    style={{
                      background: 'rgba(61, 43, 31, 0.4)',
                      border: '2px dashed rgba(184, 115, 51, 0.3)',
                    }}
                  >
                    <Calendar size={48} className="mx-auto mb-4" style={{ color: '#8B6F47' }} />
                    <p className="text-lg mb-2" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                      No workshops scheduled
                    </p>
                    <p className="text-sm" style={{ color: '#8B6F47' }}>
                      Select another date to view available workshops
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workshopsOnSelectedDate.map((workshop) => {
                      const isFull = isWorkshopFull(workshop);
                      const isPast = workshop.status === "past";

                      return (
                        <motion.div
                          key={workshop._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 rounded-xl cursor-pointer transition-all hover:border-[#D4A574]"
                          onClick={() => {
                            if (!isPast) {
                              setSelectedWorkshop(workshop);
                              setIsModalOpen(true);
                            }
                          }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                            border: '2px solid rgba(184, 115, 51, 0.5)',
                            opacity: isPast ? 0.6 : 1,
                          }}
                        >
                          {/* Category Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <div 
                              className="px-3 py-1.5 rounded-full flex items-center gap-2"
                              style={{ background: 'rgba(184, 115, 51, 0.3)' }}
                            >
                              {workshop.category === "coffee" ? <Coffee size={14} /> : <Palette size={14} />}
                              <span className="text-xs uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
                                {workshop.category}
                              </span>
                            </div>
                            {isFull && (
                              <div 
                                className="px-3 py-1.5 rounded-full"
                                style={{ background: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}
                              >
                                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                                  FULL
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 
                            className="text-xl md:text-2xl mb-2"
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: '#FFFEF9',
                              lineHeight: 1.1,
                              letterSpacing: '0.05em',
                            }}
                          >
                            {workshop.title}
                          </h4>

                          <p 
                            className="mb-4 text-sm leading-relaxed line-clamp-2"
                            style={{ color: 'rgba(255, 254, 249, 0.7)' }}
                          >
                            {workshop.description}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar size={14} style={{ color: '#B87333' }} />
                                <span className="text-xs uppercase" style={{ color: '#8B6F47' }}>Date</span>
                              </div>
                              <p className="text-sm" style={{ color: '#FFFEF9' }}>
                                {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} style={{ color: '#B87333' }} />
                                <span className="text-xs uppercase" style={{ color: '#8B6F47' }}>Time</span>
                              </div>
                              <p className="text-sm" style={{ color: '#FFFEF9' }}>{workshop.time}</p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin size={14} style={{ color: '#B87333' }} />
                                <span className="text-xs uppercase" style={{ color: '#8B6F47' }}>Location</span>
                              </div>
                              <p className="text-sm" style={{ color: '#FFFEF9' }}>{workshop.location}</p>
                            </div>

                            {workshop.price && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs uppercase" style={{ color: '#8B6F47' }}>Price</span>
                                </div>
                                <p className="text-sm font-bold" style={{ color: '#D4A574' }}>₹{workshop.price}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-6">
                            <User size={14} style={{ color: '#B87333' }} />
                            <span className="text-sm" style={{ color: '#FFFEF9' }}>
                              <span style={{ color: '#8B6F47' }}>Instructor:</span> {workshop.instructor}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAddToCalendar(workshop)}
                              className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                              style={{
                                background: 'rgba(26, 17, 16, 0.8)',
                                border: '2px solid rgba(184, 115, 51, 0.4)',
                                color: '#B87333',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.75rem',
                                letterSpacing: '0.1em',
                              }}
                            >
                              <CalendarCheck size={18} />
                              ADD TO CALENDAR
                            </button>
                            
                            {!isPast && (
                              <button
                                disabled={isFull}
                                className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                                style={{
                                  background: isFull ? 'rgba(139, 111, 71, 0.3)' : 'linear-gradient(135deg, #B87333, #CD7F32)',
                                  border: `2px solid ${isFull ? 'rgba(139, 111, 71, 0.5)' : 'rgba(184, 115, 51, 0.6)'}`,
                                  color: isFull ? '#8B6F47' : '#000',
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '0.75rem',
                                  letterSpacing: '0.1em',
                                  cursor: isFull ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {isFull ? 'FULLY BOOKED' : 'BOOK NOW'}
                                {!isFull && <ArrowRight size={18} />}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredWorkshops.map((workshop, index) => {
                const isFull = isWorkshopFull(workshop);
                const isPast = workshop.status === "past";

                return (
                  <motion.div
                    key={workshop._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl"
                    onClick={() => {
                      if (!isPast) {
                        setSelectedWorkshop(workshop);
                        setIsModalOpen(true);
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                      border: '2px solid rgba(184, 115, 51, 0.5)',
                      opacity: isPast ? 0.6 : 1,
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          workshop.category === 'coffee'
                            ? 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg'
                            : 'https://images.pexels.com/photos/1445457/pexels-photo-1445457.jpeg'
                        }
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                        style={{ filter: isPast ? 'grayscale(80%)' : 'none' }}
                      />
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(180deg, transparent 0%, rgba(26, 17, 16, 0.8) 100%)',
                        }}
                      />
                      
                      {/* Badge */}
                      <div 
                        className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-2"
                        style={{ background: 'rgba(184, 115, 51, 0.9)' }}
                      >
                        {workshop.category === 'coffee' ? <Coffee size={14} /> : <Palette size={14} />}
                        <span className="text-xs uppercase" style={{ color: '#000', fontFamily: 'var(--font-heading)' }}>
                          {workshop.category}
                        </span>
                      </div>
                      
                      {/* Date */}
                      <div 
                        className="absolute top-4 right-4 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(0, 0, 0, 0.9)' }}
                      >
                        <p className="text-lg leading-none" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
                          {new Date(workshop.date).getDate()}
                        </p>
                        <p className="text-xs" style={{ color: '#B87333' }}>
                          {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h4 
                        className="text-xl md:text-2xl mb-2"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#FFFEF9',
                          lineHeight: 1.1,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {workshop.title}
                      </h4>

                      <p 
                        className="mb-4 text-sm line-clamp-2"
                        style={{ color: 'rgba(255, 254, 249, 0.7)' }}
                      >
                        {workshop.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} style={{ color: '#B87333' }} />
                          <span style={{ color: '#FFFEF9' }}>{workshop.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} style={{ color: '#B87333' }} />
                          <span style={{ color: '#FFFEF9' }}>{workshop.instructor}</span>
                        </div>
                        {workshop.capacity > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span style={{ color: isFull ? '#ff6b6b' : '#FFFEF9' }}>
                              {workshop.registrations?.length || 0} / {workshop.capacity} seats
                              {isFull && ' (FULL)'}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isPast && (
                        <div 
                          className="flex items-center gap-2 text-sm"
                          style={{
                            color: '#B87333',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.1em',
                          }}
                        >
                          VIEW DETAILS
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Registration Modal */}
        {isModalOpen && selectedWorkshop && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl p-10 relative max-h-[90vh] overflow-y-auto rounded-xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
                border: '3px solid rgba(184, 115, 51, 0.6)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-all"
                style={{ color: '#B87333' }}
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-lg"
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                      color: '#B87333',
                    }}
                  >
                    {selectedWorkshop.category === "coffee" ? <Coffee size={28} /> : <Palette size={28} />}
                  </div>
                  <span
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{
                      color: '#B87333',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {selectedWorkshop.category} WORKSHOP
                  </span>
                </div>

                <h3
                  className="text-3xl md:text-4xl mb-6"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                  }}
                >
                  {selectedWorkshop.title}
                </h3>
              </div>

              <p
                className="text-base md:text-lg mb-10"
                style={{ color: '#B87333', lineHeight: 1.8 }}
              >
                {selectedWorkshop.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Calendar size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                    >
                      DATE
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {new Date(selectedWorkshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Clock size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                    >
                      TIME
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.time}
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <User size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                    >
                      INSTRUCTOR
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.instructor}
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <MapPin size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                    >
                      LOCATION
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.location}
                  </p>
                </div>
              </div>

              {/* Registration Section */}
              {selectedWorkshop.status === "upcoming" && (
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  {isWorkshopFull(selectedWorkshop) ? (
                    <div className="text-center">
                      <p
                        className="text-lg mb-2"
                        style={{ color: '#ff6b6b', fontFamily: 'var(--font-heading)' }}
                      >
                        WORKSHOP IS FULL
                      </p>
                      <p style={{ color: '#8B6F47' }}>
                        All seats have been taken. Please check other workshops.
                      </p>
                    </div>
                  ) : (
                    <>
                      {!isRegistering ? (
                        <button
                          onClick={() => setIsRegistering(true)}
                          className="w-full py-4 text-lg uppercase tracking-wider transition-all hover:scale-105 rounded-lg"
                          style={{
                            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                            border: '2px solid rgba(184, 115, 51, 0.4)',
                            color: '#000',
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          REGISTER FOR THIS WORKSHOP
                        </button>
                      ) : (
                        <div>
                          <h4
                            className="text-lg mb-4"
                            style={{
                              color: '#FFFEF9',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            REGISTER NOW
                          </h4>
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={registrationForm.name}
                              onChange={(e) =>
                                setRegistrationForm({ ...registrationForm, name: e.target.value })
                              }
                              className="w-full p-3 bg-transparent rounded-lg text-[#FFFEF9] placeholder-[#8B6F47] outline-none"
                              style={{ border: '2px solid rgba(184, 115, 51, 0.4)' }}
                            />
                            <input
                              type="email"
                              placeholder="Your Email"
                              value={registrationForm.email}
                              onChange={(e) =>
                                setRegistrationForm({ ...registrationForm, email: e.target.value })
                              }
                              className="w-full p-3 bg-transparent rounded-lg text-[#FFFEF9] placeholder-[#8B6F47] outline-none"
                              style={{ border: '2px solid rgba(184, 115, 51, 0.4)' }}
                            />
                            {registrationMessage && (
                              <p
                                style={{
                                  color: registrationMessage.includes('Success') ? '#4ade80' : '#ff6b6b',
                                }}
                              >
                                {registrationMessage}
                              </p>
                            )}
                            <div className="flex gap-4">
                              <button
                                onClick={handleRegister}
                                className="flex-1 py-3 uppercase tracking-wider transition-all hover:scale-105 rounded-lg"
                                style={{
                                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                                  border: '2px solid rgba(184, 115, 51, 0.4)',
                                  color: '#000',
                                  fontFamily: 'var(--font-heading)',
                                }}
                              >
                                CONFIRM
                              </button>
                              <button
                                onClick={() => {
                                  setIsRegistering(false);
                                  setRegistrationForm({ name: "", email: "" });
                                  setRegistrationMessage("");
                                }}
                                className="flex-1 py-3 uppercase tracking-wider transition-all hover:scale-105 rounded-lg"
                                style={{
                                  background: 'rgba(139, 111, 71, 0.2)',
                                  border: '2px solid rgba(139, 111, 71, 0.4)',
                                  color: '#8B6F47',
                                  fontFamily: 'var(--font-heading)',
                                }}
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md p-8 relative rounded-xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
                border: '3px solid rgba(184, 115, 51, 0.8)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 80px rgba(184, 115, 51, 0.4), 0 0 60px rgba(184, 115, 51, 0.3)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-all rounded-lg"
                style={{ color: '#B87333' }}
              >
                <X size={20} />
              </button>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(115, 54, 53, 0.3))',
                    border: '3px solid rgba(184, 115, 51, 0.8)',
                  }}
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Success Message */}
              <div className="text-center mb-6">
                <h3
                  className="text-xl md:text-2xl mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    letterSpacing: '0.1em',
                  }}
                >
                  REGISTRATION SUCCESSFUL!
                </h3>
                <p
                  className="text-base mb-4"
                  style={{
                    color: 'rgba(255, 254, 249, 0.8)',
                    lineHeight: 1.6,
                  }}
                >
                  You've successfully registered for the workshop!
                </p>
              </div>

              {/* Email Confirmation Note */}
              <div
                className="p-4 mb-6 rounded-lg"
                style={{
                  background: 'rgba(184, 115, 51, 0.1)',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <CalendarCheck size={20} style={{ color: '#D4A574', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{
                        color: '#D4A574',
                        fontWeight: 600,
                      }}
                    >
                      Check your email
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: 'rgba(255, 254, 249, 0.7)',
                        lineHeight: 1.5,
                      }}
                    >
                      A confirmation email with workshop details has been sent to your email address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workshop Details if available */}
              {selectedWorkshop && (
                <div
                  className="p-4 mb-6 rounded-lg"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{
                      color: '#8B6F47',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    Workshop
                  </p>
                  <p
                    className="text-lg mb-1"
                    style={{
                      color: '#FFFEF9',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {selectedWorkshop.title}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: 'rgba(255, 254, 249, 0.7)',
                    }}
                  >
                    {new Date(selectedWorkshop.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} • {selectedWorkshop.time}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full py-3 text-center transition-all hover:scale-105 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                  border: '2px solid rgba(184, 115, 51, 0.6)',
                  color: '#000',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.15em',
                }}
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer/>
    </>
  );
}