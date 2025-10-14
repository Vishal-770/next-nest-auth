# Quick Reference: Environment Variables

## 🚀 Quick Start

```bash
# 1. Copy template
cp apps/web/.env.example apps/web/.env

# 2. Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. Add secret to .env
# SESSION_SECRET_KEY=your_generated_secret

# 4. Start dev server
npm run dev
```

---

## 📋 Essential Variables

### Required
```env
SESSION_SECRET_KEY=your_secret_key_here
```

### Recommended
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Auth App
NODE_ENV=development
```

---

## 🌍 Environment-Specific

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
COOKIE_SECURE=false
SESSION_EXPIRY_DAYS=7
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
COOKIE_SECURE=true
SESSION_EXPIRY_DAYS=30
```

---

## 🔧 Usage in Code

```typescript
import { config } from '@/lib/config';

// Access configuration
config.api.url
config.app.name
config.session.expiryDays
config.cookie.secure
config.features.enableSignup
config.ui.defaultTheme
```

---

## 📁 Files to Know

- `.env` - Your local environment (git-ignored)
- `.env.example` - Template for developers
- `.env.production.example` - Template for production
- `lib/config.ts` - Configuration helper
- `ENV_VARIABLES.md` - Full documentation

---

## ⚡ Common Tasks

### Change API URL
```env
NEXT_PUBLIC_API_URL=https://new-api-url.com
```

### Extend session duration
```env
SESSION_EXPIRY_DAYS=30
```

### Change app name
```env
NEXT_PUBLIC_APP_NAME=My Cool App
```

### Enable/disable features
```env
NEXT_PUBLIC_ENABLE_SIGNUP=false
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=false
```

---

## 🚨 Remember

- Restart dev server after `.env` changes
- Never commit `.env` file
- Use different secrets for dev/staging/prod
- Add new variables to `turbo.json`
- Use `NEXT_PUBLIC_` only for client-side variables

---

For complete documentation, see: `ENV_VARIABLES.md`
