"use client";

import { Coffee, Calendar, Hash, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { formatTokenForDisplay } from "@/lib/tokenUtils";

type ReceiptItem = {
  name: string;
  price: number;
  quantity: number;
  itemType?: "menu" | "art";
};

type OrderReceiptProps = {
  token: string;
  orderDate: string;
  items: ReceiptItem[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
  customerName?: string;
  customerEmail?: string;
};

export default function OrderReceipt({
  token,
  orderDate,
  items,
  totalAmount,
  couponCode,
  couponDiscount = 0,
  customerName,
  customerEmail,
}: OrderReceiptProps) {
  
  const subtotal = totalAmount + (couponDiscount || 0);
  const tax = 0; // Tax is inclusive in totalAmount
  
  // Format token with date prefix for display
  const displayToken = formatTokenForDisplay(token, orderDate);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Background - Dark gradient effect
      doc.setFillColor(26, 17, 16);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Top accent bar
      doc.setFillColor(184, 115, 51);
      doc.rect(0, 0, 210, 3, 'F');
      
      // Header Background Box
      doc.setFillColor(43, 24, 16);
      doc.rect(10, 10, 190, 35, 'F');
      
      // Header Border - Copper
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.8);
      doc.rect(10, 10, 190, 35);
      
      // Business Name - RABUSTE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.setTextColor(184, 115, 51);
      doc.text("RABUSTE", 105, 26, { align: "center" });
      
      // Tagline
      doc.setFontSize(10);
      doc.setTextColor(212, 165, 116);
      doc.text("PREMIUM ROBUSTA COFFEE", 105, 34, { align: "center" });
      
      // Address
      doc.setFontSize(8);
      doc.setTextColor(245, 241, 232);
      doc.text("Dimple Row House, 15, Gymkhana Road, Piplod, Surat - 395007", 105, 40, { align: "center" });
      
      // Receipt Title Box
      let yPos = 55;
      doc.setFillColor(61, 43, 31);
      doc.rect(10, yPos, 190, 15, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.5);
      doc.rect(10, yPos, 190, 15);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(212, 165, 116);
      doc.text("ORDER RECEIPT", 105, yPos + 10, { align: "center" });
      
      // Order Details Box
      yPos = 78;
      doc.setFillColor(43, 24, 16);
      const detailsBoxHeight = customerName ? 30 : 24;
      doc.rect(10, yPos, 190, detailsBoxHeight, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.3);
      doc.rect(10, yPos, 190, detailsBoxHeight);
      
      yPos += 8;
      
      // Order Token - Prominent Display
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(212, 165, 116);
      doc.text("ORDER TOKEN:", 15, yPos);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(184, 115, 51);
      doc.text(displayToken, 195, yPos, { align: "right" });
      
      yPos += 8;
      
      // Date & Time
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(212, 165, 116);
      doc.text("DATE & TIME:", 15, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(245, 241, 232);
      doc.text(formatDate(orderDate), 195, yPos, { align: "right" });
      
      yPos += 8;
      
      // Customer Name
      if (customerName) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(212, 165, 116);
        doc.text("CUSTOMER:", 15, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(245, 241, 232);
        doc.text(customerName, 195, yPos, { align: "right" });
        yPos += 8;
      }
      
      // Items Section
      yPos += 8;
      
      // Items Header
      doc.setFillColor(61, 43, 31);
      doc.rect(10, yPos, 190, 10, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.rect(10, yPos, 190, 10);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(212, 165, 116);
      doc.text("ITEM", 15, yPos + 7);
      doc.text("QTY", 140, yPos + 7, { align: "center" });
      doc.text("PRICE", 165, yPos + 7, { align: "right" });
      doc.text("TOTAL", 195, yPos + 7, { align: "right" });
      
      yPos += 10;
      
      // Items Background
      const itemHeight = items.length * 10 + 4;
      doc.setFillColor(43, 24, 16);
      doc.rect(10, yPos, 190, itemHeight, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.3);
      doc.rect(10, yPos, 190, itemHeight);
      
      yPos += 7;
      
      // Items List
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      items.forEach((item, index) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          // Re-apply background
          doc.setFillColor(26, 17, 16);
          doc.rect(0, 0, 210, 297, 'F');
          yPos = 20;
        }
        
        // Item name (wrap if too long)
        const itemName = item.name.length > 35 ? item.name.substring(0, 32) + "..." : item.name;
        
        doc.setTextColor(245, 241, 232);
        doc.text(itemName, 15, yPos);
        
        doc.setTextColor(212, 165, 116);
        doc.text(String(item.quantity), 140, yPos, { align: "center" });
        
        doc.setTextColor(245, 241, 232);
        doc.text(`₹${item.price}`, 165, yPos, { align: "right" });
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(184, 115, 51);
        doc.text(`₹${item.price * item.quantity}`, 195, yPos, { align: "right" });
        
        doc.setFont("helvetica", "normal");
        
        // Subtle divider between items (except last)
        if (index < items.length - 1) {
          doc.setDrawColor(61, 43, 31);
          doc.setLineWidth(0.2);
          doc.line(15, yPos + 3, 195, yPos + 3);
        }
        
        yPos += 10;
      });
      
      // Totals Section
      yPos += 5;
      
      // Totals Background
      const totalsHeight = couponCode && couponDiscount > 0 ? 35 : 25;
      doc.setFillColor(61, 43, 31);
      doc.rect(10, yPos, 190, totalsHeight, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.5);
      doc.rect(10, yPos, 190, totalsHeight);
      
      yPos += 8;
      
      // Subtotal
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(245, 241, 232);
      doc.text("Subtotal:", 15, yPos);
      doc.text(`₹${subtotal}`, 195, yPos, { align: "right" });
      
      yPos += 7;
      
      // Coupon Discount
      if (couponCode && couponDiscount > 0) {
        doc.setTextColor(94, 125, 76);
        doc.text(`Discount (${couponCode}):`, 15, yPos);
        doc.text(`- ₹${couponDiscount}`, 195, yPos, { align: "right" });
        yPos += 7;
      }
      
      // Tax note
      doc.setFontSize(8);
      doc.setTextColor(212, 165, 116);
      doc.text("(All prices inclusive of taxes)", 15, yPos);
      
      yPos += 5;
      
      // Divider
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, 195, yPos);
      
      yPos += 8;
      
      // Total Amount Box
      doc.setFillColor(43, 24, 16);
      doc.rect(10, yPos, 190, 20, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.8);
      doc.rect(10, yPos, 190, 20);
      
      // TOTAL Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(212, 165, 116);
      doc.text("TOTAL:", 15, yPos + 13);
      
      // Total Amount
      doc.setFontSize(18);
      doc.setTextColor(184, 115, 51);
      doc.text(`₹${totalAmount}`, 195, yPos + 13, { align: "right" });
      
      // Footer Section
      yPos = 275;
      
      // Thank You Box
      doc.setFillColor(61, 43, 31);
      doc.rect(10, yPos, 190, 15, 'F');
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.3);
      doc.rect(10, yPos, 190, 15);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(212, 165, 116);
      doc.text("THANK YOU FOR CHOOSING RABUSTE!", 105, yPos + 6, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(245, 241, 232);
      doc.text("Visit us again soon for premium Robusta coffee!", 105, yPos + 11, { align: "center" });
      
      // Bottom accent bar
      doc.setFillColor(184, 115, 51);
      doc.rect(0, 294, 210, 3, 'F');
      
      // Download
      doc.save(`Receipt_${displayToken}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="brutal-card p-6 md:p-8"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div className="text-center mb-8 pb-6"
        style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}
      >
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
            border: '2px solid rgba(184, 115, 51, 0.5)',
          }}
        >
          <Coffee size={32} style={{ color: '#B87333' }} />
        </div>
        
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.1em',
          }}
        >
          RABUSTE
        </h1>
        
        <p className="text-sm mb-1" style={{ color: '#8B6F47' }}>
          Premium Robusta Coffee
        </p>
        <p className="text-xs" style={{ color: '#8B6F47' }}>
          Dimple Row House, 15, Gymkhana Road, Piplod, Surat - 395007
        </p>
      </div>

      {/* Receipt Title */}
      <div className="text-center mb-6">
        <h2
          className="text-2xl md:text-3xl mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.1em',
          }}
        >
          ORDER RECEIPT
        </h2>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6 pb-6"
        style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.2)' }}
      >
        {/* Token */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash size={20} style={{ color: '#B87333' }} />
            <span className="text-sm" style={{ color: '#8B6F47' }}>
              Order Token
            </span>
          </div>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#B87333',
              letterSpacing: '0.05em',
            }}
          >
            {displayToken}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={20} style={{ color: '#B87333' }} />
            <span className="text-sm" style={{ color: '#8B6F47' }}>
              Date & Time
            </span>
          </div>
          <span className="text-sm" style={{ color: '#F5F1E8' }}>
            {formatDate(orderDate)}
          </span>
        </div>

        {/* Customer Name */}
        {customerName && (
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#8B6F47' }}>
              Customer
            </span>
            <span className="text-sm" style={{ color: '#F5F1E8' }}>
              {customerName}
            </span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="space-y-4 mb-6">
        <h3
          className="text-lg mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.1em',
          }}
        >
          ITEMS
        </h3>
        
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start pb-3"
            style={{
              borderBottom: index < items.length - 1
                ? '1px solid rgba(184, 115, 51, 0.15)'
                : 'none',
            }}
          >
            <div className="flex-1">
              <h4
                className="text-base mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                  letterSpacing: '0.03em',
                }}
              >
                {item.name}
              </h4>
              <p className="text-sm" style={{ color: '#8B6F47' }}>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <span
              className="text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#B87333',
              }}
            >
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-6"
        style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}
      >
        <div className="flex justify-between text-base" style={{ color: '#8B6F47' }}>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        
        {couponCode && couponDiscount > 0 && (
          <div className="flex justify-between text-base" style={{ color: '#5E7D4C' }}>
            <span>Discount ({couponCode})</span>
            <span>- ₹{couponDiscount}</span>
          </div>
        )}

        <p className="text-xs text-center" style={{ color: '#8B6F47' }}>
          (All prices inclusive of taxes)
        </p>

        <div className="flex justify-between items-center pt-4"
          style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}
        >
          <span
            className="text-2xl"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#F5F1E8',
              letterSpacing: '0.05em',
            }}
          >
            TOTAL
          </span>
          <span
            className="text-3xl gradient-text"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            ₹{totalAmount}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8 pt-6"
        style={{ borderTop: '2px solid rgba(184, 115, 51, 0.2)' }}
      >
        <button
          onClick={downloadPDF}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
            color: '#000',
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            fontWeight: 900,
            letterSpacing: '0.1em',
            boxShadow: '0 4px 15px rgba(184, 115, 51, 0.4)',
          }}
        >
          <Download size={18} />
          DOWNLOAD PDF
        </button>
        
        <button
          onClick={printReceipt}
          className="flex items-center justify-center gap-2 py-3 px-4 transition-all hover:scale-105"
          style={{
            background: 'rgba(184, 115, 51, 0.2)',
            border: '2px solid rgba(184, 115, 51, 0.4)',
            color: '#D4A574',
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            fontWeight: 900,
            letterSpacing: '0.1em',
          }}
        >
          <Printer size={18} />
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-6"
        style={{ borderTop: '1px solid rgba(184, 115, 51, 0.2)' }}
      >
        <p className="text-sm mb-1" style={{ color: '#8B6F47' }}>
          Thank you for choosing Rabuste!
        </p>
        <p className="text-xs" style={{ color: '#8B6F47' }}>
          Visit us again soon!
        </p>
      </div>
    </motion.div>
  );
}
