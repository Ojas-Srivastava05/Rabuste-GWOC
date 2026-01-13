"use client";
import { useEffect, useState, useCallback } from "react";
import { 
  Package, CheckCircle2, Clock, Mail, FileText, MapPin, Navigation, 
  Loader2, Ticket, Search, Filter, ArrowUpDown, MoreVertical, Eye,
  Calendar, DollarSign, User
} from "lucide-react";
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
  estimatedTimeToCafe?: number;
  preparationTime?: number;
  distanceFromCafe?: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
      if (locationError.type === 'permission_denied') {
        console.warn("Location access denied by user");
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
    const pollInterval = setInterval(() => {
      fetchOrders();
    }, 10000);
    requestLocationPermission();
    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
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

  let filteredOrders = activeFilter === 'all' 
    ? orders 
    : activeFilter === 'pending' 
    ? pendingOrders 
    : completedOrders;

  // Search filter
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(order =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  filteredOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'amount') {
      comparison = a.totalAmount - b.totalAmount;
    } else if (sortBy === 'name') {
      comparison = a.customerName.localeCompare(b.customerName);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'date' | 'amount' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Clock size={18} />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-black">{orders.length}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <Package size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'pending' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Date
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Customer
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Amount
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const hasCouponApplied = itemsTotal > order.totalAmount;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-black">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-black">{order.customerName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-black">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                            {hasCouponApplied && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <Ticket size={12} />
                                Coupon applied
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-gray-400" />
                          <p className="text-sm font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          {order.status === "pending" && (
                            <button
                              onClick={() => markCompleted(order._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdatePrepTime={updatePreparationTime}
          editingPrepTime={editingPrepTime}
          setEditingPrepTime={setEditingPrepTime}
          prepTimeValues={prepTimeValues}
          setPrepTimeValues={setPrepTimeValues}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdatePrepTime,
  editingPrepTime,
  setEditingPrepTime,
  prepTimeValues,
  setPrepTimeValues,
}: {
  order: Order;
  onClose: () => void;
  onUpdatePrepTime: (orderId: string) => void;
  editingPrepTime: { [key: string]: boolean };
  setEditingPrepTime: (val: any) => void;
  prepTimeValues: { [key: string]: string };
  setPrepTimeValues: (val: any) => void;
}) {
  const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasCouponApplied = itemsTotal > order.totalAmount;
  const discountAmount = hasCouponApplied ? itemsTotal - order.totalAmount : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">CUSTOMER INFORMATION</h3>
            <div className="space-y-2">
              <p className="text-black"><strong>Name:</strong> {order.customerName}</p>
              <p className="text-black"><strong>Email:</strong> {order.customerEmail}</p>
              <p className="text-black"><strong>Order ID:</strong> {order._id}</p>
              <p className="text-black"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">ORDER ITEMS</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-black">{item.name} × {item.quantity}</p>
                    {item.itemType && (
                      <span className="text-xs text-gray-500">Type: {item.itemType}</span>
                    )}
                  </div>
                  <p className="font-semibold text-black">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Info */}
          {hasCouponApplied && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-700 mb-2">Coupon Applied</p>
              <p className="text-sm text-black">Discount: ₹{discountAmount}</p>
              {order.couponCode && (
                <p className="text-sm text-black">Code: {order.couponCode}</p>
              )}
            </div>
          )}

          {/* Instructions */}
          {order.instructions && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">SPECIAL INSTRUCTIONS</h3>
              <p className="text-black bg-yellow-50 p-3 rounded-lg">{order.instructions}</p>
            </div>
          )}

          {/* Preparation Time */}
          {order.status === 'pending' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">PREPARATION TIME</h3>
              {editingPrepTime[order._id] ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={prepTimeValues[order._id] ?? order.preparationTime ?? ''}
                    onChange={(e) => setPrepTimeValues({ ...prepTimeValues, [order._id]: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Minutes"
                    autoFocus
                  />
                  <button
                    onClick={() => onUpdatePrepTime(order._id)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPrepTime({ ...editingPrepTime, [order._id]: false })}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-black">{order.preparationTime ?? 'Not set'} minutes</p>
                  <button
                    onClick={() => {
                      setEditingPrepTime({ ...editingPrepTime, [order._id]: true });
                      setPrepTimeValues({ ...prepTimeValues, [order._id]: String(order.preparationTime ?? '') });
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-black rounded-lg hover:bg-gray-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-black">Total Amount</p>
              <p className="text-2xl font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
