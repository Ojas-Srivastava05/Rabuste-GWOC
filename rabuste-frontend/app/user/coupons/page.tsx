"use client";

import { useEffect, useState } from "react";
import { Ticket, Copy, Check, Calendar, DollarSign } from "lucide-react";

type Coupon = {
  _id: string;
  code: string;
  discountPercentage: number;
  description: string;
  validUntil: string;
  usageLimit: number | null;
  usageCount: number;
  minOrderAmount: number;
  isActive: boolean;
};

export default function UserCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/coupons");
        if (!res.ok) throw new Error("Failed to fetch coupons");

        const data = await res.json();
        const activeCoupons = (data.coupons || []).filter((c: Coupon) => {
          const isValid = c.isActive && new Date(c.validUntil) > new Date();
          const hasUsageLeft = c.usageLimit === null || (c.usageCount || 0) < c.usageLimit;
          return isValid && hasUsageLeft;
        });
        setCoupons(activeCoupons);
      } catch (err) {
        setError("Unable to load coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="section-label">Loading Coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          Available Coupons
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-[#B87333]/10 to-[#CD7F32]/10 p-6 rounded-2xl border border-[#B87333]/30">
        <h3 className="text-lg font-semibold text-[#2e211a] mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="text-2xl">💡</span>
          How to Use Coupons
        </h3>
        <p className="text-sm text-[#3a2618]">
          Copy any coupon code and apply it at checkout to get amazing discounts on your orders!
        </p>
      </div>

      {/* Coupons Grid */}
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => {
            const daysLeft = Math.ceil(
              (new Date(coupon.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const usageLeft = coupon.usageLimit === null ? null : coupon.usageLimit - (coupon.usageCount || 0);

            return (
              <div
                key={coupon._id}
                className="bg-gradient-to-br from-[#FFFDF2] to-[#FFF8E8] rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-[#B87333]/40 hover:border-[#B87333] transition-all duration-300 hover:shadow-xl relative"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                      {coupon.discountPercentage}%
                    </div>
                    <div className="text-[8px] text-white/80 uppercase">OFF</div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Coupon Code */}
                  <div className="mb-4 pr-20">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket size={20} style={{ color: '#B87333' }} />
                      <h3 className="text-lg font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Coupon Code
                      </h3>
                    </div>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="group flex items-center gap-3 bg-white border-2 border-[#B87333] rounded-xl px-4 py-3 w-full hover:bg-[#B87333]/10 transition-all duration-300"
                    >
                      <span className="text-xl font-bold text-[#B87333] flex-1 text-left tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                        {coupon.code}
                      </span>
                      {copiedCode === coupon.code ? (
                        <Check size={20} style={{ color: '#16A34A' }} />
                      ) : (
                        <Copy size={20} style={{ color: '#B87333' }} className="group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#6b4a2f] mb-4 min-h-[40px]">
                    {coupon.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm bg-white/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-[#6b4a2f]">
                        <DollarSign size={16} style={{ color: '#B87333' }} />
                        <span>Min. Order</span>
                      </div>
                      <span className="font-semibold text-[#2e211a]">₹{coupon.minOrderAmount}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-white/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-[#6b4a2f]">
                        <Calendar size={16} style={{ color: '#B87333' }} />
                        <span>Valid Until</span>
                      </div>
                      <span className="font-semibold text-[#2e211a]">
                        {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-white/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-[#6b4a2f]">
                        <Ticket size={16} style={{ color: '#B87333' }} />
                        <span>Uses Left</span>
                      </div>
                      <span className="font-semibold text-[#2e211a]">
                        {coupon.usageLimit === null ? 'Unlimited' : usageLeft}
                      </span>
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  {daysLeft <= 7 && (
                    <div className="mt-4 bg-gradient-to-r from-red-100 to-orange-100 border border-red-300 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 flex items-center gap-2">
                        ⏰ Expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFDF2] p-12 rounded-2xl text-center border border-[#B87333]/20">
          <Ticket size={64} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
          <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            No Active Coupons
          </h3>
          <p className="text-[#6b4a2f]">Check back later for exciting offers!</p>
        </div>
      )}
    </div>
  );
}