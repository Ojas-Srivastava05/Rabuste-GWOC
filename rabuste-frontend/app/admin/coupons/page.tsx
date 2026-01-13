"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Ticket, Calendar, Percent, Check, X, Search } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  description: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  usageLimit: number | null;
  usageCount: number;
  minOrderAmount: number;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    description: "",
    validUntil: "",
    usageLimit: "",
    minOrderAmount: 0,
  });

  const fetchCoupons = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/coupons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCoupons(data);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
    };

    if (editingCoupon) {
      const res = await fetch(`/api/admin/coupons/${editingCoupon._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCoupons();
        resetForm();
      }
    } else {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCoupons();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create coupon");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchCoupons();
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });

    if (res.ok) {
      fetchCoupons();
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description,
      validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
      usageLimit: coupon.usageLimit?.toString() || "",
      minOrderAmount: coupon.minOrderAmount,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountPercentage: 10,
      description: "",
      validUntil: "",
      usageLimit: "",
      minOrderAmount: 0,
    });
    setEditingCoupon(null);
    setShowModal(false);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive).length,
    inactive: coupons.filter(c => !c.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Coupon Management</h1>
          <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Coupons</p>
              <p className="text-2xl font-bold text-black">{stats.total}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <Ticket size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <X size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => {
          const isExpired = new Date(coupon.validUntil) < new Date();
          const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

          return (
            <div
              key={coupon._id}
              className={`bg-white rounded-lg border-2 p-6 ${
                coupon.isActive && !isExpired
                  ? 'border-gray-200'
                  : 'border-red-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-black">{coupon.code}</h2>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        coupon.isActive && !isExpired
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {coupon.isActive && !isExpired ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Percent size={16} className="text-gray-400" />
                    <span className="text-lg font-bold text-black">{coupon.discountPercentage}% OFF</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{coupon.description || "No description"}</p>

              <div className="space-y-2 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                </div>
                {coupon.usageLimit && (
                  <div>
                    Used: {coupon.usageCount} / {coupon.usageLimit}
                    {isLimitReached && <span className="text-red-600 ml-1">(Full)</span>}
                  </div>
                )}
                {coupon.minOrderAmount > 0 && (
                  <div>Min Order: ₹{coupon.minOrderAmount}</div>
                )}
                {isExpired && (
                  <p className="text-red-600 font-semibold">⚠️ Expired</p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    coupon.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(coupon)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCoupons.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Ticket size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No coupons found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase"
                  placeholder="SAVE20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Discount Percentage *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  placeholder="Get 20% off on all menu items"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Valid Until *</label>
                <input
                  type="date"
                  required
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Usage Limit (Leave empty for unlimited)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderAmount || 0}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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
