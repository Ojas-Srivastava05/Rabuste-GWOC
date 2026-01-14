"use client";

import { useEffect, useState } from "react";
import { User, Shield, Ban, CheckCircle, Mail, Calendar, Search, Loader2, ArrowUpDown, MoreVertical, DollarSign, ShoppingBag, Ticket, Eye } from "lucide-react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone?: {
    countryCode?: string;
    number?: string;
    fullNumber?: string;
  };
  role: "admin" | "user";
  isBlocked?: boolean;
  createdAt: string;
  totalOrderValue?: number;
  orderCount?: number;
  orderFrequency?: "none" | "once" | "twice" | "multiple";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const [filterOrderFrequency, setFilterOrderFrequency] = useState<"all" | "none" | "once" | "twice" | "multiple">("all");
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'date' | 'orderValue' | 'orderCount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    discountType: "percentage" as "percentage" | "flat",
    discountPercentage: 10,
    discountAmount: 50,
    description: "",
    validUntil: "",
    minOrderAmount: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: string, block: boolean) => {
    if (!confirm(`Are you sure you want to ${block ? "block" : "unblock"} this user?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ block }),
      });

      if (!res.ok) throw new Error("Action failed");

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);
    const matchesOrderFrequency = filterOrderFrequency === "all" || user.orderFrequency === filterOrderFrequency;
    return matchesSearch && matchesRole && matchesStatus && matchesOrderFrequency;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortBy === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'orderValue') {
      comparison = (a.totalOrderValue || 0) - (b.totalOrderValue || 0);
    } else if (sortBy === 'orderCount') {
      comparison = (a.orderCount || 0) - (b.orderCount || 0);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'name' | 'email' | 'date' | 'orderValue' | 'orderCount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleGenerateCoupon = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const validUntil = couponForm.validUntil 
        ? new Date(couponForm.validUntil).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const res = await fetch(`/api/admin/users/${selectedUser._id}/generate-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...couponForm,
          validUntil,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Coupon generated successfully!\nCode: ${data.coupon.code}\n${data.emailSent ? 'Email sent to user.' : 'Email could not be sent.'}`);
        setShowCouponModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to generate coupon");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate coupon");
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">User Management</h1>
          <p className="text-black mt-1">Manage users and their access</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Total Users</p>
              <p className="text-2xl font-bold text-black">{stats.total}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Admins</p>
              <p className="text-2xl font-bold text-blue-600">{stats.admins}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Regular Users</p>
              <p className="text-2xl font-bold text-black">{stats.regularUsers}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <User size={20} className="text-black" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Ban size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-black"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={filterOrderFrequency}
            onChange={(e) => setFilterOrderFrequency(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Order Frequency</option>
            <option value="none">No Orders</option>
            <option value="once">Ordered Once</option>
            <option value="twice">Ordered Twice</option>
            <option value="multiple">Multiple Orders</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    User
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Email
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Joined
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderCount')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Orders
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderValue')}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    Total Value
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-black" />
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-black">
                    No users found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {user.role === 'admin' ? (
                            <Shield size={18} className="text-blue-600" />
                          ) : (
                            <User size={18} className="text-black" />
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              if (user.role !== "admin") {
                                setSelectedUser(user);
                                // Fetch user details
                                fetch(`/api/admin/users/${user._id}`, {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                })
                                  .then(res => res.json())
                                  .then(data => {
                                    setSelectedUser({ ...user, ...data });
                                    alert(`User: ${user.name}\nTotal Order Value: ₹${(data.totalOrderValue || 0).toFixed(2)}\nOrder Count: ${data.orderCount || 0}\nOrder Frequency: ${data.orderFrequency || 'none'}`);
                                  })
                                  .catch(err => console.error(err));
                              }
                            }}
                            className={`text-sm font-semibold ${user.role !== "admin" ? "text-blue-600 hover:text-blue-800 cursor-pointer underline" : "text-black"}`}
                          >
                            {user.name}
                          </button>
                          {user.role === 'admin' && (
                            <p className="text-xs text-blue-600">Administrator</p>
                          )}
                          {user.role !== 'admin' && (
                            <p className="text-xs text-black">Click to view details</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-black" />
                        <p className="text-sm text-black">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-black" />
                        <p className="text-sm text-black">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className="text-black" />
                        <div>
                          <p className="text-sm font-semibold text-black">{user.orderCount || 0}</p>
                          <p className="text-xs text-black">
                            {user.orderFrequency === "once" ? "Once" : 
                             user.orderFrequency === "twice" ? "Twice" : 
                             user.orderFrequency === "multiple" ? "Multiple" : "None"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-green-600" />
                        <p className="text-sm font-semibold text-green-600">
                          ₹{(user.totalOrderValue || 0).toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.role !== "admin" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowCouponModal(true);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                              title="Generate Coupon"
                            >
                              <Ticket size={14} className="inline mr-1" />
                              Coupon
                            </button>
                            <button
                              onClick={() => toggleBlock(user._id, !user.isBlocked)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                user.isBlocked
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {user.isBlocked ? (
                                <>
                                  <CheckCircle size={12} className="inline mr-1" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban size={12} className="inline mr-1" />
                                  Block
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Generation Modal */}
      {showCouponModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                Generate Coupon for {selectedUser.name}
              </h2>
              <button
                onClick={() => {
                  setShowCouponModal(false);
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGenerateCoupon(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Discount Type *</label>
                <select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as "percentage" | "flat" })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="flat">Flat Amount Off</option>
                </select>
              </div>

              {couponForm.discountType === "percentage" ? (
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Discount Percentage *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={couponForm.discountPercentage}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Discount Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.discountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, discountAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Description</label>
                <textarea
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  placeholder="Special offer for this customer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Valid Until (Leave empty for 30 days from now)</label>
                <input
                  type="date"
                  value={couponForm.validUntil}
                  onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={couponForm.minOrderAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
                >
                  Generate & Send Coupon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
