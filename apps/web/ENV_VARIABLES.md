# Environment Variables Documentation

## Frontend Environment Variables

This document describes all environment variables used in the Next.js frontend application.

---

## 📋 Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` according to your environment

3. Generate a secure session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

---

## 🔧 Environment Variables

### API Configuration

#### `NEXT_PUBLIC_API_URL` (Required for production)
- **Default**: `http://localhost:8000`
- **Description**: Backend API base URL
- **Example**: `https://api.yourdomain.com`
- **Note**: Must include protocol (http/https) and no trailing slash

#### `NEXT_PUBLIC_API_TIMEOUT`
- **Default**: `10000`
- **Description**: API request timeout in milliseconds
- **Example**: `15000`

---

### Session Configuration

#### `SESSION_SECRET_KEY` (Required)
- **Default**: None
- **Description**: Secret key for JWT session signing (minimum 64 characters)
- **Example**: `aC6YbA3LqvZP6dQ8XxJ6hW4pOq2lR9e+1KjUtj6Z0f0=`
- **Generation**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Security**: Never commit this to git, keep it secret!

#### `SESSION_EXPIRY_DAYS`
- **Default**: `7`
- **Description**: Number of days before session expires
- **Example**: `30`
- **Range**: 1-365

---

### Cookie Configuration

#### `COOKIE_SECURE`
- **Default**: `false` (automatically `true` in production)
- **Description**: Whether to set secure flag on cookies (HTTPS only)
- **Values**: `true` | `false`
- **Note**: Auto-enabled in production (NODE_ENV=production)

#### `COOKIE_SAME_SITE`
- **Default**: `lax`
- **Description**: SameSite cookie attribute for CSRF protection
- **Values**: `lax` | `strict` | `none`
- **Recommendation**: Use `lax` for most cases

#### `COOKIE_HTTP_ONLY`
- **Default**: `true`
- **Description**: Whether cookies should be accessible via JavaScript
- **Values**: `true` | `false`
- **Security**: Keep `true` for security

---

### Application Settings

#### `NODE_ENV`
- **Default**: `development`
- **Description**: Node environment
- **Values**: `development` | `production` | `test`
- **Note**: Automatically set by hosting platforms

#### `NEXT_PUBLIC_APP_NAME`
- **Default**: `Auth App`
- **Description**: Application name displayed in UI
- **Example**: `My Awesome App`

#### `NEXT_PUBLIC_APP_URL`
- **Default**: `http://localhost:3000`
- **Description**: Frontend application URL
- **Example**: `https://app.yourdomain.com`
- **Note**: Used for redirects and canonical URLs

---

### Feature Flags

#### `NEXT_PUBLIC_ENABLE_SIGNUP`
- **Default**: `true`
- **Description**: Enable/disable user signup functionality
- **Values**: `true` | `false`

#### `NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION`
- **Default**: `true`
- **Description**: Require email verification for new accounts
- **Values**: `true` | `false`

---

### UI Configuration

#### `NEXT_PUBLIC_REDIRECT_DELAY`
- **Default**: `1500`
- **Description**: Delay before redirecting after successful actions (ms)
- **Example**: `2000`

#### `NEXT_PUBLIC_DEFAULT_THEME`
- **Default**: `system`
- **Description**: Default theme for the application
- **Values**: `light` | `dark` | `system`

---

## 🚀 Deployment

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
COOKIE_SECURE=false
```

### Production (Vercel/Netlify)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
SESSION_SECRET_KEY=your_generated_secret_here
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
SESSION_EXPIRY_DAYS=30
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong session secrets** - Minimum 64 characters
3. **Enable COOKIE_SECURE in production** - Ensures HTTPS-only cookies
4. **Keep COOKIE_HTTP_ONLY=true** - Prevents XSS attacks
5. **Use environment-specific values** - Different secrets for dev/staging/prod
6. **Rotate secrets regularly** - Change SESSION_SECRET_KEY periodically
7. **Use secret management** - Consider using Vault, AWS Secrets Manager, etc.

---

## 📝 Notes

### NEXT_PUBLIC_ Prefix
- Variables with `NEXT_PUBLIC_` prefix are exposed to the browser
- Server-only variables (like `SESSION_SECRET_KEY`) should NOT have this prefix
- Only add `NEXT_PUBLIC_` if the variable needs to be accessed client-side

### Turbo.json Configuration
All environment variables must be listed in `turbo.json` for the monorepo to work correctly:
```json
{
  "globalEnv": ["NODE_ENV", "SESSION_SECRET_KEY", ...],
  "tasks": {
    "build": {
      "env": ["SESSION_SECRET_KEY", "NODE_ENV", ...]
    }
  }
}
```

---

## 🐛 Troubleshooting

### Environment variables not loading
1. Check if variable is in `.env` file
2. Verify it's listed in `turbo.json`
3. Restart dev server after adding new variables
4. For production, redeploy after updating environment variables

### Session not persisting
1. Check `SESSION_SECRET_KEY` is set
2. Verify `COOKIE_SECURE` matches your protocol (HTTP/HTTPS)
3. Check `SESSION_EXPIRY_DAYS` is reasonable

### API connection errors
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running
3. Verify CORS is configured on backend

---

## 📚 Related Files

- `.env` - Local environment variables (git-ignored)
- `.env.example` - Template for environment variables
- `lib/config.ts` - Configuration helper with type safety
- `turbo.json` - Monorepo environment variable configuration

---

## 🤝 Contributing

When adding new environment variables:
1. Add to `.env.example` with description
2. Update `turbo.json` with the variable name
3. Add to `lib/config.ts` with proper typing
4. Document in this file
5. Update deployment guides
