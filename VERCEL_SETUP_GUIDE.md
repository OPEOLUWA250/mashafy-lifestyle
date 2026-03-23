# Production Deployment to Vercel - Complete Setup Guide

## Issue Fixed (March 23, 2026)
**Problem**: `net::ERR_NAME_NOT_RESOLVED` DNS errors in production, infinite retry loop  
**Root Cause**: Missing environment variables in Vercel  
**Solution**: Circuit breaker pattern + proper env var configuration

---

## Step 1: Add Environment Variables to Vercel Dashboard

### 1.1 Navigate to Vercel Settings
1. Go to your Vercel Project: https://vercel.com/dashboard/projects
2. Select your **mashafy-lifestyle** project
3. Click **Settings** (top right)
4. Navigate to **Environment Variables** (left sidebar)

### 1.2 Add Production Variables

You must add **TWO** environment variables for production deployments:

#### Variable 1: Supabase URL
```
Name:  VITE_SUPABASE_URL
Value: https://oadjbgvjxqkseyimfdqd.supabase.co
```

#### Variable 2: Supabase Anonymous Key
```
Name:  VITE_SUPABASE_ANON_KEY  
Value: sb_publishable_9j8XN6pM3HSPQAihymcX9A_PvU_S8Kw
```

### 1.3 Select Environments
**IMPORTANT**: When adding each variable, select:
- ✅ **Production** (required)
- ✅ **Preview** (for testing staging builds)
- ☐ Development (optional - only if testing locally via Vercel)

### 1.4 Save Variables
- Click **Save** for each variable
- Both should now appear in your Environment Variables list with checkmarks

---

## Step 2: Redeploy with New Variables

### Option A: Automatic (Recommended)
1. Make any small commit to your repo (e.g., update README)
2. Push to main branch
3. Vercel automatically redeploys with new env vars

### Option B: Manual Redeploy
1. In Vercel Dashboard, go to **Deployments**
2. Find your latest deployment
3. Click the **⋮ (three dots)** menu
4. Select **Redeploy**
5. Confirm redeploy

---

## Step 3: Verify Configuration Success

### Check 1: Vercel Build Log
1. In Vercel Dashboard, open the latest deployment
2. Click **Deployments** tab
3. Check build log for errors (should be green checkmark)

### Check 2: Production Site Console
1. Open your production site: https://mashafy-lifestyle.vercel.app
2. Open DevTools: **F12** → **Console** tab
3. Look for: `🔍 Supabase Configuration Check:`
4. Should show:
   ```
   { 
     url: "✅ Present", 
     key: "✅ Present", 
     clientCreated: "✅ Yes" 
   }
   ```

### Check 3: Products Load
1. Visit the shop page
2. Products should load from Supabase
3. Check Network tab in DevTools:
   - Should see successful `GET /rest/v1/products` request
   - Status should be **200 OK** (not DNS error)

---

## Troubleshooting

### Issue: Still Seeing "❌ MISSING" in Config Check

**Solutions:**
1. **Clear browser cache**: Ctrl+Shift+Delete → Clear cache
2. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Verify Vercel settings**:
   - Environment Variables list should show both VITE_SUPABASE_* keys
   - Check that they're set for **Production** environment
4. **Redeploy again**: Force a new deployment in Vercel

### Issue: Still Getting DNS Error (ERR_NAME_NOT_RESOLVED)

**This is a network issue, NOT a config issue. Causes:**
1. **Firewall blocking Supabase domain** - Contact your network admin
2. **Local network restriction** - Try from different network/VPN
3. **Supabase project inactive** - Check Supabase dashboard project status
4. **Rate limiting** - App will auto-fallback to cached data after 5 attempts

**What happens with fallback:**
- Console shows: `🔴 CIRCUIT BREAKER: Too many failures. Waiting before retry...`
- App displays cached products (last known good data)
- No crash, no blank page
- Auto-retries every 30 seconds until network is available

### Issue: Environment Variables Showing But Not Working

**Common cause:** Deployed BEFORE adding env vars

**Fix:**
1. Add the environment variables to Vercel
2. Redeploy (either via git push or manual redeploy)
3. Clear browser cache completely
4. Hard refresh with Ctrl+Shift+R

---

## Environment Variables Reference

| Variable Name | Value | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://oadjbgvjxqkseyimfdqd.supabase.co` | Supabase API endpoint |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_9j8X...` | Supabase public key for client-side auth |

### Why Vite Prefix?
- `VITE_` prefix makes these values accessible in the browser via `import.meta.env`
- Vercel automatically injects these during build
- Without prefix, they won't be available to frontend

---

## How the Application Works After Fix

### Success Path (Network Available)
```
User visits → App startup → Check config ✅ → Fetch from Supabase ✅ → Display products
```

### Fallback Path (Network Unavailable)
```
User visits → App startup → Check config ✅ → Fetch from Supabase ❌
→ Circuit breaker opens → Return cached products → Display products (slightly stale)
→ Auto-retry every 30 seconds when network back
```

### Protection Path (Config Missing - Should Not Happen After Setup)
```
User visits → App startup → Check config ❌ → Display ERROR MESSAGE in console
→ Gracefully degrade to local products if available
```

---

## Circuit Breaker Limits

**To prevent infinite retry loops:**
- Max 5 consecutive network failures before pausing
- 30-second pause between retry attempts
- Auto-reset on successful network connection
- Prevents console spam and excessive API calls

**You'll see in console:**
```javascript
❌ Network failure #1/5
❌ Network failure #2/5
❌ Network failure #3/5
❌ Network failure #4/5
❌ Network failure #5/5
🔴 CIRCUIT BREAKER: Too many failures (5/5). Waiting before retry...
// ... 30 seconds pass ...
✅ Network restored. Resetting failure counter.
✅ Supabase fetch successful!
```

---

## Testing Production Changes

### Before Deploying to Production
1. Test locally: `npm run build && npm run preview`
2. Open `http://localhost:4173`
3. Check console for config check
4. Verify products load

### After Deploying to Vercel
1. Wait 2-3 minutes for build to complete
2. Visit production URL
3. Open DevTools Console (F12)
4. Verify config check shows all ✅
5. Navigate to /shop and verify products load
6. Check Network tab to see Supabase requests succeed

---

## Quick Reference: Common Tasks

### Add New Environment Variable
1. Vercel Dashboard → Settings → Environment Variables
2. Click **Add New...**
3. Fill Name and Value
4. Select **Production** and **Preview**
5. Click **Save**

### Remove/Update Environment Variable  
1. Vercel Dashboard → Settings → Environment Variables
2. Find the variable
3. Click **⋮** → Edit or Delete
4. Redeploy to apply changes

### Check if Env Vars Are Working
1. Open production website
2. Open DevTools Console (F12)
3. Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Should display the URL you set (not undefined)

### Force Full Redeploy
1. Vercel Dashboard → Deployments
2. Find latest deployment
3. Click **⋮** → **Redeploy**
4. Wait for blue circle to turn green checkmark

---

## Support

If issues persist:

1. **Check Supabase dashboard** - Ensure project is active and not paused
2. **Check Vercel build logs** - Look for compile errors (gray X = issue)
3. **Check browser console** - Look for specific error messages
4. **Check Network tab** - Verify requests to `oadjbgvjxqkseyimfdqd.supabase.co`

**Still stuck?** Open `c:\Users\Opeoluwa\Projects\mashafy-lifestyle\PRODUCT_SYNC_ULTRA_FIX.md` for debugging info.

---

## Version Info
- **Fixed**: March 23, 2026
- **Build**: 1431 modules, ~511 kB (gzip 146 kB)
- **Framework**: React 18 + TypeScript + Vite
- **Deploy**: Vercel (serverless)
