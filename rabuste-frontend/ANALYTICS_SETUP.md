# 📊 Analytics Setup - Firebase + Vercel

Your website now uses **two analytics systems** that work together:

## 🎯 **1. Firebase Analytics** (Custom Events)

**What it tracks:**
- ✅ Custom events (add_to_cart, order_placed, etc.)
- ✅ Section views
- ✅ VR interactions
- ✅ Workshop clicks
- ✅ User actions (login, signup)
- ✅ Product views
- ✅ Search queries

**Where to view:**
- Firebase Console → Analytics → Events
- Real-time view available
- Detailed event parameters

**Best for:** Detailed user behavior tracking, custom events, e-commerce metrics

---

## 🎯 **2. Vercel Analytics** (Page Views & Performance)

**What it tracks:**
- ✅ Page views (automatic)
- ✅ Performance metrics
- ✅ Web Vitals (Core Web Vitals)
- ✅ Geographic data
- ✅ Device information

**Where to view:**
- Vercel Dashboard → Analytics tab
- Available after deployment
- Real-time page view data

**Best for:** Performance monitoring, page view analytics, Core Web Vitals

---

## 🔄 **How They Work Together**

```
User visits your website
    ↓
Vercel Analytics → Tracks page view automatically
    ↓
Firebase Analytics → Tracks custom events (add to cart, orders, etc.)
    ↓
Both send data to their respective dashboards
```

---

## ✅ **What's Already Set Up**

### **Firebase Analytics:**
- ✅ Installed and configured
- ✅ Custom event tracking functions
- ✅ Page view tracking
- ✅ Section view tracking
- ✅ E-commerce event tracking

### **Vercel Analytics:**
- ✅ Package installed (`@vercel/analytics`)
- ✅ Component added to layout
- ✅ Automatic page view tracking

---

## 🚀 **After Deployment**

### **Firebase Analytics:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Analytics → Events
4. View real-time or standard reports

### **Vercel Analytics:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Analytics" tab
4. View page views and performance metrics

---

## 📈 **What You'll See**

### **Firebase Console:**
- `page_view` - Page visits
- `add_to_cart` - Cart additions
- `order_placed` - Completed orders
- `section_view` - Homepage sections
- `vr_scene_interaction` - VR usage
- `workshop_click` - Workshop clicks
- And many more custom events...

### **Vercel Dashboard:**
- Page views per page
- Unique visitors
- Performance metrics
- Core Web Vitals
- Geographic distribution
- Device breakdown

---

## 💡 **Benefits of Using Both**

1. **Comprehensive Coverage:**
   - Vercel: Page views and performance
   - Firebase: Custom events and user actions

2. **Redundancy:**
   - If one fails, you still have data from the other

3. **Different Insights:**
   - Vercel: Technical performance
   - Firebase: Business metrics (orders, cart, etc.)

4. **Best of Both Worlds:**
   - Vercel: Simple, automatic
   - Firebase: Detailed, customizable

---

## 🔍 **Testing**

### **Test Firebase Analytics:**
1. Visit your website
2. Add item to cart
3. Check Firebase Console → Events → Real-time
4. Should see `add_to_cart` event within 30 seconds

### **Test Vercel Analytics:**
1. Deploy to Vercel
2. Visit your deployed site
3. Navigate between pages
4. Check Vercel Dashboard → Analytics
5. Should see page views within 30 seconds

---

## ⚙️ **Configuration**

### **Firebase:**
- Environment variables in `.env.local`
- Configuration in `lib/firebase.ts`
- Event tracking in `lib/analytics.ts`

### **Vercel:**
- No configuration needed!
- Works automatically after deployment
- No environment variables required

---

## 📝 **Notes**

- **Both systems work independently** - no conflicts
- **Vercel Analytics only works on Vercel deployments** - won't track in local dev
- **Firebase Analytics works everywhere** - local dev and production
- **No performance impact** - both are optimized

---

## 🎉 **You're All Set!**

Your website now has comprehensive analytics tracking:
- ✅ Automatic page views (Vercel)
- ✅ Custom events (Firebase)
- ✅ Performance metrics (Vercel)
- ✅ E-commerce tracking (Firebase)
- ✅ User behavior (Firebase)

Just deploy and start collecting data! 🚀
