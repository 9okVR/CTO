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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing the free cryptocurrency API
- [Google Fonts](https://fonts.google.com/) for the Inter font family
