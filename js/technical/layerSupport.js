var layers = {};

const decimalZero = new Decimal(0);
const decimalOne = new Decimal(1);
const decimalNaN = new Decimal(NaN);
const decimalInfinity = new Decimal(`1e90000000000000000000000`);

const defaultGlow = "#ff0000";


function layerShown(layer) {
	return tmp[layer].layerShown;
}

var LAYERS = Object.keys(layers);

var hotkeys = {};

var maxRow = 0;

function updateHotkeys() {
	hotkeys = {};
	for (layer in layers) {
		hk = layers[layer].hotkeys;
		if (hk) {
			for (id in hk) {
				hotkeys[hk[id].key] = hk[id];
				hotkeys[hk[id].key].layer = layer;
				hotkeys[hk[id].key].id = id;
				if (hk[id].unlocked === undefined)
					hk[id].unlocked = true;
			}
		}
	}
}

var ROW_LAYERS = {};
var TREE_LAYERS = {};
var OTHER_LAYERS = {};

function updateLayers() {
	LAYERS = Object.keys(layers);
	ROW_LAYERS = {};
	TREE_LAYERS = {};
	OTHER_LAYERS = {};
	for (layer in layers) {
		setupLayer(layer);
	}
	for (row in OTHER_LAYERS) {
		OTHER_LAYERS[row].sort((a, b) => (a.position > b.position) ? 1 : -1);
		for (layer in OTHER_LAYERS[row])
			OTHER_LAYERS[row][layer] = OTHER_LAYERS[row][layer].layer; 
	}
	for (row in TREE_LAYERS) {
		TREE_LAYERS[row].sort((a, b) => (a.position > b.position) ? 1 : -1);
		for (layer in TREE_LAYERS[row])
			TREE_LAYERS[row][layer] = TREE_LAYERS[row][layer].layer;
	}
	let treeLayers2 = [];
	for (x = 0; x < maxRow + 1; x++) {
		if (TREE_LAYERS[x]) treeLayers2.push(TREE_LAYERS[x]);
	}
	TREE_LAYERS = treeLayers2;
	updateHotkeys();
}

function hash(string) {
	let returnValue = 7;
	for (let i = 0; i < string.length; i++) {
		returnValue = (returnValue*31 + string.charCodeAt(i))%245659;
	}
	for (let i = 0; i < string.length; i++) {
		returnValue = (returnValue*31 + string.charCodeAt(i))%245659;
	}
	return returnValue;
}
function setupLayer(layer) {
	layers[layer].layer = layer;
	layers[layer].hashedId = hash(layer);
	if (layers[layer].upgrades) {
		setRowCol(layers[layer].upgrades);
		for (thing in layers[layer].upgrades) {
			if (isPlainObject(layers[layer].upgrades[thing])) {
				layers[layer].upgrades[thing].id = thing;
				layers[layer].upgrades[thing].layer = layer;
				if (layers[layer].upgrades[thing].unlocked === undefined)
					layers[layer].upgrades[thing].unlocked = true;
			}
		}
	}
	if (layers[layer].milestones) {
		for (thing in layers[layer].milestones) {
			if (isPlainObject(layers[layer].milestones[thing])) {
				layers[layer].milestones[thing].id = thing;
				layers[layer].milestones[thing].layer = layer;
				if (layers[layer].milestones[thing].unlocked === undefined)
					layers[layer].milestones[thing].unlocked = true;
			}
		}
	}
	if (layers[layer].achievements) {
		setRowCol(layers[layer].achievements);
		for (thing in layers[layer].achievements) {
			if (isPlainObject(layers[layer].achievements[thing])) {
				layers[layer].achievements[thing].id = thing;
				layers[layer].achievements[thing].layer = layer;
				if (layers[layer].achievements[thing].unlocked === undefined)
					layers[layer].achievements[thing].unlocked = true;
			}
		}
	}
	if (layers[layer].challenges) {
		setRowCol(layers[layer].challenges);
		for (thing in layers[layer].challenges) {
			if (isPlainObject(layers[layer].challenges[thing])) {
				layers[layer].challenges[thing].id = thing;
				layers[layer].challenges[thing].layer = layer;
				if (layers[layer].challenges[thing].unlocked === undefined)
					layers[layer].challenges[thing].unlocked = true;
				if (layers[layer].challenges[thing].completionLimit === undefined)
					layers[layer].challenges[thing].completionLimit = 1;
				else if (layers[layer].challenges[thing].marked === undefined) 
					layers[layer].challenges[thing].marked = function() {return maxedChallenge(this.layer, this.id);};

			}
		}
	}
	if (layers[layer].buyables) {
		layers[layer].buyables.layer = layer;
		setRowCol(layers[layer].buyables);
		for (thing in layers[layer].buyables) {
			if (isPlainObject(layers[layer].buyables[thing])) {
				layers[layer].buyables[thing].id = thing;
				layers[layer].buyables[thing].layer = layer;
				if (layers[layer].buyables[thing].unlocked === undefined)
					layers[layer].buyables[thing].unlocked = true;
				layers[layer].buyables[thing].canBuy = function() {return canBuyBuyable(this.layer, this.id);};
				if (layers[layer].buyables[thing].purchaseLimit === undefined) layers[layer].buyables[thing].purchaseLimit = new Decimal(Infinity);
		
			}  
	
		}
	}

	if (player[layer].points) {
		layers[layer].usages = [];
		for (let l in layers) {
			if (!layers[l].processes) continue;
			for (let p in layers[l].processes) {
				if (!isPlainObject(layers[l].processes[p])) continue;
				if (layers[l].processes[p].requires[layer]) layers[layer].usages.push([l, p]);
			}
		}
		layers[layer].productionProcesses = [];
		for (let l in layers) {
			if (!layers[l].processes) continue;
			for (let p in layers[l].processes) {
				if (!isPlainObject(layers[l].processes[p])) continue;
				if (layers[l].processes[p].produces[layer]) layers[layer].productionProcesses.push([l, p]);
			}
		}

		layers[layer].usage = function () {
			let usage = decimalZero;
			for (let u of this.usages) {
				let prcs = tmp[u[0]].processes[u[1]];
				if (!prcs.active) continue;
				usage = usage.add(prcs.requires[this.layer].amt.sub(prcs.produces[this.layer] ? prcs.produces[this.layer].amt : 0));
			}
			return usage.max(0);
		};

		layers[layer].connectedResources = [];
		for (let l in layers) {
			if (layers[l].connected == layer) layers[layer].connectedResources.push(l);
		}
	}
	if (layers[layer].processes) {
		layers[layer].processes.layer = layer;
		for (thing in layers[layer].processes) {
			let prcs = layers[layer].processes[thing];
			if (isPlainObject(prcs)) {
				prcs.id = thing;
				prcs.layer = layer;

				prcs.active = function() {
					let prcs = tmp[this.layer].processes[this.id];
					if (this.overrideActive) return prcs.overrideActive;
					if (!prcs.unlocked) return false;
					if (this.activeCondition && !prcs.activeCondition) return false;
					if ((player[this.layer].disabled || !player[this.layer].processes[this.id].on)
						&& !prcs.forceActive)
						return false;
					return meetsRequirements(this.layer, this.id) && !allMaxed(this.layer, this.id);
				};

				prcs.unlocked = function () {
					if (this.unlockCondition) return this.unlockCondition();
					return hasUpgrade(this.layer, this.id);
				};

				for (let i in prcs.produces) {
					const curr = prcs.produces[i];

					curr.layer = layer;
					curr.id = thing;
					curr.rp = "produces";
					curr.currencyName = i;
				}
				for (let i in prcs.requires) {
					const curr = prcs.requires[i];

					curr.layer = layer;
					curr.id = thing;
					curr.rp = "requires";
					curr.currencyName = i;
				}

				prcs.maxProduction = function (diff) {
					let maximum = decimalInfinity;
					let prcs = tmp[this.layer].processes[this.id];
					for (let i in prcs.requires) {
						if (prcs.requires[i].amt.m == 0 || prcs.requires[i].disabled) continue;
						maximum = maximum.min(player[i].points.div(tmp[i].usage));
					}
					let pMax = decimalInfinity;
					for (let i in prcs.produces) {
						if (prcs.produces[i].disabled) continue;
						if (pMax.eq(decimalInfinity)) pMax = D(1e-7);
						// The 1.001 is there to prevent floating point errors
						let mx = prcs.produces[i].cap.mul(1.001).sub(player[i].points.sub(tmp[i].usage.mul(diff)).max(0)).div(prcs.produces[i].amt);
						if (prcs.whole) mx = mx.ceil();
						pMax = pMax.max(mx);
					}
					return maximum.min(pMax);
				};
			}
		}
	}

	if (layers[layer].clickables) {
		layers[layer].clickables.layer = layer;
		setRowCol(layers[layer].clickables);
		for (thing in layers[layer].clickables) {
			if (isPlainObject(layers[layer].clickables[thing])) {
				layers[layer].clickables[thing].id = thing;
				layers[layer].clickables[thing].layer = layer;
				if (layers[layer].clickables[thing].unlocked === undefined)
					layers[layer].clickables[thing].unlocked = true;
			}
		}  
	}

	if (layers[layer].bars) {
		layers[layer].bars.layer = layer;
		for (thing in layers[layer].bars) {
			layers[layer].bars[thing].id = thing;
			layers[layer].bars[thing].layer = layer;
			if (layers[layer].bars[thing].unlocked === undefined)
				layers[layer].bars[thing].unlocked = true;
		}  
	}

	if (layers[layer].infoboxes) {
		for (thing in layers[layer].infoboxes) {
			layers[layer].infoboxes[thing].id = thing;
			layers[layer].infoboxes[thing].layer = layer;
			if (layers[layer].infoboxes[thing].unlocked === undefined)
				layers[layer].infoboxes[thing].unlocked = true;
		}  
	}
	
	if (layers[layer].grid) {
		layers[layer].grid.layer = layer;
		if (layers[layer].grid.getUnlocked === undefined)
			layers[layer].grid.getUnlocked = true;
		if (layers[layer].grid.getCanClick === undefined)
			layers[layer].grid.getCanClick = true;

	}

	if (layers[layer].nodeStyle) {
		layers[layer].nodeStyle.layer = layer;
	}
	if (layers[layer].startData) {
		data = layers[layer].startData();
		if (data.best !== undefined && data.showBest === undefined) layers[layer].showBest = true;
		if (data.total !== undefined && data.showTotal === undefined) layers[layer].showTotal = true;
	}

	if(!layers[layer].componentStyles) layers[layer].componentStyles = {};
	if(layers[layer].symbol === undefined) layers[layer].symbol = layer.charAt(0).toUpperCase() + layer.slice(1);
	if(layers[layer].unlockOrder === undefined) layers[layer].unlockOrder = [];
	if(layers[layer].gainMult === undefined) layers[layer].gainMult = decimalOne;
	if(layers[layer].gainExp === undefined) layers[layer].gainExp = decimalOne;
	if(layers[layer].directMult === undefined) layers[layer].directMult = decimalOne;
	if(layers[layer].type === undefined) layers[layer].type = "none";
	if(layers[layer].base === undefined || layers[layer].base <= 1) layers[layer].base = 2;
	if(layers[layer].softcap === undefined) layers[layer].softcap = new Decimal("e1e7");
	if(layers[layer].softcapPower === undefined) layers[layer].softcapPower = new Decimal("0.5");
	if(layers[layer].displayRow === undefined) layers[layer].displayRow = layers[layer].row;
	if(layers[layer].name === undefined) layers[layer].name = layer;
	if(layers[layer].layerShown === undefined) layers[layer].layerShown = true;
	if(layers[layer].glowColor === undefined) layers[layer].glowColor = defaultGlow;

	let row = layers[layer].row;

	let displayRow = layers[layer].displayRow;

	if(!ROW_LAYERS[row]) ROW_LAYERS[row] = {};
	if(!TREE_LAYERS[displayRow] && !isNaN(displayRow)) TREE_LAYERS[displayRow] = [];
	if(!OTHER_LAYERS[displayRow] && isNaN(displayRow)) OTHER_LAYERS[displayRow] = [];

	ROW_LAYERS[row][layer]=layer;
	let position = (layers[layer].position !== undefined ? layers[layer].position : layer);
	
	if (!isNaN(displayRow) || displayRow < 0) TREE_LAYERS[displayRow].push({layer: layer, position: position});
	else OTHER_LAYERS[displayRow].push({layer: layer, position: position});

	if (maxRow < layers[layer].displayRow) maxRow = layers[layer].displayRow;
}



function addLayer(layerName, layerData, tabLayers = null) { // Call this to add layers from a different file!
	layers[layerName] = layerData;
	layers[layerName].isLayer = true;
	if (tabLayers !== null) {
		let format = {};
		for (id in tabLayers) {
			layer = tabLayers[id];
			format[(layers[layer].name ? layers[layer].name : layer)] = {
				embedLayer: layer,
				buttonStyle() {
					if (!tmp[this.embedLayer].nodeStyle) return {'border-color': tmp[this.embedLayer].color};
					else {
						style = tmp[this.embedLayer].nodeStyle;
						if (style['border-color'] === undefined) style['border-color'] = tmp[this.embedLayer].color;
						return style;
					} 
				},
				unlocked() {return tmp[this.embedLayer].layerShown;},
			};       
		}
		layers[layerName].tabFormat = format;
	}
}

function addNode(layerName, layerData) { // Does the same thing, but for non-layer nodes
	layers[layerName] = layerData;
	layers[layerName].isLayer = false;
}

// If data is a function, return the result of calling it. Otherwise, return the data.
function readData(data, args=null) {
	if ((!!data && data.constructor && data.call && data.apply))
		return data(args);
	else
		return data;
}

function setRowCol(upgrades) {
	if (upgrades.rows && upgrades.cols) return;
	let maxRow = 0;
	let maxCol = 0;
	for (up in upgrades) {
		if (!isNaN(up)) {
			if (Math.floor(up/10) > maxRow) maxRow = Math.floor(up/10);
			if (up%10 > maxCol) maxCol = up%10;
		}
	}
	upgrades.rows = maxRow;
	upgrades.cols = maxCol;
}

function someLayerUnlocked(row) {
	for (layer in ROW_LAYERS[row])
		if (player[layer].unlocked)
			return true;
	return false;
}


// This isn't worth making a .ts file over
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;


addLayer("info-tab", {
	tabFormat: ["info-tab"],
	row: "otherside"
});

addLayer("options-tab", {
	tabFormat: ["options-tab"],
	row: "otherside"
});

addLayer("changelog-tab", {
	tabFormat() {return ([["raw-html", modInfo.changelog]]);},
	row: "otherside"
});