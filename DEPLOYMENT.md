# Deployment Guide for CryptoTracker

This document provides comprehensive instructions for deploying CryptoTracker to Vercel for both preview and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Project Configuration](#vercel-project-configuration)
- [Deployment Process](#deployment-process)
- [Preview vs Production](#preview-vs-production)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ **Vercel Account**: Sign up at [vercel.com](https://vercel.com/signup)
- ✅ **Git Repository**: Code hosted on GitHub, GitLab, or Bitbucket
- ✅ **Static Files**: HTML, CSS, and JavaScript files committed to repository
- ✅ **Browser Testing**: Application tested in Chrome, Firefox, Safari, and Edge
- ✅ **Mobile Testing**: Responsive design verified on mobile and tablet devices

### Optional Requirements

- **Vercel CLI**: For command-line deployments
  ```bash
  npm install -g vercel
  # or
  pnpm add -g vercel
  ```

- **CoinGecko Pro API Key**: If you need higher rate limits (optional)

## Environment Setup

### Environment Variables

CryptoTracker uses the free CoinGecko API which doesn't require authentication. However, you can configure optional environment variables to customize runtime behavior:

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Available Environment Variables**:

   | Variable | Required | Description | Default |
   |----------|----------|-------------|---------|
   | `COINGECKO_API_BASE` | No | Base URL for the CoinGecko API (override to use a proxy or paid endpoint) | `https://api.coingecko.com/api/v3` |
   | `REFRESH_INTERVAL_MS` | No | Interval between market data refreshes (milliseconds) | `60000` |
   | `COINGECKO_API_KEY` | No | CoinGecko Pro API key for higher rate limits (not currently used, reserved for future) | None |

3. **Setting Environment Variables in Vercel**:
   - Navigate to your project in Vercel Dashboard
   - Go to **Settings** → **Environment Variables**
   - Add variables with appropriate scope:
     - **Production**: Used for production deployments
     - **Preview**: Used for pull request previews
     - **Development**: Used for local development with `vercel dev`
   - After adding environment variables, trigger a redeploy for them to take effect

### Configuration Files

The project includes several configuration files:

#### `vercel.json`

Configures Vercel-specific settings:

- **Regions**: Optimized for US East (`iad1`) - update for your target audience
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **Cache Headers**: Long-term caching for static assets, no-cache for HTML
- **URL Behavior**: Clean URLs without `.html` extensions

#### `.env.example`

Template for environment variables. Copy this to `.env.local` for local development.

#### `.gitignore`

Prevents sensitive files from being committed:
- `.env` and `.env.*` files
- `node_modules/`
- Build artifacts

## Vercel Project Configuration

### Method 1: Deploy via Git Integration (Recommended)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Vercel to access your repositories
   - Select the CryptoTracker repository

2. **Configure Project Settings**:
   ```
   Framework Preset: Other (Static Site)
   Root Directory: ./
   Install Command: pnpm install
   Build Command: pnpm build
   Output Directory: dist
   Development Command: (leave blank or configure your preferred local server)
   ```

3. **Add Environment Variables** (if any):
   - Click **"Environment Variables"**
   - Add any variables from `.env.example`
   - Select environment scope (Production, Preview, Development)

4. **Deploy**:
   - Click **"Deploy"**
   - Wait for deployment to complete
   - Access your site at the provided URL

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # For preview deployment
   vercel
   
   # For production deployment
   vercel --prod
   ```

4. **Follow CLI prompts**:
   - Link to existing project or create new one
   - Confirm project settings
   - Wait for deployment to complete

### Method 3: One-Click Deploy

Click the button below for instant deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Deployment Process

### Automatic Deployments

Once connected to Git, Vercel automatically deploys:

- **Production**: Commits to `main` or `master` branch
- **Preview**: Commits to feature branches or pull requests
- **Development**: Local testing with `vercel dev`

### Manual Deployments

To manually deploy:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Deploy with specific environment
vercel --env NODE_ENV=production
```

### Build Process

CryptoTracker ships as a static site, but we run a lightweight build step so environment variables can be injected into the runtime configuration.

1. `pnpm build` executes `scripts/build.mjs`
2. The script copies `index.html`, `styles.css`, and `app.js` into the `dist/` directory
3. Environment variables are read (from CLI, `.env.local`, or the Vercel dashboard) and emitted into `dist/config.js`
4. Vercel uploads the `dist/` directory to the edge network and applies headers defined in `vercel.json`

## Preview vs Production

### Preview Deployments

- **Trigger**: Pull requests or non-production branch commits
- **URL**: Unique URL per deployment (e.g., `your-app-git-feature-username.vercel.app`)
- **Purpose**: Test changes before merging to production
- **Duration**: Persists until deployment is deleted
- **Environment**: Uses Preview environment variables

### Production Deployments

- **Trigger**: Commits to main/master branch
- **URL**: Primary domain (e.g., `your-app.vercel.app` or custom domain)
- **Purpose**: Live site for end users
- **Environment**: Uses Production environment variables
- **Automatic**: Replaces previous production deployment

### Promoting Preview to Production

```bash
# Deploy specific commit to production
vercel --prod --force

# Or promote via Vercel Dashboard
# Go to Deployments → Select Preview → Click "Promote to Production"
```

## Post-Deployment Checklist

After deploying, verify the following:

### Functional Checks

- ✅ **Homepage Loads**: Verify `index.html` loads correctly
- ✅ **API Connectivity**: CoinGecko API requests succeed
- ✅ **Real-time Updates**: Price data updates every 60 seconds
- ✅ **Market View**: Cryptocurrency table displays correctly
- ✅ **Portfolio View**: Can add/remove assets
- ✅ **Watchlist View**: Can star/unstar cryptocurrencies
- ✅ **Search**: Search functionality works
- ✅ **Theme Toggle**: Light/dark mode switches correctly
- ✅ **LocalStorage**: Data persists across page reloads

### Technical Checks

- ✅ **Security Headers**: Verify headers using [securityheaders.com](https://securityheaders.com/)
- ✅ **Performance**: Check Core Web Vitals in Vercel Speed Insights
- ✅ **Console Errors**: No JavaScript errors in browser console
- ✅ **Network Requests**: All API requests complete successfully
- ✅ **Caching**: Static assets cached correctly (check Network tab)
- ✅ **Mobile Responsive**: Test on mobile devices or browser dev tools
- ✅ **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### Monitoring Setup

- ✅ **Vercel Analytics**: Enable in Project Settings
- ✅ **Vercel Speed Insights**: Enable in Project Settings
- ✅ **Custom Domain**: Configure if desired
- ✅ **SSL Certificate**: Verify HTTPS works (auto-enabled by Vercel)
- ✅ **Email Notifications**: Configure deployment notifications

## Monitoring and Maintenance

### Vercel Analytics

Enable to track:
- Page views and unique visitors
- Top pages and referrers
- Geographic distribution
- Device and browser breakdown

**Setup**: Project Settings → Analytics → Enable

### Vercel Speed Insights

Monitor real user performance:
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Performance scores
- Device-specific metrics

**Setup**: Project Settings → Speed Insights → Enable

### Deployment Logs

Access logs via:
- **Vercel Dashboard**: Deployments → Select Deployment → View Logs
- **Vercel CLI**: `vercel logs <deployment-url>`

### Health Monitoring

Set up monitoring for:
- **API Rate Limits**: CoinGecko free tier has limits (10-50 calls/minute)
- **Error Tracking**: Monitor browser console errors
- **Uptime Monitoring**: Use services like UptimeRobot or Pingdom
- **Performance Degradation**: Track Speed Insights trends

### Maintenance Tasks

Regular maintenance:

1. **Update Dependencies** (if added in future):
   ```bash
   pnpm update
   ```

2. **Review API Usage**: Monitor CoinGecko API rate limits

3. **Check Performance**: Review Speed Insights monthly

4. **Security Audit**: Review security headers quarterly

5. **Backup Data**: No server-side data to backup (client-side only)

## Troubleshooting

### Common Issues

#### Issue: API Rate Limiting

**Symptoms**: 429 errors, missing data, slow updates

**Solutions**:
- Increase update interval in `app.js` (currently 60 seconds)
- Upgrade to CoinGecko Pro API
- Implement request caching
- Add retry logic with exponential backoff

#### Issue: LocalStorage Not Working

**Symptoms**: Portfolio/watchlist data not persisting

**Solutions**:
- Verify browser supports localStorage
- Check for third-party cookie blocking
- Ensure HTTPS is enabled
- Test in incognito mode to rule out extensions

#### Issue: CORS Errors

**Symptoms**: Failed API requests, CORS policy errors

**Solutions**:
- Verify using client-side requests (not server-side)
- Check CoinGecko API status
- Ensure correct API endpoint URLs
- Review browser console for specific errors

#### Issue: Deployment Fails

**Symptoms**: Build errors, deployment timeout

**Solutions**:
- Check Vercel deployment logs
- Verify all files are committed
- Ensure `.gitignore` doesn't exclude required files
- Contact Vercel support if issue persists

#### Issue: Performance Problems

**Symptoms**: Slow page loads, poor Core Web Vitals

**Solutions**:
- Enable Vercel Speed Insights for diagnostics
- Optimize images (if added in future)
- Review caching headers in `vercel.json`
- Minimize JavaScript execution time
- Use regional deployment closer to users

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **CoinGecko API Docs**: [coingecko.com/api/documentation](https://www.coingecko.com/en/api/documentation)
- **Project Issues**: Create an issue in your Git repository

## Additional Resources

- [Vercel Platform Overview](https://vercel.com/docs/platform/overview)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Static Site Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Custom Domains on Vercel](https://vercel.com/docs/concepts/projects/custom-domains)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network/overview)

---

**Last Updated**: 2024

For questions or issues, please open an issue in the project repository.
