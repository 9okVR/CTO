# Vercel Deployment Checklist

Use this checklist to verify your CryptoTracker deployment is ready for production.

## Pre-Deployment

### Repository Setup
- [ ] All source files committed to Git (index.html, styles.css, app.js, config.js)
- [ ] `.env.example` is up-to-date with all environment variables
- [ ] `.gitignore` properly configured (excludes .env, dist/, node_modules/)
- [ ] `vercel.json` configuration file present
- [ ] `package.json` with build script present
- [ ] `scripts/build.mjs` build script present

### Environment Variables
- [ ] Copy `.env.example` to `.env.local` for local testing
- [ ] Configure environment variables in Vercel Dashboard if customization needed:
  - `COINGECKO_API_BASE` (optional)
  - `REFRESH_INTERVAL_MS` (optional)
  - `COINGECKO_API_KEY` (optional, for paid CoinGecko plans)
- [ ] Set appropriate environment scopes (Production, Preview, Development)

### Local Testing
- [ ] Build completes successfully: `node scripts/build.mjs` or `pnpm build`
- [ ] `dist/` directory contains all required files
- [ ] `dist/config.js` contains correct environment variables
- [ ] Application works locally (open `index.html` in browser)
- [ ] No console errors in browser developer tools
- [ ] API calls to CoinGecko succeed
- [ ] Portfolio and watchlist localStorage features work

### Browser & Device Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile devices (iOS & Android)
- [ ] Tablet devices
- [ ] Desktop (1920x1080, 1366x768)

### Feature Testing
- [ ] Market view displays cryptocurrency data
- [ ] Prices update automatically (every 60 seconds by default)
- [ ] Search functionality works
- [ ] Watchlist: Can star/unstar cryptocurrencies
- [ ] Portfolio: Can add/remove assets
- [ ] Theme toggle switches between light/dark mode
- [ ] Theme preference persists after page reload
- [ ] Sparkline charts render correctly
- [ ] All responsive breakpoints work (mobile, tablet, desktop)

## Vercel Project Setup

### Initial Configuration
- [ ] Vercel account created
- [ ] Git repository connected to Vercel
- [ ] Project imported in Vercel Dashboard
- [ ] Framework preset: **Other (Static Site)**
- [ ] Install command: `pnpm install`
- [ ] Build command: `pnpm build`
- [ ] Output directory: `dist`
- [ ] Root directory: `./`

### Environment Variables (Vercel Dashboard)
- [ ] Navigate to Project Settings → Environment Variables
- [ ] Add custom variables (if needed)
- [ ] Set correct environment scopes
- [ ] Save changes

### Deployment Settings
- [ ] Auto-deploy enabled for main branch (Production)
- [ ] Preview deployments enabled for PRs
- [ ] Build settings saved

## First Deployment

### Deploy via Git
- [ ] Push code to main/master branch
- [ ] Monitor deployment in Vercel Dashboard
- [ ] Check build logs for errors
- [ ] Wait for deployment to complete
- [ ] Note deployment URL

### Deploy via CLI (Alternative)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Confirm deployment success

## Post-Deployment Verification

### Deployment Status
- [ ] Deployment shows "Ready" status in Vercel Dashboard
- [ ] No build errors in logs
- [ ] All files uploaded successfully
- [ ] Production URL accessible

### Functional Testing (Production)
- [ ] Production URL loads correctly
- [ ] All static assets load (check Network tab)
- [ ] No 404 errors
- [ ] API calls to CoinGecko succeed
- [ ] Market data displays correctly
- [ ] Real-time updates work (check after 60 seconds)
- [ ] Portfolio management works
- [ ] Watchlist management works
- [ ] Theme toggle works
- [ ] LocalStorage persistence works
- [ ] Search functionality works
- [ ] No console errors

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] Time to Interactive < 3.5 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Lighthouse score > 90 (Performance)
- [ ] Core Web Vitals pass

### Security Testing
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers present (check via DevTools):
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
- [ ] No mixed content warnings
- [ ] CSP headers configured (optional)

### SEO & Accessibility
- [ ] Page has proper title tag
- [ ] Meta description present
- [ ] Favicon loads
- [ ] Mobile viewport meta tag present
- [ ] Semantic HTML structure
- [ ] Lighthouse Accessibility score > 90

## Optional Vercel Features

### Analytics & Monitoring
- [ ] Vercel Analytics enabled (Project Settings → Analytics)
- [ ] Vercel Speed Insights enabled (Project Settings → Speed Insights)
- [ ] Real User Monitoring configured
- [ ] Error tracking set up (optional)

### Custom Domain
- [ ] Custom domain purchased (if applicable)
- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain accessible and working

### Preview Deployments
- [ ] Create a test PR
- [ ] Verify preview deployment created automatically
- [ ] Test preview URL
- [ ] Check preview environment variables applied
- [ ] Merge PR and verify production deployment

### Notifications
- [ ] Email notifications configured
- [ ] Slack/Discord integration set up (optional)
- [ ] Deployment status notifications enabled

## Ongoing Maintenance

### Regular Checks
- [ ] Monitor Vercel Analytics for traffic patterns
- [ ] Review Speed Insights for performance degradation
- [ ] Check CoinGecko API rate limits (free tier: 10-50 calls/min)
- [ ] Review deployment logs weekly
- [ ] Test critical features monthly

### Updates
- [ ] Keep dependencies up-to-date (if any added)
- [ ] Monitor CoinGecko API for breaking changes
- [ ] Review and update environment variables as needed
- [ ] Test on new browser versions
- [ ] Update documentation when features change

### Disaster Recovery
- [ ] Know how to rollback to previous deployment
- [ ] Have backup of repository
- [ ] Document custom configuration
- [ ] Keep .env.example updated
- [ ] Test recovery process

## Troubleshooting Quick Reference

### Build Failures
1. Check build logs in Vercel Dashboard
2. Verify `package.json` is correct
3. Test build locally: `pnpm build`
4. Check Node.js version (requires >=18)

### API Errors
1. Verify CoinGecko API is accessible
2. Check API rate limits
3. Review browser console for errors
4. Test API endpoints directly

### LocalStorage Issues
1. Check browser compatibility
2. Verify HTTPS is enabled
3. Test in incognito mode
4. Clear browser cache and retry

### Performance Issues
1. Check Vercel Speed Insights
2. Verify caching headers working
3. Test on different networks
4. Review API response times

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [Full Deployment Guide](./DEPLOYMENT.md)
- [Project README](./README.md)

---

**Last Updated**: 2024  
**Status**: Ready for Production ✅
