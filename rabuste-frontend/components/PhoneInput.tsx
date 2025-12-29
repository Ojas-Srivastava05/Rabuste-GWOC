'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  digits: number;
}

const countries: Country[] = [
  // 🌎 North America
  { code: '+1', name: 'United States', flag: '🇺🇸', digits: 10 },
  { code: '+1', name: 'Canada', flag: '🇨🇦', digits: 10 },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', digits: 10 },

  // 🌍 South America
  { code: '+55', name: 'Brazil', flag: '🇧🇷', digits: 11 },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', digits: 10 },
  { code: '+56', name: 'Chile', flag: '🇨🇱', digits: 9 },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', digits: 10 },
  { code: '+51', name: 'Peru', flag: '🇵🇪', digits: 9 },

  // 🌍 Europe
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', digits: 10 },
  { code: '+33', name: 'France', flag: '🇫🇷', digits: 9 },
  { code: '+49', name: 'Germany', flag: '🇩🇪', digits: 10 },
  { code: '+39', name: 'Italy', flag: '🇮🇹', digits: 10 },
  { code: '+34', name: 'Spain', flag: '🇪🇸', digits: 9 },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', digits: 9 },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', digits: 9 },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', digits: 9 },
  { code: '+47', name: 'Norway', flag: '🇳🇴', digits: 8 },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', digits: 8 },
  { code: '+48', name: 'Poland', flag: '🇵🇱', digits: 9 },
  { code: '+43', name: 'Austria', flag: '🇦🇹', digits: 10 },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', digits: 9 },

  // 🌏 Asia
  { code: '+91', name: 'India', flag: '🇮🇳', digits: 10 },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰', digits: 10 },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩', digits: 10 },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰', digits: 9 },
  { code: '+977', name: 'Nepal', flag: '🇳🇵', digits: 10 },
  { code: '+81', name: 'Japan', flag: '🇯🇵', digits: 10 },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', digits: 10 },
  { code: '+86', name: 'China', flag: '🇨🇳', digits: 11 },
  { code: '+66', name: 'Thailand', flag: '🇹🇭', digits: 9 },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳', digits: 9 },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', digits: 10 },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', digits: 10 },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', digits: 8 },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', digits: 9 },

  // 🌍 Middle East
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', digits: 9 },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', digits: 9 },
  { code: '+974', name: 'Qatar', flag: '🇶🇦', digits: 8 },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭', digits: 8 },
  { code: '+968', name: 'Oman', flag: '🇴🇲', digits: 8 },
  { code: '+972', name: 'Israel', flag: '🇮🇱', digits: 9 },
  { code: '+964', name: 'Iraq', flag: '🇮🇶', digits: 10 },

  // 🌍 Africa
  { code: '+27', name: 'South Africa', flag: '🇿🇦', digits: 9 },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', digits: 10 },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', digits: 10 },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', digits: 9 },

  // 🌏 Oceania
  { code: '+61', name: 'Australia', flag: '🇦🇺', digits: 9 },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', digits: 9 },
];


interface PhoneInputProps {
  value: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (number: string) => void;
  error?: string;
}

export default function PhoneInput({
  value,
  countryCode,
  onCountryChange,
  onNumberChange,
  error,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry =
    countries.find(c => c.code === countryCode) || countries[22]; // Default to India

  /* Positioning */
  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const dropdownHeight = 400;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

    setDropdownPos({
      top: openUp ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
      left: rect.left,
      width: Math.max(320, rect.width),
      openUp,
    });

    // Auto-focus search
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isOpen]);

  /* Outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !wrapperRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCountries = countries.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm)
  );

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <div
        ref={wrapperRef}
        className="flex items-stretch overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(20, 20, 20, 0.8)',
          border: `2px solid ${error ? '#DC2626' : isOpen ? '#B87333' : 'rgba(184, 115, 51, 0.2)'}`,
          boxShadow: isOpen ? '0 0 0 1px rgba(184, 115, 51, 0.3)' : 'none',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(v => !v)}
          className="h-full px-4 py-4 flex items-center gap-2 hover:bg-black/30 transition-all duration-200"
          style={{
            borderRight: '2px solid rgba(184, 115, 51, 0.2)',
            color: '#B87333',
          }}
        >
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="font-mono text-sm font-semibold">{selectedCountry.code}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <input
          type="tel"
          value={value}
          onChange={e => onNumberChange(e.target.value.replace(/\D/g, ''))}
          placeholder={`Enter ${selectedCountry.digits}-digit number`}
          maxLength={selectedCountry.digits}
          className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-sm"
          style={{
            color: '#FFFEF9',
            fontFamily: 'Work Sans, sans-serif',
            letterSpacing: '0.05em',
          }}
        />
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="overflow-hidden shadow-2xl"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            maxHeight: '400px',
            background: 'linear-gradient(to bottom, rgba(15, 15, 15, 0.98), rgba(10, 10, 10, 0.98))',
            border: '2px solid rgba(184, 115, 51, 0.5)',
            borderRadius: '12px',
            zIndex: 99999,
            // backdropFilter: 'blur(12px)',
            filter: 'none',
            backdropFilter: 'none',

            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(184, 115, 51, 0.2)',
            animation: 'dropdown-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Enhanced Search Header */}
          <div
            className="p-4"
            style={{ 
              borderBottom: '2px solid rgba(184, 115, 51, 0.3)',
              background: 'linear-gradient(to bottom, rgba(184, 115, 51, 0.05), transparent)'
            }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: searchTerm ? '#B87333' : '#8B6F47' }}
              />
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-10 pr-10 py-3 text-sm rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                  color: '#FFFEF9',
                  fontFamily: 'Work Sans, sans-serif',
                  letterSpacing: '0.02em',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#B87333';
                  e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                  e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-amber-900/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" style={{ color: '#8B6F47' }} />
                </button>
              )}
            </div>
            
            {/* Result count */}
            {searchTerm && (
              <p className="text-xs mt-2 px-1" style={{ color: '#8B6F47' }}>
                {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
              </p>
            )}
          </div>

          {/* Countries List with improved styling */}
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: '320px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#B87333 rgba(0,0,0,0.3)'
            }}
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, idx) => {
                const isSelected = country.code === selectedCountry.code && country.name === selectedCountry.name;
                
                return (
                  <button
                    key={`${country.code}-${country.name}-${idx}`}
                    onClick={() => {
                      onCountryChange(country.code);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all duration-150 group"
                    style={{
                      background: isSelected 
                        ? 'linear-gradient(to right, rgba(184, 115, 51, 0.15), rgba(184, 115, 51, 0.05))' 
                        : 'transparent',
                      borderBottom: '1px solid rgba(184, 115, 51, 0.1)',
                      borderLeft: isSelected ? '3px solid #B87333' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(184, 115, 51, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {country.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="text-sm font-medium truncate transition-colors"
                        style={{ 
                          color: isSelected ? '#D4A574' : '#FFFEF9',
                          fontFamily: 'Work Sans, sans-serif',
                          letterSpacing: '0.02em'
                        }}
                      >
                        {country.name}
                      </div>
                      <div 
                        className="text-xs mt-0.5"
                        style={{ color: '#8B6F47' }}
                      >
                        {country.digits} digits required
                      </div>
                    </div>
                    <span
                      className="text-sm font-mono font-bold transition-colors"
                      style={{ 
                        color: isSelected ? '#D4A574' : '#B87333',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {country.code}
                    </span>
                    {isSelected && (
                      <span className="text-xs ml-1" style={{ color: '#D4A574' }}>✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: '#8B6F47' }} />
                <p className="text-sm" style={{ color: '#8B6F47' }}>
                  No countries found
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B5F47' }}>
                  Try searching by country name or code
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animations & Scrollbar */}
      <style jsx>{`
        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: translateY(${dropdownPos.openUp ? '12px' : '-12px'}) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #D4A574, #B87333);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #CD7F32, #D4A574);
        }
      `}</style>

      {/* Error & Helper Text */}
      {error && (
        <div className="mt-2 p-2 rounded" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
          <p className="text-xs flex items-center gap-1" style={{ color: '#DC2626' }}>
            <span>⚠</span> {error}
          </p>
        </div>
      )}

      {!error && value && (
        <div className="mt-2 flex items-center justify-between text-xs" style={{ color: '#8B6F47' }}>
          <span>
            {value.length}/{selectedCountry.digits} digits
          </span>
          <span className="font-mono">
            {selectedCountry.code}{value}
          </span>
        </div>
      )}
    </div>
  );
}