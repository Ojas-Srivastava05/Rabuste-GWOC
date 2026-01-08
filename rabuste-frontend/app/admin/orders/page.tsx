"use client";
import { useEffect, useState } from "react";
import { Package, CheckCircle2, Clock, Mail, FileText, MapPin, Navigation, Loader2, Ticket } from "lucide-react";
import { getCurrentLocation, calculateDistance, calculateDeliveryTime, formatDistance, CAFE_LOCATION, LocationError } from "@/lib/locationUtils";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  itemType?: "menu" | "art";
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
  couponDescription?: string | null;
  status: "pending" | "completed";
  createdAt: string;
  instructions?: string;
  userLocation?: {
    lat: number;
    lng: number;
    distance?: number;
    estimatedTime?: number;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const fetchOrders = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // Check for error response from API
      if (!res.ok || data.error) {
        console.error("API error:", data.error || `HTTP ${res.status}`);
        setOrders([]);
        if (showRefreshing) setIsRefreshing(false);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("Expected orders array, got:", data);
        setOrders([]);
        if (showRefreshing) setIsRefreshing(false);
        return;
      }

      // Log orders with coupon information
      const ordersWithCoupons = data.filter((o: Order) => o.couponCode || o.couponDiscount);
      if (ordersWithCoupons.length > 0) {
        console.log('✅ Orders with coupons:', ordersWithCoupons.map((o: Order) => ({
          id: o._id,
          customer: o.customerName,
          couponCode: o.couponCode,
          couponDiscount: o.couponDiscount,
          totalAmount: o.totalAmount
        })));
      } else {
        console.log('⚠️ No orders with coupon data found. Checking first 3 orders:', data.slice(0, 3).map((o: Order) => ({
          id: o._id,
          customer: o.customerName,
          couponCode: o.couponCode,
          couponDiscount: o.couponDiscount,
          hasCouponCodeField: 'couponCode' in o,
          hasCouponDiscountField: 'couponDiscount' in o,
        })));
      }
      
      setOrders(data);
      if (showRefreshing) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
      if (showRefreshing) setIsRefreshing(false);
    }
  };

  const markCompleted = async (orderId: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "completed" }),
    });

    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updated._id
            ? { ...order, status: updated.status }
            : order
        )
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up polling for real-time updates every 10 seconds
    const pollInterval = setInterval(() => {
      fetchOrders();
    }, 10000);

    // Request location permission
    requestLocationPermission();

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      await getCurrentLocation();
      setLocationPermission('granted');
      setLocationError(null);
    } catch (error) {
      const locationError = error as LocationError;
      
      // Only log as warning instead of error, since this is expected behavior
      if (locationError.type === 'permission_denied') {
        console.warn("Location access denied by user - ETA features will be unavailable");
      } else {
        console.warn(`Location unavailable (${locationError.type}): ${locationError.message}`);
      }
      
      setLocationPermission('denied');
      setLocationError(locationError.message);
    }
  };

  const calculateOrderETA = async (order: Order) => {
    if (locationPermission !== 'granted') return;

    try {
      const userLocation = await getCurrentLocation();
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        CAFE_LOCATION.lat,
        CAFE_LOCATION.lng
      );
      const estimatedTime = calculateDeliveryTime(distance);

      // Update order with location data
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id
            ? {
                ...o,
                userLocation: {
                  ...userLocation,
                  distance,
                  estimatedTime,
                },
              }
            : o
        )
      );
    } catch (error) {
      console.error("Error calculating ETA:", error);
    }
  };

  useEffect(() => {
    // Calculate ETA for all pending orders when location permission is granted
    if (locationPermission === 'granted') {
      orders.filter(o => o.status === 'pending').forEach(order => {
        if (!order.userLocation) {
          calculateOrderETA(order);
        }
      });
    }
  }, [orders, locationPermission]);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  // Filter orders based on active filter
  const displayedOrders = activeFilter === 'all' 
    ? orders 
    : activeFilter === 'pending' 
    ? pendingOrders 
    : completedOrders;

  // Handler for filter clicks
  const handleFilterClick = (filter: 'all' | 'pending' | 'completed') => {
    setActiveFilter(filter);
    // Smooth scroll to orders section
    setTimeout(() => {
      const ordersSection = document.getElementById('orders-section');
      if (ordersSection) {
        ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
        <div className="flex flex-col gap-4 mb-6">
          <div className="inline-flex items-center gap-4 mb-4 sm:mb-6">
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
            ORDER <span className="gradient-text">MANAGEMENT</span>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1" />
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {isRefreshing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                REFRESHING...
              </>
            ) : (
              <>
                <Clock size={20} />
                REFRESH ORDERS
              </>
            )}
          </button>
        </div>
        
        {/* Location Status Banner */}
        {locationPermission === 'denied' && (
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={20} style={{ color: '#FF9800', flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: '#FFB74D' }}>
                  Location features unavailable
                </p>
                <p className="text-xs mb-2" style={{ color: '#FFB74D', opacity: 0.9 }}>
                  {locationError || 'Enable location to see delivery ETAs and distances.'}
                </p>
                <div className="text-xs space-y-1 mb-2" style={{ color: '#FFB74D', opacity: 0.7 }}>
                  <p>• Check if location services are enabled on your device</p>
                  <p>• Allow location access in your browser settings</p>
                  <p>• Try refreshing the page after enabling location</p>
                </div>
                <button
                  onClick={requestLocationPermission}
                  className="mt-1 text-xs px-3 py-1 rounded transition-all hover:opacity-80"
                  style={{ 
                    background: 'rgba(255, 152, 0, 0.2)',
                    border: '1px solid rgba(255, 152, 0, 0.4)',
                    color: '#FFB74D' 
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <button 
          onClick={() => handleFilterClick('pending')}
          className={`brutal-card p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 ${
            activeFilter === 'pending' ? 'ring-2 ring-[#B87333] shadow-lg shadow-[#B87333]/50' : ''
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <Clock size={24} className="text-[#B87333]" />
            <span className="section-label text-sm">PENDING</span>
          </div>
          <p
            className="text-3xl sm:text-5xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pendingOrders.length}
          </p>
        </button>

        <button 
          onClick={() => handleFilterClick('completed')}
          className={`brutal-card p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 ${
            activeFilter === 'completed' ? 'ring-2 ring-[#6f8f72] shadow-lg shadow-[#6f8f72]/50' : ''
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <CheckCircle2 size={24} className="text-[#6f8f72]" />
            <span className="section-label text-sm">COMPLETED</span>
          </div>
          <p
            className="text-3xl sm:text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: '#6f8f72' }}
          >
            {completedOrders.length}
          </p>
        </button>

        <button 
          onClick={() => handleFilterClick('all')}
          className={`brutal-card p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 ${
            activeFilter === 'all' ? 'ring-2 ring-[#B87333] shadow-lg shadow-[#B87333]/50' : ''
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <Package size={24} className="text-[#B87333]" />
            <span className="section-label text-sm">TOTAL</span>
          </div>
          <p
            className="text-3xl sm:text-5xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {orders.length}
          </p>
        </button>
      </div>

      {orders.length === 0 && (
        <div className="brutal-card p-12 text-center max-w-2xl mx-auto">
          <Package size={64} className="text-[#B87333] mx-auto mb-6" />
          <p className="text-xl" style={{ color: '#8B6F47' }}>
            No orders yet. Orders will appear here once customers place them.
          </p>
        </div>
      )}

      {/* Orders List */}
      {displayedOrders.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {activeFilter === 'pending' ? 'Pending Orders' : activeFilter === 'completed' ? 'Completed Orders' : 'All Orders'}
          </h2>
          <span className="text-[#8B6F47]">
            Showing {displayedOrders.length} of {orders.length} orders
          </span>
        </div>
      )}
      
      <div id="orders-section" className="space-y-6">
        {displayedOrders.map((order) => {
          // Calculate if coupon was applied using simple math
          const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const amountPaid = order.totalAmount;
          const hasCouponApplied = itemsTotal > amountPaid;
          const discountAmount = hasCouponApplied ? itemsTotal - amountPaid : 0;
          const discountPercentage = hasCouponApplied ? Math.round((discountAmount / itemsTotal) * 100) : 0;
          
          return (
          <div
            key={order._id}
            className="brutal-card p-8"
            style={{
              background:
                order.status === "pending"
                  ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(42, 24, 16, 0.8))'
                  : 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))',
            }}
          >
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    className="text-3xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                    }}
                  >
                    {order.customerName}
                  </h2>
                {/* Inline Coupon Indicator next to name */}
                  {hasCouponApplied && (
                    <span
                      className="text-2xl"
                      title={`Coupon Applied - ₹${discountAmount} off (${discountPercentage}% discount)`}
                    >
                      🎫
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: '#8B6F47' }}>
                  <Mail size={16} />
                  {order.customerEmail}
                </div>
                <div className="text-xs" style={{ color: '#8B6F47' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                
                {/* Location-based ETA */}
                {order.status === 'pending' && order.userLocation && (
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#B87333' }}>
                      <Navigation size={16} />
                      <span>{formatDistance(order.userLocation.distance!)}</span>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        color: '#4CAF50',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      ETA: ~{order.userLocation.estimatedTime} min
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Coupon Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Coupon Badge - Simple math based */}
                {hasCouponApplied && (
                  <div
                    className="px-4 py-2 rounded-full uppercase tracking-widest text-sm font-bold flex items-center gap-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      color: '#FFFFFF',
                      border: '2px solid #16A34A',
                      boxShadow: '0 0 24px rgba(34, 197, 94, 0.6)',
                    }}
                  >
                    <Ticket size={16} />
                    💰 {discountPercentage}% OFF
                  </div>
                )}
                
                {/* Status Badge */}
                <div
                  className="px-5 py-2 rounded-full uppercase tracking-widest text-sm font-bold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background:
                      order.status === "pending"
                        ? 'linear-gradient(135deg, #B87333, #CD7F32)'
                        : 'rgba(111, 143, 114, 0.3)',
                    color: order.status === "pending" ? '#000000' : '#6f8f72',
                    border: order.status === "completed" ? '2px solid #6f8f72' : 'none',
                  }}
                >
                  {order.status}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3
                className="text-xl mb-4 flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                }}
              >
                <FileText size={20} />
                ORDER ITEMS
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-lg"
                    style={{
                      background: item.itemType === 'art' 
                        ? 'rgba(184, 115, 51, 0.15)' 
                        : 'rgba(0, 0, 0, 0.3)',
                      border: `2px solid ${item.itemType === 'art' 
                        ? 'rgba(184, 115, 51, 0.4)' 
                        : 'rgba(184, 115, 51, 0.2)'}`,
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" style={{ color: '#F5F1E8' }}>
                          {item.name}
                        </span>
                        {item.itemType === 'art' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase"
                            style={{
                              background: 'rgba(184, 115, 51, 0.3)',
                              color: '#D4A574',
                              border: '1px solid rgba(184, 115, 51, 0.5)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            🎨 ARTWORK
                          </span>
                        )}
                        {item.itemType === 'menu' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase"
                            style={{
                              background: 'rgba(139, 111, 71, 0.2)',
                              color: '#8B6F47',
                              border: '1px solid rgba(139, 111, 71, 0.4)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            ☕ MENU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm" style={{ color: '#8B6F47' }}>
                        <span>× {item.quantity}</span>
                        {item.itemType === 'art' && (
                          <span className="text-xs" style={{ color: '#B87333' }}>
                            • Ready for pickup
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xl gradient-text font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.instructions && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(184, 115, 51, 0.1)',
                  border: '1px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                <p className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#B87333' }}>
                  Special Instructions
                </p>
                <p style={{ color: '#D4A574' }}>{order.instructions}</p>
              </div>
            )}

            {/* Coupon Information - Math-based discount display */}
            {hasCouponApplied && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(111, 143, 114, 0.15)',
                  border: '1px solid rgba(111, 143, 114, 0.4)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={16} style={{ color: '#6f8f72' }} />
                  <p className="text-sm font-bold uppercase tracking-wide" style={{ color: '#6f8f72' }}>
                    Discount Applied
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p style={{ color: '#8DB98D' }}>
                      Items Total: <span className="font-bold">₹{itemsTotal}</span>
                    </p>
                    <p className="font-bold text-lg" style={{ color: '#6f8f72' }}>
                      {discountPercentage}% OFF
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p style={{ color: '#8DB98D' }}>
                      Discount Amount:
                    </p>
                    <p className="font-bold" style={{ color: '#6f8f72' }}>
                      - ₹{discountAmount}
                    </p>
                  </div>
                  {order.couponCode && (
                    <p className="text-sm" style={{ color: '#8DB98D', opacity: 0.9 }}>
                      Code: <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>{order.couponCode}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t-2 border-[#B87333]/30">
              {hasCouponApplied && (
                <div className="text-sm" style={{ color: '#8DB98D' }}>
                  <span style={{ textDecoration: 'line-through' }}>₹{itemsTotal}</span>
                  {' → '}
                  <span className="font-bold" style={{ color: '#6f8f72' }}>₹{discountAmount} saved</span>
                </div>
              )}
              {!hasCouponApplied && (
                <span />
              )}
              <span
                className="text-2xl"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                }}
              >
                TOTAL
              </span>
              <span
                className="text-4xl gradient-text"
                style={{
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ₹{order.totalAmount}
              </span>
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => markCompleted(order._id)}
                className="btn btn-primary w-full mt-6"
              >
                <CheckCircle2 size={20} />
                MARK AS COMPLETED
              </button>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}