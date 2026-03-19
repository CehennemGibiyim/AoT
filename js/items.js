const ITEM_CATEGORIES = {
    WEAPONS: 'weapons',
    ARMOR: 'armor',
    TOOLS: 'tools',
    RESOURCES: 'resources',
    CONSUMABLES: 'consumables',
    MOUNTS: 'mounts'
};

const WEAPON_TYPES = {
    SWORD: 'sword',
    AXE: 'axe',
    HAMMER: 'hammer',
    DAGGER: 'dagger',
    SPEAR: 'spear',
    QUARTERSTAFF: 'quarterstaff',
    BOW: 'bow',
    CROSSBOW: 'crossbow',
    FIRE_STAFF: 'fire_staff',
    HOLY_STAFF: 'holy_staff',
    ARCANE_STAFF: 'arcane_staff',
    NATURE_STAFF: 'nature_staff',
    FROST_STAFF: 'frost_staff'
};

const ARMOR_TYPES = {
    CLOTH: 'cloth_armor',
    LEATHER: 'leather_armor',
    PLATE: 'plate_armor'
};

const RESOURCE_TYPES = {
    WOOD: 'wood',
    ORE: 'ore',
    FIBER: 'fiber',
    HIDE: 'hide',
    ROCK: 'rock'
};

let itemsDatabase = [];
let itemCategories = {};

async function loadItemsDatabase() {
    try {
        const response = await fetch('data/items.json');
        const rawData = await response.text();
        
        itemsDatabase = parseItemsData(rawData);
        categorizeItems();
        return itemsDatabase;
    } catch (error) {
        console.error('Error loading items database:', error);
        return [];
    }
}

function parseItemsData(rawText) {
    const lines = rawText.split('\n');
    return lines.map(line => {
        const parts = line.split('|');
        if (parts.length < 5) return null;
        
        return {
            uniqueName: parts[0]?.trim(),
            localizedNames: {
                'EN-US': parts[1]?.trim()
            },
            description: parts[2]?.trim(),
            itemCategory: parts[3]?.trim(),
            tier: parseInt(parts[4]) || 1,
            enchantmentLevel: parseInt(parts[5]) || 0,
            itemType: parts[6]?.trim(),
            durability: parseInt(parts[7]) || 0,
            weight: parseFloat(parts[8]) || 0,
            canBeSold: parts[9] === 'true',
            canBeTrashed: parts[10] === 'true',
            craftingRequirements: parseCraftingRequirements(parts[11]),
            value: parseInt(parts[12]) || 0
        };
    }).filter(item => item && item.uniqueName);
}

function parseCraftingRequirements(requirementsString) {
    if (!requirementsString) return [];
    
    try {
        return JSON.parse(requirementsString);
    } catch (error) {
        return [];
    }
}

function categorizeItems() {
    itemCategories = {
        weapons: [],
        armor: [],
        tools: [],
        resources: [],
        consumables: [],
        mounts: [],
        other: []
    };
    
    itemsDatabase.forEach(item => {
        const category = determineItemCategory(item);
        if (itemCategories[category]) {
            itemCategories[category].push(item);
        } else {
            itemCategories.other.push(item);
        }
    });
}

function determineItemCategory(item) {
    const name = item.uniqueName.toLowerCase();
    const category = item.itemCategory.toLowerCase();
    
    if (name.includes('staff') || name.includes('sword') || name.includes('axe') || 
        name.includes('hammer') || name.includes('dagger') || name.includes('spear') ||
        name.includes('bow') || name.includes('crossbow')) {
        return 'weapons';
    }
    
    if (name.includes('armor') || name.includes('helmet') || name.includes('boots') ||
        name.includes('gloves') || name.includes('cloth') || name.includes('leather') ||
        name.includes('plate')) {
        return 'armor';
    }
    
    if (name.includes('pickaxe') || name.includes('axe') || name.includes('sickle') ||
        name.includes('fishing') || name.includes('tool')) {
        return 'tools';
    }
    
    if (name.includes('wood') || name.includes('ore') || name.includes('fiber') ||
        name.includes('hide') || name.includes('rock') || name.includes('stone')) {
        return 'resources';
    }
    
    if (name.includes('potion') || name.includes('food') || name.includes('drink') ||
        name.includes('banner') || name.includes('scroll')) {
        return 'consumables';
    }
    
    if (name.includes('horse') || name.includes('ox') || name.includes('mule') ||
        name.includes('mount')) {
        return 'mounts';
    }
    
    return 'other';
}

function findItemByName(query) {
    const searchTerm = query.toLowerCase();
    
    return itemsDatabase.filter(item => 
        item.uniqueName.toLowerCase().includes(searchTerm) ||
        (item.localizedNames && item.localizedNames['EN-US'] && 
         item.localizedNames['EN-US'].toLowerCase().includes(searchTerm))
    );
}

function findItemById(itemId) {
    return itemsDatabase.find(item => item.uniqueName === itemId);
}

function getItemsByCategory(category) {
    return itemCategories[category] || [];
}

function getItemsByTier(tier) {
    return itemsDatabase.filter(item => item.tier === tier);
}

function getCraftingRecipe(itemId) {
    const item = findItemById(itemId);
    if (!item || !item.craftingRequirements) return null;
    
    return {
        item: item,
        requirements: item.craftingRequirements,
        craftingCost: calculateCraftingCost(item.craftingRequirements)
    };
}

function calculateCraftingCost(requirements) {
    let totalCost = 0;
    
    if (Array.isArray(requirements)) {
        requirements.forEach(req => {
            const materialCost = req.quantity * (req.unitValue || 0);
            totalCost += materialCost;
        });
    }
    
    return totalCost;
}

function renderItemsList(items) {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = '<div class="items-grid">';
    
    items.forEach(item => {
        const itemName = item.localizedNames?.['EN-US'] || item.uniqueName;
        const iconUrl = getItemIconUrl(item.uniqueName, 64);
        
        html += `
            <div class="item-card" data-tier="${item.tier}" data-category="${determineItemCategory(item)}">
                <div class="item-icon">
                    <img src="${iconUrl}" alt="${itemName}" onerror="this.src='assets/placeholder.png'">
                </div>
                <div class="item-info">
                    <h4>${itemName}</h4>
                    <p class="item-id">${item.uniqueName}</p>
                    <div class="item-badges">
                        <span class="badge tier-${item.tier}">T${item.tier}</span>
                        ${item.enchantmentLevel > 0 ? `<span class="badge enchantment">+${item.enchantmentLevel}</span>` : ''}
                    </div>
                    <div class="item-stats">
                        <p><strong>Category:</strong> ${item.itemCategory}</p>
                        <p><strong>Weight:</strong> ${item.weight}</p>
                        <p><strong>Durability:</strong> ${item.durability}</p>
                        ${item.value > 0 ? `<p><strong>Value:</strong> ${formatPrice(item.value)}</p>` : ''}
                    </div>
                    <div class="item-actions">
                        <button onclick="showItemDetails('${item.uniqueName}')">Details</button>
                        <button onclick="addToCraftingCalculator('${item.uniqueName}')">Craft</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderCategories() {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = '<div class="categories-grid">';
    
    Object.entries(itemCategories).forEach(([category, items]) => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        const icon = getCategoryIcon(category);
        
        html += `
            <div class="category-card" onclick="showCategoryItems('${category}')">
                <div class="category-icon">${icon}</div>
                <h3>${categoryName}</h3>
                <p class="item-count">${items.length} items</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function getCategoryIcon(category) {
    const icons = {
        weapons: '⚔️',
        armor: '🛡️',
        tools: '🔨',
        resources: '📦',
        consumables: '🧪',
        mounts: '🐎',
        other: '📋'
    };
    
    return icons[category] || '📋';
}

function showCategoryItems(category) {
    const items = getItemsByCategory(category);
    renderItemsList(items);
}

function showItemDetails(itemId) {
    const item = findItemById(itemId);
    if (!item) return;
    
    const recipe = getCraftingRecipe(itemId);
    const itemName = item.localizedNames?.['EN-US'] || item.uniqueName;
    const iconUrl = getItemIconUrl(item.uniqueName, 128);
    
    const container = document.getElementById('content');
    let html = `
        <div class="item-details">
            <div class="item-header">
                <img src="${iconUrl}" alt="${itemName}" class="item-large-icon">
                <div class="item-title">
                    <h2>${itemName}</h2>
                    <p class="item-id">${item.uniqueName}</p>
                    <div class="item-badges">
                        <span class="badge tier-${item.tier}">T${item.tier}</span>
                        ${item.enchantmentLevel > 0 ? `<span class="badge enchantment">+${item.enchantmentLevel}</span>` : ''}
                        <span class="badge category">${item.itemCategory}</span>
                    </div>
                </div>
            </div>
            
            <div class="item-description">
                <h3>Description</h3>
                <p>${item.description || 'No description available'}</p>
            </div>
            
            <div class="item-properties">
                <h3>Properties</h3>
                <div class="properties-grid">
                    <div class="property">
                        <label>Weight:</label>
                        <span>${item.weight}</span>
                    </div>
                    <div class="property">
                        <label>Durability:</label>
                        <span>${item.durability}</span>
                    </div>
                    <div class="property">
                        <label>Can be sold:</label>
                        <span>${item.canBeSold ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="property">
                        <label>Can be trashed:</label>
                        <span>${item.canBeTrashed ? 'Yes' : 'No'}</span>
                    </div>
                    ${item.value > 0 ? `
                    <div class="property">
                        <label>Base value:</label>
                        <span>${formatPrice(item.value)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
    `;
    
    if (recipe) {
        html += `
            <div class="crafting-recipe">
                <h3>Crafting Recipe</h3>
                <div class="recipe-requirements">
                    <p><strong>Crafting Cost:</strong> ${formatPrice(recipe.craftingCost)}</p>
                    <div class="requirements-list">
        `;
        
        if (Array.isArray(recipe.requirements)) {
            recipe.requirements.forEach(req => {
                html += `
                    <div class="requirement">
                        <span>${req.itemName || req.itemId}</span>
                        <span>x${req.quantity}</span>
                    </div>
                `;
            });
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="item-actions">
            <button onclick="showMarketPrices('${itemId}')">Market Prices</button>
            <button onclick="addToCraftingCalculator('${itemId}')">Add to Calculator</button>
            <button onclick="showCategoryItems('${determineItemCategory(item)}')">Back to Category</button>
        </div>
    </div>
    `;
    
    container.innerHTML = html;
}

function searchItems(query) {
    if (!query) {
        renderCategories();
        return;
    }
    
    const results = findItemByName(query);
    renderItemsList(results);
}

function getPopularItems() {
    return itemsDatabase
        .filter(item => item.tier >= 6 && item.tier <= 8)
        .sort((a, b) => b.value - a.value)
        .slice(0, 20);
}

function renderPopularItems() {
    const popularItems = getPopularItems();
    renderItemsList(popularItems);
}
