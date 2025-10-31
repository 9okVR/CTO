# CryptoTracker - Responsive Cryptocurrency Web App

A modern, responsive cryptocurrency tracking web application that works seamlessly on both mobile and desktop devices.

## Features

### 📊 Real-time Market Data
- Live cryptocurrency prices updated every minute
- Top 50 cryptocurrencies by market cap
- 24-hour price change indicators
- Market cap and volume information
- 7-day price sparkline charts
- Global market statistics dashboard

### 💼 Portfolio Management
- Track your crypto investments
- Add holdings with purchase price
- Real-time profit/loss calculations
- Percentage gain/loss tracking
- Visual portfolio overview

### ⭐ Watchlist
- Favorite cryptocurrencies for quick access
- Star/unstar coins from the market view
- Dedicated watchlist view

### 🎨 User Interface
- **Responsive Design**: Optimized for mobile phones, tablets, and desktop screens
- **Dark/Light Theme**: Toggle between dark and light modes (preference saved)
- **Modern UI**: Glassmorphism effects and smooth animations
- **Search Functionality**: Quickly find cryptocurrencies
- **Clean Typography**: Using Inter font for enhanced readability

### 💾 Data Persistence
- Portfolio data saved in browser's local storage
- Watchlist saved across sessions
- Theme preference remembered

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript**: No frameworks, pure JS for optimal performance
- **CoinGecko API**: Free cryptocurrency data API

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Open the app:
   - Simply open `index.html` in a modern web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Usage

1. **Browse Market**: View real-time cryptocurrency prices on the Market tab
2. **Add to Watchlist**: Click the star icon on any cryptocurrency
3. **Create Portfolio**:
   - Switch to the Portfolio tab
   - Click "Add Asset"
   - Select a cryptocurrency
   - Enter the amount you own
   - Enter your purchase price
   - Click "Add to Portfolio"
4. **Toggle Theme**: Click the sun/moon icon in the header to switch themes

## API Information

This app uses the [CoinGecko API](https://www.coingecko.com/en/api) which is free and doesn't require an API key. The app fetches:
- Global market statistics
- Top 50 cryptocurrencies by market cap
- Real-time prices and 24h changes
- 7-day price history for sparkline charts

Data is automatically refreshed every 60 seconds.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Requires a modern browser with ES6+ support and localStorage.

## Responsive Design

The app adapts to different screen sizes:

- **Desktop (>960px)**: Full table view with all columns
- **Tablet (720px-960px)**: Optimized layout with key information
- **Mobile (<720px)**: Compact view hiding less critical columns

## Features by Screen Size

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Real-time Prices | ✓ | ✓ | ✓ |
| 24h Change | ✓ | ✓ | ✓ |
| Market Cap | - | - | ✓ |
| Volume | - | - | ✓ |
| Sparkline Charts | ✓ | ✓ | ✓ |
| Portfolio | ✓ | ✓ | ✓ |
| Watchlist | ✓ | ✓ | ✓ |

## Deployment

### Deploy to Vercel

This app is optimized for deployment on Vercel. Follow these steps to deploy, or refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md) for a more detailed guide covering preview environments, monitoring, and troubleshooting.

#### Prerequisites
- A [Vercel account](https://vercel.com/signup) (free tier works great)
- Git repository with your code (GitHub, GitLab, or Bitbucket)

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Manual Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project and deploy.

3. **Deploy from Git Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Configure project settings:
     - **Framework Preset**: Other (Static Site)
     - **Build Command**: `pnpm build`
     - **Output Directory**: `dist`
     - **Install Command**: `pnpm install` (or leave blank to use the default)
   - Click "Deploy"

#### Environment Variables

This app uses the free CoinGecko API which doesn't require an API key. However, you can fine-tune runtime behaviour with the provided configuration variables:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the available variables:

   | Variable | Description | Default |
   |----------|-------------|---------|
   | `COINGECKO_API_BASE` | Base URL for the CoinGecko API (override to use a proxy or paid endpoint) | `https://api.coingecko.com/api/v3` |
   | `REFRESH_INTERVAL_MS` | Interval between market data refreshes (milliseconds) | `60000` |
   | `COINGECKO_API_KEY` | Optional key for CoinGecko paid plans | _blank_ |

3. In Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add the same variables for Production, Preview, and Development scopes as needed
   - Trigger a redeploy so the new values are applied during the build step

#### Optional Vercel Features

Enable these in your Vercel project settings for enhanced functionality:

- **Vercel Analytics**: Track visitor metrics and page views
- **Vercel Speed Insights**: Monitor real user performance metrics
- **Custom Domain**: Add your own domain name
- **Preview Deployments**: Automatic deployments for pull requests

#### Deployment Configuration

The project includes a `vercel.json` configuration file that sets:
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Caching policies for static assets
- Clean URLs without `.html` extensions
- Optimized regional deployment (US East by default)

#### Production Checklist

Before deploying to production, ensure:

- ✅ All static files (HTML, CSS, JS) are committed to repository
- ✅ `.gitignore` is properly configured to exclude `.env` files and `dist/` folder
- ✅ `.env.example` is up-to-date with all required variables
- ✅ External APIs (CoinGecko) are accessible and working
- ✅ Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design verified on mobile, tablet, and desktop
- ✅ Theme toggle functionality working
- ✅ LocalStorage persistence working correctly
- ✅ No console errors in production build
- ✅ Security headers configured (via vercel.json)
- ✅ Build command (`pnpm build`) executes successfully
- ✅ Analytics and monitoring enabled (optional)
- ✅ Vercel project settings correctly configured with build/output directories

Looking for a more exhaustive verification list? See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) for a printable, step-by-step runbook.

#### Monitoring Your Deployment

After deployment:

1. **Check Build Logs**: Review deployment logs in Vercel Dashboard
2. **Test Preview URL**: Vercel provides a preview URL for every deployment
3. **Monitor Performance**: Use Vercel Speed Insights to track performance
4. **Track Usage**: Use Vercel Analytics to monitor visitor behavior
5. **Set up Alerts**: Configure notifications for deployment failures

#### Troubleshooting

Common issues and solutions:

- **API Rate Limiting**: CoinGecko free tier has rate limits. Consider upgrading if needed.
- **CORS Errors**: Should not occur with client-side requests, but check browser console.
- **LocalStorage Issues**: Ensure third-party cookies/storage is enabled in browser.
- **Loading Errors**: Check network tab for failed API requests.

For more information, see [Vercel Documentation](https://vercel.com/docs).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing the free cryptocurrency API
- [Google Fonts](https://fonts.google.com/) for the Inter font family
- [Vercel](https://vercel.com/) for hosting platform
