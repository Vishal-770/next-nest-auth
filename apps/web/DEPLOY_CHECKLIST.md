# 🚀 Vercel Deployment - Quick Checklist

## Step-by-Step Guide

### ✅ Step 1: Deploy Backend First
- [ ] Deploy NestJS API to Railway/Render/Fly.io
- [ ] Get backend URL: `https://your-api.railway.app`
- [ ] Test API is accessible: `curl https://your-api.railway.app`

### ✅ Step 2: Prepare Environment Variables
- [ ] Generate production secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- [ ] Copy the output for `SESSION_SECRET_KEY`

### ✅ Step 3: Deploy to Vercel
1. **Go to**: https://vercel.com/new
2. **Import**: Your GitHub repository `Vishal-770/next-nest-auth`
3. **Set Root Directory**: `apps/web` ⚠️ IMPORTANT!
4. **Add Environment Variables**:
   ```
   SESSION_SECRET_KEY=your_generated_secret
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_APP_NAME=Auth App
   NODE_ENV=production
   SESSION_EXPIRY_DAYS=30
   COOKIE_SECURE=true
   COOKIE_SAME_SITE=lax
   COOKIE_HTTP_ONLY=true
   ```
5. **Click Deploy** 🚀

### ✅ Step 4: Update Backend CORS
After frontend deploys, get your Vercel URL and update backend:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app', // Add this
  ],
  credentials: true,
});
```

Redeploy backend after updating CORS.

### ✅ Step 5: Test Everything
- [ ] Visit your Vercel URL
- [ ] Test Signup
- [ ] Test Login
- [ ] Test Email Verification
- [ ] Test Session Persistence
- [ ] Test Theme Toggle

---

## 📋 Environment Variables to Add in Vercel

Copy-paste these in Vercel dashboard:

### Required (MUST set):
```
SESSION_SECRET_KEY=paste_your_generated_secret_here
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Recommended (Use these defaults or customize):
```
NODE_ENV=production
SESSION_EXPIRY_DAYS=30
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=true
NEXT_PUBLIC_APP_NAME=Auth App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_ENABLE_SIGNUP=true
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_REDIRECT_DELAY=1500
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_API_TIMEOUT=15000
```

---

## 🎯 Important Settings

### ⚠️ Root Directory
**MUST be set to**: `apps/web`

### ⚠️ Framework
**Should auto-detect**: Next.js

### ⚠️ Build Command
**Should auto-detect**: `npm run build`

---

## 🚨 Common Issues

### "Module not found"
**Solution**: Verify root directory is `apps/web`

### "Environment variable not defined"
**Solution**: Add variable in Vercel dashboard, then redeploy

### "Cannot connect to API"
**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running
3. Update backend CORS to include your Vercel domain

### Session not working
**Solutions**:
1. Verify `SESSION_SECRET_KEY` is set
2. Check `COOKIE_SECURE=true` for HTTPS
3. Ensure cookies are not blocked

---

## 💡 Pro Tip

After first deployment, Vercel will auto-deploy every time you push to GitHub:

```bash
git add .
git commit -m "Update app"
git push origin main
# Vercel automatically deploys! 🎉
```

---

## ✨ That's It!

You're ready to deploy. Just follow the checklist above and you'll be live in ~5 minutes!

For detailed instructions, see: `VERCEL_DEPLOYMENT.md`
