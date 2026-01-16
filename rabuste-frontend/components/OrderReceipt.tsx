"use client";

import { Coffee, Calendar, Hash, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

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
      
      // Set font
      doc.setFont("helvetica");
      
      // Header - Business Name
      doc.setFontSize(24);
      doc.setTextColor(184, 115, 51);
      doc.text("RABUSTE", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Premium Robusta Coffee", 105, 28, { align: "center" });
      doc.text("Dimple Row House, 15, Gymkhana Road, Piplod, Surat - 395007", 105, 34, { align: "center" });
      
      // Divider
      doc.setDrawColor(184, 115, 51);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);
      
      // Receipt Title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("ORDER RECEIPT", 105, 50, { align: "center" });
      
      // Order Details
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      let yPos = 60;
      
      // Token
      doc.setFont("helvetica", "bold");
      doc.text("Order Token:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(184, 115, 51);
      doc.text(token, 60, yPos);
      
      yPos += 8;
      
      // Date & Time
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Date & Time:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(formatDate(orderDate), 60, yPos);
      
      yPos += 8;
      
      // Customer Name (if available)
      if (customerName) {
        doc.setFont("helvetica", "bold");
        doc.text("Customer:", 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(customerName, 60, yPos);
        yPos += 8;
      }
      
      // Divider
      yPos += 5;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Items Header
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Item", 20, yPos);
      doc.text("Qty", 130, yPos);
      doc.text("Price", 155, yPos);
      doc.text("Total", 175, yPos, { align: "right" });
      
      yPos += 6;
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 8;
      
      // Items
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      items.forEach((item) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        // Item name (wrap if too long)
        const itemName = item.name.length > 40 ? item.name.substring(0, 37) + "..." : item.name;
        doc.text(itemName, 20, yPos);
        doc.text(String(item.quantity), 130, yPos);
        doc.text(`₹${item.price}`, 155, yPos);
        doc.text(`₹${item.price * item.quantity}`, 190, yPos, { align: "right" });
        yPos += 8;
      });
      
      // Divider before totals
      yPos += 5;
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Subtotal
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", 130, yPos);
      doc.text(`₹${subtotal}`, 190, yPos, { align: "right" });
      yPos += 8;
      
      // Coupon Discount (if applicable)
      if (couponCode && couponDiscount > 0) {
        doc.setTextColor(94, 125, 76);
        doc.text(`Discount (${couponCode}):`, 130, yPos);
        doc.text(`- ₹${couponDiscount}`, 190, yPos, { align: "right" });
        yPos += 8;
      }
      
      // Tax note
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text("(All prices inclusive of taxes)", 130, yPos);
      yPos += 10;
      
      // Total
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("TOTAL:", 130, yPos);
      doc.setTextColor(184, 115, 51);
      doc.text(`₹${totalAmount}`, 190, yPos, { align: "right" });
      
      // Footer
      yPos = 270;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Rabuste!", 105, yPos, { align: "center" });
      doc.text("Visit us again soon!", 105, yPos + 5, { align: "center" });
      
      // Download
      doc.save(`Receipt_${token}.pdf`);
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
            {token}
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
