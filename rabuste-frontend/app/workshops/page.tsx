// "use client";

// import RotatingText from "../../components/RotatingText";
// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   Coffee,
//   Palette,
//   Clock,
//   User,
//   MapPin,
//   X,
//   Sparkles,
// } from "lucide-react";

// // types

// // Formats a date as YYYY-MM-DD (local time)
// const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

// type Workshop = {
//   _id: number;
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

// export default function App() {
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
//         // setWorkshops(data);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const processed = data.map((w: Workshop) => {
//           const workshopDate = new Date(w.date);
//           workshopDate.setHours(0, 0, 0, 0);

//           return {
//             ...w,
//             status: workshopDate < today ? "past" : "upcoming",
//           };
//         });

//         setWorkshops(processed);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchWorkshops();
//   }, []);

//   // helpers

//   const getUpcomingWorkshopsWithinMonth = (): NextWorkshop[] => {
//     const now = new Date();
//     const oneMonthFromNow = new Date();
//     oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

//     return workshops
//       .filter((w) => {
//         const workshopDate = new Date(w.date);
//         return (
//           w.status === "upcoming" &&
//           workshopDate > now &&
//           workshopDate <= oneMonthFromNow
//         );
//       })
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       .map((workshop) => {
//         const daysLeft = Math.ceil(
//           (new Date(workshop.date).getTime() - now.getTime()) /
//             (1000 * 60 * 60 * 24)
//         );
//         return { ...workshop, daysLeft };
//       });
//   };

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

//   const isToday = (date: Date): boolean => {
//     const today = new Date();
//     return (
//       date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear()
//     );
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

//   const upcomingWorkshopsWithinMonth = getUpcomingWorkshopsWithinMonth();
//   const nextWorkshop = getNextWorkshop();
//   const { daysInMonth, startingDayOfWeek, year, month } =
//     getDaysInMonth(currentMonth);

//   const monthName = currentMonth.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });

//   const rotatingWorkshopTexts = upcomingWorkshopsWithinMonth.map(
//     (workshop) =>
//       `${workshop.category === "coffee" ? "☕" : "🎨"} ${workshop.daysLeft} ${
//         workshop.daysLeft === 1 ? "day" : "days"
//       } left for ${workshop.title}`
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2419] to-[#1a0f0a] px-2 sm:px-0">
//       {/* scrolling ticker */}
//       {/* {upcomingWorkshopsWithinMonth.length > 0 && (
//         <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-orange-800 to-amber-950 border-b-8 border-amber-500 shadow-[0_20px_80px_-20px_rgba(251,191,36,0.6)]">
//           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-400/10 to-amber-500/10 blur-2xl"></div>

//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA4Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

//           <div className="relative py-12 md:py-16 px-6 md:px-12">
//             <div className="flex items-center justify-center mb-6">
//               <Sparkles className="w-8 h-8 text-amber-300 mr-3 animate-pulse" />
//               <h2 className="text-3xl md:text-5xl font-extrabold text-amber-100 tracking-widest uppercase drop-shadow-lg">
//                 Upcoming Experiences
//               </h2>
//               <Sparkles className="w-8 h-8 text-amber-300 ml-3 animate-pulse" />
//             </div>

//             <div className="flex justify-center items-center">
//               <RotatingText
//                 texts={rotatingWorkshopTexts}
//                 mainClassName="px-2 sm:px-6 md:px-8 py-1 sm:py-3 md:py-4 bg-amber-700/60 text-white text-xs sm:text-lg md:text-2xl font-extrabold rounded-full shadow-lg ring-1 ring-amber-400/30 backdrop-blur-sm whitespace-nowrap overflow-hidden"
//                 staggerFrom="last"
//                 initial={{ y: "100%" }}
//                 animate={{ y: 0 }}
//                 exit={{ y: "-120%" }}
//                 staggerDuration={0.025}
//                 splitLevelClassName="overflow-hidden"
//                 transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                 rotationInterval={5000}
//               />
//             </div>
//           </div>
//         </div>
//       )} */}
//       {/* scrolling ticker */}
//       {upcomingWorkshopsWithinMonth.length > 0 && (
//         <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-orange-800 to-amber-950 border-b-8 border-amber-500 shadow-[0_20px_80px_-20px_rgba(251,191,36,0.6)]">
//           {/* Glow layer */}
//           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-400/10 to-amber-500/10 blur-2xl"></div>

//           {/* Pattern overlay */}
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-40"></div>

//           <div className="relative py-10 md:py-14 px-6 md:px-12">
//             {/* Heading */}
//             <div className="flex items-center justify-center mb-4 md:mb-6">
//               <Sparkles className="w-6 h-6 text-amber-300 mr-2 animate-pulse" />
//               <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-100 tracking-wide uppercase drop-shadow-lg text-center">
//                 Upcoming Experiences
//               </h2>
//               <Sparkles className="w-6 h-6 text-amber-300 ml-2 animate-pulse" />
//             </div>

//             {/* Rotating text */}
//             <div className="flex justify-center items-center mt-2 md:mt-4">
//               <RotatingText
//                 texts={rotatingWorkshopTexts}
//                 mainClassName="px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-amber-700/70 text-white text-xs sm:text-sm md:text-lg font-semibold rounded-full shadow-lg ring-1 ring-amber-400/40 backdrop-blur-sm whitespace-nowrap overflow-hidden"
//                 staggerFrom="last"
//                 initial={{ y: "100%" }}
//                 animate={{ y: 0 }}
//                 exit={{ y: "-120%" }}
//                 staggerDuration={0.025}
//                 splitLevelClassName="overflow-hidden"
//                 transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                 rotationInterval={5000}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* header */}

//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center mb-16 relative">
//           <div className="absolute inset-0 flex items-center justify-center opacity-5">
//             <Coffee className="w-64 h-64" />
//           </div>

//           <h1 className="relative text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-extrabold mb-6 bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight text-center px-2">
//             The Robusta Assemblée
//           </h1>

//           <div className="flex items-center justify-center mb-6">
//             <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
//             <Coffee className="w-8 h-8 mx-4 text-amber-400" />
//             <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
//           </div>

//           <p className="relative text-sm sm:text-lg md:text-2xl text-amber-300/90 max-w-3xl mx-auto leading-relaxed font-light italic text-center px-4">
//             A curated calendar of intimate workshops and gallery evenings
//             <br />
//             for connoisseurs who savour art, aroma, and refined conversation.
//           </p>
//         </div>

//         {/* calendar */}

//         <div className="max-w-6xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border-4 border-amber-200/50 backdrop-blur-sm">
//           {/* month navigation */}
//           <div className="flex items-center justify-between mb-10">
//             <button
//               onClick={() => changeMonth(-1)}
//               className="px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-sm sm:text-base md:text-lg"
//             >
//               ←
//             </button>

//             <h2 className="text-2xl sm:text-3xl md:text-5xl font-montserrat font-extrabold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent text-center">
//               {monthName}
//             </h2>
//             <button
//               onClick={() => changeMonth(1)}
//               className="px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-sm sm:text-base md:text-lg"
//             >
//               →
//             </button>
//           </div>

//           {/* calendar grid */}

//           <div className="overflow-x-auto">
//             <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 text-xs sm:text-sm md:text-base">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                 <div
//                   key={day}
//                   className="text-center font-montserrat font-bold text-amber-900 pb-6 text-lg sm:text-base md:text-lg"
//                 >
//                   {day}
//                 </div>
//               ))}

//               {Array.from({ length: startingDayOfWeek }).map((_, i) => (
//                 <div key={`empty-${i}`} />
//               ))}

//               {Array.from({ length: daysInMonth }).map((_, i) => {
//                 const day = i + 1;
//                 const date = new Date(year, month, day);
//                 const workshop = getWorkshopForDate(date);
//                 const isCoffee = workshop?.category === "coffee";
//                 const isPainting = workshop?.category === "painting";
//                 const isPast = workshop?.status === "past";
//                 const today = isToday(date);

//                 return (
//                   <div
//                     key={day}
//                     onClick={() => handleDateClick(day)}
//                     className={`
//             aspect-square min-w-[40px] sm:min-w-[50px] md:min-w-[60px] rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg md:text-xl font-bold
//             ${
//               workshop
//                 ? "transform hover:scale-110 hover:shadow-2xl hover:z-10"
//                 : "hover:bg-amber-100/50"
//             }
//             ${
//               today && !workshop
//                 ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg ring-4 ring-blue-300 today-pulse"
//                 : ""
//             }
//             ${today && workshop ? "ring-4 ring-blue-400 today-pulse" : ""}
//             ${
//               isCoffee && !isPast
//                 ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-xl coffee-date"
//                 : ""
//             }
//             ${
//               isPainting && !isPast
//                 ? "bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 text-white shadow-xl painting-date"
//                 : ""
//             }
//             ${
//               isPast
//                 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 opacity-60"
//                 : ""
//             }
//             ${
//               !workshop && !today
//                 ? "bg-white/80 border-2 border-amber-200 text-gray-700"
//                 : ""
//             }
//           `}
//                   >
//                     <span className="relative z-10 drop-shadow-md text-sm sm:text-base md:text-lg">
//                       {day}
//                     </span>

//                     {isCoffee && !isPast && (
//                       <Coffee className="absolute w-4 sm:w-6 md:w-10 h-4 sm:h-6 md:h-10 opacity-25 pointer-events-none steam-animation" />
//                     )}
//                     {isPainting && !isPast && (
//                       <Palette className="absolute w-4 sm:w-6 md:w-10 h-4 sm:h-6 md:h-10 opacity-25 pointer-events-none paint-splash" />
//                     )}
//                     {today && (
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping pointer-events-none"></div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="mt-10 pt-8 border-t-2 border-amber-300/50">
//             <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 shadow-md"></div>
//                 <span className="font-semibold text-gray-700">Today</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md"></div>
//                 <span className="font-semibold text-gray-700">
//                   Coffee Workshop
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"></div>
//                 <span className="font-semibold text-gray-700">
//                   Painting Workshop
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 shadow-md opacity-60"></div>
//                 <span className="font-semibold text-gray-700">
//                   Past Workshop
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* modal */}
//       {isModalOpen && selectedWorkshop && (
//         <div
//           className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl w-full sm:w-[90%] max-w-3xl p-4 sm:p-6 md:p-8 relative modal-content transform shadow-2xl border-4 border-amber-300/50 max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-6 right-6 p-3 hover:bg-amber-200/50 rounded-full transition-all hover:rotate-90 duration-300"
//             >
//               <X className="w-7 h-7 text-amber-900" />
//             </button>

//             <div className="mb-8">
//               <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 mb-6 shadow-lg">
//                 {selectedWorkshop.category === "coffee" ? (
//                   <Coffee className="w-6 h-6 text-amber-900" />
//                 ) : (
//                   <Palette className="w-6 h-6 text-amber-900" />
//                 )}
//                 <span className="font-bold text-amber-900 text-base uppercase tracking-widest">
//                   {selectedWorkshop.category}
//                 </span>
//               </div>

//               <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text">
//                 {selectedWorkshop.title}
//               </h3>

//               {selectedWorkshop.status === "past" && (
//                 <span className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold shadow-md">
//                   Past Workshop
//                 </span>
//               )}
//             </div>

//             <p className="text-sm sm:text-base md:text-xl text-gray-800 mb-6 md:mb-8 leading-relaxed break-words">
//               {selectedWorkshop.description}
//             </p>

//             <div className="space-y-5 bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
//               <div className="flex items-center gap-4 text-gray-800">
//                 <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
//                   <Calendar className="w-6 h-6 text-amber-900" />
//                 </div>
//                 <span className="font-semibold text-lg">
//                   {selectedWorkshop.date}
//                 </span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-800">
//                 <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
//                   <Clock className="w-6 h-6 text-amber-900" />
//                 </div>
//                 <span className="text-lg">{selectedWorkshop.time}</span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-800">
//                 <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
//                   <User className="w-6 h-6 text-amber-900" />
//                 </div>
//                 <span className="text-lg">
//                   Instructor: {selectedWorkshop.instructor}
//                 </span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-800">
//                 <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-amber-900" />
//                 </div>
//                 <span className="text-lg">{selectedWorkshop.location}</span>
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
//           animation: marquee 30s linear infinite;
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

//         @keyframes todayPulse {
//           0%,
//           100% {
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
//           }
//           50% {
//             box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
//           }
//         }

//         .today-pulse {
//           animation: todayPulse 2s ease-in-out infinite;
//         }

//         .coffee-date {
//           box-shadow: 0 8px 25px rgba(251, 146, 60, 0.5);
//         }

//         .painting-date {
//           box-shadow: 0 8px 25px rgba(236, 72, 153, 0.5);
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

import RotatingText from "../../components/RotatingText";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Coffee,
  Palette,
  Clock,
  User,
  MapPin,
  X,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";

// types

// Formats a date as YYYY-MM-DD (local time)
const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

type Workshop = {
  _id: number;
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

const CoffeeBean = ({
  delay,
  duration,
}: {
  delay: number;
  duration: number;
}) => {
  const randomLeft = Math.random() * 100; // horizontal position
  const randomSize = 16 + Math.random() * 24; // font size

  return (
    <div
      className="absolute block drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] animate-coffee-fall"
      style={{
        left: `${randomLeft}%`,
        top: "-10%", // start above screen
        fontSize: `${randomSize}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        lineHeight: 1,
        fontFamily:
          "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
        zIndex: 5,
      }}
    >
      ☕
    </div>
  );
};

// Steam Effect Component
const SteamEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="steam-particle"
          style={{
            left: `${20 + i * 15}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
};

// page

export default function App() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // data

  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch("/api/workshops");
        if (!res.ok) throw new Error("Failed to fetch workshops");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
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

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

  // Rotate text effect
  useEffect(() => {
    if (rotatingWorkshopTexts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(
          (prev) => (prev + 1) % rotatingWorkshopTexts.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [rotatingWorkshopTexts.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a0f0a] via-[#2d1810] to-[#0a0604] animate-gradient-shift">
        {/* Gradient Orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-900/30 to-orange-800/20 blur-3xl animate-float"
          style={{
            top: "10%",
            left: "20%",
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-yellow-900/20 to-amber-900/30 blur-3xl animate-float-delayed"
          style={{
            bottom: "20%",
            right: "15%",
            transform: `translate(${-mousePosition.x * 0.03}px, ${
              -mousePosition.y * 0.03
            }px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-900/25 to-red-900/15 blur-3xl animate-float-slow"
          style={{
            top: "50%",
            right: "30%",
            transform: `translate(${mousePosition.x * 0.015}px, ${
              mousePosition.y * 0.015
            }px)`,
          }}
        />

        {/* Floating Coffee Beans */}
        {[...Array(20)].map((_, i) => (
          <CoffeeBean
            key={i}
            delay={i * 2}
            duration={15 + Math.random() * 10}
          />
        ))}

        {/* Steam Effects */}
        <SteamEffect />

        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Top Banner */}
          {upcomingWorkshopsWithinMonth.length > 0 && (
            <div className="relative backdrop-blur-xl bg-black/40 border-b border-amber-700/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-orange-800/20 to-amber-900/20 animate-shimmer" />

              <div className="relative py-4 md:py-6 px-6 md:px-12">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mr-2 animate-pulse" />
                  <h2 className="text-sm md:text-base font-semibold text-amber-200/90 tracking-[0.3em] uppercase">
                    Upcoming Experiences
                  </h2>
                  <Sparkles className="w-4 h-4 text-amber-400 ml-2 animate-pulse" />
                </div>

                <div className="flex justify-center items-center mt-2 md:mt-4">
                  <div className="px-6 py-2 bg-gradient-to-r from-amber-900/40 to-orange-900/40 backdrop-blur-sm text-amber-100 text-xs md:text-sm font-medium rounded-full border border-amber-600/30 shadow-xl transition-all duration-500 animate-fade-in">
                    <RotatingText
                      texts={
                        rotatingWorkshopTexts.length
                          ? rotatingWorkshopTexts
                          : ["No upcoming workshops"]
                      }
                      // mainClassName="px-2 sm:px-6 md:px-8 py-1 sm:py-3 md:py-4  text-white text-xs sm:text-lg md:text-2xl font-extrabold rounded-full shadow-lg ring-1 ring-amber-400/30 backdrop-blur-sm whitespace-nowrap overflow-hidden"
                      staggerFrom="last"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden"
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                      }}
                      rotationInterval={5000}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Hero */}
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center max-w-5xl mx-auto">
              {/* Logo/Icon */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping-slow">
                    <Image
                      src="/Rabuste logo.png"
                      alt="Next Logo"
                      width={64}
                      height={64}
                      className="md:w-20 md:h-20 text-amber-500/30"
                    />
                  </div>

                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image
                      src="/Rabuste logo.png"
                      alt="Next Logo"
                      fill
                      className="object-contain text-amber-400 relative z-10 animate-pulse-slow"
                    />
                  </div>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
                <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
                  The Robusta
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Assemblée
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-amber-200/80 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in-up animation-delay-400">
                A curated calendar of intimate workshops and gallery evenings
                <br />
                for connoisseurs who savour art, aroma, and refined
                conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-amber-700/20 animate-fade-in-up animation-delay-800">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => changeMonth(-1)}
                className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-md text-amber-100 rounded-xl hover:from-amber-800/60 hover:to-orange-800/60 transition-all border border-amber-600/30 font-bold text-base md:text-lg shadow-lg hover:shadow-amber-900/50 hover:scale-105 transform"
              >
                <span className="group-hover:-translate-x-1 inline-block transition-transform">
                  ←
                </span>
              </button>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent text-center">
                {monthName}
              </h2>

              <button
                onClick={() => changeMonth(1)}
                className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-md text-amber-100 rounded-xl hover:from-amber-800/60 hover:to-orange-800/60 transition-all border border-amber-600/30 font-bold text-base md:text-lg shadow-lg hover:shadow-amber-900/50 hover:scale-105 transform"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[280px]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-amber-300/80 pb-4 text-xs sm:text-sm md:text-base tracking-wider uppercase"
                    >
                      {day}
                    </div>
                  )
                )}

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
                        group aspect-square min-w-[40px] rounded-xl flex items-center justify-center text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 relative overflow-hidden
                        ${
                          workshop
                            ? "cursor-pointer hover:scale-110 hover:z-10"
                            : "hover:bg-white/5"
                        }
                        ${
                          today && !workshop
                            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-900/50 ring-2 ring-amber-400/50 animate-pulse-border"
                            : ""
                        }
                        ${
                          today && workshop
                            ? "ring-2 ring-amber-400 animate-pulse-border"
                            : ""
                        }
                        ${
                          isCoffee && !isPast
                            ? "bg-gradient-to-br from-amber-800/80 to-orange-900/80 backdrop-blur-sm text-amber-50 shadow-xl shadow-amber-900/60 border border-amber-600/40 hover:shadow-2xl hover:shadow-amber-800/70"
                            : ""
                        }
                        ${
                          isPainting && !isPast
                            ? "bg-gradient-to-br from-rose-900/80 to-pink-900/80 backdrop-blur-sm text-rose-50 shadow-xl shadow-rose-900/60 border border-rose-600/40 hover:shadow-2xl hover:shadow-rose-800/70"
                            : ""
                        }
                        ${
                          isPast
                            ? "bg-black/20 border border-white/5 text-gray-500 opacity-40"
                            : ""
                        }
                        ${
                          !workshop && !today
                            ? "bg-white/5 border border-white/10 text-amber-200/70 hover:border-amber-600/30"
                            : ""
                        }
                      `}
                    >
                      {/* Shine effect on hover for workshops */}
                      {workshop && !isPast && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-shine" />
                      )}

                      <span className="relative z-10">{day}</span>

                      {isCoffee && !isPast && (
                        <Coffee className="absolute w-5 md:w-7 h-5 md:h-7 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-125 transition-all" />
                      )}
                      {isPainting && !isPast && (
                        <Palette className="absolute w-5 md:w-7 h-5 md:h-7 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-125 transition-all" />
                      )}
                      {today && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg" />
                  <span className="font-medium text-amber-200">Today</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-800/80 to-orange-900/80 border border-amber-600/40 shadow-lg" />
                  <span className="font-medium text-amber-200">
                    Coffee Workshop
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-900/80 to-pink-900/80 border border-rose-600/40 shadow-lg" />
                  <span className="font-medium text-amber-200">
                    Painting Workshop
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-black/20 border border-white/5 opacity-40" />
                  <span className="font-medium text-amber-200">Past</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedWorkshop && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="backdrop-blur-xl bg-black/40 border border-amber-700/30 rounded-3xl w-full max-w-3xl p-8 md:p-10 relative shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-all hover:rotate-90 duration-300 group"
            >
              <X className="w-6 h-6 text-amber-200 group-hover:text-amber-100" />
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-amber-900/60 to-orange-900/60 backdrop-blur-sm border border-amber-600/30 mb-6">
                {selectedWorkshop.category === "coffee" ? (
                  <Coffee className="w-5 h-5 text-amber-300" />
                ) : (
                  <Palette className="w-5 h-5 text-rose-300" />
                )}
                <span className="font-semibold text-amber-100 text-sm uppercase tracking-widest">
                  {selectedWorkshop.category}
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                {selectedWorkshop.title}
              </h3>

              {selectedWorkshop.status === "past" && (
                <span className="inline-block px-4 py-2 bg-white/10 text-amber-200 border border-white/20 rounded-full font-medium text-sm">
                  Past Workshop
                </span>
              )}
            </div>

            <p className="text-base md:text-lg text-amber-100/80 mb-8 leading-relaxed">
              {selectedWorkshop.description}
            </p>

            <div className="space-y-4 bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-4 text-amber-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center border border-amber-600/30">
                  <Calendar className="w-6 h-6 text-amber-300" />
                </div>
                <span className="font-medium text-lg">
                  {selectedWorkshop.date}
                </span>
              </div>

              <div className="flex items-center gap-4 text-amber-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center border border-amber-600/30">
                  <Clock className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-lg">{selectedWorkshop.time}</span>
              </div>

              <div className="flex items-center gap-4 text-amber-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center border border-amber-600/30">
                  <User className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-lg">
                  Instructor: {selectedWorkshop.instructor}
                </span>
              </div>

              <div className="flex items-center gap-4 text-amber-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center border border-amber-600/30">
                  <MapPin className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-lg">{selectedWorkshop.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(-10deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes coffee-fall {
          0% {
            top: -10%;
            opacity: 0;
            transform: rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
            transform: rotate(360deg);
          }
        }

        @keyframes steam-rise {
          0% {
            bottom: 0;
            opacity: 0;
            transform: translateX(0);
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: translateX(30px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes ping-slow {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-border {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
          }
        }

        @keyframes shine {
          to {
            transform: translateX(100%) translateY(100%);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .coffee-bean {
          animation: coffee-fall linear infinite;
          font-size: 1.5em;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));
        }

        .steam-particle {
          position: absolute;
          bottom: 0;
          width: 50px;
          height: 100px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation: steam-rise 6s ease-out infinite;
          filter: blur(8px);
        }

        .animate-shimmer {
          background-size: 1000px 100%;
          animation: shimmer 3s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
