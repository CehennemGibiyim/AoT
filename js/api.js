const API_ENDPOINTS = {
    PRICES: 'https://www.albion-online-data.com/api/v2/stats/prices/',
    GOLD: 'https://www.albion-online-data.com/api/v2/stats/gold',
    HISTORY: 'https://www.albion-online-data.com/api/v2/stats/history/',
    ITEMS: 'https://gameinfo.albiononline.com/api/gameinfo/items/',
    RENDER: 'https://render.albiononline.com/v1/item/'
};

const CITIES = [
    'Caerleon', 'Thetford', 'Fort Sterling', 
    'Lymhurst', 'Bridgewatch', 'Martlock', 'Black Market'
];

const QUALITIES = ['Normal', 'Good', 'Outstanding', 'Excellent', 'Masterpiece'];

async function getItemPrices(itemIds, locations = [], qualities = []) {
    try {
        let url = `${API_ENDPOINTS.PRICES}${itemIds}.json?`;
        if (locations.length) url += `locations=${locations.join(',')}&`;
        if (qualities.length) url += `qualities=${qualities.join(',')}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching item prices:', error);
        throw error;
    }
}

async function getGoldPrices(count = 1) {
    try {
        const response = await fetch(`${API_ENDPOINTS.GOLD}?count=${count}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold prices:', error);
        throw error;
    }
}

async function getItemHistory(itemId, locations = [], qualities = [], dateRange = '24') {
    try {
        let url = `${API_ENDPOINTS.HISTORY}${itemId}.json?date-range=${dateRange}`;
        if (locations.length) url += `&locations=${locations.join(',')}`;
        if (qualities.length) url += `&qualities=${qualities.join(',')}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching item history:', error);
        throw error;
    }
}

async function getItemDetails(itemId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.ITEMS}${itemId}/data`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching item details:', error);
        throw error;
    }
}

function getItemIconUrl(itemId, size = 64) {
    return `${API_ENDPOINTS.RENDER}${itemId}.png?size=${size}`;
}

function formatPrice(price) {
    if (!price || price === 0) return '-';
    return new Intl.NumberFormat().format(price);
}

function getQualityName(quality) {
    return QUALITIES[quality] || 'Normal';
}

function getCityDisplayName(city) {
    if (city === 'Black Market') return 'Black Market';
    return city;
}

async function searchItemsByName(query) {
    try {
        const response = await fetch('data/items.json');
        const items = await response.json();
        
        return items.filter(item => 
            item.UniqueName.toLowerCase().includes(query.toLowerCase()) ||
            item.LocalizedNames?.['EN-US']?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 20);
    } catch (error) {
        console.error('Error searching items:', error);
        return [];
    }
}

function calculateProfit(sellPrice, buyPrice, craftingCost = 0, taxRate = 0.1) {
    const netSellPrice = sellPrice * (1 - taxRate);
    const totalCost = buyPrice + craftingCost;
    const profit = netSellPrice - totalCost;
    const profitMargin = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    return {
        profit,
        profitMargin,
        netSellPrice,
        totalCost,
        isProfitable: profit > 0
    };
}

function parseItemId(itemName) {
    const itemMap = {
        'fire staff': 'T4_FIRE_STAFF',
        'holy staff': 'T4_HOLY_STAFF',
        'arcane staff': 'T4_ARCANE_STAFF',
        'nature staff': 'T4_NATURE_STAFF',
        'frost staff': 'T4_FROST_STAFF',
        'sword': 'T4_SWORD',
        'axe': 'T4_AXE',
        'hammer': 'T4_HAMMER',
        'dagger': 'T4_DAGGER',
        'spear': 'T4_SPEAR',
        'quarterstaff': 'T4_QUARTERSTAFF',
        'bow': 'T4_BOW',
        'crossbow': 'T4_CROSSBOW',
        'leather armor': 'T4_LEATHER_ARMOR',
        'cloth armor': 'T4_CLOTH_ARMOR',
        'plate armor': 'T4_PLATE_ARMOR',
        'wood': 'T2_WOOD',
        'ore': 'T2_ORE',
        'fiber': 'T2_FIBER',
        'hide': 'T2_HIDE',
        'rock': 'T2_ROCK'
    };
    
    const normalizedName = itemName.toLowerCase().trim();
    return itemMap[normalizedName] || itemName.toUpperCase().replace(/\s+/g, '_');
}

async function getMarketDataWithFallback(itemId) {
    try {
        const prices = await getItemPrices(itemId);
        if (prices && prices.length > 0) {
            return prices;
        }
        
        throw new Error('No price data available');
    } catch (error) {
        console.warn(`Failed to fetch data for ${itemId}, using fallback`);
        return [];
    }
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

const debouncedSearch = debounce(searchItemsByName, 300);
