# Cache & CDN Optimization Summary

## ✅ Optimizations Implemented

### 1. Static Assets Cache Headers
- **Next.js Static Files**: `max-age=31536000, immutable, stale-while-revalidate=86400`
- **Images**: All image directories cached for 1 year
- **Logo & Icons**: Long-term cache with stale-while-revalidate
- **Fonts**: Cached with CORS headers

### 2. API Route Caching
- **Menu API** (`/api/menu`): `s-maxage=60, stale-while-revalidate=300` (1 min CDN, 5 min stale)
- **Art API** (`/api/art`): `s-maxage=60, stale-while-revalidate=300` (1 min CDN, 5 min stale)
- **Instagram API** (`/api/instagram`): `s-maxage=300, stale-while-revalidate=600` (5 min CDN, 10 min stale)
- **Workshops API** (`/api/workshops`): `s-maxage=120, stale-while-revalidate=300` (2 min CDN, 5 min stale)
- **Coupons API** (`/api/coupons`): `s-maxage=120, stale-while-revalidate=300` (2 min CDN, 5 min stale)

### 3. Image Optimization
- **Next.js Image**: `minimumCacheTTL: 31536000` (1 year)
- **Remote Patterns**: Added Instagram CDN domains
- **Formats**: AVIF and WebP support
- **Device Sizes**: Optimized for all screen sizes

### 4. CDN-Specific Headers
- Added `CDN-Cache-Control` headers for Vercel edge network
- Added `Vercel-CDN-Cache-Control` for explicit Vercel CDN control
- `stale-while-revalidate` for background updates

### 5. DNS Prefetch
- Instagram domains (`www.instagram.com`, `static.cdninstagram.com`)
- Payment gateway (`checkout.razorpay.com`)
- Analytics (`www.googletagmanager.com`)
- Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)

## Cache Strategy

### Static Assets (1 Year)
- CSS/JS bundles
- Images
- Fonts
- Icons/Logos

### API Responses (Short-term with stale-while-revalidate)
- Public data: 1-5 minutes CDN cache
- Stale-while-revalidate: 5-10 minutes
- Allows instant responses while updating in background

## Benefits

1. **Reduced Latency**: Assets served from edge nodes closest to users
2. **Lower Bandwidth**: Cached responses reduce origin requests
3. **Better Performance**: Stale-while-revalidate provides instant responses
4. **Global CDN**: Vercel's edge network serves content worldwide
5. **Cost Savings**: Fewer origin requests = lower costs

## Monitoring

Monitor cache hit rates in Vercel Analytics to ensure optimal caching behavior.
