let currentTab = 'market';
let isInitialized = false;

document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

async function initializeApp() {
    try {
        showLoading();
        
        await Promise.all([
            loadItemsDatabase(),
            loadMapData()
        ]);
        
        isInitialized = true;
        hideLoading();
        showTab('market');
        
        console.log('Albion Online Tools initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

function showTab(tabName) {
    if (!isInitialized) {
        showError('Application is still loading. Please wait...');
        return;
    }
    
    currentTab = tabName;
    updateNavigation(tabName);
    
    switch(tabName) {
        case 'market':
            renderMarketTab();
            break;
        case 'maps':
            renderMapsTab();
            break;
        case 'crafting':
            renderCraftingTab();
            break;
        case 'profit':
            renderProfitTab();
            break;
        default:
            renderMarketTab();
    }
}

function updateNavigation(activeTab) {
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(activeTab)) {
            button.classList.add('active');
        }
    });
}

async function renderMarketTab() {
    const container = document.getElementById('content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="market-section">
            <div class="search-section">
                <div class="search-controls">
                    <input type="text" id="itemSearch" placeholder="Search for items..." 
                           onkeyup="handleItemSearch(event)">
                    <select id="cityFilter">
                        <option value="">All Cities</option>
                        ${CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                    </select>
                    <select id="qualityFilter">
                        <option value="">All Qualities</option>
                        ${QUALITIES.map((quality, index) => `<option value="${index}">${quality}</option>`).join('')}
                    </select>
                    <button onclick="searchMarketItems()">Search</button>
                    <button onclick="clearMarketSearch()">Clear</button>
                </div>
                
                <div class="quick-searches">
                    <h4>Popular Items:</h4>
                    <div class="quick-search-buttons">
                        <button onclick="quickSearch('fire staff')">Fire Staff</button>
                        <button onclick="quickSearch('holy staff')">Holy Staff</button>
                        <button onclick="quickSearch('sword')">Sword</button>
                        <button onclick="quickSearch('leather armor')">Leather Armor</button>
                        <button onclick="quickSearch('wood')">Wood</button>
                        <button onclick="quickSearch('ore')">Ore</button>
                    </div>
                </div>
            </div>
            
            <div id="priceResults" class="price-results"></div>
        </div>
    `;
    
    // Load initial market data
    await loadInitialMarketData();
}

async function loadInitialMarketData() {
    try {
        const goldPrices = await getGoldPrices(1);
        displayGoldPrice(goldPrices);
    } catch (error) {
        console.error('Failed to load initial market data:', error);
    }
}

function displayGoldPrice(goldData) {
    const container = document.getElementById('priceResults');
    if (!container || !goldData || goldData.length === 0) return;
    
    const latestGold = goldData[0];
    const containerHtml = document.getElementById('content').innerHTML;
    
    const goldHtml = `
        <div class="gold-price-section">
            <h3>💰 Current Gold Price</h3>
            <div class="gold-price-card">
                <span class="gold-amount">${formatPrice(latestGold.price)}</span>
                <span class="gold-date">${new Date(latestGold.timestamp).toLocaleDateString()}</span>
            </div>
        </div>
    `;
    
    container.innerHTML = goldHtml;
}

async function renderMapsTab() {
    const container = document.getElementById('content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="maps-section">
            <div class="maps-header">
                <h2>🗺️ Albion Online Maps</h2>
                <div class="maps-controls">
                    <button onclick="renderMapList()">Zone List</button>
                    <button onclick="renderMapStats()">Statistics</button>
                    <button onclick="renderBestZones()">Best Resource Zones</button>
                </div>
            </div>
            <div id="mapsContent"></div>
        </div>
    `;
    
    await renderMapList();
}

async function renderCraftingTab() {
    const container = document.getElementById('content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="crafting-section">
            <div class="crafting-header">
                <h2>⚒️ Crafting & Items</h2>
                <div class="crafting-controls">
                    <button onclick="renderCategories()">Categories</button>
                    <button onclick="renderPopularItems()">Popular Items</button>
                    <input type="text" id="craftingSearch" placeholder="Search items..." 
                           onkeyup="handleCraftingSearch(event)">
                </div>
            </div>
            <div id="craftingContent"></div>
        </div>
    `;
    
    await renderCategories();
}

async function renderProfitTab() {
    const container = document.getElementById('content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="profit-section">
            <div class="profit-header">
                <h2>💰 Profit Calculator</h2>
                <div class="profit-controls">
                    <button onclick="renderCraftingCalculator()">Crafting Calculator</button>
                    <button onclick="calculatePopularCrafting()">Popular Items</button>
                    <button onclick="calculateResourceRefining()">Resource Refining</button>
                    <button onclick="calculateTransitOpportunities()">Transit Opportunities</button>
                </div>
            </div>
            <div id="profitContent"></div>
        </div>
    `;
    
    await renderCraftingCalculator();
}

async function handleItemSearch(event) {
    if (event.key === 'Enter') {
        await searchMarketItems();
    }
}

async function searchMarketItems() {
    const query = document.getElementById('itemSearch')?.value;
    const city = document.getElementById('cityFilter')?.value;
    const quality = document.getElementById('qualityFilter')?.value;
    
    if (!query) {
        showError('Please enter an item name to search');
        return;
    }
    
    try {
        showLoading();
        
        const item = findItemByName(query)[0];
        if (!item) {
            showError('Item not found. Try a different search term.');
            hideLoading();
            return;
        }
        
        const locations = city ? [city] : [];
        const qualities = quality ? [parseInt(quality)] : [];
        
        const prices = await getItemPrices(item.uniqueName, locations, qualities);
        displayPrices(prices, item);
        
        hideLoading();
    } catch (error) {
        console.error('Error searching market items:', error);
        showError('Failed to fetch market data. Please try again.');
        hideLoading();
    }
}

function displayPrices(prices, item) {
    const container = document.getElementById('priceResults');
    if (!container) return;
    
    const itemName = item.localizedNames?.['EN-US'] || item.uniqueName;
    const iconUrl = getItemIconUrl(item.uniqueName, 64);
    
    let html = `
        <div class="price-results-header">
            <div class="item-header">
                <img src="${iconUrl}" alt="${itemName}" class="item-icon">
                <div class="item-title">
                    <h3>${itemName}</h3>
                    <p class="item-id">${item.uniqueName}</p>
                </div>
            </div>
        </div>
        
        <div class="price-table-container">
            <table class="price-table">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Quality</th>
                        <th>Sell Price (Min)</th>
                        <th>Buy Price (Max)</th>
                        <th>Last Update</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (prices && prices.length > 0) {
        prices.forEach(price => {
            const updateTime = new Date(price.sell_price_min_date_time || price.buy_price_max_date_time).toLocaleString();
            html += `
                <tr>
                    <td>${getCityDisplayName(price.city)}</td>
                    <td>${getQualityName(price.quality)}</td>
                    <td class="sell-price">${formatPrice(price.sell_price_min)}</td>
                    <td class="buy-price">${formatPrice(price.buy_price_max)}</td>
                    <td>${updateTime}</td>
                    <td>
                        <button onclick="addToCraftingQueue('${price.item_id}', 1, '${price.city}', true)">
                            Add to Calculator
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="6" class="no-data">No market data available for this item</td>
            </tr>
        `;
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="price-actions">
            <button onclick="showItemDetails('${item.uniqueName}')">Item Details</button>
            <button onclick="addToCraftingQueue('${item.uniqueName}', 1, 'Caerleon', true)">
                Calculate Profit
            </button>
            <button onclick="getItemHistory('${item.uniqueName}')">Price History</button>
        </div>
    `;
    
    container.innerHTML = html;
}

async function getItemHistory(itemId) {
    try {
        showLoading();
        const history = await getItemHistory(itemId, [], [], '7');
        displayPriceHistory(history, itemId);
        hideLoading();
    } catch (error) {
        console.error('Error fetching price history:', error);
        showError('Failed to fetch price history');
        hideLoading();
    }
}

function displayPriceHistory(history, itemId) {
    const container = document.getElementById('content');
    if (!container) return;
    
    const item = findItemById(itemId);
    const itemName = item?.localizedNames?.['EN-US'] || itemId;
    
    let html = `
        <div class="price-history">
            <div class="history-header">
                <h2>📈 Price History - ${itemName}</h2>
                <button onclick="showTab('market')">Back to Market</button>
            </div>
            
            <div class="history-content">
    `;
    
    if (history && history.length > 0) {
        html += '<div class="history-chart-placeholder">';
        html += '<p>Price history chart would be displayed here</p>';
        html += '</div>';
        
        html += '<div class="history-table-container">';
        html += '<table class="history-table">';
        html += '<thead><tr><th>Date</th><th>City</th><th>Price</th><th>Volume</th></tr></thead><tbody>';
        
        history.slice(0, 50).forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${entry.location}</td>
                    <td>${formatPrice(entry.avg_price)}</td>
                    <td>${entry.item_count || '-'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
    } else {
        html += '<p class="no-data">No price history available for this item</p>';
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

function quickSearch(itemName) {
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.value = itemName;
        searchMarketItems();
    }
}

function clearMarketSearch() {
    document.getElementById('itemSearch').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('qualityFilter').value = '';
    document.getElementById('priceResults').innerHTML = '';
    loadInitialMarketData();
}

async function handleCraftingSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        const results = findItemByName(query);
        renderItemsList(results);
    }
}

function showLoading() {
    const container = document.getElementById('content');
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
    }
}

function hideLoading() {
    // Loading is hidden when content is updated
}

function showError(message) {
    const container = document.getElementById('content');
    if (container) {
        const currentContent = container.innerHTML;
        container.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button onclick="showTab('${currentTab}')">Try Again</button>
            </div>
        `;
    }
}

function showSuccess(message) {
    const container = document.getElementById('content');
    if (container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.innerHTML = `<p>${message}</p>`;
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Global utility functions
function formatPrice(price) {
    if (!price || price === 0) return '-';
    return new Intl.NumberFormat().format(price);
}

function getQualityName(quality) {
    return QUALITIES[quality] || 'Normal';
}

function getCityDisplayName(city) {
    return city;
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                showTab('market');
                break;
            case '2':
                event.preventDefault();
                showTab('maps');
                break;
            case '3':
                event.preventDefault();
                showTab('crafting');
                break;
            case '4':
                event.preventDefault();
                showTab('profit');
                break;
        }
    }
});

// Auto-refresh functionality
let autoRefreshInterval = null;

function startAutoRefresh(intervalMinutes = 5) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(async () => {
        if (currentTab === 'market') {
            try {
                const goldPrices = await getGoldPrices(1);
                displayGoldPrice(goldPrices);
                console.log('Auto-refreshed market data');
            } catch (error) {
                console.error('Auto-refresh failed:', error);
            }
        }
    }, intervalMinutes * 60 * 1000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Initialize auto-refresh when app loads
document.addEventListener('DOMContentLoaded', () => {
    startAutoRefresh(5);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

// Export functions for global access
window.showTab = showTab;
window.searchMarketItems = searchMarketItems;
window.quickSearch = quickSearch;
window.clearMarketSearch = clearMarketSearch;
window.addToCraftingQueue = addToCraftingQueue;
window.removeFromCraftingQueue = removeFromCraftingQueue;
window.clearCraftingQueue = clearCraftingQueue;
window.showItemDetails = showItemDetails;
window.showMarketPrices = showMarketPrices;
window.getItemHistory = getItemHistory;
window.filterMaps = filterMaps;
window.resetMapFilters = resetMapFilters;
window.renderMapList = renderMapList;
window.renderMapStats = renderMapStats;
window.renderBestZones = renderBestZones;
window.renderCategories = renderCategories;
window.renderPopularItems = renderPopularItems;
window.renderCraftingCalculator = renderCraftingCalculator;
window.calculateItemProfit = calculateItemProfit;
window.selectItemForCalculation = selectItemForCalculation;
window.calculatePopularCrafting = calculatePopularCrafting;
window.calculateResourceRefining = calculateResourceRefining;
window.calculateTransitOpportunities = calculateTransitOpportunities;
window.handleItemSearch = handleItemSearch;
window.handleCraftingSearch = handleCraftingSearch;
