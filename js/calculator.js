const CRAFTING_BONUS_RATES = {
    T4: 0.4,
    T5: 0.5,
    T6: 0.6,
    T7: 0.7,
    T8: 0.8
};

const FOCUS_COSTS = {
    T4: 1000,
    T5: 3600,
    T6: 9000,
    T7: 18000,
    T8: 36000
};

const TAX_RATES = {
    PLAYER_CITY: 0.1,
    BLACK_ZONE: 0.0,
    ISLAND: 0.0
};

let craftingQueue = [];
let profitCalculations = [];

function calculateCraftingProfit(itemId, quantity = 1, city = 'Caerleon', useFocus = true) {
    const item = findItemById(itemId);
    if (!item) return null;
    
    const recipe = getCraftingRecipe(itemId);
    if (!recipe) return null;
    
    const craftingCost = recipe.craftingCost * quantity;
    const focusCost = useFocus ? (FOCUS_COSTS[`T${item.tier}`] || 0) * quantity : 0;
    const totalCost = craftingCost + focusCost;
    
    const marketData = getMarketDataWithFallback(itemId);
    const marketPrice = marketData.length > 0 ? marketData[0].sell_price_min || 0 : 0;
    
    const taxRate = city === 'Black Zone' ? TAX_RATES.BLACK_ZONE : TAX_RATES.PLAYER_CITY;
    const netRevenue = (marketPrice * quantity) * (1 - taxRate);
    
    const profit = netRevenue - totalCost;
    const profitMargin = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    const craftingBonus = useFocus ? CRAFTING_BONUS_RATES[`T${item.tier}`] || 0 : 0;
    const expectedReturn = quantity * (1 + craftingBonus);
    
    return {
        itemId,
        itemName: item.localizedNames?.['EN-US'] || item.uniqueName,
        quantity,
        craftingCost,
        focusCost,
        totalCost,
        marketPrice,
        netRevenue,
        profit,
        profitMargin,
        isProfitable: profit > 0,
        craftingBonus,
        expectedReturn,
        city,
        useFocus
    };
}

function calculateResourceProfit(resourceId, tier, quantity = 1, city = 'Caerleon') {
    const resourceData = getMarketDataWithFallback(resourceId);
    const resourcePrice = resourceData.length > 0 ? resourceData[0].sell_price_min || 0 : 0;
    
    const refinedItemId = `${resourceId}_ENCHANTED`;
    const refinedData = getMarketDataWithFallback(refinedItemId);
    const refinedPrice = refinedData.length > 0 ? refinedData[0].sell_price_min || 0 : 0;
    
    const refinementCost = resourcePrice * quantity;
    const revenue = refinedPrice * quantity;
    const profit = revenue - refinementCost;
    const profitMargin = refinementCost > 0 ? (profit / refinementCost) * 100 : 0;
    
    return {
        resourceId,
        tier,
        quantity,
        resourcePrice,
        refinedPrice,
        refinementCost,
        revenue,
        profit,
        profitMargin,
        isProfitable: profit > 0,
        city
    };
}

function calculateTransitProfit(itemId, buyCity, sellCity, quantity = 1) {
    const buyData = getMarketDataWithFallback(itemId);
    const sellData = getMarketDataWithFallback(itemId);
    
    const buyPrice = buyData.find(d => d.city === buyCity)?.buy_price_max || 0;
    const sellPrice = sellData.find(d => d.city === sellCity)?.sell_price_min || 0;
    
    if (!buyPrice || !sellPrice) return null;
    
    const totalBuyCost = buyPrice * quantity;
    const totalSellRevenue = sellPrice * quantity;
    const transitCost = calculateTransitCost(buyCity, sellCity, quantity);
    const totalCost = totalBuyCost + transitCost;
    
    const profit = totalSellRevenue - totalCost;
    const profitMargin = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    return {
        itemId,
        itemName: findItemById(itemId)?.localizedNames?.['EN-US'] || itemId,
        buyCity,
        sellCity,
        quantity,
        buyPrice,
        sellPrice,
        totalBuyCost,
        totalSellRevenue,
        transitCost,
        totalCost,
        profit,
        profitMargin,
        isProfitable: profit > 0
    };
}

function calculateTransitCost(buyCity, sellCity, quantity) {
    const baseCostPerItem = {
        'Caerleon': 100,
        'Thetford': 80,
        'Fort Sterling': 60,
        'Lymhurst': 70,
        'Bridgewatch': 65,
        'Martlock': 75
    };
    
    const buyCost = baseCostPerItem[buyCity] || 50;
    const sellCost = baseCostPerItem[sellCity] || 50;
    
    return (buyCost + sellCost) * quantity;
}

function addToCraftingQueue(itemId, quantity = 1, city = 'Caerleon', useFocus = true) {
    const calculation = calculateCraftingProfit(itemId, quantity, city, useFocus);
    if (calculation) {
        craftingQueue.push(calculation);
        updateCraftingQueue();
    }
}

function removeFromCraftingQueue(index) {
    craftingQueue.splice(index, 1);
    updateCraftingQueue();
}

function updateCraftingQueue() {
    const container = document.getElementById('craftingQueue');
    if (!container) return;
    
    let html = '<div class="crafting-queue">';
    
    if (craftingQueue.length === 0) {
        html += '<p class="empty-queue">No items in crafting queue</p>';
    } else {
        let totalProfit = 0;
        let totalCost = 0;
        
        craftingQueue.forEach((item, index) => {
            totalProfit += item.profit;
            totalCost += item.totalCost;
            
            html += `
                <div class="queue-item ${item.isProfitable ? 'profitable' : 'unprofitable'}">
                    <div class="queue-item-info">
                        <h4>${item.itemName}</h4>
                        <p>Quantity: ${item.quantity} | City: ${item.city}</p>
                        <p>Cost: ${formatPrice(item.totalCost)} | Revenue: ${formatPrice(item.netRevenue)}</p>
                        <p class="profit ${item.isProfitable ? 'profit-positive' : 'profit-negative'}">
                            Profit: ${formatPrice(item.profit)} (${item.profitMargin.toFixed(1)}%)
                        </p>
                    </div>
                    <button onclick="removeFromCraftingQueue(${index})" class="remove-btn">Remove</button>
                </div>
            `;
        });
        
        html += `
            <div class="queue-summary">
                <h3>Queue Summary</h3>
                <p><strong>Total Cost:</strong> ${formatPrice(totalCost)}</p>
                <p><strong>Total Profit:</strong> ${formatPrice(totalProfit)}</p>
                <p><strong>Total Margin:</strong> ${totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : 0}%</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderCraftingCalculator() {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = `
        <div class="crafting-calculator">
            <div class="calculator-inputs">
                <div class="input-group">
                    <label for="calcItemSearch">Item:</label>
                    <input type="text" id="calcItemSearch" placeholder="Search for item...">
                    <div id="itemSearchResults" class="search-results"></div>
                </div>
                
                <div class="input-row">
                    <div class="input-group">
                        <label for="calcQuantity">Quantity:</label>
                        <input type="number" id="calcQuantity" value="1" min="1">
                    </div>
                    
                    <div class="input-group">
                        <label for="calcCity">City:</label>
                        <select id="calcCity">
                            ${CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="calcUseFocus" checked>
                            Use Focus
                        </label>
                    </div>
                </div>
                
                <button onclick="calculateItemProfit()" class="calculate-btn">Calculate Profit</button>
            </div>
            
            <div id="calculationResult" class="calculation-result"></div>
            
            <div class="calculator-sections">
                <div class="section">
                    <h3>Quick Calculations</h3>
                    <div class="quick-calc-buttons">
                        <button onclick="calculatePopularCrafting()">Popular Items</button>
                        <button onclick="calculateResourceRefining()">Resource Refining</button>
                        <button onclick="calculateTransitOpportunities()">Transit Opportunities</button>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Crafting Queue</h3>
                    <div id="craftingQueue"></div>
                    <button onclick="clearCraftingQueue()" class="clear-btn">Clear Queue</button>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Setup search functionality
    setupItemSearch();
}

function setupItemSearch() {
    const searchInput = document.getElementById('calcItemSearch');
    const resultsContainer = document.getElementById('itemSearchResults');
    
    if (!searchInput || !resultsContainer) return;
    
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const results = await searchItemsByName(query);
        displaySearchResults(results.slice(0, 10));
    }), 300);
}

function displaySearchResults(results) {
    const container = document.getElementById('itemSearchResults');
    if (!container) return;
    
    let html = '<div class="search-results-list">';
    
    results.forEach(item => {
        const itemName = item.localizedNames?.['EN-US'] || item.uniqueName;
        html += `
            <div class="search-result-item" onclick="selectItemForCalculation('${item.uniqueName}')">
                <img src="${getItemIconUrl(item.uniqueName, 32)}" alt="${itemName}">
                <div class="result-info">
                    <span class="result-name">${itemName}</span>
                    <span class="result-id">${item.uniqueName}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function selectItemForCalculation(itemId) {
    const searchInput = document.getElementById('calcItemSearch');
    const resultsContainer = document.getElementById('itemSearchResults');
    
    if (searchInput) {
        const item = findItemById(itemId);
        searchInput.value = item?.localizedNames?.['EN-US'] || itemId;
    }
    
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

async function calculateItemProfit() {
    const searchInput = document.getElementById('calcItemSearch');
    const quantity = parseInt(document.getElementById('calcQuantity')?.value || 1);
    const city = document.getElementById('calcCity')?.value || 'Caerleon';
    const useFocus = document.getElementById('calcUseFocus')?.checked !== false;
    
    if (!searchInput?.value) {
        alert('Please select an item');
        return;
    }
    
    const item = findItemByName(searchInput.value)[0];
    if (!item) {
        alert('Item not found');
        return;
    }
    
    const calculation = calculateCraftingProfit(item.uniqueName, quantity, city, useFocus);
    if (!calculation) {
        alert('No crafting recipe found for this item');
        return;
    }
    
    displayCalculationResult(calculation);
}

function displayCalculationResult(calculation) {
    const container = document.getElementById('calculationResult');
    if (!container) return;
    
    const profitClass = calculation.isProfitable ? 'profit-positive' : 'profit-negative';
    
    let html = `
        <div class="calculation-details">
            <h3>Calculation Result</h3>
            <div class="result-item">
                <h4>${calculation.itemName}</h4>
                <p>Quantity: ${calculation.quantity} | City: ${calculation.city}</p>
            </div>
            
            <div class="costs-section">
                <h4>Costs</h4>
                <p>Crafting Cost: ${formatPrice(calculation.craftingCost)}</p>
                <p>Focus Cost: ${formatPrice(calculation.focusCost)}</p>
                <p><strong>Total Cost: ${formatPrice(calculation.totalCost)}</strong></p>
            </div>
            
            <div class="revenue-section">
                <h4>Revenue</h4>
                <p>Market Price: ${formatPrice(calculation.marketPrice)}</p>
                <p>Net Revenue: ${formatPrice(calculation.netRevenue)}</p>
                <p>Expected Return: ${calculation.expectedReturn.toFixed(2)} items</p>
            </div>
            
            <div class="profit-section">
                <h4>Profit Analysis</h4>
                <p class="${profitClass}">Profit: ${formatPrice(calculation.profit)}</p>
                <p class="${profitClass}">Profit Margin: ${calculation.profitMargin.toFixed(2)}%</p>
                <p>Crafting Bonus: ${(calculation.craftingBonus * 100).toFixed(0)}%</p>
            </div>
            
            <div class="calculation-actions">
                <button onclick="addToCraftingQueue('${calculation.itemId}', ${calculation.quantity}, '${calculation.city}', ${calculation.useFocus})" 
                        class="add-to-queue-btn">Add to Queue</button>
                <button onclick="showMarketPrices('${calculation.itemId}')">Market Prices</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

async function calculatePopularCrafting() {
    const popularItems = getPopularItems().slice(0, 10);
    const calculations = [];
    
    for (const item of popularItems) {
        const calc = calculateCraftingProfit(item.uniqueName, 1, 'Caerleon', true);
        if (calc) {
            calculations.push(calc);
        }
    }
    
    displayProfitComparison(calculations, 'Popular Items Crafting Profit');
}

async function calculateResourceRefining() {
    const resources = ['T4_WOOD', 'T4_ORE', 'T4_FIBER', 'T4_HIDE', 'T4_ROCK'];
    const calculations = [];
    
    for (const resource of resources) {
        const calc = calculateResourceProfit(resource, 4, 1, 'Caerleon');
        if (calc) {
            calculations.push(calc);
        }
    }
    
    displayResourceRefiningComparison(calculations);
}

async function calculateTransitOpportunities() {
    const items = ['T4_FIRE_STAFF', 'T4_SWORD', 'T4_LEATHER_ARMOR'];
    const cities = ['Caerleon', 'Thetford', 'Fort Sterling', 'Lymhurst', 'Bridgewatch', 'Martlock'];
    const calculations = [];
    
    for (const itemId of items) {
        for (let i = 0; i < cities.length; i++) {
            for (let j = 0; j < cities.length; j++) {
                if (i !== j) {
                    const calc = calculateTransitProfit(itemId, cities[i], cities[j], 1);
                    if (calc && calc.isProfitable) {
                        calculations.push(calc);
                    }
                }
            }
        }
    }
    
    calculations.sort((a, b) => b.profit - a.profit);
    displayTransitComparison(calculations.slice(0, 20));
}

function displayProfitComparison(calculations, title) {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = `
        <div class="profit-comparison">
            <h2>${title}</h2>
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Cost</th>
                            <th>Revenue</th>
                            <th>Profit</th>
                            <th>Margin</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    calculations.forEach(calc => {
        const profitClass = calc.isProfitable ? 'profit-positive' : 'profit-negative';
        html += `
            <tr>
                <td>
                    <img src="${getItemIconUrl(calc.itemId, 32)}" alt="">
                    ${calc.itemName}
                </td>
                <td>${formatPrice(calc.totalCost)}</td>
                <td>${formatPrice(calc.netRevenue)}</td>
                <td class="${profitClass}">${formatPrice(calc.profit)}</td>
                <td class="${profitClass}">${calc.profitMargin.toFixed(1)}%</td>
                <td>
                    <button onclick="addToCraftingQueue('${calc.itemId}', 1, '${calc.city}', true)">Add to Queue</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function displayResourceRefiningComparison(calculations) {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = `
        <div class="resource-refining-comparison">
            <h2>Resource Refining Profit</h2>
            <div class="refining-grid">
    `;
    
    calculations.forEach(calc => {
        const profitClass = calc.isProfitable ? 'profit-positive' : 'profit-negative';
        html += `
            <div class="refining-card ${calc.isProfitable ? 'profitable' : 'unprofitable'}">
                <h3>${calc.resourceId}</h3>
                <p>Resource Price: ${formatPrice(calc.resourcePrice)}</p>
                <p>Refined Price: ${formatPrice(calc.refinedPrice)}</p>
                <p class="${profitClass}">Profit: ${formatPrice(calc.profit)}</p>
                <p class="${profitClass}">Margin: ${calc.profitMargin.toFixed(1)}%</p>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

function displayTransitComparison(calculations) {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = `
        <div class="transit-comparison">
            <h2>Transit Opportunities</h2>
            <div class="transit-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Buy Price</th>
                            <th>Sell Price</th>
                            <th>Transit Cost</th>
                            <th>Profit</th>
                            <th>Margin</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    calculations.forEach(calc => {
        const profitClass = calc.isProfitable ? 'profit-positive' : 'profit-negative';
        html += `
            <tr>
                <td>
                    <img src="${getItemIconUrl(calc.itemId, 32)}" alt="">
                    ${calc.itemName}
                </td>
                <td>${calc.buyCity}</td>
                <td>${calc.sellCity}</td>
                <td>${formatPrice(calc.buyPrice)}</td>
                <td>${formatPrice(calc.sellPrice)}</td>
                <td>${formatPrice(calc.transitCost)}</td>
                <td class="${profitClass}">${formatPrice(calc.profit)}</td>
                <td class="${profitClass}">${calc.profitMargin.toFixed(1)}%</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function clearCraftingQueue() {
    craftingQueue = [];
    updateCraftingQueue();
}
