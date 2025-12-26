"use client";

import React, { useEffect, useState } from "react";
import "./menu.css";
import gsap from "gsap";
import { initAccordionSlider } from "./menu.core";

// Bestsellers for accordion
const bestsellers = [
  {
    id: 1,
    name: "Rabuste Signature",
    subtitle: "Bold Robusta Espresso",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
    price: "₹180",
    description: "Our signature blend with intense flavor",
    specs: [
      { label: "Intensity", value: "Strong" },
      { label: "Origin", value: "Indian Robusta" },
      { label: "Notes", value: "Dark Chocolate, Nutty" }
    ]
  },
  {
    id: 2,
    name: "Cold Brew Supreme",
    subtitle: "18-Hour Cold Extraction",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800",
    price: "₹220",
    description: "Smooth, rich cold brew perfection",
    specs: [
      { label: "Brew Time", value: "18 Hours" },
      { label: "Strength", value: "Medium" },
      { label: "Notes", value: "Smooth, Sweet" }
    ]
  },
  {
    id: 3,
    name: "Vietnamese Robusta",
    subtitle: "Traditional Phin Filter",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    price: "₹190",
    description: "Authentic Vietnamese coffee experience",
    specs: [
      { label: "Method", value: "Phin Filter" },
      { label: "Style", value: "Traditional" },
      { label: "Notes", value: "Bold, Rich" }
    ]
  },
  {
    id: 4,
    name: "Caramel Macchiato",
    subtitle: "Layered Perfection",
    image: "https://images.unsplash.com/photo-1578374173704-14875135fc1e?w=800",
    price: "₹200",
    description: "Espresso with vanilla and caramel",
    specs: [
      { label: "Type", value: "Specialty" },
      { label: "Sweetness", value: "Medium" },
      { label: "Notes", value: "Caramel, Vanilla" }
    ]
  }
];

// Full menu items
const menuCategories = [
  {
    category: "Espresso Based",
    items: [
      { id: 5, name: "Americano", price: "₹140", description: "Pure espresso with hot water", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" },
      { id: 6, name: "Cappuccino", price: "₹160", description: "Espresso with foamed milk", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
      { id: 7, name: "Latte", price: "₹170", description: "Smooth espresso with steamed milk", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400" },
      { id: 8, name: "Flat White", price: "₹180", description: "Velvety microfoam with espresso", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400" },
      { id: 9, name: "Cortado", price: "₹170", description: "Equal parts espresso and milk", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400" },
      { id: 10, name: "Mocha", price: "₹210", description: "Chocolate espresso delight", image: "https://images.unsplash.com/photo-1578374173704-14875135fc1e?w=400" }
    ]
  },
  {
    category: "Specialty Brews",
    items: [
      { id: 11, name: "Nitro Coffee", price: "₹250", description: "Nitrogen-infused cold brew", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" },
      { id: 12, name: "Affogato", price: "₹240", description: "Espresso over vanilla gelato", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400" },
      { id: 13, name: "Pour Over", price: "₹200", description: "Hand-brewed precision", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
      { id: 14, name: "French Press", price: "₹180", description: "Full-bodied immersion brew", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400" }
    ]
  },
  {
    category: "Iced & Cold",
    items: [
      { id: 15, name: "Iced Latte", price: "₹190", description: "Chilled espresso with milk", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400" },
      { id: 16, name: "Iced Americano", price: "₹160", description: "Espresso over ice", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" },
      { id: 17, name: "Cold Brew Latte", price: "₹230", description: "Cold brew with creamy milk", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400" },
      { id: 18, name: "Frappe", price: "₹220", description: "Blended iced coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" }
    ]
  }
];

export default function MenuPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // ensure DOM painted before menu.core queries elements
    requestAnimationFrame(() => initAccordionSlider());

    // animate slides and menu grid; target the .slide class used by menu.core/menu.css
    gsap.from('.slide', {
      x: -100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.menu-grid', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out'
    });
    // nothing to cleanup here — menu.core binds handlers safely
  }, []);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const filteredCategories = selectedCategory === "all" 
    ? menuCategories 
    : menuCategories.filter(cat => cat.category === selectedCategory);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
      color: '#fff'
    }}>
      {/* styles are provided by app/menu/menu.css - removed inline CSS to avoid conflicts */}

      {/* Back Button & Cart */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => window.location.replace("/")}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#c4a574',
            color: '#000',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>

        {getTotalItems() > 0 && (
          <div className="cart-badge" style={{
            background: 'rgba(196, 165, 116, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 6px 20px rgba(196, 165, 116, 0.3)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🛒</span>
            <span style={{ fontWeight: 700, color: '#000' }}>{getTotalItems()} items</span>
          </div>
        )}
      </div>

      {/* Bestsellers — use slider-container so menu.css and menu.core control visuals */}
      <div className="slider-container">
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '28px 20px', width: '100%' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FAD0C4', marginBottom: '12px', textAlign: 'center' }}>
            ⭐ Bestsellers
          </h2>
        </div>

        <div className="accordion-slider" aria-hidden={false}>
          <button className="navigation-arrows nav-prev" aria-label="Prev">‹</button>

          {bestsellers.map((item, index) => (
            <div
              key={item.id}
              className="slide"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="slide-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="slide-content">
                <div className="car-name">{item.name}</div>
                <div className="car-subtitle">{item.subtitle}</div>
                <div className="car-specs">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="spec-row">
                      <span className="spec-label">{spec.label}</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="add-button no-slide-click"
                  onClick={(e) => { e.stopPropagation(); addToCart(item.id); }}
                  aria-label="Add to cart"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <button className="navigation-arrows nav-next" aria-label="Next">›</button>
        </div>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#c4a574',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px'
          }}>
            Our Selection
          </span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 12px 0'
          }}>
            Menu
          </h1>
          <p style={{ color: '#E6C9A8', fontSize: '1.1rem', margin: 0 }}>
            Crafted with passion, served with excellence
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              background: selectedCategory === "all" ? '#c4a574' : 'rgba(196, 165, 116, 0.2)',
              border: '1px solid rgba(196, 165, 116, 0.3)',
              color: selectedCategory === "all" ? '#000' : '#E6C9A8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            All
          </button>
          {menuCategories.map(cat => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                background: selectedCategory === cat.category ? '#c4a574' : 'rgba(196, 165, 116, 0.2)',
                border: '1px solid rgba(196, 165, 116, 0.3)',
                color: selectedCategory === cat.category ? '#000' : '#E6C9A8',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Full Menu Grid */}
        {filteredCategories.map(category => (
          <div key={category.category} style={{ marginBottom: '60px' }} className="menu-grid">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#FAD0C4',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid rgba(196, 165, 116, 0.2)'
            }}>
              {category.category}
            </h2>
            <div className="grid-inner">
              {category.items.map(item => (
                <div
                  key={item.id}
                  className="menu-item-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.6), rgba(42, 42, 42, 0.4))',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(196, 165, 116, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#FAD0C4',
                      margin: '0 0 8px 0'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#E6C9A8',
                      margin: '0 0 16px 0',
                      opacity: 0.9
                    }}>
                      {item.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#c4a574'
                      }}>
                        {item.price}
                      </span>
                      {cart[item.id] ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: 'rgba(196, 165, 116, 0.2)',
                          padding: '8px 12px',
                          borderRadius: '12px'
                        }}>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              background: '#c4a574',
                              border: 'none',
                              color: '#000',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            −
                          </button>
                          <span style={{
                            fontWeight: 700,
                            color: '#FAD0C4',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {cart[item.id]}
                          </span>
                          <button
                            onClick={() => addToCart(item.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              background: '#c4a574',
                              border: 'none',
                              color: '#000',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #c4a574, #E6C9A8)',
                            border: 'none',
                            color: '#000',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}