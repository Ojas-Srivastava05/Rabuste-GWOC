"use client";
import { useEffect, useState, useCallback } from "react";
import { Package, CheckCircle2, Clock, Mail, FileText, MapPin, Navigation, Loader2, Ticket } from "lucide-react";
import { getCurrentLocation, calculateDistance, calculateTimeToCafe, formatDistance, CAFE_LOCATION, LocationError } from "@/lib/locationUtils";
import { trackOrderStatusUpdate } from "@/lib/analytics";

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
  estimatedTimeToCafe?: number; // in minutes
  preparationTime?: number; // in minutes, admin configurable
  distanceFromCafe?: number; // in km
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [editingPrepTime, setEditingPrepTime] = useState<{ [orderId: string]: boolean }>({});
  const [prepTimeValues, setPrepTimeValues] = useState<{ [orderId: string]: string }>({});

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
    
    // Find the order before updating to track status change
    const currentOrder = orders.find(o => o._id === orderId);

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
      
      // Track order status update
      if (currentOrder) {
        trackOrderStatusUpdate(orderId, currentOrder.status, 'completed');
      }
      
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updated._id
            ? { ...order, status: updated.status, ...updated }
            : order
        )
      );
    }
  };

  const updatePreparationTime = async (orderId: string) => {
    const token = localStorage.getItem("token");
    const prepTime = prepTimeValues[orderId];
    
    if (!prepTime || isNaN(Number(prepTime)) || Number(prepTime) < 0) {
      alert("Please enter a valid positive number for preparation time");
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preparationTime: Number(prepTime) }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updated._id
              ? { ...order, preparationTime: updated.preparationTime }
              : order
          )
        );
        setEditingPrepTime({ ...editingPrepTime, [orderId]: false });
        setPrepTimeValues({ ...prepTimeValues, [orderId]: "" });
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update preparation time");
      }
    } catch (err) {
      console.error("Failed to update preparation time:", err);
      alert("Failed to update preparation time");
    }
  };

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

  const calculateOrderETA = useCallback(async (order: Order) => {
    if (locationPermission !== 'granted' || order.distanceFromCafe) return;

    try {
      const userLocation = await getCurrentLocation();
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        CAFE_LOCATION.lat,
        CAFE_LOCATION.lng
      );
      const estimatedTime = calculateTimeToCafe(distance);

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
                distanceFromCafe: distance,
                estimatedTimeToCafe: estimatedTime,
              }
            : o
        )
      );
    } catch (error) {
      console.error("Error calculating ETA:", error);
    }
  }, [locationPermission]);

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

  useEffect(() => {
    // Calculate ETA for all pending orders when location permission is granted
    if (locationPermission === 'granted') {
      orders.filter(o => o.status === 'pending').forEach(order => {
        if (!order.userLocation && !order.distanceFromCafe) {
          calculateOrderETA(order);
        }
      });
    }
  }, [orders, locationPermission, calculateOrderETA]);

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
            activeFilter === 'completed' ? 'ring-2 ring-[#5E7D4C] shadow-lg shadow-[#5E7D4C]/50' : ''
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <CheckCircle2 size={24} className="text-[#5E7D4C]" />
            <span className="section-label text-sm">COMPLETED</span>
          </div>
          <p
            className="text-3xl sm:text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}
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

      {/* Orders List - Card Grid Layout */}
      {displayedOrders.length > 0 && (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {activeFilter === 'pending' ? 'Pending Orders' : activeFilter === 'completed' ? 'Completed Orders' : 'All Orders'}
          </h2>
          <span className="text-[#8B6F47]">
            Showing {displayedOrders.length} of {orders.length} orders
          </span>
        </div>
      )}
      
      <div id="orders-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h2
                    className="text-2xl sm:text-3xl font-bold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                      lineHeight: 1.1,
                    }}
                  >
                    {order.customerName}
                  </h2>
                {/* Inline Coupon Indicator next to name */}
                  {hasCouponApplied && (
                    <span
                      className="text-2xl sm:text-3xl"
                      title={`Coupon Applied - ₹${discountAmount} off (${discountPercentage}% discount)`}
                    >
                      🎫
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-lg sm:text-xl mb-2" style={{ color: '#8B6F47' }}>
                  <Mail size={20} />
                  {order.customerEmail}
                </div>
                <div className="text-base sm:text-lg font-semibold" style={{ color: '#B87333' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                
                {/* Location-based ETA and Time Management */}
                {order.status === 'pending' && (
                  <div className="mt-4 space-y-3">
                    {/* Distance and Time to Cafe */}
                    {(order.distanceFromCafe || order.estimatedTimeToCafe) && (
                      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.1)', border: '1px solid rgba(184, 115, 51, 0.3)' }}>
                        {order.distanceFromCafe && (
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#B87333' }}>
                            <Navigation size={16} />
                            <span className="font-semibold">Distance: {formatDistance(order.distanceFromCafe)}</span>
                          </div>
                        )}
                        {order.estimatedTimeToCafe && (
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#D4A574' }}>
                            <Clock size={16} />
                            <span className="font-semibold">Time to reach cafe: ~{order.estimatedTimeToCafe} min</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Preparation Time Editor */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(94, 125, 76, 0.1)', border: '1px solid rgba(94, 125, 76, 0.3)' }}>
                      <div className="flex items-center gap-2 flex-1">
                        <Clock size={16} style={{ color: '#5E7D4C' }} />
                        <span className="text-sm font-semibold" style={{ color: '#5E7D4C' }}>
                          Preparation Time:
                        </span>
                        {editingPrepTime[order._id] ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="number"
                              min="0"
                              value={prepTimeValues[order._id] ?? order.preparationTime ?? ''}
                              onChange={(e) => setPrepTimeValues({ ...prepTimeValues, [order._id]: e.target.value })}
                              className="px-3 py-1 rounded text-sm w-20"
                              style={{
                                background: '#FFFDF2',
                                border: '2px solid rgba(94, 125, 76, 0.5)',
                                color: '#2e211a',
                              }}
                              placeholder="5"
                              autoFocus
                            />
                            <span className="text-xs" style={{ color: '#8B6F47' }}>min</span>
                            <button
                              onClick={() => updatePreparationTime(order._id)}
                              className="px-3 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                              style={{
                                background: 'linear-gradient(135deg, #5E7D4C, #4A6741)',
                                color: '#FFFFFF',
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingPrepTime({ ...editingPrepTime, [order._id]: false });
                                setPrepTimeValues({ ...prepTimeValues, [order._id]: "" });
                              }}
                              className="px-3 py-1 rounded text-xs font-semibold transition-all hover:scale-105"
                              style={{
                                background: 'rgba(139, 111, 71, 0.2)',
                                border: '1px solid rgba(139, 111, 71, 0.4)',
                                color: '#8B6F47',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-lg font-bold" style={{ color: '#5E7D4C' }}>
                              {order.preparationTime ?? 'Not set'} min
                            </span>
                            <button
                              onClick={() => {
                                setEditingPrepTime({ ...editingPrepTime, [order._id]: true });
                                setPrepTimeValues({ ...prepTimeValues, [order._id]: String(order.preparationTime ?? '') });
                              }}
                              className="px-3 py-1 rounded text-xs font-semibold transition-all hover:scale-105 ml-2"
                              style={{
                                background: 'rgba(94, 125, 76, 0.2)',
                                border: '1px solid rgba(94, 125, 76, 0.4)',
                                color: '#5E7D4C',
                              }}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Total Estimated Time */}
                    {(order.estimatedTimeToCafe || order.preparationTime) && (
                      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(94, 125, 76, 0.2), rgba(184, 115, 51, 0.1))', border: '2px solid rgba(94, 125, 76, 0.5)' }}>
                        <Clock size={18} style={{ color: '#5E7D4C' }} />
                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#5E7D4C', fontFamily: 'var(--font-heading)' }}>
                          Total Estimated Time:
                        </span>
                        <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                          {(order.preparationTime || 0) + (order.estimatedTimeToCafe || 0)} min
                        </span>
                        <span className="text-xs" style={{ color: '#8B6F47' }}>
                          (Preparation: {order.preparationTime || 0} min + Travel: {order.estimatedTimeToCafe || 0} min)
                        </span>
                      </div>
                    )}
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
                        : 'rgba(94, 125, 76, 0.3)',
                    color: order.status === "pending" ? '#000000' : '#5E7D4C',
                    border: order.status === "completed" ? '2px solid #5E7D4C' : 'none',
                  }}
                >
                  {order.status}
                </div>
              </div>
            </div>

            {/* ORDER ITEMS - REORGANIZED FOR BARISTA VISIBILITY */}
            <div className="mb-8" style={{ 
              background: 'rgba(184, 115, 51, 0.1)', 
              border: '4px solid rgba(184, 115, 51, 0.4)',
              borderRadius: '12px',
              padding: '2rem',
            }}>
              <h3
                className="text-2xl sm:text-3xl mb-6 flex items-center gap-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                }}
              >
                <FileText size={28} />
                ORDER ITEMS
              </h3>
              
              {/* Grid layout for items - makes them BIG and prominent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-lg"
                    style={{
                      background: item.itemType === 'art' 
                        ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(184, 115, 51, 0.15))' 
                        : 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(42, 24, 16, 0.4))',
                      border: `4px solid ${item.itemType === 'art' 
                        ? 'rgba(184, 115, 51, 0.7)' 
                        : 'rgba(184, 115, 51, 0.5)'}`,
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Item Name - Clear and readable */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: '#F5F1E8', flex: 1 }}>
                          {item.name}
                        </h4>
                        {item.itemType === 'art' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase font-bold whitespace-nowrap"
                            style={{
                              background: 'rgba(184, 115, 51, 0.5)',
                              color: '#D4A574',
                              border: '2px solid rgba(184, 115, 51, 0.7)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            🎨 ART
                          </span>
                        )}
                        {item.itemType === 'menu' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase font-bold whitespace-nowrap"
                            style={{
                              background: 'rgba(139, 111, 71, 0.4)',
                              color: '#8B6F47',
                              border: '2px solid rgba(139, 111, 71, 0.6)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            ☕ MENU
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity - Prominent but reasonable */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl font-bold" style={{ color: '#D4A574' }}>
                          ×{item.quantity}
                        </span>
                        {item.itemType === 'art' && (
                          <span className="text-sm font-semibold" style={{ color: '#B87333' }}>
                            Ready for pickup
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Price - Clear at bottom */}
                    <div className="mt-auto pt-4 border-t-2" style={{ borderColor: 'rgba(184, 115, 51, 0.3)' }}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs uppercase tracking-wide" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                          Total
                        </span>
                        <span className="text-2xl sm:text-3xl gradient-text font-bold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.instructions && (
              <div
                className="mb-6 p-6 sm:p-8 rounded-lg"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  border: '3px solid rgba(184, 115, 51, 0.5)',
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold mb-3 uppercase tracking-wide" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                  ⚠️ Special Instructions
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: '#F5F1E8' }}>{order.instructions}</p>
              </div>
            )}

            {/* Coupon Information - Math-based discount display */}
            {hasCouponApplied && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(94, 125, 76, 0.15)',
                  border: '1px solid rgba(94, 125, 76, 0.4)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={16} style={{ color: '#5E7D4C' }} />
                  <p className="text-sm font-bold uppercase tracking-wide" style={{ color: '#5E7D4C' }}>
                    Discount Applied
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p style={{ color: '#8DB98D' }}>
                      Items Total: <span className="font-bold">₹{itemsTotal}</span>
                    </p>
                    <p className="font-bold text-lg" style={{ color: '#5E7D4C' }}>
                      {discountPercentage}% OFF
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p style={{ color: '#8DB98D' }}>
                      Discount Amount:
                    </p>
                    <p className="font-bold" style={{ color: '#5E7D4C' }}>
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
                  <span className="font-bold" style={{ color: '#5E7D4C' }}>₹{discountAmount} saved</span>
                </div>
              )}
              {!hasCouponApplied && (
                <span />
              )}
              <span
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                }}
              >
                TOTAL
              </span>
              <span
                className="text-5xl sm:text-6xl md:text-7xl gradient-text font-bold"
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
                className="btn btn-primary w-full mt-8 py-6 text-2xl sm:text-3xl font-bold"
                style={{
                  minHeight: '80px',
                  fontSize: '1.5rem',
                  letterSpacing: '0.15em',
                }}
              >
                <CheckCircle2 size={32} />
                ✓ MARK AS COMPLETED
              </button>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}