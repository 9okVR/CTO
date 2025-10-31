const API_BASE = 'https://api.coingecko.com/api/v3';

const state = {
    cryptocurrencies: [],
    portfolio: JSON.parse(localStorage.getItem('portfolio') || '[]'),
    watchlist: JSON.parse(localStorage.getItem('watchlist') || '[]'),
    currentView: 'market',
    theme: localStorage.getItem('theme') || 'dark',
    globalStats: null
};

function formatNumber(number, decimals = 2) {
    if (number >= 1e12) {
        return '$' + (number / 1e12).toFixed(decimals) + 'T';
    } else if (number >= 1e9) {
        return '$' + (number / 1e9).toFixed(decimals) + 'B';
    } else if (number >= 1e6) {
        return '$' + (number / 1e6).toFixed(decimals) + 'M';
    } else if (number >= 1e3) {
        return '$' + (number / 1e3).toFixed(decimals) + 'K';
    }
    return '$' + number.toFixed(decimals);
}

function formatPrice(price) {
    if (price < 0.01) {
        return '$' + price.toFixed(6);
    } else if (price < 1) {
        return '$' + price.toFixed(4);
    }
    return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function fetchGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/global`);
        const data = await response.json();
        state.globalStats = data.data;
        updateGlobalStats();
    } catch (error) {
        console.error('Failed to fetch global stats:', error);
    }
}

function updateGlobalStats() {
    if (!state.globalStats) return;

    document.getElementById('totalMarketCap').textContent = formatNumber(state.globalStats.total_market_cap.usd);
    document.getElementById('total24hVolume').textContent = formatNumber(state.globalStats.total_volume.usd);
    document.getElementById('btcDominance').textContent = state.globalStats.market_cap_percentage.btc.toFixed(1) + '%';
    document.getElementById('activeCryptos').textContent = state.globalStats.active_cryptocurrencies.toLocaleString();
}

async function fetchCryptocurrencies() {
    try {
        const response = await fetch(`${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`);
        state.cryptocurrencies = await response.json();
        renderCryptoTable();
        populateAssetSelect();
    } catch (error) {
        console.error('Failed to fetch cryptocurrencies:', error);
        document.getElementById('cryptoTableBody').innerHTML = `
            <tr>
                <td colspan="8" class="error-state">
                    Failed to load cryptocurrencies. Please try again later.
                </td>
            </tr>
        `;
    }
}

function createSparkline(data, isUp) {
    if (!data || data.length === 0) return '';

    const width = 110;
    const height = 38;
    const padding = 4;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    return `
        <svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <path d="M ${points.join(' L ')}" class="${isUp ? 'up' : 'down'}"/>
        </svg>
    `;
}

function renderCryptoTable(filterText = '') {
    const tbody = document.getElementById('cryptoTableBody');
    
    const filteredCryptos = state.cryptocurrencies.filter(crypto => 
        crypto.name.toLowerCase().includes(filterText.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredCryptos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px 0; color: var(--text-secondary);">
                    No cryptocurrencies found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredCryptos.map(crypto => {
        const priceChange = crypto.price_change_percentage_24h || 0;
        const isPositive = priceChange >= 0;
        const isWatchlisted = state.watchlist.includes(crypto.id);

        return `
            <tr>
                <td class="text-left">${crypto.market_cap_rank}</td>
                <td class="text-left">
                    <div class="crypto-name">
                        <img src="${crypto.image}" alt="${crypto.name}" />
                        <div>
                            <div>${crypto.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary)">${crypto.symbol.toUpperCase()}</div>
                        </div>
                    </div>
                </td>
                <td class="text-right hide-mobile">${formatPrice(crypto.current_price)}</td>
                <td class="text-right ${isPositive ? 'price-up' : 'price-down'}">
                    ${isPositive ? '↑' : '↓'} ${Math.abs(priceChange).toFixed(2)}%
                </td>
                <td class="text-right hide-mobile">${formatNumber(crypto.market_cap)}</td>
                <td class="text-right hide-mobile">${formatNumber(crypto.total_volume)}</td>
                <td class="text-center">
                    ${createSparkline(crypto.sparkline_in_7d?.price || [], isPositive)}
                </td>
                <td class="text-center">
                    <div class="actions">
                        <button class="icon-btn watch ${isWatchlisted ? 'active' : ''}" onclick="toggleWatchlist('${crypto.id}')" title="Add to watchlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWatchlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleWatchlist(cryptoId) {
    const index = state.watchlist.indexOf(cryptoId);
    
    if (index > -1) {
        state.watchlist.splice(index, 1);
    } else {
        state.watchlist.push(cryptoId);
    }
    
    localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    renderCurrentView();
}

function renderCurrentView() {
    if (state.currentView === 'market') {
        renderCryptoTable();
    } else if (state.currentView === 'portfolio') {
        renderPortfolio();
    } else if (state.currentView === 'watchlist') {
        renderWatchlist();
    }
}

function renderPortfolio() {
    const totalValue = state.portfolio.reduce((sum, asset) => {
        const crypto = state.cryptocurrencies.find(c => c.id === asset.id);
        if (!crypto) return sum;
        return sum + (crypto.current_price * asset.amount);
    }, 0);

    const totalCost = state.portfolio.reduce((sum, asset) => {
        return sum + (asset.purchasePrice * asset.amount);
    }, 0);

    const total24hChange = totalValue - totalCost;

    document.getElementById('portfolioTotal').textContent = formatPrice(totalValue);
    document.getElementById('portfolio24hChange').textContent = formatPrice(total24hChange);
    document.getElementById('portfolio24hChange').className = `portfolio-stat-value ${total24hChange >= 0 ? 'price-up' : 'price-down'}`;

    const portfolioContent = document.getElementById('portfolioContent');

    if (state.portfolio.length === 0) {
        portfolioContent.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <h3>Your portfolio is empty</h3>
                <p>Add your first cryptocurrency to start tracking your investments</p>
                <button class="btn btn-primary" onclick="openAddAssetModal()">Add Asset</button>
            </div>
        `;
        return;
    }

    portfolioContent.className = 'portfolio-grid';
    portfolioContent.innerHTML = state.portfolio.map((asset, index) => {
        const crypto = state.cryptocurrencies.find(c => c.id === asset.id);
        if (!crypto) return '';

        const currentValue = crypto.current_price * asset.amount;
        const purchasedValue = asset.purchasePrice * asset.amount;
        const profitLoss = currentValue - purchasedValue;
        const profitLossPercent = ((currentValue - purchasedValue) / purchasedValue) * 100;

        return `
            <div class="asset-card">
                <div class="asset-header">
                    <div class="asset-title">
                        <div style="font-weight: 600; font-size: 1.1rem;">${crypto.name}</div>
                        <div class="asset-symbol">${crypto.symbol.toUpperCase()}</div>
                    </div>
                    <button class="icon-btn" onclick="removeFromPortfolio(${index})" title="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
                <div class="asset-metrics">
                    <div class="asset-metric">
                        <span>Holdings</span>
                        <span style="font-weight: 500;">${asset.amount} ${crypto.symbol.toUpperCase()}</span>
                    </div>
                    <div class="asset-metric">
                        <span>Current Value</span>
                        <span style="font-weight: 500;">${formatPrice(currentValue)}</span>
                    </div>
                    <div class="asset-metric">
                        <span>Purchase Price</span>
                        <span style="font-weight: 500;">${formatPrice(asset.purchasePrice)}</span>
                    </div>
                    <div class="asset-metric">
                        <span>P&L</span>
                        <span class="asset-pl ${profitLoss >= 0 ? 'positive' : 'negative'}" style="font-weight: 600;">
                            ${formatPrice(profitLoss)} (${profitLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderWatchlist() {
    const watchlistContent = document.getElementById('watchlistContent');
    
    const watchedCryptos = state.cryptocurrencies.filter(crypto => 
        state.watchlist.includes(crypto.id)
    );

    if (watchedCryptos.length === 0) {
        watchlistContent.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <h3>Your watchlist is empty</h3>
                <p>Click the star icon on any cryptocurrency to add it to your watchlist</p>
            </div>
        `;
        return;
    }

    watchlistContent.innerHTML = `
        <table class="crypto-table">
            <thead>
                <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Name</th>
                    <th class="text-right hide-mobile">Price</th>
                    <th class="text-right">24h %</th>
                    <th class="text-right hide-mobile">Market Cap</th>
                    <th class="text-right hide-mobile">Volume</th>
                    <th class="text-center">Chart</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                ${watchedCryptos.map(crypto => {
                    const priceChange = crypto.price_change_percentage_24h || 0;
                    const isPositive = priceChange >= 0;

                    return `
                        <tr>
                            <td class="text-left">${crypto.market_cap_rank}</td>
                            <td class="text-left">
                                <div class="crypto-name">
                                    <img src="${crypto.image}" alt="${crypto.name}" />
                                    <div>
                                        <div>${crypto.name}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary)">${crypto.symbol.toUpperCase()}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-right hide-mobile">${formatPrice(crypto.current_price)}</td>
                            <td class="text-right ${isPositive ? 'price-up' : 'price-down'}">
                                ${isPositive ? '↑' : '↓'} ${Math.abs(priceChange).toFixed(2)}%
                            </td>
                            <td class="text-right hide-mobile">${formatNumber(crypto.market_cap)}</td>
                            <td class="text-right hide-mobile">${formatNumber(crypto.total_volume)}</td>
                            <td class="text-center">
                                ${createSparkline(crypto.sparkline_in_7d?.price || [], isPositive)}
                            </td>
                            <td class="text-center">
                                <div class="actions">
                                    <button class="icon-btn watch active" onclick="toggleWatchlist('${crypto.id}')" title="Remove from watchlist">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function removeFromPortfolio(index) {
    state.portfolio.splice(index, 1);
    localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
    renderPortfolio();
}

function populateAssetSelect() {
    const select = document.getElementById('assetSelect');
    select.innerHTML = '<option value="">Select a cryptocurrency</option>' + 
        state.cryptocurrencies.slice(0, 30).map(crypto => 
            `<option value="${crypto.id}">${crypto.name} (${crypto.symbol.toUpperCase()})</option>`
        ).join('');
}

function openAddAssetModal() {
    document.getElementById('addAssetModal').classList.add('open');
}

function closeAddAssetModal() {
    document.getElementById('addAssetModal').classList.remove('open');
    document.getElementById('addAssetForm').reset();
}

function switchView(view) {
    state.currentView = view;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    document.querySelectorAll('.view').forEach(viewEl => {
        viewEl.classList.toggle('active', viewEl.id === `${view}View`);
    });

    renderCurrentView();
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-theme', state.theme === 'light');
    localStorage.setItem('theme', state.theme);
}

document.addEventListener('DOMContentLoaded', () => {
    if (state.theme === 'light') {
        document.body.classList.add('light-theme');
    }

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        if (state.currentView === 'market') {
            renderCryptoTable(e.target.value);
        }
    }, 300));

    document.getElementById('addAssetBtn').addEventListener('click', openAddAssetModal);
    document.getElementById('modalClose').addEventListener('click', closeAddAssetModal);
    document.getElementById('modalOverlay').addEventListener('click', closeAddAssetModal);
    document.getElementById('cancelBtn').addEventListener('click', closeAddAssetModal);

    document.getElementById('addAssetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cryptoId = document.getElementById('assetSelect').value;
        const amount = parseFloat(document.getElementById('assetAmount').value);
        const purchasePrice = parseFloat(document.getElementById('assetPrice').value);

        if (!cryptoId || !amount || !purchasePrice) return;

        state.portfolio.push({
            id: cryptoId,
            amount,
            purchasePrice,
            addedAt: Date.now()
        });

        localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
        closeAddAssetModal();
        
        if (state.currentView === 'portfolio') {
            renderPortfolio();
        }
    });

    fetchGlobalStats();
    fetchCryptocurrencies();
    
    setInterval(() => {
        fetchGlobalStats();
        fetchCryptocurrencies();
    }, 60000);
});
