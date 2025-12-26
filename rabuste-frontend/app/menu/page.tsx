"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const menuData = [
  {
    category: 'Espresso Based',
    items: [
      { id: 1, name: 'Single Origin Espresso', desc: 'Pure intensity with dark chocolate notes', price: 140, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=90' },
      { id: 2, name: 'Double Shot', desc: 'Bold and powerful', price: 200, image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=90' },
      { id: 3, name: 'Cappuccino', desc: 'Perfect balance of espresso and foam', price: 160, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=90' },
      { id: 4, name: 'Flat White', desc: 'Velvety microfoam perfection', price: 170, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=90' },
    ]
  },
  {
    category: 'Cold Brew',
    items: [
      { id: 5, name: 'Cold Brew Reserve', desc: '18-hour slow extraction', price: 220, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=90' },
      { id: 6, name: 'Iced Latte', desc: 'Smooth and refreshing', price: 190, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&q=90' },
      { id: 7, name: 'Nitro Cold Brew', desc: 'Nitrogen-infused smoothness', price: 250, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=90' },
    ]
  },
  {
    category: 'Specialty',
    items: [
      { id: 8, name: 'Affogato', desc: 'Espresso meets vanilla gelato', price: 240, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=90' },
      { id: 9, name: 'Mocha', desc: 'Rich chocolate indulgence', price: 210, image: 'https://images.unsplash.com/photo-1578374173703-9c37b1c7738e?w=400&q=90' },
      { id: 10, name: 'Cortado', desc: 'Perfectly balanced', price: 170, image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=400&q=90' },
    ]
  },
];

export default function MenuPage() {
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = menuData.flatMap(cat => cat.items).find(i => i.id === Number(id));
      if (item) total += item.price * qty;
    });
    return total;
  };

  const categories = ['All', ...menuData.map(cat => cat.category)];
  const filteredData = activeCategory === 'All' 
    ? menuData 
    : menuData.filter(cat => cat.category === activeCategory);

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Header */}
      <div 
        className="sticky top-20 z-40 py-6"
        style={{ 
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 168, 106, 0.1)',
        }}
      >
        <div className="container px-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 px-5 py-2.5 rounded-sm border border-[#C9A86A]/20 hover:border-[#C9A86A]/40 transition-all"
            style={{ color: '#C9A86A' }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </button>

          <h1 
            className="text-4xl md:text-6xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 200 }}
          >
            Menu
          </h1>

          {getTotalItems() > 0 && (
            <button
              onClick={() => router.push('/cart')}
              className="flex items-center gap-3 px-5 py-2.5 rounded-sm border transition-all relative"
              style={{
                background: 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 100%)',
                color: '#0A0A0A',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <ShoppingCart size={20} />
              <span className="text-sm font-medium">₹{getTotalPrice()}</span>
              <span 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: '#0A0A0A',
                  color: '#C9A86A',
                  border: '2px solid #C9A86A',
                }}
              >
                {getTotalItems()}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="container px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-6 py-3 rounded-sm text-sm uppercase tracking-wider whitespace-nowrap transition-all"
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 100%)' : 'transparent',
                color: activeCategory === cat ? '#0A0A0A' : '#C9A86A',
                border: `1px solid ${activeCategory === cat ? 'transparent' : 'rgba(201, 168, 106, 0.2)'}`,
                fontWeight: activeCategory === cat ? 500 : 300,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="container px-6 pb-20">
        {filteredData.map((category, catIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 
              className="text-3xl md:text-5xl mb-8 gradient-text"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 200 }}
            >
              {category.category}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="elegant-card p-6"
                >
                  <div 
                    className="relative overflow-hidden rounded-sm mb-4"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 
                    className="text-xl mb-2"
                    style={{ 
                      color: '#F5F1E8',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 300,
                    }}
                  >
                    {item.name}
                  </h3>

                  <p 
                    className="text-sm mb-4"
                    style={{ color: '#8B6F47', lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <span 
                      className="text-2xl gradient-text"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                    >
                      ₹{item.price}
                    </span>

                    {cart[item.id] ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-sm border border-[#C9A86A]/20 hover:border-[#C9A86A]/40 flex items-center justify-center transition-all"
                          style={{ color: '#C9A86A' }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ color: '#C9A86A', fontWeight: 500 }}>{cart[item.id]}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 rounded-sm flex items-center justify-center transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 100%)',
                            color: '#0A0A0A',
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="px-4 py-2 rounded-sm text-sm uppercase tracking-wider transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 100%)',
                          color: '#0A0A0A',
                          fontWeight: 500,
                        }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}