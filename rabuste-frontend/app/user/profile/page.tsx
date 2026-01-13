"use client";

import { useUser } from "@/contexts/UserContext";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function UserProfile() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          My Profile
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#FFFDF2] to-[#FFF8E8] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#B87333]/30">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
              color: '#FFF',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {user.name}
            </h2>
            <p className="text-sm text-[#6b4a2f] mb-1">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-[#B87333]/20 text-[#B87333] text-xs font-semibold rounded-full">
              {user.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
              <User size={18} style={{ color: '#FFF' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-[#2e211a] font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
              <Mail size={18} style={{ color: '#FFF' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-[#2e211a] font-medium">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
                <Phone size={18} style={{ color: '#FFF' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-[#2e211a] font-medium">{user.phone.fullNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
              <Calendar size={18} style={{ color: '#FFF' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider mb-1">User ID</p>
              <p className="text-[#2e211a] font-medium font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-gradient-to-br from-[#B87333]/10 to-[#CD7F32]/10 p-6 rounded-2xl border border-[#B87333]/30">
        <h3 className="text-lg font-semibold text-[#2e211a] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="text-2xl">ℹ️</span>
          Account Information
        </h3>
        <div className="space-y-3 text-sm text-[#3a2618]">
          <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
            <span className="font-semibold">Account Type:</span>
            <span className="text-[#B87333] font-medium uppercase">{user.role}</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
            <span className="font-semibold">Status:</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}