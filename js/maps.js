const EXCLUDED_ZONES = ['MIST', 'MISTS', 'mist', 'mists'];
const ZONE_TYPES = {
    SAFE: 'Safe',
    YELLOW: 'Yellow',
    RED: 'Red',
    BLACK: 'Black'
};

const TIER_COLORS = {
    4: '#4a90e2',
    5: '#4a90e2',
    6: '#7ed321',
    7: '#f5a623',
    8: '#d0021b'
};

const TYPE_COLORS = {
    SAFE: '#2ecc71',
    YELLOW: '#f1c40f',
    RED: '#e74c3c',
    BLACK: '#2c3e50'
};

let mapData = [];
let filteredMapData = [];

async function loadMapData() {
    try {
        const response = await fetch('data/locations.json');
        const rawData = await response.text();
        
        mapData = parseLocations(rawData).filter(zone => {
            return !EXCLUDED_ZONES.some(excluded => 
                zone.name.toLowerCase().includes(excluded.toLowerCase())
            );
        });
        
        filteredMapData = [...mapData];
        return mapData;
    } catch (error) {
        console.error('Error loading map data:', error);
        return [];
    }
}

function parseLocations(rawText) {
    const lines = rawText.split('\n');
    return lines.map(line => {
        const parts = line.split('|');
        if (parts.length < 9) return null;
        
        return {
            id: parts[0]?.trim(),
            name: parts[1]?.trim(),
            type: parts[2]?.trim().toUpperCase(),
            tier: parseInt(parts[3]) || 4,
            resources: {
                wood: parseInt(parts[4]) || 0,
                ore: parseInt(parts[5]) || 0,
                fiber: parseInt(parts[6]) || 0,
                hide: parseInt(parts[7]) || 0,
                rock: parseInt(parts[8]) || 0
            },
            coordinates: {
                x: parseFloat(parts[9]) || 0,
                y: parseFloat(parts[10]) || 0
            }
        };
    }).filter(item => item && item.id);
}

function renderMapList() {
    const container = document.getElementById('content');
    if (!container) return;
    
    let html = `
        <div class="map-controls">
            <div class="filter-section">
                <label>Zone Type:</label>
                <select id="zoneTypeFilter" onchange="filterMaps()">
                    <option value="">All Types</option>
                    <option value="SAFE">Safe</option>
                    <option value="YELLOW">Yellow</option>
                    <option value="RED">Red</option>
                    <option value="BLACK">Black</option>
                </select>
                
                <label>Tier:</label>
                <select id="tierFilter" onchange="filterMaps()">
                    <option value="">All Tiers</option>
                    <option value="4">T4</option>
                    <option value="5">T5</option>
                    <option value="6">T6</option>
                    <option value="7">T7</option>
                    <option value="8">T8</option>
                </select>
                
                <label>Resource:</label>
                <select id="resourceFilter" onchange="filterMaps()">
                    <option value="">All Resources</option>
                    <option value="wood">Wood</option>
                    <option value="ore">Ore</option>
                    <option value="fiber">Fiber</option>
                    <option value="hide">Hide</option>
                    <option value="rock">Rock</option>
                </select>
                
                <button onclick="resetMapFilters()">Reset Filters</button>
            </div>
        </div>
        <div class="map-grid">
    `;
    
    filteredMapData.forEach(zone => {
        html += `
            <div class="map-card" data-tier="${zone.tier}" data-type="${zone.type}">
                <h3>${zone.name}</h3>
                <div class="badges">
                    <span class="badge tier-${zone.tier}">T${zone.tier}</span>
                    <span class="badge type-${zone.type}">${zone.type}</span>
                </div>
                <div class="resources">
                    ${renderResourceIcons(zone.resources)}
                </div>
                <div class="zone-info">
                    <p><strong>ID:</strong> ${zone.id}</p>
                    ${zone.coordinates.x ? `<p><strong>Coords:</strong> ${zone.coordinates.x}, ${zone.coordinates.y}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderResourceIcons(resources) {
    let html = '<div class="resource-icons">';
    
    if (resources.wood > 0) {
        html += `<div class="resource-icon resource-wood" title="Wood Tier ${resources.wood}">W${resources.wood}</div>`;
    }
    if (resources.ore > 0) {
        html += `<div class="resource-icon resource-ore" title="Ore Tier ${resources.ore}">O${resources.ore}</div>`;
    }
    if (resources.fiber > 0) {
        html += `<div class="resource-icon resource-fiber" title="Fiber Tier ${resources.fiber}">F${resources.fiber}</div>`;
    }
    if (resources.hide > 0) {
        html += `<div class="resource-icon resource-hide" title="Hide Tier ${resources.hide}">H${resources.hide}</div>`;
    }
    if (resources.rock > 0) {
        html += `<div class="resource-icon resource-rock" title="Rock Tier ${resources.rock}">R${resources.rock}</div>`;
    }
    
    if (html === '<div class="resource-icons">') {
        html += '<span class="no-resources">No resources</span>';
    }
    
    html += '</div>';
    return html;
}

function filterMaps() {
    const typeFilter = document.getElementById('zoneTypeFilter')?.value || '';
    const tierFilter = document.getElementById('tierFilter')?.value || '';
    const resourceFilter = document.getElementById('resourceFilter')?.value || '';
    
    filteredMapData = mapData.filter(zone => {
        if (typeFilter && zone.type !== typeFilter) return false;
        if (tierFilter && zone.tier.toString() !== tierFilter) return false;
        if (resourceFilter && zone.resources[resourceFilter] === 0) return false;
        return true;
    });
    
    renderMapList();
}

function resetMapFilters() {
    document.getElementById('zoneTypeFilter').value = '';
    document.getElementById('tierFilter').value = '';
    document.getElementById('resourceFilter').value = '';
    filteredMapData = [...mapData];
    renderMapList();
}

function searchZones(query) {
    if (!query) {
        filteredMapData = [...mapData];
    } else {
        const searchTerm = query.toLowerCase();
        filteredMapData = mapData.filter(zone => 
            zone.name.toLowerCase().includes(searchTerm) ||
            zone.id.toLowerCase().includes(searchTerm)
        );
    }
    renderMapList();
}

function getZoneStats() {
    const stats = {
        total: mapData.length,
        byType: {},
        byTier: {},
        resourceRich: 0
    };
    
    mapData.forEach(zone => {
        stats.byType[zone.type] = (stats.byType[zone.type] || 0) + 1;
        stats.byTier[zone.tier] = (stats.byTier[zone.tier] || 0) + 1;
        
        const hasResources = Object.values(zone.resources).some(r => r > 0);
        if (hasResources) stats.resourceRich++;
    });
    
    return stats;
}

function renderMapStats() {
    const stats = getZoneStats();
    const container = document.getElementById('content');
    
    let html = `
        <div class="map-stats">
            <h2>🗺️ Zone Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Zones</h3>
                    <p class="stat-number">${stats.total}</p>
                </div>
                <div class="stat-card">
                    <h3>Resource Rich</h3>
                    <p class="stat-number">${stats.resourceRich}</p>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>By Type</h3>
                <div class="type-stats">
    `;
    
    Object.entries(stats.byType).forEach(([type, count]) => {
        html += `
            <div class="type-stat">
                <span class="badge type-${type}">${type}</span>
                <span>${count}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="stats-section">
                <h3>By Tier</h3>
                <div class="tier-stats">
    `;
    
    Object.entries(stats.byTier).forEach(([tier, count]) => {
        html += `
            <div class="tier-stat">
                <span class="badge tier-${tier}">T${tier}</span>
                <span>${count}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function findBestResourceZones(resourceType, tier = null) {
    return mapData
        .filter(zone => zone.resources[resourceType] > 0)
        .filter(zone => !tier || zone.resources[resourceType] >= tier)
        .sort((a, b) => b.resources[resourceType] - a.resources[resourceType])
        .slice(0, 10);
}

function renderBestZones() {
    const container = document.getElementById('content');
    
    let html = '<div class="best-zones">';
    
    ['wood', 'ore', 'fiber', 'hide', 'rock'].forEach(resource => {
        const bestZones = findBestResourceZones(resource);
        
        html += `
            <div class="resource-section">
                <h3>${resource.charAt(0).toUpperCase() + resource.slice(1)} Zones</h3>
                <div class="zone-list">
        `;
        
        bestZones.slice(0, 5).forEach(zone => {
            html += `
                <div class="zone-item">
                    <span class="zone-name">${zone.name}</span>
                    <span class="zone-tier">T${zone.resources[resource]}</span>
                    <span class="zone-type badge type-${zone.type}">${zone.type}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}
