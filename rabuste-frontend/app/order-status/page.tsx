"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Package, AlertCircle, Coffee, Sparkles, Trophy, RefreshCw, Lightbulb, Heart, MapPin, Navigation, MessageSquare, X, Store, Receipt, Hash } from "lucide-react";
import { getCurrentLocation, calculateDistance, calculateDeliveryTime, formatDistance, CAFE_LOCATION, LocationError } from "@/lib/locationUtils";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  itemType?: "menu" | "art";
};

type Order = {
  _id: string;
  token?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed";
  createdAt: string;
  userLocation?: {
    lat: number;
    lng: number;
    distance?: number;
    estimatedTime?: number;
  };
  estimatedTimeToCafe?: number; // in minutes, calculated when order is created
  preparationTime?: number; // in minutes, admin configurable
  distanceFromCafe?: number; // in km
  couponCode?: string | null;
  couponDiscount?: number;
};

// Coffee facts database
const coffeeFacts = [
  "Coffee beans are actually seeds from coffee cherries! 🍒",
  "Robusta coffee has almost double the caffeine of Arabica ⚡",
  "Coffee is the world's 2nd most traded commodity after oil 🌍",
  "The word 'coffee' comes from the Arabic word 'qahwah' ☕",
  "A coffee tree can live for over 100 years! 🌳",
  "Finland consumes the most coffee per capita in the world 🇫🇮",
  "Coffee was discovered by goats in Ethiopia around 800 AD 🐐",
  "Espresso means 'pressed out' in Italian 🇮🇹",
  "Light roast coffee has more caffeine than dark roast ☕",
  "Coffee stays fresh for only 2 weeks after roasting 📦",
  "The most expensive coffee comes from animal droppings 💎",
  "Decaf coffee isn't completely caffeine-free ⚠️",
  "Coffee can help you burn fat by boosting metabolism 🔥",
  "The average coffee drinker consumes 3 cups daily 📊",
  "Instant coffee was invented in 1901 ⚡",
  "Brazil produces 40% of the world's coffee 🇧🇷",
  "A coffee tree yields about 1-2 pounds of beans per year 🌱",
  "Coffee improves physical performance by 11-12% 💪",
  "Cold brew has 67% less acid than hot coffee 🧊"
];

// Coffee tips
const coffeeTips = [
  "Store coffee beans in an airtight container away from light 💡",
  "Grind your coffee just before brewing for maximum freshness ⚡",
  "Use filtered water for the best tasting coffee 💧",
  "The ideal water temperature for brewing is 195-205°F (90-96°C) 🌡️",
  "A coffee bloom (initial pour) releases trapped CO2 for better flavor 🌸",
  "Don't reheat coffee - it breaks down the flavors 🔥",
  "Drink coffee 30-60 minutes after waking for best effect ⏰",
  "Add a pinch of salt to reduce bitterness in coffee 🧂",
  "Clean your coffee maker monthly for best taste 🧽",
  "Pair dark chocolate with your espresso for luxury 🍫"
];

// Memory Matching Game
const MemoryGame = ({ onWin }: { onWin: () => void }) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const emojis = ['☕', '🫘', '🥤', '🍩', '🧋', '🥐'];
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => onWin(), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm" style={{ color: '#B87333' }}>
          Moves: {moves}
        </p>
        <button
          onClick={() => {
            const emojis = ['☕', '🫘', '🥤', '🍩', '🧋', '🥐'];
            const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
            setCards(shuffled);
            setFlipped([]);
            setMatched([]);
            setMoves(0);
          }}
          className="text-xs px-3 py-1"
          style={{
            background: 'rgba(184, 115, 51, 0.2)',
            border: '1px solid rgba(184, 115, 51, 0.4)',
            color: '#D4A574',
          }}
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="aspect-square flex items-center justify-center text-3xl"
            style={{
              background: flipped.includes(index) || matched.includes(index)
                ? 'rgba(184, 115, 51, 0.3)'
                : 'rgba(61, 43, 31, 0.5)',
              border: '2px solid rgba(184, 115, 51, 0.4)',
              cursor: matched.includes(index) ? 'default' : 'pointer',
            }}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Coffee Trivia Quiz
const TriviaQuiz = ({ onWin }: { onWin: () => void }) => {
  const questions = [
    {
      q: "Which country is the largest coffee producer?",
      options: ["Colombia", "Brazil", "Vietnam", "Ethiopia"],
      correct: 1
    },
    {
      q: "What does 'espresso' mean in Italian?",
      options: ["Fast coffee", "Strong coffee", "Pressed out", "Dark roast"],
      correct: 2
    },
    {
      q: "Coffee beans are actually...",
      options: ["Seeds", "Beans", "Nuts", "Fruits"],
      correct: 0
    },
    {
      q: "Which has more caffeine?",
      options: ["Dark roast", "Light roast", "Medium roast", "Same"],
      correct: 1
    },
    {
      q: "A coffee tree can live for...",
      options: ["10 years", "50 years", "100+ years", "20 years"],
      correct: 2
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
      if (currentQ === questions.length - 1) {
        setTimeout(() => onWin(), 1000);
      }
    }
    
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnswered(false);
        setSelected(null);
      }
    }, 1500);
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs" style={{ color: '#8B6F47' }}>
            Question {currentQ + 1}/{questions.length}
          </span>
          <span className="text-xs gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Score: {score}
          </span>
        </div>
        <div className="h-1" style={{ background: 'rgba(61, 43, 31, 0.5)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((currentQ + 1) / questions.length) * 100}%`,
              background: 'linear-gradient(90deg, #B87333, #D4A574)',
            }}
          />
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: '#F5F1E8' }}>
        {questions[currentQ].q}
      </p>

      <div className="space-y-2">
        {questions[currentQ].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            className="w-full text-left px-4 py-3 text-sm transition-all"
            style={{
              background: answered
                ? index === questions[currentQ].correct
                  ? 'rgba(94, 125, 76, 0.3)'
                  : selected === index
                  ? 'rgba(244, 67, 54, 0.3)'
                  : 'rgba(61, 43, 31, 0.5)'
                : 'rgba(61, 43, 31, 0.5)',
              border: `1px solid ${
                answered
                  ? index === questions[currentQ].correct
                    ? 'rgba(94, 125, 76, 0.6)'
                    : selected === index
                    ? 'rgba(244, 67, 54, 0.6)'
                    : 'rgba(184, 115, 51, 0.3)'
                  : 'rgba(184, 115, 51, 0.3)'
              }`,
              color: '#F5F1E8',
              cursor: answered ? 'default' : 'pointer',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Coffee Origin Guessing Game
const OriginGame = ({ onWin }: { onWin: () => void }) => {
  const coffees = [
    { name: "Robusta", origins: ["Vietnam", "Brazil", "Indonesia"], correct: 0 },
    { name: "Arabica", origins: ["Ethiopia", "Colombia", "Yemen"], correct: 0 },
    { name: "Mocha", origins: ["Yemen", "Brazil", "Vietnam"], correct: 0 },
    { name: "Java", origins: ["Indonesia", "Ethiopia", "Colombia"], correct: 0 },
    { name: "Kona", origins: ["Hawaii", "Jamaica", "Kenya"], correct: 0 },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleGuess = (index: number) => {
    if (answered) return;
    setAnswered(true);
    
    if (index === coffees[current].correct) {
      setScore(score + 1);
      if (current === coffees.length - 1) {
        setTimeout(() => onWin(), 1000);
      }
    }
    
    setTimeout(() => {
      if (current < coffees.length - 1) {
        setCurrent(current + 1);
        setAnswered(false);
      }
    }, 1500);
  };

  return (
    <div>
      <div className="text-center mb-4">
        <p className="text-xs mb-2" style={{ color: '#8B6F47' }}>
          {current + 1}/{coffees.length} • Score: {score}
        </p>
        <p className="text-lg mb-1 gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
          {coffees[current].name}
        </p>
        <p className="text-xs" style={{ color: '#8B6F47' }}>
          Where does this coffee originate?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {coffees[current].origins.map((origin, index) => (
          <button
            key={index}
            onClick={() => handleGuess(index)}
            disabled={answered}
            className="py-3 text-sm transition-all"
            style={{
              background: answered && index === coffees[current].correct
                ? 'rgba(94, 125, 76, 0.3)'
                : 'rgba(61, 43, 31, 0.5)',
              border: `2px solid ${
                answered && index === coffees[current].correct
                  ? 'rgba(94, 125, 76, 0.6)'
                  : 'rgba(184, 115, 51, 0.4)'
              }`,
              color: '#F5F1E8',
              fontFamily: 'var(--font-body)',
            }}
          >
            {origin}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function OrderStatusPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFact, setCurrentFact] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [activeGame, setActiveGame] = useState<'memory' | 'trivia' | 'origin'>('memory');
  const [gameStats, setGameStats] = useState({ memory: 0, trivia: 0, origin: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [completedOrdersVisible, setCompletedOrdersVisible] = useState(3);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showPastOrders, setShowPastOrders] = useState(false);

  useEffect(() => {
    fetchOrders();
    getUserLocation();
    fetchGameStats();
    
    // Poll for order updates every 5 seconds
    const orderPollInterval = setInterval(() => {
      fetchOrders();
    }, 5000);
    
    // Rotate facts every 10 seconds
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % coffeeFacts.length);
    }, 10000);

    // Rotate tips every 12 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % coffeeTips.length);
    }, 12000);

    return () => {
      clearInterval(orderPollInterval);
      clearInterval(factInterval);
      clearInterval(tipInterval);
    };
  }, []);

  async function fetchGameStats() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/games/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const stats = await res.json();
        setGameStats({
          memory: stats.memory || 0,
          trivia: stats.trivia || 0,
          origin: stats.origin || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch game stats", err);
    }
  }

  async function recordGameCompletion(gameType: 'memory' | 'trivia' | 'origin') {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/games/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameType }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Show coupon notification if generated
        if (data.couponGenerated && data.couponCode) {
          alert(`🎉 Congratulations! You've completed 3 games and earned a coupon!\n\nCoupon Code: ${data.couponCode}\nDiscount: ₹50 OFF\n\nCheck your email for details!`);
        }
        
        // Update stats
        await fetchGameStats();
      }
    } catch (err) {
      console.error("Failed to record game completion", err);
    }
  }

  // Show pickup modal when there are pending orders (first time only)
  useEffect(() => {
    const hasSeenPickupModal = sessionStorage.getItem('hasSeenPickupModal');
    if (orders.length > 0 && !loading && !hasSeenPickupModal) {
      const pendingOrders = orders.filter((order) => order.status === "pending");
      if (pendingOrders.length > 0) {
        setShowPickupModal(true);
        sessionStorage.setItem('hasSeenPickupModal', 'true');
      }
    }
  }, [orders, loading]);

  const handleClosePickupModal = () => {
    setShowPickupModal(false);
  };

  const handleOpenPickupModal = () => {
    setShowPickupModal(true);
  };

  async function getUserLocation() {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setLocationError(null);
    } catch (error) {
      const locationError = error as LocationError;
      
      // Only log as warning instead of error, since this is expected behavior
      if (locationError.type === 'permission_denied') {
        console.warn("Location access denied by user - delivery ETA features will be unavailable");
      } else {
        console.warn(`Location unavailable (${locationError.type}): ${locationError.message}`);
      }
      
      setLocationError(locationError.message || "Location access denied. Enable location to see delivery ETA.");
    }
  }

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        return;
      }

      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Order[] = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      // Keep all orders (both pending and completed) and calculate location data
      const ordersWithLocation = data.map((order: Order) => {
        if (order.status === 'pending' && userLocation) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            CAFE_LOCATION.lat,
            CAFE_LOCATION.lng
          );
          const estimatedTime = calculateDeliveryTime(distance);
          
          return {
            ...order,
            userLocation: {
              ...userLocation,
              distance,
              estimatedTime,
            },
          };
        }
        return order;
      });
      
      setOrders(ordersWithLocation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const estimatedTime = (order: Order) => {
    // Use backend-stored total time if available (preparationTime + estimatedTimeToCafe)
    if (order.preparationTime !== undefined && order.estimatedTimeToCafe !== undefined) {
      return order.preparationTime + order.estimatedTimeToCafe;
    }
    
    // Fallback: Use location-based ETA if available
    if (order.userLocation?.estimatedTime) {
      return order.userLocation.estimatedTime;
    }
    
    // Final fallback: Estimate based on menu items
    const menuItems = order.items.filter(item => item.itemType === 'menu' || !item.itemType);
    const menuItemCount = menuItems.reduce((sum, item) => sum + item.quantity, 0);
    return menuItemCount > 0 ? Math.max(10, menuItemCount * 3) : 0; // 3 mins per item, minimum 10 mins
  };

  const hasArtItems = (order: Order) => {
    return order.items.some(item => item.itemType === 'art');
  };

  const hasMenuItems = (order: Order) => {
    return order.items.some(item => item.itemType === 'menu' || !item.itemType);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6"
              style={{
                borderColor: '#B87333',
                borderTopColor: 'transparent',
              }}
            />
            <p
              className="text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#B87333',
                letterSpacing: '0.1em',
              }}
            >
              LOADING ORDERS...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Separate pending and completed orders
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter((order) => order.status === "completed");

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-8"
            >
              <Package
                size={80}
                style={{ color: '#B87333' }}
                className="mx-auto"
              />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                letterSpacing: '0.05em',
              }}
            >
              NO ORDERS YET
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: '#8B6F47', lineHeight: 1.7 }}
            >
              You don't have any orders at the moment
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn-primary"
            >
              EXPLORE MENU
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      {/* Pickup Location Modal */}
      <AnimatePresence>
        {showPickupModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={handleClosePickupModal}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{ pointerEvents: 'none' }}
            >
              <div
                className="relative max-w-lg w-full p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.98), rgba(43, 24, 16, 0.98))',
                  border: '3px solid rgba(184, 115, 51, 0.6)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 115, 51, 0.3), inset 0 1px 0 rgba(184, 115, 51, 0.2)',
                  pointerEvents: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={handleClosePickupModal}
                  className="absolute top-4 right-4 p-2 transition-all hover:scale-110"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    border: '2px solid rgba(184, 115, 51, 0.4)',
                  }}
                  aria-label="Close"
                >
                  <X size={20} style={{ color: '#B87333' }} />
                </button>

                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="p-6 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                      boxShadow: '0 10px 30px rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Store size={48} style={{ color: '#000' }} />
                  </div>
                </motion.div>

                {/* Title */}
                <h2
                  className="text-3xl md:text-4xl mb-4 text-center uppercase"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    letterSpacing: '0.05em',
                    textShadow: '0 2px 10px rgba(184, 115, 51, 0.3)',
                  }}
                >
                  Pickup Location
                </h2>

                <p
                  className="text-center text-lg mb-6"
                  style={{
                    color: '#D4A574',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Please collect your order from our shop
                </p>

                {/* Divider */}
                <div
                  className="h-px mb-6"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #B87333, transparent)',
                  }}
                />

                {/* Shop Details */}
                <div
                  className="p-5 mb-6"
                  style={{
                    background: 'rgba(184, 115, 51, 0.1)',
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Coffee size={24} style={{ color: '#B87333', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h3
                        className="text-2xl mb-2"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#FFFEF9',
                          letterSpacing: '0.05em',
                        }}
                      >
                        RABUSTE
                      </h3>
                      <div className="flex items-start gap-2">
                        <MapPin size={18} style={{ color: '#B87333', flexShrink: 0, marginTop: '2px' }} />
                        <p
                          className="text-base leading-relaxed"
                          style={{
                            color: '#D4A574',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          Dimple Row House, 15, Gymkhana Road,<br />
                          Piplod, Surat, Gujarat 395007
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Link */}
                  <a
                    href="https://maps.google.com/?q=Dimple+Row+House+15+Gymkhana+Road+Piplod+Surat+Gujarat+395007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 mt-4 transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                      color: '#000',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '16px',
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Navigation size={18} />
                    Get Directions
                  </a>
                </div>

                {/* Note */}
                <div
                  className="text-center p-4"
                  style={{
                    background: 'rgba(255, 183, 77, 0.1)',
                    border: '1px solid rgba(255, 183, 77, 0.3)',
                  }}
                >
                  <p
                    className="text-sm"
                    style={{
                      color: '#FFB74D',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    ☕ Your order will be ready for pickup shortly!
                  </p>
                </div>

                {/* Got It Button */}
                <button
                  onClick={handleClosePickupModal}
                  className="w-full py-4 mt-6 transition-all hover:scale-105"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    border: '2px solid rgba(184, 115, 51, 0.4)',
                    color: '#D4A574',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Got It!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-4 md:px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                TRACK YOUR ORDERS
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </div>

            <h1
              className="text-5xl md:text-7xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                lineHeight: 0.9,
                color: '#FFFEF9',
                letterSpacing: '0.05em',
              }}
            >
              YOUR <span className="gradient-text">ORDERS</span>
            </h1>

            {/* Pickup Location Button */}
            <motion.button
              onClick={handleOpenPickupModal}
              className="inline-flex items-center gap-3 px-6 py-3 mt-4 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(184, 115, 51, 0.4)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Store size={20} />
              View Pickup Location
            </motion.button>
            
            {/* Location Status */}
            {userLocation && (
              <div className="inline-flex items-center gap-2 mt-2 text-sm" style={{ color: '#B87333' }}>
                <MapPin size={16} />
                <span>Delivery location detected</span>
              </div>
            )}
            {locationError && (
              <div
                className="inline-block mt-2 px-4 py-2 rounded-lg max-w-md"
                style={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={16} style={{ color: '#FF9800', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#FFB74D' }}>
                      Location features unavailable
                    </p>
                    <p className="text-xs" style={{ color: '#FFB74D', opacity: 0.8 }}>
                      {locationError}
                    </p>
                  </div>
                </div>
                <button
                  onClick={getUserLocation}
                  className="text-xs px-3 py-1 rounded transition-all hover:opacity-80"
                  style={{ 
                    background: 'rgba(255, 152, 0, 0.2)',
                    border: '1px solid rgba(255, 152, 0, 0.4)',
                    color: '#FFB74D' 
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Orders Column - Takes more space */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active Orders Section */}
              {pendingOrders.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="copper-line flex-1" />
                    <span 
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#B87333',
                        letterSpacing: '0.1em',
                      }}
                    >
                      ACTIVE ORDERS
                    </span>
                    <div className="copper-line flex-1" style={{ transform: 'scaleX(-1)' }} />
                  </div>
                  
                  <AnimatePresence>
                    {pendingOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="brutal-card p-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4"
                      style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.2)' }}
                    >
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock size={20} style={{ color: '#B87333' }} />
                          <span
                            className="text-sm"
                            style={{
                              color: '#8B6F47',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Placed {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {order.token && (
                          <div className="flex items-center gap-2 mb-1">
                            <Hash size={16} style={{ color: '#B87333' }} />
                            <span
                              className="text-sm font-bold"
                              style={{
                                color: '#B87333',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {order.token}
                            </span>
                          </div>
                        )}
                        <p
                          className="text-xs"
                          style={{
                            color: '#8B6F47',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {hasMenuItems(order) && (
                          <>
                            <div
                              className="inline-flex items-center gap-2 px-4 py-2"
                              style={{
                                background: 'rgba(255, 183, 77, 0.2)',
                                border: '2px solid rgba(255, 183, 77, 0.4)',
                              }}
                            >
                              <AlertCircle size={18} style={{ color: '#FFB74D' }} />
                              <span
                                className="text-sm"
                                style={{
                                  color: '#FFB74D',
                                  fontFamily: 'var(--font-heading)',
                                  letterSpacing: '0.1em',
                                }}
                              >
                                PREPARING
                              </span>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-xs" style={{ color: '#8B6F47' }}>
                                {order.userLocation ? 'Delivery ETA' : 'Est. time'}
                              </p>
                              <p
                                className="text-lg gradient-text"
                                style={{ fontFamily: 'var(--font-heading)' }}
                              >
                                ~{estimatedTime(order)} min
                              </p>
                            </div>
                            
                            {/* Distance Info */}
                            {order.userLocation && (
                              <div className="flex items-center gap-2 text-xs" style={{ color: '#8B6F47' }}>
                                <Navigation size={14} />
                                <span>{formatDistance(order.userLocation.distance!)} away</span>
                              </div>
                            )}
                          </>
                        )}
                        {hasArtItems(order) && !hasMenuItems(order) && (
                          <div
                            className="inline-flex items-center gap-2 px-4 py-2"
                            style={{
                              background: 'rgba(184, 115, 51, 0.2)',
                              border: '2px solid rgba(184, 115, 51, 0.4)',
                            }}
                          >
                            <Package size={18} style={{ color: '#B87333' }} />
                            <span
                              className="text-sm"
                              style={{
                                color: '#B87333',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.1em',
                              }}
                            >
                              READY FOR PICKUP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (i * 0.05) }}
                          className="flex justify-between items-center pb-3"
                          style={{
                            borderBottom: i < order.items.length - 1
                              ? '1px solid rgba(184, 115, 51, 0.15)'
                              : 'none',
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {item.itemType === 'art' ? (
                              <Sparkles size={16} style={{ color: '#D4A574' }} />
                            ) : (
                              <Coffee size={16} style={{ color: '#B87333' }} />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3
                                  className="text-base"
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    color: '#F5F1E8',
                                    letterSpacing: '0.03em',
                                  }}
                                >
                                  {item.name}
                                </h3>
                                {item.itemType === 'art' && (
                                  <span 
                                    className="text-xs px-2 py-0.5 uppercase"
                                    style={{
                                      background: 'rgba(184, 115, 51, 0.2)',
                                      color: '#B87333',
                                      border: '1px solid rgba(184, 115, 51, 0.4)',
                                    }}
                                  >
                                    ARTWORK
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-sm"
                                style={{ color: '#8B6F47' }}
                              >
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div
                            className="text-lg gradient-text"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            ₹{item.price * item.quantity}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div
                      className="flex justify-between items-center pt-4"
                      style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}
                    >
                      <span
                        className="text-xl"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#F5F1E8',
                          letterSpacing: '0.05em',
                        }}
                      >
                        TOTAL
                      </span>
                      <span
                        className="text-2xl gradient-text"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div
                        className="h-2 overflow-hidden"
                        style={{
                          background: 'rgba(61, 43, 31, 0.5)',
                          border: '1px solid rgba(184, 115, 51, 0.3)',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "45%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)',
                          }}
                        />
                      </div>
                      <p className="text-xs mt-2 text-center" style={{ color: '#8B6F47' }}>
                        Your order is being prepared with love ❤️
                      </p>
                    </div>

                    {/* View Receipt Button */}
                    {order.token && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => router.push(`/receipt/${order._id}`)}
                          className="flex items-center gap-2 px-6 py-3 transition-all hover:scale-105"
                          style={{
                            background: 'rgba(184, 115, 51, 0.2)',
                            border: '2px solid rgba(184, 115, 51, 0.4)',
                            color: '#D4A574',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '14px',
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                          }}
                        >
                          <Receipt size={18} />
                          VIEW RECEIPT
                        </button>
                      </div>
                    )}
                  </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* View Past Orders Button */}
              {completedOrders.length > 0 && !showPastOrders && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-12"
                >
                  <button
                    onClick={() => setShowPastOrders(true)}
                    className="px-8 py-4 rounded-lg transition-all hover:scale-105 font-bold uppercase tracking-wide flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(94, 125, 76, 0.3), rgba(94, 125, 76, 0.2))',
                      border: '2px solid rgba(94, 125, 76, 0.5)',
                      color: '#5E7D4C',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.1em',
                      boxShadow: '0 4px 15px rgba(94, 125, 76, 0.2)',
                    }}
                  >
                    <Trophy size={20} />
                    View Past Orders ({completedOrders.length})
                  </button>
                </motion.div>
              )}

              {/* Completed Orders Section */}
              {completedOrders.length > 0 && showPastOrders && (
                <div className="space-y-6 mt-12">
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex-1 h-px"
                      style={{ 
                        background: 'linear-gradient(90deg, transparent, rgba(94, 125, 76, 0.5), transparent)' 
                      }}
                    />
                    <span 
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#5E7D4C',
                        letterSpacing: '0.1em',
                      }}
                    >
                      COMPLETED ORDERS
                    </span>
                    <div 
                      className="flex-1 h-px"
                      style={{ 
                        background: 'linear-gradient(90deg, transparent, rgba(94, 125, 76, 0.5), transparent)',
                        transform: 'scaleX(-1)' 
                      }}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {completedOrders.slice(0, completedOrdersVisible).map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6"
                        style={{
                          background: 'rgba(94, 125, 76, 0.05)',
                          border: '2px solid rgba(94, 125, 76, 0.3)',
                          position: 'relative',
                        }}
                      >
                        {/* Completed Badge */}
                        <div
                          className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2"
                          style={{
                            background: 'rgba(94, 125, 76, 0.2)',
                            border: '2px solid rgba(94, 125, 76, 0.5)',
                          }}
                        >
                          <Trophy size={18} style={{ color: '#5E7D4C' }} />
                          <span
                            className="text-sm"
                            style={{
                              color: '#5E7D4C',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            COMPLETED
                          </span>
                        </div>

                        {/* Order Header */}
                        <div className="mb-6 pb-4 pr-32"
                          style={{ borderBottom: '2px solid rgba(94, 125, 76, 0.2)' }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Clock size={20} style={{ color: '#5E7D4C' }} />
                            <span
                              className="text-sm"
                              style={{
                                color: '#5E7D4C',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              Completed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {order.token && (
                            <div className="flex items-center gap-2 mb-1">
                              <Hash size={16} style={{ color: '#5E7D4C' }} />
                              <span
                                className="text-sm font-bold"
                                style={{
                                  color: '#5E7D4C',
                                  fontFamily: 'var(--font-heading)',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {order.token}
                              </span>
                            </div>
                          )}
                          <p
                            className="text-xs"
                            style={{
                              color: '#8B6F47',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>

                        {/* Feedback Button */}
                        <div className="mb-4">
                          <button
                            onClick={() => router.push(`/feedback?orderId=${order._id}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: 'rgba(184, 115, 51, 0.2)',
                              border: '1px solid rgba(184, 115, 51, 0.4)',
                              color: '#D4A574',
                            }}
                          >
                            <MessageSquare size={16} />
                            <span className="text-sm font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                              Share Feedback
                            </span>
                          </button>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + (i * 0.05) }}
                              className="flex justify-between items-center pb-3"
                              style={{
                                borderBottom: i < order.items.length - 1
                                  ? '1px solid rgba(94, 125, 76, 0.15)'
                                  : 'none',
                              }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {item.itemType === 'art' ? (
                                  <Sparkles size={16} style={{ color: '#5E7D4C' }} />
                                ) : (
                                  <Coffee size={16} style={{ color: '#5E7D4C' }} />
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className="text-base"
                                      style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: '#F5F1E8',
                                        letterSpacing: '0.03em',
                                      }}
                                    >
                                      {item.name}
                                    </h3>
                                    {item.itemType === 'art' && (
                                      <span 
                                        className="text-xs px-2 py-0.5 uppercase"
                                        style={{
                                          background: 'rgba(94, 125, 76, 0.2)',
                                          color: '#5E7D4C',
                                          border: '1px solid rgba(94, 125, 76, 0.4)',
                                        }}
                                      >
                                        ARTWORK
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className="text-sm"
                                    style={{ color: '#8B6F47' }}
                                  >
                                    ₹{item.price} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="text-lg"
                                style={{ 
                                  fontFamily: 'var(--font-heading)',
                                  color: '#5E7D4C',
                                }}
                              >
                                ₹{item.price * item.quantity}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Order Total */}
                        <div
                          className="flex justify-between items-center pt-4"
                          style={{ borderTop: '2px solid rgba(94, 125, 76, 0.3)' }}
                        >
                          <span
                            className="text-xl"
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: '#F5F1E8',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </span>
                          <span
                            className="text-2xl"
                            style={{ 
                              fontFamily: 'var(--font-heading)',
                              color: '#5E7D4C',
                            }}
                          >
                            ₹{order.totalAmount}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                          {order.token && (
                            <button
                              onClick={() => router.push(`/receipt/${order._id}`)}
                              className="flex items-center gap-2 px-6 py-3 transition-all hover:scale-105"
                              style={{
                                background: 'rgba(94, 125, 76, 0.2)',
                                border: '2px solid rgba(94, 125, 76, 0.4)',
                                color: '#5E7D4C',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '14px',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                              }}
                            >
                              <Receipt size={18} />
                              VIEW RECEIPT
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/feedback?orderId=${order._id}`)}
                            className="flex items-center gap-2 px-6 py-3 transition-all hover:scale-105"
                            style={{
                              background: 'rgba(184, 115, 51, 0.2)',
                              border: '2px solid rgba(184, 115, 51, 0.4)',
                              color: '#D4A574',
                              fontFamily: 'var(--font-heading)',
                              fontSize: '14px',
                              fontWeight: 900,
                              letterSpacing: '0.1em',
                            }}
                          >
                            <MessageSquare size={18} />
                            SHARE FEEDBACK
                          </button>
                        </div>

                        {/* Thank You Message */}
                        <div className="mt-4 text-center">
                          <p className="text-sm" style={{ color: '#8B6F47' }}>
                            Thank you for your order! ❤️
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* View More / Hide Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    {completedOrders.length > completedOrdersVisible && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setCompletedOrdersVisible(prev => prev + 3)}
                        className="px-8 py-4 rounded-lg transition-all hover:scale-105 font-bold uppercase tracking-wide"
                        style={{
                          background: 'linear-gradient(135deg, rgba(94, 125, 76, 0.3), rgba(94, 125, 76, 0.2))',
                          border: '2px solid rgba(94, 125, 76, 0.5)',
                          color: '#5E7D4C',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        View More ({completedOrders.length - completedOrdersVisible} remaining)
                      </motion.button>
                    )}
                    
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setShowPastOrders(false);
                        setCompletedOrdersVisible(3);
                      }}
                      className="px-8 py-4 rounded-lg transition-all hover:scale-105 font-bold uppercase tracking-wide"
                      style={{
                        background: 'rgba(139, 111, 71, 0.2)',
                        border: '2px solid rgba(139, 111, 71, 0.4)',
                        color: '#8B6F47',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Hide Past Orders
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Column - Takes remaining space */}
            <div className="lg:col-span-2 space-y-6">
              {/* Coffee Fact */}
              <motion.div
                key={`fact-${currentFact}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="brutal-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles size={24} style={{ color: '#B87333' }} />
                  <h3
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                  >
                    DID YOU KNOW?
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#8B6F47' }}>
                  {coffeeFacts[currentFact]}
                </p>
                <button
                  onClick={() => setCurrentFact((currentFact + 1) % coffeeFacts.length)}
                  className="mt-4 text-xs px-3 py-1 flex items-center gap-2"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    border: '1px solid rgba(184, 115, 51, 0.4)',
                    color: '#D4A574',
                  }}
                >
                  <RefreshCw size={12} />
                  Next Fact
                </button>
              </motion.div>

              {/* Coffee Tip */}
              <motion.div
                key={`tip-${currentTip}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="brutal-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb size={24} style={{ color: '#FFB74D' }} />
                  <h3
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                  >
                    PRO TIP
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#8B6F47' }}>
                  {coffeeTips[currentTip]}
                </p>
                <button
                  onClick={() => setCurrentTip((currentTip + 1) % coffeeTips.length)}
                  className="mt-4 text-xs px-3 py-1 flex items-center gap-2"
                  style={{
                    background: 'rgba(255, 183, 77, 0.2)',
                    border: '1px solid rgba(255, 183, 77, 0.4)',
                    color: '#FFB74D',
                  }}
                >
                  <RefreshCw size={12} />
                  Next Tip
                </button>
              </motion.div>

              {/* Interactive Games Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="brutal-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Trophy size={24} style={{ color: '#D4A574' }} />
                  <h3
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                  >
                    PLAY & WIN
                  </h3>
                </div>

                {/* Game Selector */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveGame('memory')}
                    className="flex-1 py-2 text-xs transition-all"
                    style={{
                      background: activeGame === 'memory' ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                      border: `1px solid ${activeGame === 'memory' ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                      color: activeGame === 'memory' ? '#D4A574' : '#B87333',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Memory {gameStats.memory > 0 && `(${gameStats.memory})`}
                  </button>
                  <button
                    onClick={() => setActiveGame('trivia')}
                    className="flex-1 py-2 text-xs transition-all"
                    style={{
                      background: activeGame === 'trivia' ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                      border: `1px solid ${activeGame === 'trivia' ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                      color: activeGame === 'trivia' ? '#D4A574' : '#B87333',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Trivia {gameStats.trivia > 0 && `(${gameStats.trivia})`}
                  </button>
                  <button
                    onClick={() => setActiveGame('origin')}
                    className="flex-1 py-2 text-xs transition-all"
                    style={{
                      background: activeGame === 'origin' ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                      border: `1px solid ${activeGame === 'origin' ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                      color: activeGame === 'origin' ? '#D4A574' : '#B87333',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Origins {gameStats.origin > 0 && `(${gameStats.origin})`}
                  </button>
                </div>

                {/* Active Game */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGame}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {activeGame === 'memory' && (
                      <MemoryGame
                        onWin={async () => {
                          setGameStats(prev => ({ ...prev, memory: prev.memory + 1 }));
                          await recordGameCompletion('memory');
                        }}
                      />
                    )}
                    {activeGame === 'trivia' && (
                      <TriviaQuiz
                        onWin={async () => {
                          setGameStats(prev => ({ ...prev, trivia: prev.trivia + 1 }));
                          await recordGameCompletion('trivia');
                        }}
                      />
                    )}
                    {activeGame === 'origin' && (
                      <OriginGame
                        onWin={async () => {
                          setGameStats(prev => ({ ...prev, origin: prev.origin + 1 }));
                          await recordGameCompletion('origin');
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Fun Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="brutal-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart size={24} style={{ color: '#FF6B6B' }} />
                  <h3
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                  >
                    YOUR RABUSTE STATS
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#8B6F47' }}>
                      Active Orders
                    </span>
                    <span className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      {pendingOrders.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#8B6F47' }}>
                      Completed Orders
                    </span>
                    <span className="text-lg" style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}>
                      {completedOrders.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#8B6F47' }}>
                      Total Items (Active)
                    </span>
                    <span className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      {pendingOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#8B6F47' }}>
                      Total Wins
                    </span>
                    <span className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      {gameStats.memory + gameStats.trivia + gameStats.origin}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}