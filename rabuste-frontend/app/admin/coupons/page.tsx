"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Ticket, Calendar, Percent, Check, X } from "lucide-react";

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

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)',
        color: '#F5F1E8',
      }}
    >
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="copper-line" />
              <span className="section-label">ADMIN PANEL</span>
              <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <h1
              className="text-5xl md:text-7xl"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
              }}
            >
              COUPON <span className="gradient-text">MANAGEMENT</span>
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={20} />
            CREATE COUPON
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl">
        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <Ticket size={28} className="text-[#B87333]" />
            <span className="section-label">TOTAL</span>
          </div>
          <p
            className="text-5xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {coupons.length}
          </p>
        </div>

        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <Check size={28} className="text-[#6f8f72]" />
            <span className="section-label">ACTIVE</span>
          </div>
          <p
            className="text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: '#6f8f72' }}
          >
            {coupons.filter(c => c.isActive).length}
          </p>
        </div>

        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <X size={28} className="text-[#ef4444]" />
            <span className="section-label">INACTIVE</span>
          </div>
          <p
            className="text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: '#ef4444' }}
          >
            {coupons.filter(c => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="space-y-6">
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.validUntil) < new Date();
          const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

          return (
            <div
              key={coupon._id}
              className="brutal-card p-8"
              style={{
                background: coupon.isActive && !isExpired
                  ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(42, 24, 16, 0.8))'
                  : 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))',
                opacity: !coupon.isActive || isExpired ? 0.6 : 1,
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
                        letterSpacing: '0.1em',
                      }}
                    >
                      {coupon.code}
                    </h2>
                    <div
                      className="px-4 py-1 flex items-center gap-2"
                      style={{
                        background: coupon.isActive && !isExpired
                          ? 'rgba(111, 143, 114, 0.3)'
                          : 'rgba(139, 111, 71, 0.3)',
                        border: `2px solid ${coupon.isActive && !isExpired ? '#6f8f72' : '#8B6F47'}`,
                        color: coupon.isActive && !isExpired ? '#6f8f72' : '#8B6F47',
                      }}
                    >
                      <Percent size={16} />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {coupon.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#D4A574' }}>
                    {coupon.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#8B6F47' }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                    </div>
                    {coupon.usageLimit && (
                      <div>
                        Used: {coupon.usageCount} / {coupon.usageLimit}
                        {isLimitReached && <span style={{ color: '#ef4444' }}> (Limit Reached)</span>}
                      </div>
                    )}
                    {coupon.minOrderAmount > 0 && (
                      <div>Min Order: ₹{coupon.minOrderAmount}</div>
                    )}
                  </div>
                  {isExpired && (
                    <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
                      ⚠️ Expired
                    </p>
                  )}
                </div>

                <div
                  className="px-5 py-2 rounded-full uppercase tracking-widest text-sm font-bold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background: coupon.isActive
                      ? 'linear-gradient(135deg, #B87333, #CD7F32)'
                      : 'rgba(139, 111, 71, 0.3)',
                    color: coupon.isActive ? '#000000' : '#8B6F47',
                    border: !coupon.isActive ? '2px solid #8B6F47' : 'none',
                  }}
                >
                  {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className="btn btn-secondary flex-1"
                >
                  {coupon.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
                <button
                  onClick={() => handleEdit(coupon)}
                  className="btn btn-secondary"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="btn"
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    border: '2px solid rgba(220, 38, 38, 0.5)',
                    color: '#FCA5A5',
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {coupons.length === 0 && (
          <div className="brutal-card p-12 text-center">
            <Ticket size={64} className="text-[#B87333] mx-auto mb-6" />
            <p className="text-xl" style={{ color: '#8B6F47' }}>
              No coupons yet. Create your first coupon to get started.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="brutal-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
            }}
          >
            <h2
              className="text-3xl mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                letterSpacing: '0.1em',
              }}
            >
              {editingCoupon ? 'EDIT COUPON' : 'CREATE COUPON'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  COUPON CODE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors uppercase"
                  placeholder="SAVE20"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  DISCOUNT PERCENTAGE * (Menu Items Only)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors"
                  rows={3}
                  placeholder="Get 20% off on all menu items"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  VALID UNTIL *
                </label>
                <input
                  type="date"
                  required
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  USAGE LIMIT (Leave empty for unlimited)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#B87333' }}>
                  MINIMUM ORDER AMOUNT (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderAmount || 0}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingCoupon ? 'UPDATE COUPON' : 'CREATE COUPON'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}