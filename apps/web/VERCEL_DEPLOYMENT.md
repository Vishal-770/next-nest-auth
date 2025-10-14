# Vercel Deployment Guide for Frontend

## ✅ Yes, You Can Deploy `/apps/web` Directly to Vercel!

Vercel has excellent support for monorepos and can deploy just the frontend from your turborepo structure.

---

## 🚀 Deployment Methods

### Method 1: Via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Import in Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Vishal-770/next-nest-auth`

#### Step 3: Configure Project
In the project configuration screen:

**Framework Preset**: `Next.js`

**Root Directory**: `apps/web` ⚠️ **IMPORTANT**
- Click "Edit" next to Root Directory
- Select or type: `apps/web`

**Build & Development Settings**:
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Step 4: Environment Variables
Add these in the Environment Variables section:

```env
SESSION_SECRET_KEY=generate_new_production_secret
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
NEXT_PUBLIC_APP_NAME=Auth App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
SESSION_EXPIRY_DAYS=30
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=true
NEXT_PUBLIC_ENABLE_SIGNUP=true
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_REDIRECT_DELAY=1500
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_API_TIMEOUT=15000
```

**Generate SESSION_SECRET_KEY**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Step 5: Deploy
- Click **"Deploy"**
- Wait for build to complete (2-3 minutes)
- Your app will be live at `https://your-app.vercel.app`

---

### Method 2: Via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Navigate to Web Directory
```bash
cd apps/web
```

#### Step 3: Login to Vercel
```bash
vercel login
```

#### Step 4: Deploy
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

#### Step 5: Set Environment Variables
```bash
vercel env add SESSION_SECRET_KEY production
vercel env add NEXT_PUBLIC_API_URL production
# Add all other environment variables...
```

---

## 📋 Pre-Deployment Checklist

### ✅ Before Deploying:

1. **Backend Deployed First**
   - [ ] Deploy NestJS backend to Railway/Render
   - [ ] Get backend URL (e.g., `https://api.railway.app`)
   - [ ] Test backend API is accessible

2. **Environment Variables Ready**
   - [ ] Generate new SESSION_SECRET_KEY for production
   - [ ] Have backend URL ready
   - [ ] Know your frontend domain (or use Vercel's)

3. **Code Preparation**
   - [ ] All changes committed to git
   - [ ] `.env` file NOT in git (should be in `.gitignore`)
   - [ ] Push latest code to GitHub

4. **Configuration Files**
   - [ ] `vercel.json` created (optional but helpful)
   - [ ] `next.config.js` configured
   - [ ] All dependencies in `package.json`

---

## 🔧 Configuration Files

### `vercel.json` (already created)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### `next.config.js` (update if needed)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // For better production builds
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
```

---

## 🌍 Environment Variables for Production

### Required Variables:
```env
# ⚠️ MUST CHANGE - Generate new secret for production
SESSION_SECRET_KEY=your_new_production_secret_here

# ⚠️ MUST UPDATE - Your actual backend URL
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# ⚠️ MUST UPDATE - Will be auto-provided by Vercel
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Recommended Variables:
```env
NODE_ENV=production
SESSION_EXPIRY_DAYS=30
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=true
NEXT_PUBLIC_APP_NAME=Auth App
NEXT_PUBLIC_ENABLE_SIGNUP=true
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_REDIRECT_DELAY=1500
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_API_TIMEOUT=15000
```

---

## 🔄 Post-Deployment Steps

### 1. Update Backend CORS
After frontend is deployed, update your NestJS backend CORS:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',          // Development
    'https://your-app.vercel.app',    // Production
  ],
  credentials: true,
});
```

### 2. Test Your Deployment
- [ ] Visit your Vercel URL
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test email verification
- [ ] Test theme toggle
- [ ] Check session persistence
- [ ] Verify API connectivity

### 3. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with module not found
```bash
Solution: 
1. Check all dependencies are in package.json
2. Verify root directory is set to apps/web
3. Check import paths use @/ alias correctly
```

**Issue**: Environment variables not working
```bash
Solution:
1. Redeploy after adding env vars (required)
2. Verify variable names are correct
3. Check NEXT_PUBLIC_ prefix for client vars
```

### Runtime Errors

**Issue**: Cannot connect to backend
```bash
Solution:
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check backend CORS allows your domain
3. Ensure backend is running and accessible
```

**Issue**: Session not persisting
```bash
Solution:
1. Verify SESSION_SECRET_KEY is set
2. Check COOKIE_SECURE=true for HTTPS
3. Ensure backend allows credentials in CORS
```

**Issue**: "Failed to load resource" errors
```bash
Solution:
1. Check all NEXT_PUBLIC_ variables are set
2. Verify API timeout is sufficient
3. Check browser console for specific errors
```

---

## 📊 Deployment Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Vercel Dashboard** | Easy, Visual, Auto-deploys from Git | Requires GitHub connection |
| **Vercel CLI** | Quick, Direct control, No Git needed | Manual process, Command-line only |
| **GitHub Integration** | Auto-deploy on push, Preview deployments | Initial setup required |

---

## 🎯 Recommended Approach

### For First Deployment:
1. ✅ Use Vercel Dashboard
2. ✅ Connect to GitHub
3. ✅ Set root directory to `apps/web`
4. ✅ Add all environment variables
5. ✅ Deploy

### For Updates:
Just push to GitHub - Vercel auto-deploys! 🚀

```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel automatically deploys
```

---

## 📱 Preview Deployments

Vercel automatically creates preview deployments for:
- Every pull request
- Every push to non-main branches

Each preview gets its own URL:
`https://your-app-git-branch-name.vercel.app`

---

## 💡 Pro Tips

1. **Use Vercel's Environment Groups**
   - Production: Production environment variables
   - Preview: Test environment variables
   - Development: Local development variables

2. **Enable Automatic Deploys**
   - Every push to `main` = Production deployment
   - Every PR = Preview deployment

3. **Monitor Your Deployment**
   - Vercel Dashboard shows real-time logs
   - Analytics available for Pro plan
   - Error tracking built-in

4. **Domain Management**
   - Vercel provides free `.vercel.app` subdomain
   - Can add custom domains easily
   - Automatic SSL certificates

---

## 🚀 Quick Deploy Commands

```bash
# One-time setup
cd apps/web
vercel login
vercel

# Future deployments
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## ✅ Success Indicators

After successful deployment, you should see:
- ✅ Build completed successfully
- ✅ Deployment URL provided
- ✅ Application accessible at URL
- ✅ All pages load correctly
- ✅ API calls work
- ✅ Session management works
- ✅ Theme toggle works

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turborepo on Vercel](https://vercel.com/docs/monorepos/turborepo)

---

## 🎉 You're Ready!

Your `/apps/web` directory is fully configured and ready to deploy to Vercel. Just follow the steps above and you'll be live in minutes!

**Remember**: Deploy your backend first, then use its URL in your frontend environment variables.
