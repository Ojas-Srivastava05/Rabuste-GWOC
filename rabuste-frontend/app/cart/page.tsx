"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Ticket, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type CartItem = {
  menuItem?: string;
  artItem?: string;
  itemType: "menu" | "art";
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
  discountedTotal?: number;
};

function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    fetchCart();
    
    // Auto-apply coupon if coming from email
    const autoApplyCoupon = sessionStorage.getItem('autoApplyCoupon');
    if (autoApplyCoupon) {
      sessionStorage.removeItem('autoApplyCoupon');
      // Wait for cart to load, then apply coupon
      setTimeout(() => {
        setCouponCode(autoApplyCoupon);
        // Auto-apply after a short delay to ensure cart is loaded
        setTimeout(() => {
          applyCouponWithCode(autoApplyCoupon);
        }, 500);
      }, 500);
    }
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    if (data.couponCode) {
      setCouponCode(data.couponCode);
      setCouponSuccess(`Coupon ${data.couponCode} applied!`);
    }
    setLoading(false);
  }

  async function applyCouponWithCode(code: string) {
    if (!cart) return;
    
    setCouponApplying(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      // Calculate menu items total only (coupons don't apply to art)
      const menuItemsTotal = cart.items
        .filter(item => item.itemType === "menu")
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Validate coupon
      const validateRes = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: code.toUpperCase(),
          orderAmount: menuItemsTotal
        }),
      });

      if (!validateRes.ok) {
        const error = await validateRes.json();
        setCouponError(error.error || "Invalid coupon code");
        setCouponApplying(false);
        return;
      }

      const couponData = await validateRes.json();

      // Apply coupon to cart
      const applyRes = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          couponCode: couponData.code,
          discountType: couponData.discountType || "percentage",
          discountPercentage: couponData.discountPercentage || 0,
          discountAmount: couponData.discountAmount || 0,
        }),
      });

      if (applyRes.ok) {
        const updatedCart = await applyRes.json();
        setCart(updatedCart);
        const discountText = couponData.discountType === "flat" 
          ? `₹${couponData.discountAmount} off`
          : `${couponData.discountPercentage}% off`;
        setCouponSuccess(`Coupon ${couponData.code} applied! ${discountText} on menu items`);
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponApplying(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponApplying(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      // Calculate menu items total only (coupons don't apply to art)
      const menuItemsTotal = cart!.items
        .filter(item => item.itemType === "menu")
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Validate coupon
      const validateRes = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: couponCode.toUpperCase(),
          orderAmount: menuItemsTotal
        }),
      });

      if (!validateRes.ok) {
        const error = await validateRes.json();
        setCouponError(error.error || "Invalid coupon code");
        setCouponApplying(false);
        return;
      }

      const couponData = await validateRes.json();

      // Apply coupon to cart
      const applyRes = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          couponCode: couponData.code,
          discountType: couponData.discountType || "percentage",
          discountPercentage: couponData.discountPercentage || 0,
          discountAmount: couponData.discountAmount || 0,
        }),
      });

      if (applyRes.ok) {
        const updatedCart = await applyRes.json();
        setCart(updatedCart);
        const discountText = couponData.discountType === "flat" 
          ? `₹${couponData.discountAmount} off`
          : `${couponData.discountPercentage}% off`;
        setCouponSuccess(`Coupon ${couponData.code} applied! ${discountText} on menu items`);
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponApplying(false);
    }
  }

  async function removeCoupon() {
    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
        setCouponCode("");
        setCouponSuccess("");
        setCouponError("");
      }
    } catch (error) {
      console.error("Failed to remove coupon", error);
    }
  }

  async function updateQuantity(itemId: string, itemType: "menu" | "art", newQuantity: number) {
    // If new quantity is 0 or less, remove the item
    if (newQuantity < 1) {
      await removeItem(itemId, itemType);
      return;
    }

    try {
      // Use POST with the difference in quantity
      const currentItem = cart?.items.find(
        item => (item.menuItem || item.artItem) === itemId && item.itemType === itemType
      );
      
      if (!currentItem) return;
      
      const quantityChange = newQuantity - currentItem.quantity;
      
      // For menu items
      if (itemType === "menu") {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menuItemId: itemId,
            quantity: quantityChange,
          }),
        });
        
        if (res.ok) {
          await fetchCart();
        }
      }
      // For art items
      else if (itemType === "art") {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artItemId: itemId,
            quantity: quantityChange,
          }),
        });
        
        if (res.ok) {
          await fetchCart();
        }
      }
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  }

  async function removeItem(itemId: string, itemType: "menu" | "art") {
    try {
      const res = await fetch("/api/cart/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemType,
        }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <div 
              className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                border: '2px solid rgba(184, 115, 51, 0.4)',
              }}
            >
              <Package size={60} className="text-[#B87333]" />
            </div>
            <h1 
              className="text-5xl md:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              EMPTY CART
            </h1>
            <p className="text-xl mb-12" style={{ color: '#B87333' }}>
              Your cart is waiting to be filled with bold flavors
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn btn-primary"
            >
              EXPLORE MENU
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: 'clamp(80px, 15vw, 120px)', paddingBottom: 'clamp(40px, 10vw, 80px)', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-3 sm:px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                YOUR ORDER
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </div>
            
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              SHOPPING <span className="gradient-text">CART</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item, index) => (
                <div
                  key={item.menuItem || item.artItem || index}
                  className="brutal-card p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex-1">
                      <a
                        href={`/menu#item-${item.menuItem || item.artItem}`}
                        className="block"
                      >
                        <h3 
                          className="text-xl sm:text-2xl mb-2 hover:underline transition-all"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#F5F1E8',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                          }}
                        >
                          {item.name}
                        </h3>
                      </a>
                      <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg mb-4 md:mb-0">
                        <span className="gradient-text font-bold">₹{Math.ceil(item.price)}</span>
                        <span style={{ color: '#8B6F47' }}>each</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => {
                            const itemId = item.menuItem || item.artItem;
                            if (itemId) {
                              updateQuantity(itemId, item.itemType, item.quantity - 1);
                            }
                          }}
                          className="w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                            border: '2px solid rgba(184, 115, 51, 0.6)',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <Minus size={22} style={{ color: '#000', fontWeight: 'bold' }} />
                        </button>
                        
                        <div
                          className="px-5 sm:px-6 py-2 text-lg sm:text-xl font-bold rounded-lg"
                          style={{
                            background: 'rgba(26, 17, 16, 0.6)',
                            border: '2px solid rgba(184, 115, 51, 0.4)',
                            color: '#F5F1E8',
                            minWidth: '60px',
                            textAlign: 'center',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {item.quantity}
                        </div>
                        
                        <button
                          onClick={() => {
                            const itemId = item.menuItem || item.artItem;
                            if (itemId) {
                              updateQuantity(itemId, item.itemType, item.quantity + 1);
                            }
                          }}
                          className="w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                            border: '2px solid rgba(184, 115, 51, 0.6)',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <Plus size={22} style={{ color: '#000', fontWeight: 'bold' }} />
                        </button>
                      </div>

                      <div 
                        className="text-xl sm:text-2xl font-bold gradient-text"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          minWidth: '100px',
                          textAlign: 'right',
                        }}
                      >
                        ₹{Math.ceil(item.price * item.quantity)}
                      </div>

                      <button
                        onClick={() => removeItem(
                          item.menuItem || item.artItem || '',
                          item.itemType
                        )}
                        className="p-2.5 sm:p-2 transition-all active:scale-95"
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          cursor: 'pointer',
                          minWidth: '44px',
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Trash2 size={18} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Desktop */}
            <div className="hidden lg:block lg:col-span-1" style={{ position: 'relative', zIndex: 100 }}>
              <div 
                className="sticky top-32 brutal-card p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.9), rgba(42, 24, 16, 0.9))',
                }}
              >
                <h2 
                  className="text-2xl sm:text-3xl mb-6 sm:mb-8"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.1em',
                  }}
                >
                  ORDER SUMMARY
                </h2>

                {/* Coupon Section */}
                <div className="mb-8">
                  <h3 
                    className="text-xl mb-4 flex items-center gap-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#B87333',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <Ticket size={20} />
                    APPLY COUPON
                  </h3>

                  {cart.couponCode ? (
                    <div
                      className="p-4 mb-3 flex items-center justify-between"
                      style={{
                        background: 'rgba(111, 143, 114, 0.2)',
                        border: '2px solid rgba(111, 143, 114, 0.4)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} style={{ color: '#5E7D4C' }} />
                        <div>
                          <p style={{ color: '#5E7D4C', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                            {cart.couponCode}
                          </p>
                          <p className="text-xs" style={{ color: '#8B6F47' }}>
                            Coupon applied successfully
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-sm px-3 py-1 transition-colors"
                        style={{
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-3 bg-black/40 border-2 border-[#B87333]/40 text-[#F5F1E8] focus:border-[#B87333] transition-colors uppercase"
                        style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplying}
                        className="btn btn-secondary"
                        style={{ minWidth: '100px' }}
                      >
                        {couponApplying ? '...' : 'APPLY'}
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
                      {couponError}
                    </p>
                  )}

                  {couponSuccess && (
                    <p className="text-sm mt-2" style={{ color: '#5E7D4C' }}>
                      {couponSuccess}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-8 pb-6">
                  <div className="flex justify-between text-base" style={{ color: '#8B6F47' }}>
                    <span>Subtotal</span>
                    <span>₹{Math.ceil(cart.totalAmount)}</span>
                  </div>
                  
                  {cart.couponCode && cart.couponDiscount && cart.couponDiscount > 0 && (
                    <div className="flex justify-between text-base" style={{ color: '#5E7D4C' }}>
                      <span>Coupon Discount ({cart.couponCode})</span>
                      <span>- ₹{Math.ceil(cart.couponDiscount)}</span>
                    </div>
                  )}

                  <p className="text-xs text-center" style={{ color: '#8B6F47' }}>
                    All prices are inclusive of taxes
                  </p>
                </div>

                <div className="flex justify-between items-center mb-8 pt-6 border-t-2 border-[#B87333]/30">
                  <span 
                    className="text-3xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                      letterSpacing: '0.05em',
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
                    ₹{Math.ceil(cart.discountedTotal || cart.totalAmount)}
                  </span>
                </div>

                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      router.push("/auth?redirect=/checkout");
                    } else {
                      router.push("/checkout");
                    }
                  }}
                  className="btn btn-primary w-full mb-4"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/cart", { method: "DELETE" });
                    window.location.reload();
                  }}
                  className="btn btn-secondary w-full"
                >
                  <Trash2 size={18} />
                  CLEAR CART
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Checkout Bar - Fixed at Bottom */}
        {cart && (
          <div 
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999]"
            style={{
              background: 'linear-gradient(180deg, rgba(26, 17, 16, 0.98) 0%, rgba(42, 24, 16, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              borderTop: '2px solid rgba(184, 115, 51, 0.4)',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(184, 115, 51, 0.2)',
            }}
          >
            <div className="container px-4 py-4">
              {/* Total Price */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#B87333]/30">
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
                  className="text-2xl gradient-text font-bold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  ₹{Math.ceil(cart.discountedTotal || cart.totalAmount)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/cart", { method: "DELETE" });
                    window.location.reload();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all active:scale-95"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.05em',
                    fontSize: '14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                  }}
                >
                  <Trash2 size={18} />
                  CLEAR
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const token = localStorage.getItem("token");
                    if (!token) {
                      window.location.href = "/auth?redirect=/checkout";
                    } else {
                      window.location.href = "/checkout";
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const token = localStorage.getItem("token");
                    if (!token) {
                      window.location.href = "/auth?redirect=/checkout";
                    } else {
                      window.location.href = "/checkout";
                    }
                  }}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    border: '2px solid rgba(184, 115, 51, 0.6)',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    fontSize: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    boxShadow: '0 4px 16px rgba(184, 115, 51, 0.4)',
                  }}
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spacer for mobile checkout bar */}
        <div className="lg:hidden h-32" />
      </div>

      <Footer />
    </>
  );
}