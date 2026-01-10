# Instagram Posts Integration Setup

This document explains how to set up automatic fetching of Instagram posts for the website.

## Overview

The system supports two methods for displaying Instagram posts:
1. **Auto-fetch from Instagram API** (recommended for cafe owners with less tech knowledge)
2. **Manual posts** (fallback if API is not configured)

## Method 1: Auto-Fetch from Instagram API (Recommended)

### Prerequisites
- Instagram Business or Creator account
- Facebook Page connected to Instagram account
- Facebook Developer account

### Setup Steps

1. **Create a Facebook App**
   - Go to https://developers.facebook.com/
   - Click "My Apps" → "Create App"
   - Choose "Business" type
   - Add "Instagram Graph API" product

2. **Get Access Token**
   - In your Facebook App, go to Instagram Graph API → Basic Display
   - Get a User Access Token (long-lived token recommended, expires in 60 days)
   - Get your Instagram User ID

3. **Fetch Instagram Posts**
   - Log in as admin on your website
   - Go to admin panel (or use API directly)
   - Make a POST request to: `/api/instagram/admin/fetch`
   - Body: 
     ```json
     {
       "accessToken": "YOUR_ACCESS_TOKEN",
       "userId": "YOUR_INSTAGRAM_USER_ID" // Optional, can use "me"
     }
     ```

4. **Automatic Refresh** (Optional)
   - Set up a cron job or scheduled task to call the fetch endpoint every 6 hours
   - This keeps your Instagram posts up to date automatically

### API Endpoint: Auto-Fetch
```
POST /api/instagram/admin/fetch
Headers: Authorization: Bearer <admin_token>
Body: {
  "accessToken": "instagram_access_token",
  "userId": "instagram_user_id" // optional
}
```

## Method 2: Manual Posts (Fallback)

If you don't want to set up the Instagram API, you can manually add posts:

### Add Manual Post
```
POST /api/instagram/admin/manual
Headers: Authorization: Bearer <admin_token>
Body: {
  "imageUrl": "https://instagram.com/p/.../image.jpg",
  "caption": "Post caption text",
  "permalink": "https://www.instagram.com/p/.../",
  "likes": 123 // optional
}
```

### Update Manual Post
```
PATCH /api/instagram/admin/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "caption": "Updated caption",
  "likes": 150
}
```

### Delete Post
```
DELETE /api/instagram/admin/:id
Headers: Authorization: Bearer <admin_token>
```

## Frontend Display

The website automatically fetches the latest 6 Instagram posts from:
- **Frontend API**: `GET /api/instagram` (public route)
- **Backend API**: `GET /api/instagram` (public route)

The InstagramShowcase component will:
- Display loading state while fetching
- Show error message if fetch fails
- Display fallback message if no posts are available
- Automatically link to Instagram profile

## Database Model

Instagram posts are stored in MongoDB with the following structure:
```javascript
{
  instagramId: String (unique),
  imageUrl: String,
  caption: String,
  permalink: String,
  likes: Number,
  timestamp: Date,
  mediaType: String (IMAGE/VIDEO/CAROUSEL_ALBUM),
  isManual: Boolean,
  displayOrder: Number
}
```

## Notes

- The system prioritizes non-manual posts over manual posts
- Only the latest 6 posts are displayed on the website
- Posts are sorted by timestamp (newest first)
- Manual posts are sorted by displayOrder after API posts

## Troubleshooting

**Issue**: No posts showing on website
- Check if posts exist in database
- Verify API endpoint is accessible
- Check browser console for errors

**Issue**: Auto-fetch not working
- Verify access token is valid and not expired
- Check Instagram User ID is correct
- Ensure Instagram account is Business/Creator type
- Verify Facebook Page is connected to Instagram account

**Issue**: Posts not updating
- Check if cron job/scheduled task is running (if configured)
- Manually trigger fetch endpoint
- Verify access token hasn't expired (refresh if needed)
