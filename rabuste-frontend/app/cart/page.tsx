"use client";

import Link from "next/link";
import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateItem, removeItem, total } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0a' }}
      >
        <div className="text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-8"
          >
            <div 
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(146, 102, 68, 0.2), rgba(200, 155, 123, 0.2))',
                border: '2px solid rgba(146, 102, 68, 0.3)',
              }}
            >
              <ShoppingBag size={64} color="#926644" strokeWidth={1.5} />
            </div>
          </motion.div>

          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: '#E6C9A8',
            }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-lg mb-8" style={{ color: '#D0B5A2' }}>
            Looks like you haven't added anything yet.
          </p>
          
          <button
            onClick={() => router.push('/menu')}
            className="px-8 py-4 rounded-full font-semibold text-lg"
            style={{
              background: 'linear-gradient(135deg, #926644, #C89B7B)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 md:px-8"
      style={{ background: '#0a0a0a' }}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-lg hover:translate-x-[-4px] transition-transform"
          style={{ color: '#926644', fontFamily: 'var(--font-heading)' }}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 
          className="text-4xl md:text-5xl font-bold"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: '#E6C9A8',
          }}
        >
          Your Cart
        </h1>
        <p className="mt-2" style={{ color: '#D0B5A2' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-morphism p-6 rounded-2xl"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: '#E6C9A8',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold" style={{ color: '#926644' }}>
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{
                        background: 'rgba(146, 102, 68, 0.1)',
                        border: '1px solid rgba(146, 102, 68, 0.2)',
                      }}
                    >
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                        style={{
                          background: 'rgba(146, 102, 68, 0.2)',
                          color: '#926644',
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span 
                        className="w-8 text-center font-bold"
                        style={{ color: '#E6C9A8' }}
                      >
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                        style={{
                          background: 'rgba(146, 102, 68, 0.3)',
                          color: '#926644',
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-red-500/20"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div 
                  className="mt-4 pt-4 flex justify-between items-center"
                  style={{ borderTop: '1px solid rgba(146, 102, 68, 0.2)' }}
                >
                  <span style={{ color: '#D0B5A2' }}>Subtotal</span>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: '#926644' }}
                  >
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-morphism p-6 rounded-2xl sticky top-8"
            >
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ 
                  color: '#E6C9A8',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: '#D0B5A2' }}>Subtotal</span>
                  <span style={{ color: '#E6C9A8' }}>₹{total()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#D0B5A2' }}>Tax (5%)</span>
                  <span style={{ color: '#E6C9A8' }}>₹{Math.round(total() * 0.05)}</span>
                </div>
                <div 
                  className="pt-4"
                  style={{ borderTop: '1px solid rgba(146, 102, 68, 0.2)' }}
                >
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-lg font-semibold"
                      style={{ color: '#E6C9A8' }}
                    >
                      Total
                    </span>
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: '#926644' }}
                    >
                      ₹{Math.round(total() * 1.05)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 rounded-full font-semibold text-lg text-center transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #926644, #C89B7B)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => router.push('/menu')}
                className="block w-full mt-4 py-4 rounded-full font-semibold text-lg text-center"
                style={{
                  background: 'transparent',
                  color: '#926644',
                  border: '2px solid rgba(146, 102, 68, 0.3)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}