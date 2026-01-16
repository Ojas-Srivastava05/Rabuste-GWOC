# 🎥 Cloudinary Video Hosting Setup

Your videos are now configured to use Cloudinary for hosting, which means:
- ✅ Videos are **NOT** committed to git (faster commits/pushes)
- ✅ Videos load faster from CDN
- ✅ Automatic video optimization
- ✅ Works in both development and production

## 📋 Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier available)
2. After signup, you'll see your **Cloud Name**, **API Key**, and **API Secret**

### Step 2: Upload Your Videos
1. Go to [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
2. Click **Upload** → **Upload** (or drag & drop)
3. Upload these videos:
   - `herocafe.mp4` (main hero background video)
4. After upload, click on each video to get its **Public ID** (the name without extension)

### Step 3: Set Environment Variables

Create or update `.env.local` in `rabuste-frontend/`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvraokarg

# Video URLs (use Cloudinary public IDs)
# Format: https://res.cloudinary.com/dvraokarg/video/upload/vVERSION/PUBLIC_ID.mov
NEXT_PUBLIC_HERO_VIDEO_URL=https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov
NEXT_PUBLIC_RIGHT_VIDEO_URL=https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov
```

**Note:**
- Cloud name is set to: `dvraokarg`
- Video URLs are already configured with your Cloudinary account

### Step 4: For Vercel Deployment

Add the same environment variables in your Vercel dashboard:
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add all the `NEXT_PUBLIC_*` variables from above

## 🔄 How It Works

- **Development**: If environment variables are not set, videos load from `/public/gallery/` (local files)
- **Production**: Videos load from Cloudinary CDN (faster, optimized)

## 📝 Current Video Files

The following videos are configured:
- **Hero Background**: Cloudinary URL (default: `https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov`)
- **Right Side Video**: Same as hero video

## 🚀 Benefits

1. **Faster Git Operations**: Videos are in `.gitignore`, so commits/pushes are instant
2. **Better Performance**: Cloudinary CDN serves videos faster globally
3. **Automatic Optimization**: Cloudinary optimizes video delivery
4. **Scalable**: Free tier includes 25GB storage + 25GB bandwidth/month

## ⚠️ Important Notes

- Videos are still in your local `public/gallery/` folder for development
- They're just not tracked by git anymore
- Make sure to upload to Cloudinary before deploying to production
- Keep local videos as backup

## 🆘 Troubleshooting

**Videos not showing in production?**
- Check that environment variables are set in Vercel
- Verify the Cloudinary URLs are correct
- Check browser console for errors

**Want to use local videos temporarily?**
- Just don't set the environment variables
- Videos will automatically fall back to local files
