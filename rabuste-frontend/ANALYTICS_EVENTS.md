# 📊 Firebase Analytics Events Guide

This document lists all the analytics events being tracked in your Rabuste website.

## 🎯 How to View Analytics

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Analytics** → **Events**
4. View real-time data or standard reports

---

## 📈 Tracked Events

### **1. Page Views** (`page_view`)
**When:** User visits any page
**Data:**
- `page_title` - Name of the page
- `page_location` - URL path
- `timestamp` - When viewed

**Where:** Automatically tracked on all pages via `PageViewTracker` component

---

### **2. Section Views** (`section_view`)
**When:** User scrolls to a homepage section (50% visible)
**Data:**
- `section_name` - Name of section (hero, experience, benefits, etc.)
- `timestamp` - When viewed

**Sections Tracked:**
- `hero`
- `horizontal_scroll`
- `experience`
- `benefits`
- `vr_experience`
- `process`
- `call_to_action`
- `testimonials`
- `contact`

---

### **3. VR Scene Interactions** (`vr_scene_interaction`)
**When:** User interacts with VR tour
**Data:**
- `scene_name` - Name of VR scene (Main Counter, Seating Area, Art Gallery)
- `interaction_type` - Type of interaction (view, navigate, close)
- `timestamp` - When occurred

**Interactions:**
- Opening VR tour
- Navigating between scenes
- Closing VR tour

---

### **4. Workshop Clicks** (`workshop_click`)
**When:** User clicks on a workshop to view details
**Data:**
- `workshop_id` - Workshop ID
- `workshop_title` - Workshop name
- `timestamp` - When clicked

---

### **5. Add to Cart** (`add_to_cart` + `cart_item_added`)
**When:** User adds item to cart
**Data:**
- `item_id` - Item ID
- `item_name` - Item name
- `item_type` - Type (menu or art)
- `price` - Item price
- `quantity` - Quantity added
- `category` - Item category
- `currency` - INR
- `value` - Total value (price × quantity)
- `timestamp` - When added

**Tracked For:**
- Menu items
- Art items

---

### **6. Remove from Cart** (`remove_from_cart`)
**When:** User removes item from cart
**Data:**
- `item_id` - Item ID
- `item_name` - Item name
- `item_type` - Type (menu or art)
- `timestamp` - When removed

---

### **7. Checkout Started** (`begin_checkout`)
**When:** User arrives at checkout page
**Data:**
- `currency` - INR
- `value` - Total cart value
- `items` - Number of items
- `item_types` - Types of items (menu, art)
- `has_coupon` - Whether coupon is applied

---

### **8. Order Placed** (`purchase` + `order_placed`)
**When:** User successfully places an order
**Data:**
- `transaction_id` - Order ID
- `value` - Order total amount
- `currency` - INR
- `items` - Number of items
- `coupon` - Coupon code (if used)
- `discount` - Discount amount
- `item_types` - Types of items in order
- `order_id` - Order ID
- `total_amount` - Total amount
- `item_count` - Number of items
- `has_coupon` - Whether coupon was used
- `coupon_code` - Coupon code
- `coupon_discount` - Discount amount
- `timestamp` - When ordered

**Note:** This uses Firebase's standard `purchase` event for e-commerce tracking

---

### **9. Order Status Update** (`order_status_update`)
**When:** Admin updates order status (pending → completed)
**Data:**
- `order_id` - Order ID
- `old_status` - Previous status
- `new_status` - New status
- `timestamp` - When updated

---

### **10. Menu Item View** (`view_item` + `menu_item_view`)
**When:** User views a menu item (opens modal/details)
**Data:**
- `item_id` - Menu item ID
- `item_name` - Item name
- `category` - Item category
- `price` - Item price
- `currency` - INR
- `value` - Item price
- `timestamp` - When viewed

---

### **11. Art Item View** (`view_item` + `art_item_view`)
**When:** User views an art item (opens modal/details)
**Data:**
- `item_id` - Art item ID
- `item_name` - Artwork title
- `artist` - Artist name
- `category` - Art category
- `price` - Artwork price
- `currency` - INR
- `value` - Artwork price
- `timestamp` - When viewed

---

### **12. Search** (`search`)
**When:** User searches in menu (presses Enter)
**Data:**
- `search_term` - Search query
- `result_count` - Number of results
- `timestamp` - When searched

---

### **13. User Login** (`login`)
**When:** User logs in
**Data:**
- `method` - Login method (email)
- `timestamp` - When logged in

---

### **14. User Signup** (`sign_up`)
**When:** User creates new account
**Data:**
- `timestamp` - When signed up

---

## 📊 Analytics Dashboard Overview

### **Key Metrics You'll See:**

1. **Active Users** - Number of users visiting your site
2. **Events** - Total number of events tracked
3. **Top Events** - Most common events
4. **User Engagement** - How users interact with your site

### **E-commerce Metrics:**
- **Revenue** - From `purchase` events
- **Conversion Rate** - Orders / Checkouts started
- **Average Order Value** - Total revenue / Orders
- **Cart Abandonment** - Checkouts started but not completed

### **Product Performance:**
- **Top Items** - Most viewed/added to cart
- **Category Performance** - Which categories perform best
- **Art vs Menu** - Comparison of art vs menu items

---

## 🔍 Finding Specific Data

### **View Order Details:**
1. Go to Analytics → Events
2. Click on `purchase` or `order_placed`
3. See all order data including amounts, items, coupons

### **View Cart Activity:**
1. Go to Analytics → Events
2. Look for `add_to_cart`, `remove_from_cart`, `begin_checkout`
3. See cart abandonment rate

### **View User Behavior:**
1. Go to Analytics → Events
2. Check `page_view` for page popularity
3. Check `section_view` for homepage engagement
4. Check `search` for popular search terms

### **View VR Usage:**
1. Go to Analytics → Events
2. Click `vr_scene_interaction`
3. See which scenes are most popular
4. See interaction types (view, navigate, close)

---

## 💡 Tips for Using Analytics

1. **Check Daily** - Review events daily to understand user behavior
2. **Look for Patterns** - Identify peak times, popular items
3. **Track Conversions** - Monitor checkout → purchase conversion
4. **Optimize Based on Data** - Use insights to improve UX
5. **A/B Testing** - Use data to test different approaches

---

## 🚨 Important Notes

- **Real-time Data:** Available immediately in "View real-time report"
- **Standard Reports:** Data appears after 24-48 hours
- **Privacy Compliant:** All tracking is anonymous and GDPR-friendly
- **No Personal Data:** Only tracks behavior, not personal information

---

## 📱 Mobile vs Desktop

Analytics automatically tracks:
- Device type (mobile, tablet, desktop)
- Browser information
- Screen size
- Location (country/city level, not exact)

---

**Your analytics are now fully set up and tracking! 🎉**
