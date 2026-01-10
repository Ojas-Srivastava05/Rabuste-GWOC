# 📊 AI-Powered Feedback System

## ✅ What's Been Implemented

### **1. Backend Feedback Model** (`rabuste-backend/src/models/feedback.js`)
- Stores all feedback data (order, cafe, website)
- Includes AI analysis fields:
  - `sentiment`: positive/negative/neutral
  - `sentimentScore`: -1 to 1 scale
  - `summary`: AI-generated summary
  - `categories`: Auto-detected categories
  - `isFlagged`: Auto-flagged negative reviews
  - `priority`: low/medium/high/urgent

### **2. AI Sentiment Analysis** (`rabuste-backend/src/utils/sentimentAnalysis.js`)
- **Sentiment Analysis**: Analyzes comments and ratings
  - Positive/negative word detection
  - Combines text analysis with rating scores
  - Returns sentiment (-1 to 1 scale)
  
- **Summary Generation**: Creates concise summaries
  - Extracts key ratings
  - Includes comment snippets
  - Type-specific formatting
  
- **Category Extraction**: Auto-categorizes feedback
  - Order: food_quality, delivery, packaging, etc.
  - Cafe: ambience, service, cleanliness, etc.
  - Website: usability, design, performance, etc.
  
- **Priority Determination**: Auto-assigns priority
  - Urgent: Negative sentiment + rating ≤ 2
  - High: Negative sentiment + rating ≤ 3
  - Medium: Neutral sentiment + rating ≤ 3
  - Low: All others

### **3. Backend API Routes** (`rabuste-backend/src/routes/feedback.js`)
- `POST /api/feedback` - Submit feedback (public)
- `GET /api/feedback` - Get all feedback (admin only)
- `GET /api/feedback/stats` - Get statistics (admin only)
- `GET /api/feedback/:id` - Get single feedback (admin only)
- `PATCH /api/feedback/:id` - Update feedback (admin only)

### **4. Admin Panel** (`rabuste-frontend/app/admin/feedback/page.tsx`)
- **Statistics Dashboard**:
  - Total feedback count
  - Average rating
  - Flagged reviews count
  - Positive feedback count
  
- **Advanced Filtering**:
  - Filter by type (order/cafe/website)
  - Filter by sentiment (positive/negative/neutral)
  - Filter by priority (urgent/high/medium/low)
  - Filter flagged reviews only
  - Search by text
  
- **Feedback Display**:
  - AI summary prominently displayed
  - Sentiment badges (color-coded)
  - Priority indicators
  - Category tags
  - Detailed ratings breakdown
  - Full comments
  
- **Actions**:
  - Flag/unflag reviews
  - Update priority
  - Pagination support

---

## 🎯 How It Works

### **1. User Submits Feedback**
```
User fills feedback form
    ↓
Frontend sends to /api/feedback
    ↓
Backend receives feedback
    ↓
AI Analysis:
  - Sentiment Analysis
  - Generate Summary
  - Extract Categories
  - Determine Priority
  - Flag if negative
    ↓
Store in database
    ↓
Send email notification
```

### **2. Admin Views Feedback**
```
Admin opens /admin/feedback
    ↓
Fetches feedback with filters
    ↓
Displays:
  - Statistics
  - Filtered feedback list
  - AI summaries
  - Sentiment analysis
  - Priority flags
```

---

## 🔍 AI Features Explained

### **Sentiment Analysis**
- Analyzes comment text for positive/negative words
- Combines with rating scores (60% text, 40% rating)
- Returns sentiment: positive/negative/neutral
- Score range: -1 (very negative) to 1 (very positive)

### **Auto-Flagging**
- Automatically flags reviews when:
  - Sentiment is negative AND
  - Rating is ≤ 2 stars
- Helps identify critical issues quickly

### **Category Detection**
- Automatically detects relevant categories:
  - **Order**: food_quality, delivery, packaging, order_accuracy
  - **Cafe**: ambience, service, cleanliness, atmosphere
  - **Website**: usability, design, performance, features

### **Priority Assignment**
- **Urgent**: Negative + Rating ≤ 2 (needs immediate attention)
- **High**: Negative + Rating ≤ 3 (important to address)
- **Medium**: Neutral + Rating ≤ 3 (should review)
- **Low**: All others (can review later)

---

## 📈 Admin Panel Features

### **Statistics Cards**
- Total feedback received
- Average rating across all feedback
- Number of flagged reviews
- Positive feedback count

### **Filters**
- **Type**: Order / Cafe / Website
- **Sentiment**: Positive / Negative / Neutral
- **Priority**: Urgent / High / Medium / Low
- **Flagged**: Show only flagged reviews
- **Search**: Search by text in comments/summary

### **Feedback Cards**
- **Header**: Type badge, sentiment badge, priority badge, flagged indicator
- **User Info**: Name, email, date
- **Rating**: Star display with numeric rating
- **AI Summary**: Prominently displayed summary
- **Categories**: Tagged categories
- **Comments**: Full user comments
- **Detailed Ratings**: Breakdown by category
- **Actions**: Flag/unflag button

---

## 🚀 Benefits

1. **Automated Analysis**: No manual review needed
2. **Quick Issue Detection**: Negative reviews auto-flagged
3. **Priority Management**: Know what needs attention first
4. **Category Insights**: Understand feedback themes
5. **Summary**: Quick overview without reading full comments
6. **Search & Filter**: Find specific feedback easily

---

## 📝 Example Feedback Flow

### **User Submits:**
```
Type: Order
Rating: 2/5
Food Quality: 3/5
Delivery Time: 1/5
Comments: "Food was okay but delivery was very slow. Took 45 minutes!"
```

### **AI Analysis:**
```
Sentiment: negative
Sentiment Score: -0.4
Summary: "Order Feedback: 2/5 overall. Food quality: 3/5. Delivery time: 1/5. Comment: 'Food was okay but delivery was very slow. Took 45 minutes!'"
Categories: ["delivery", "delivery_issue"]
Priority: urgent
Flagged: true
```

### **Admin Sees:**
- ⚠️ **FLAGGED** badge (red)
- **URGENT** priority badge
- **NEGATIVE** sentiment badge
- Summary showing delivery issue
- Categories: delivery, delivery_issue

---

## 🔧 Technical Details

### **Backend Files:**
- `src/models/feedback.js` - MongoDB schema
- `src/routes/feedback.js` - API routes
- `src/utils/sentimentAnalysis.js` - AI analysis functions

### **Frontend Files:**
- `app/api/feedback/route.ts` - Frontend API (forwards to backend)
- `app/admin/feedback/page.tsx` - Admin panel
- `app/admin/layout.tsx` - Added feedback link

### **Database Fields:**
- All feedback data
- AI analysis results
- Timestamps
- User information

---

## 🎉 Result

The owner can now:
- ✅ See all customer feedback in one place
- ✅ Get AI-powered summaries
- ✅ Identify negative reviews automatically
- ✅ Understand feedback categories
- ✅ Prioritize which feedback to address first
- ✅ Search and filter feedback easily
- ✅ Track feedback statistics

**The system is fully automated and ready to use!** 🚀
