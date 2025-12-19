// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   Coffee,
//   Palette,
//   Clock,
//   User,
//   MapPin,
//   X,
// } from "lucide-react";

// // types

// // Formats a date as YYYY-MM-DD (local time)
// const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

// type Workshop = {
//   id: number;
//   title: string;
//   category: "coffee" | "painting";
//   date: string;
//   time: string;
//   description: string;
//   instructor: string;
//   location: string;
//   status: "upcoming" | "past";
// };

// type NextWorkshop = Workshop & {
//   daysLeft: number;
// };

// // page

// export default function WorkshopsPage() {
//   const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
//     null
//   );
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   // data

//   const [workshops, setWorkshops] = useState<Workshop[]>([]);

//   useEffect(() => {
//     const fetchWorkshops = async () => {
//       try {
//         const res = await fetch("/api/workshops");
//         if (!res.ok) throw new Error("Failed to fetch workshops");
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setWorkshops(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchWorkshops();
//   }, []);

//   // helpers

//   const getNextWorkshop = (): NextWorkshop | null => {
//     const now = new Date();

//     const upcoming = workshops
//       .filter((w) => w.status === "upcoming" && new Date(w.date) > now)
//       .sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//       )[0];

//     if (!upcoming) return null;

//     const daysLeft = Math.ceil(
//       (new Date(upcoming.date).getTime() - now.getTime()) /
//         (1000 * 60 * 60 * 24)
//     );

//     return { ...upcoming, daysLeft };
//   };

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);

//     return {
//       daysInMonth: lastDay.getDate(),
//       startingDayOfWeek: firstDay.getDay(),
//       year,
//       month,
//     };
//   };

//   const getWorkshopForDate = (date: Date): Workshop | undefined => {
//     const dateStr = formatDate(date);
//     return workshops.find((w) => w.date === dateStr);
//   };

//   const handleDateClick = (day: number) => {
//     const date = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth(),
//       day
//     );

//     const workshop = getWorkshopForDate(date);

//     if (workshop) {
//       setSelectedWorkshop(workshop);
//       setIsModalOpen(true);
//     }
//   };

//   const changeMonth = (direction: number) => {
//     setCurrentMonth(
//       new Date(
//         currentMonth.getFullYear(),
//         currentMonth.getMonth() + direction,
//         1
//       )
//     );
//   };

//   //   calender

//   const nextWorkshop = getNextWorkshop();
//   const { daysInMonth, startingDayOfWeek, year, month } =
//     getDaysInMonth(currentMonth);

//   const monthName = currentMonth.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });

//   const [newWorkshop, setNewWorkshop] = useState<
//     Omit<Workshop, "id" | "status">
//   >({
//     title: "",
//     category: "coffee",
//     date: "",
//     time: "",
//     description: "",
//     instructor: "",
//     location: "",
//   });

//   const handleAdminChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setNewWorkshop((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddWorkshop = async () => {
//     if (!newWorkshop.title || !newWorkshop.date) return;

//     const formattedDate = formatDate(new Date(newWorkshop.date));

//     try {
//       const res = await fetch("/api/workshops", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...newWorkshop,
//           date: formattedDate,
//           status: "upcoming",
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to add workshop");

//       const savedWorkshop = await res.json();

//       // update local state to reflect new workshop immediately
//       setWorkshops((prev) => [...prev, savedWorkshop]);

//       // reset form
//       setNewWorkshop({
//         title: "",
//         category: "coffee",
//         date: "",
//         time: "",
//         description: "",
//         instructor: "",
//         location: "",
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error adding workshop");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#4a2825]">
//       {/* scrolling ticker */}
//       {nextWorkshop && (
//         <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-rose-900 text-white py-4 overflow-hidden relative">
//           <div className="animate-marquee whitespace-nowrap inline-block">
//             <span className="text-xl md:text-2xl font-bold mx-8">
//               {nextWorkshop.category === "coffee" ? "☕" : "🎨"}{" "}
//               {nextWorkshop.daysLeft} days left for {nextWorkshop.title}
//             </span>
//             <span className="text-xl md:text-2xl font-bold mx-8">
//               {nextWorkshop.category === "coffee" ? "☕" : "🎨"}{" "}
//               {nextWorkshop.daysLeft} days left for {nextWorkshop.title}
//             </span>
//             <span className="text-xl md:text-2xl font-bold mx-8">
//               {nextWorkshop.category === "coffee" ? "☕" : "🎨"}{" "}
//               {nextWorkshop.daysLeft} days left for {nextWorkshop.title}
//             </span>
//             <span className="text-xl md:text-2xl font-bold mx-8">
//               {nextWorkshop.category === "coffee" ? "☕" : "🎨"}{" "}
//               {nextWorkshop.daysLeft} days left for {nextWorkshop.title}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* header */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl md:text-7xl font-montserrat font-extrabold mb-4 bg-[#fffbd6] bg-clip-text text-transparent">
//             Workshops
//           </h1>
//           <p className="text-lg md:text-xl text-[#b39977] max-w-2xl mx-auto">
//             Explore our creative sessions in coffee craftsmanship and artistic
//             expression
//           </p>
//         </div>

//         {/* admin UI */}

//         {
//           <div className="max-w-5xl mx-auto mb-12 bg-white rounded-3xl shadow-xl p-8">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800">
//               Admin – Add Workshop
//             </h2>

//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 name="title"
//                 value={newWorkshop.title}
//                 onChange={handleAdminChange}
//                 placeholder="Workshop Title"
//                 className="border p-3 rounded-xl"
//               />

//               <select
//                 name="category"
//                 value={newWorkshop.category}
//                 onChange={handleAdminChange}
//                 className="border p-3 rounded-xl"
//               >
//                 <option value="coffee">Coffee</option>
//                 <option value="painting">Painting</option>
//               </select>

//               <input
//                 type="date"
//                 name="date"
//                 value={newWorkshop.date}
//                 onChange={handleAdminChange}
//                 className="border p-3 rounded-xl"
//               />

//               <input
//                 name="time"
//                 value={newWorkshop.time}
//                 onChange={handleAdminChange}
//                 placeholder="Time (e.g. 2:00 PM - 4:00 PM)"
//                 className="border p-3 rounded-xl"
//               />

//               <input
//                 name="instructor"
//                 value={newWorkshop.instructor}
//                 onChange={handleAdminChange}
//                 placeholder="Instructor"
//                 className="border p-3 rounded-xl"
//               />

//               <input
//                 name="location"
//                 value={newWorkshop.location}
//                 onChange={handleAdminChange}
//                 placeholder="Location"
//                 className="border p-3 rounded-xl"
//               />
//             </div>

//             <textarea
//               name="description"
//               value={newWorkshop.description}
//               onChange={handleAdminChange}
//               placeholder="Description"
//               className="border p-3 rounded-xl w-full mt-4"
//             />

//             <button
//               onClick={handleAddWorkshop}
//               className="mt-6 px-8 py-4 bg-[#b39977] text-white font-bold rounded-2xl hover:scale-105 transition"
//             >
//               Add Workshop
//             </button>
//           </div>
//         }

//         {/* calendar */}
//         <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
//           {/* month navigation */}
//           <div className="flex items-center justify-between mb-8">
//             <button
//               onClick={() => changeMonth(-1)}
//               className="px-6 py-3 bg-[#4a2825] text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
//             >
//               ←
//             </button>
//             <h2 className="text-3xl font-bold text-[#342519]">{monthName}</h2>
//             <button
//               onClick={() => changeMonth(1)}
//               className="px-6 py-3 bg-[#4a2825] text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
//             >
//               →
//             </button>
//           </div>

//           {/* calendar grid */}
//           <div className="grid grid-cols-7 gap-4">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//               <div
//                 key={day}
//                 className="text-center font-montserrat font-extrabold text-[#342519] pb-4"
//               >
//                 {day}
//               </div>
//             ))}

//             {Array.from({ length: startingDayOfWeek }).map((_, i) => (
//               <div key={`empty-${i}`} />
//             ))}

//             {Array.from({ length: daysInMonth }).map((_, i) => {
//               const day = i + 1;
//               const date = new Date(year, month, day);
//               const workshop = getWorkshopForDate(date);
//               const isCoffee = workshop?.category === "coffee";
//               const isPainting = workshop?.category === "painting";
//               const isPast = workshop?.status === "past";

//               return (
//                 <div
//                   key={day}
//                   onClick={() => handleDateClick(day)}
//                   className={`
//                     aspect-square rounded-2xl flex items-center justify-center text-lg font-semibold
//                     transition-all duration-300 cursor-pointer relative overflow-hidden
//                     ${
//                       workshop
//                         ? "transform hover:scale-110 hover:shadow-xl"
//                         : "hover:bg-gray-100"
//                     }
//                     ${isCoffee && !isPast ? "bg-[#b39977] coffee-date" : ""}
//                     ${isPainting && !isPast ? "bg-[#b39977] painting-date" : ""}
//                     ${isPast ? "bg-gray-200 opacity-50" : ""}
//                     ${!workshop ? "bg-white border-2 border-gray-200" : ""}
//                   `}
//                 >
//                   <span className="relative z-10">{day}</span>
//                   {isCoffee && !isPast && (
//                     <div className="absolute inset-0 flex items-center justify-center opacity-20">
//                       <Coffee className="w-8 h-8 steam-animation" />
//                     </div>
//                   )}
//                   {isPainting && !isPast && (
//                     <div className="absolute inset-0 flex items-center justify-center opacity-20">
//                       <Palette className="w-8 h-8 paint-splash" />
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* modal */}
//       {isModalOpen && selectedWorkshop && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-3xl max-w-2xl w-full p-8 relative modal-content transform"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <div className="mb-6">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 mb-4">
//                 {selectedWorkshop.category === "coffee" ? (
//                   <Coffee className="w-5 h-5 text-amber-900" />
//                 ) : (
//                   <Palette className="w-5 h-5 text-amber-900" />
//                 )}
//                 <span className="font-semibold text-amber-700 text-sm uppercase tracking-wide">
//                   {selectedWorkshop.category}
//                 </span>
//               </div>

//               <h3 className="text-4xl font-bold mb-2 text-gray-900">
//                 {selectedWorkshop.title}
//               </h3>

//               {selectedWorkshop.status === "past" && (
//                 <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
//                   Past Workshop
//                 </span>
//               )}
//             </div>

//             <p className="text-lg text-gray-700 mb-6 leading-relaxed">
//               {selectedWorkshop.description}
//             </p>

//             <div className="space-y-4">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Calendar className="w-5 h-5 text-amber-700" />
//                 <span className="font-medium">{selectedWorkshop.date}</span>
//               </div>

//               <div className="flex items-center gap-3 text-gray-700">
//                 <Clock className="w-5 h-5 text-amber-700" />
//                 <span>{selectedWorkshop.time}</span>
//               </div>

//               <div className="flex items-center gap-3 text-gray-700">
//                 <User className="w-5 h-5 text-amber-700" />
//                 <span>Instructor: {selectedWorkshop.instructor}</span>
//               </div>

//               <div className="flex items-center gap-3 text-gray-700">
//                 <MapPin className="w-5 h-5 text-amber-700" />
//                 <span>{selectedWorkshop.location}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes marquee {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }

//         .animate-marquee {
//           animation: marquee 20s linear infinite;
//         }

//         @keyframes steam {
//           0%,
//           100% {
//             transform: translateY(0) scale(1);
//             opacity: 0.3;
//           }
//           50% {
//             transform: translateY(-10px) scale(1.1);
//             opacity: 0.5;
//           }
//         }

//         .steam-animation {
//           animation: steam 3s ease-in-out infinite;
//         }

//         @keyframes splash {
//           0%,
//           100% {
//             transform: rotate(0deg) scale(1);
//           }
//           25% {
//             transform: rotate(-5deg) scale(1.05);
//           }
//           75% {
//             transform: rotate(5deg) scale(1.05);
//           }
//         }

//         .paint-splash {
//           animation: splash 4s ease-in-out infinite;
//         }

//         .coffee-date {
//           box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
//         }

//         .painting-date {
//           box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
//         }

//         @keyframes modalFadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes modalSlideUp {
//           from {
//             transform: translateY(30px) scale(0.95);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0) scale(1);
//             opacity: 1;
//           }
//         }

//         .modal-overlay {
//           animation: modalFadeIn 0.3s ease-out;
//         }

//         .modal-content {
//           animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//         }
//       `}</style>
//     </div>
//   );
// }
