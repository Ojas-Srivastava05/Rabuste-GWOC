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
//             The Robusta Assemblée
//           </h1>
//           <p className="text-lg md:text-xl text-[#b39977] max-w-2xl mx-auto">
//             A calendar of intimate workshops and gallery evenings for those who
//             savour art, aroma, and conversation.
//           </p>
//         </div>

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
//             <h2 className="text-3xl font-montserrat font-extrabold text-[#342519]">
//               {monthName}
//             </h2>
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
"use client";

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
  id: number;
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
        setWorkshops(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkshops();
  }, []);

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

  //   calender

  const upcomingWorkshopsWithinMonth = getUpcomingWorkshopsWithinMonth();
  const nextWorkshop = getNextWorkshop();
  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2419] to-[#1a0f0a]">
      {/* scrolling ticker */}
      {upcomingWorkshopsWithinMonth.length > 0 && (
        <div className="relative bg-gradient-to-r from-amber-900/90 via-orange-800/90 to-amber-900/90 backdrop-blur-md border-b-4 border-amber-600/50 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative py-8 px-4 overflow-hidden">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-amber-300 mr-2 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold text-amber-100 tracking-wide uppercase">
                Upcoming Experiences
              </h2>
              <Sparkles className="w-6 h-6 text-amber-300 ml-2 animate-pulse" />
            </div>

            <div className="animate-marquee whitespace-nowrap inline-block">
              {[...Array(4)].map((_, repeatIndex) => (
                <span key={repeatIndex} className="inline-flex items-center">
                  {upcomingWorkshopsWithinMonth.map((workshop, idx) => (
                    <span
                      key={`${repeatIndex}-${workshop.id}`}
                      className="inline-flex items-center mx-6 md:mx-12"
                    >
                      <span className="text-3xl md:text-4xl mr-3">
                        {workshop.category === "coffee" ? "☕" : "🎨"}
                      </span>
                      <span className="text-xl md:text-2xl font-semibold text-amber-50">
                        {workshop.daysLeft}{" "}
                        {workshop.daysLeft === 1 ? "day" : "days"} left for
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-white mx-2 px-4 py-1 bg-amber-700/50 rounded-full">
                        {workshop.title}
                      </span>
                      {idx < upcomingWorkshopsWithinMonth.length - 1 && (
                        <span className="text-amber-300 mx-4 text-2xl">✦</span>
                      )}
                    </span>
                  ))}
                  <span className="text-amber-300 mx-6 text-3xl">★</span>
                </span>
              ))}
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
          <h1 className="relative text-6xl md:text-8xl font-montserrat font-extrabold mb-6 bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
            The Robusta Assemblée
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <Coffee className="w-8 h-8 mx-4 text-amber-400" />
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
          <p className="relative text-xl md:text-2xl text-amber-300/90 max-w-3xl mx-auto leading-relaxed font-light italic">
            A curated calendar of intimate workshops and gallery evenings
            <br />
            for connoisseurs who savour art, aroma, and refined conversation.
          </p>
        </div>

        {/* calendar */}
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-10 border-4 border-amber-200/50 backdrop-blur-sm">
          {/* month navigation */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => changeMonth(-1)}
              className="px-8 py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-110 font-bold text-lg"
            >
              ←
            </button>
            <h2 className="text-4xl md:text-5xl font-montserrat font-extrabold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
              {monthName}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="px-8 py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-110 font-bold text-lg"
            >
              →
            </button>
          </div>

          {/* calendar grid */}
          <div className="grid grid-cols-7 gap-3 md:gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-montserrat font-bold text-amber-900 pb-6 text-lg"
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
                    aspect-square rounded-2xl flex items-center justify-center text-xl font-bold
                    transition-all duration-300 cursor-pointer relative overflow-hidden
                    
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
                  <span className="relative z-10 drop-shadow-md">{day}</span>
                  {isCoffee && !isPast && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                      <Coffee className="w-10 h-10 steam-animation text-white" />
                    </div>
                  )}
                  {isPainting && !isPast && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                      <Palette className="w-10 h-10 paint-splash text-white" />
                    </div>
                  )}
                  {today && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-10 pt-8 border-t-2 border-amber-300/50">
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 shadow-md"></div>
                <span className="font-semibold text-gray-700">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md"></div>
                <span className="font-semibold text-gray-700">
                  Coffee Workshop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"></div>
                <span className="font-semibold text-gray-700">
                  Painting Workshop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 shadow-md opacity-60"></div>
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
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl max-w-3xl w-full p-10 relative modal-content transform shadow-2xl border-4 border-amber-300/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-3 hover:bg-amber-200/50 rounded-full transition-all hover:rotate-90 duration-300"
            >
              <X className="w-7 h-7 text-amber-900" />
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 mb-6 shadow-lg">
                {selectedWorkshop.category === "coffee" ? (
                  <Coffee className="w-6 h-6 text-amber-900" />
                ) : (
                  <Palette className="w-6 h-6 text-amber-900" />
                )}
                <span className="font-bold text-amber-900 text-base uppercase tracking-widest">
                  {selectedWorkshop.category}
                </span>
              </div>

              <h3 className="text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text">
                {selectedWorkshop.title}
              </h3>

              {selectedWorkshop.status === "past" && (
                <span className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold shadow-md">
                  Past Workshop
                </span>
              )}
            </div>

            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              {selectedWorkshop.description}
            </p>

            <div className="space-y-5 bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 text-gray-800">
                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-900" />
                </div>
                <span className="font-semibold text-lg">
                  {selectedWorkshop.date}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-800">
                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-900" />
                </div>
                <span className="text-lg">{selectedWorkshop.time}</span>
              </div>

              <div className="flex items-center gap-4 text-gray-800">
                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-900" />
                </div>
                <span className="text-lg">
                  Instructor: {selectedWorkshop.instructor}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-800">
                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-900" />
                </div>
                <span className="text-lg">{selectedWorkshop.location}</span>
              </div>
            </div>
          </div>
        </div>
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
