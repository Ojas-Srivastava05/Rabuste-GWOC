"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, CheckCircle, Loader2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  initializeRazorpayPayment,
  RazorpayResponse
} from "@/lib/razorpay";
import { trackCheckoutStarted, trackOrderPlaced } from "@/lib/analytics";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  itemType?: string;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
  discountedTotal?: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [paying, setPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  // Track checkout started
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      trackCheckoutStarted({
        itemCount: cart.items.length,
        totalAmount: cart.discountedTotal || cart.totalAmount,
        hasCoupon: !!cart.couponCode,
        itemTypes: [...new Set(cart.items.map(item => item.itemType || 'menu'))],
      });
    }
  }, [cart]);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRazorpayPayment() {
    if (!cart) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?redirect=/checkout");
      return;
    }

    setPaying(true);
    
    try {
      // Create Razorpay order
      const totalAmount = cart.discountedTotal || cart.totalAmount;
      const razorpayOrder = await createRazorpayOrder(totalAmount);

      // Initialize Razorpay payment
      await initializeRazorpayPayment({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Rabuste Coffee',
        description: 'Premium Robusta Coffee Order',
        order_id: razorpayOrder.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const isVerified = await verifyRazorpayPayment(response);
            
            if (isVerified) {
              // Create order after successful payment
              await createOrderAfterPayment(response.razorpay_payment_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setPaying(false);
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
        },
        theme: {
          color: '#B87333'
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          }
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setPaying(false);
    }
  }

  async function createOrderAfterPayment(paymentId: string) {
    try {
      const token = localStorage.getItem("token");
      
      // Prepare order data
      const orderPayload = {
        items: cart!.items,
        totalAmount: cart!.discountedTotal || cart!.totalAmount,
        instructions: "",
        couponCode: cart!.couponCode ? String(cart!.couponCode).toUpperCase() : null,
        couponDiscount: cart!.couponDiscount ? Number(cart!.couponDiscount) : 0,
        paymentId: paymentId,
        paymentStatus: 'completed'
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Order creation failed");
      }

      const orderData = await res.json();
      
      // Track order placed
      trackOrderPlaced({
        orderId: orderData._id,
        totalAmount: cart!.discountedTotal || cart!.totalAmount,
        itemCount: cart!.items.length,
        hasCoupon: !!cart!.couponCode,
        couponCode: cart!.couponCode || undefined,
        couponDiscount: cart!.couponDiscount || undefined,
        itemTypes: [...new Set(cart!.items.map(item => item.itemType || 'menu'))],
      });
      
      // Clear the cart after successful order
      try {
        await fetch("/api/cart", { method: "DELETE" });
      } catch (clearError) {
        console.error("Failed to clear cart:", clearError);
      }
      
      // Check if order contains art items
      const hasArtItems = cart!.items.some((item) => item.itemType === 'art');
      
      // Redirect to appropriate order status page
      if (hasArtItems) {
        router.push(`/art-order-status?orderId=${orderData._id}`);
      } else {
        router.push("/order-status");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Payment successful but order creation failed. Please contact support.");
    } finally {
      setPaying(false);
    }
  }
  

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading checkout...</p>
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
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
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
              Add items to your cart before checking out
            </p>
            <button onClick={() => router.push("/menu")} className="btn btn-primary">
              GO TO MENU
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalAmount = cart.discountedTotal || cart.totalAmount;
  const subtotal = cart.totalAmount;
  const discount = cart.couponDiscount || 0;

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                SECURE PAYMENT
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
              CHECK<span className="gradient-text">OUT</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl px-2" style={{ color: '#B87333' }}>
              Complete your order securely
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Order Summary Card */}
            <div className="brutal-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2
                className="text-2xl sm:text-3xl mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                  letterSpacing: '0.1em',
                }}
              >
                <ShoppingBag size={28} className="text-[#B87333]" />
                YOUR ORDER
              </h2>

              <div className="space-y-4 mb-8">
                {cart.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-4 border-b border-[#B87333]/20"
                  >
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg sm:text-xl mb-1"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#F5F1E8',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-base" style={{ color: '#8B6F47' }}>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xl sm:text-2xl gradient-text font-bold flex-shrink-0 ml-2">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t-2 border-[#B87333]/30">
                <div className="flex justify-between text-base" style={{ color: '#8B6F47' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {cart.couponCode && discount > 0 && (
                  <div className="flex justify-between text-base" style={{ color: '#5E7D4C' }}>
                    <span>Coupon Discount ({cart.couponCode})</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}

                <p className="text-sm text-center mb-4" style={{ color: '#8B6F47' }}>
                  All prices are inclusive of taxes
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t-2 border-[#B87333]/30">
                  <span
                    className="text-2xl sm:text-3xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                      letterSpacing: '0.05em',
                    }}
                  >
                    TOTAL
                  </span>
                  <span
                    className="text-3xl sm:text-4xl gradient-text"
                    style={{
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="brutal-card p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                  }}
                >
                  <CreditCard size={20} className="text-[#B87333]" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.1em',
                  }}
                >
                  PAYMENT METHOD
                </h2>
              </div>

              <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#8B6F47', lineHeight: 1.7 }}>
                Secure payment powered by Razorpay. Your payment information is encrypted and safe.
              </p>

              <button
                onClick={handleRazorpayPayment}
                disabled={paying}
                className="btn btn-primary w-full"
                style={{
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  padding: 'clamp(16px, 4vw, 24px) clamp(24px, 6vw, 50px)',
                  minHeight: '56px',
                }}
              >
                {paying ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    PROCESSING PAYMENT...
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    PAY ₹{totalAmount}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6" style={{ color: '#8B6F47' }}>
                <CheckCircle size={16} />
                <span className="text-sm">Secure & encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}