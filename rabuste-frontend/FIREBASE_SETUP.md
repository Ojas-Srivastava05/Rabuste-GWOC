# Firebase Analytics Setup Guide

## Quick Setup Steps

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name: "Rabuste" (or your preferred name)
   - Follow the setup wizard

2. **Enable Google Analytics**
   - In Firebase Console, go to Project Settings
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Register your app with a nickname (e.g., "Rabuste Web")
   - Copy the Firebase configuration object

3. **Get Your Configuration Values**
   You'll need these values from the Firebase config:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId` (for Analytics)

4. **Add Environment Variables**
   Create or update `.env.local` in `rabuste-frontend/`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. **Update Firebase Config**
   - Open `lib/firebase.ts`
   - The config will automatically use environment variables
   - If you prefer hardcoding (not recommended for production), replace the placeholder values

6. **Verify Setup**
   - Start your development server: `npm run dev`
   - Open browser console - you should see no Firebase errors
   - Navigate through your site - events should be tracked
   - Check Firebase Console > Analytics > Events to see tracked events

## Tracked Events

The following events are automatically tracked:

1. **Section Views** (`section_view`)
   - Tracks when users view different sections of the homepage
   - Sections: hero, horizontal_scroll, experience, benefits, vr_experience, process, call_to_action, testimonials, contact

2. **VR Scene Interactions** (`vr_scene_interaction`)
   - Tracks VR tour usage
   - Types: view, navigate, close
   - Includes scene name

3. **Workshop Clicks** (`workshop_click`)
   - Tracks when users click on workshops
   - Includes workshop ID and title

## Testing Analytics

1. Open your site in a browser
2. Open Developer Tools > Network tab
3. Filter by "google-analytics" or "firebase"
4. Navigate through sections, use VR, click workshops
5. You should see analytics requests being sent

## Production Deployment

Make sure to:
1. Add all environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Verify Analytics is enabled in Firebase Console
3. Test events are being tracked after deployment
4. Check Firebase Console > Analytics > Events after 24-48 hours for data

## Troubleshooting

- **No events showing**: Check browser console for errors, verify environment variables are set
- **Analytics not initializing**: Ensure `measurementId` is correct and Analytics is enabled in Firebase
- **Events not appearing**: Wait 24-48 hours for data to appear in Firebase Console (real-time view may show immediately)
