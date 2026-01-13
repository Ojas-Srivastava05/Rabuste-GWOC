"use client";

import { useEffect, useState } from "react";
import { User, Shield, Ban, CheckCircle, Mail, Calendar, Search, Loader2 } from "lucide-react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked?: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");

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
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
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
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
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
          USER <span className="gradient-text">MANAGEMENT</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 mb-8">
        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-[#B87333]" />
            <span className="section-label text-xs">TOTAL</span>
          </div>
          <p className="text-2xl sm:text-3xl gradient-text font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {stats.total}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-[#5E7D4C]" />
            <span className="section-label text-xs">ADMINS</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}>
            {stats.admins}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-[#B87333]" />
            <span className="section-label text-xs">USERS</span>
          </div>
          <p className="text-2xl sm:text-3xl gradient-text font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {stats.users}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-[#5E7D4C]" />
            <span className="section-label text-xs">ACTIVE</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}>
            {stats.active}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Ban size={20} className="text-red-500" />
            <span className="section-label text-xs">BLOCKED</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#EF4444' }}>
            {stats.blocked}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="brutal-card p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#8B6F47' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg text-[#F5F1E8] focus:outline-none focus:border-[#B87333] placeholder-[#8B6F47]"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="w-full px-4 py-3 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-4 py-3 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg text-[#F5F1E8] focus:outline-none focus:border-[#B87333]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#B87333' }} />
          <p className="section-label">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="brutal-card p-12 text-center">
          <User size={64} className="text-[#B87333] mx-auto mb-6" />
          <p className="text-xl" style={{ color: '#8B6F47' }}>
            No users found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="brutal-card p-6"
              style={{
                background: user.isBlocked
                  ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(42, 24, 16, 0.8))'
                  : user.role === 'admin'
                  ? 'linear-gradient(135deg, rgba(94, 125, 76, 0.15), rgba(42, 24, 16, 0.8))'
                  : 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(42, 24, 16, 0.8))',
                border: user.isBlocked
                  ? '2px solid rgba(220, 38, 38, 0.4)'
                  : user.role === 'admin'
                  ? '2px solid rgba(94, 125, 76, 0.4)'
                  : '2px solid rgba(184, 115, 51, 0.4)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#F5F1E8', fontFamily: 'var(--font-heading)' }}>
                      {user.name}
                    </h3>
                    {user.role === 'admin' && (
                      <Shield size={18} className="text-[#5E7D4C]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#8B6F47' }}>
                    <Mail size={14} />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#8B6F47' }}>
                    <Calendar size={12} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                  style={{
                    background: user.role === 'admin' ? 'rgba(94, 125, 76, 0.3)' : 'rgba(184, 115, 51, 0.3)',
                    color: user.role === 'admin' ? '#5E7D4C' : '#B87333',
                    border: `1px solid ${user.role === 'admin' ? 'rgba(94, 125, 76, 0.5)' : 'rgba(184, 115, 51, 0.5)'}`,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {user.role}
                </span>
                {user.isBlocked ? (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={{
                      background: 'rgba(220, 38, 38, 0.3)',
                      color: '#FCA5A5',
                      border: '1px solid rgba(220, 38, 38, 0.5)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    BLOCKED
                  </span>
                ) : (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={{
                      background: 'rgba(94, 125, 76, 0.3)',
                      color: '#5E7D4C',
                      border: '1px solid rgba(94, 125, 76, 0.5)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Actions */}
              {user.role !== "admin" && (
                <button
                  onClick={() => toggleBlock(user._id, !user.isBlocked)}
                  className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{
                    background: user.isBlocked
                      ? 'linear-gradient(135deg, #5E7D4C, #4A6741)'
                      : 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.4))',
                    border: user.isBlocked
                      ? '2px solid #5E7D4C'
                      : '2px solid rgba(220, 38, 38, 0.5)',
                    color: user.isBlocked ? '#FFFFFF' : '#FCA5A5',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {user.isBlocked ? (
                    <>
                      <CheckCircle size={16} className="inline mr-2" />
                      UNBLOCK USER
                    </>
                  ) : (
                    <>
                      <Ban size={16} className="inline mr-2" />
                      BLOCK USER
                    </>
                  )}
                    </button>
                  )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
