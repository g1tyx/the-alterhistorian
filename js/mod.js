const Templates = {
	upgradeCostTooltip() {
		const circle = layers[this.layer].attachToCircle;
		if (player.tab != circle) return;
		if (player[circle].displayTab != this.layer) return;
		if (hasUpgrade(this.layer, this.id)) return;
		let returnText = "<span>";
		let cost = tmp[this.layer].upgrades[this.id].cost;
		if (isPlainObject(cost)) {
			for (let i in cost) {
				if (!player[i].unlocked) returnText += "???";
				else returnText += tmp[i].resource + " " + formatCurrency(player[i].points, i) + "/" + formatCurrency(cost[i], i);
				returnText += "<br>";
			}
			returnText = returnText.substring(0, returnText.length - 4);
		} else {
			cost = D(cost);
			const i = tmp[this.layer].upgrades[this.id].currencyLayer;
			if (cost.eq(0)) returnText += "Free"; 
			else returnText += tmp[i].resource + " " +
				formatCurrency(player[i].points, i) + "/" + formatCurrency(cost, i);
		}
		returnText += "</span>";
		return returnText;
	},
	buyableCostTooltip() {
		const circle = layers[this.layer].attachToCircle;
		if (player.tab != circle) return;
		if (player[circle].displayTab != this.layer) return;
		if (player[this.layer].buyables[this.id].gte(tmp[this.layer].buyables[this.id].purchaseLimit)) return;

		let returnText = "<span>";
		let cost = tmp[this.layer].buyables[this.id].cost;
		for (let i in cost) {
			if (!player[i].unlocked) returnText += "???";
			else returnText += tmp[i].resource + " " + formatCurrency(player[i].points, i) + "/" + formatCurrency(cost[i], i);
			returnText += "<br>";
		}
		returnText = returnText.substring(0, returnText.length - 4);
		returnText += "</span>";
		return returnText;
	},
	nodeStyle: {
		machine: {
			height: '100px',
			width: '100px',
			'background-size': '100px 100px',
			'background-position'() {
				return options.hqTree ? '-2px -2px' : '-4px -4px';
			},
			'box-shadow'() {
				if (player[tmp[this.layer].attachToCircle].displayTab == this.layer) {
					return '0px 0px 15px 2px #fd7';
				}
			}
		},
		dark: {
			'border-color': 'rgba(255, 255, 255, 0.25)',
			'color': 'rgba(255, 255, 255, 0.8)'
		}
	},
	clickable: {
		height: "120px",
		width: "120px"
	},
	locked: {
		fullDisplay: " ",
		style: {
			'background-image': 'url(assets/locked.png)',
			'background-position': 'center',
			'background-size': 'cover',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			position: 'absolute'
		},
		currencyInternalName: "points"
	},
	upgrade: {
		style: {
			width: "40px",
			height: "40px",
			'background-image': 'url(assets/upgrade.png)',
			'background-position': 'center',
			'background-size': 'cover',
			'background-repeat': 'no-repeat',
			display: "inline-block",
			'vertical-align': 'middle',
			margin: 0
		},
		typeUpgrade: true,
		display: " ",
		cost() {
			if (player[this.layer].buyables[this.id].gte(this.purchaseLimit)) return 0;
			return this.costTable[player[this.layer].buyables[this.id].toString()];
		},
		canAfford() {
			if (!tmp[this.layer].processes[this.id].unlocked) return false;
			if (player[this.layer].buyables[this.id].gte(this.purchaseLimit)) return false;
			for (let i in tmp[this.layer].buyables[this.id].cost) {
				if (player[i].points.lt(tmp[this.layer].buyables[this.id].cost[i])) return false;
			}
			return true;
		},
		unlocked() {
			return player[this.layer].buyables[this.id].lt(this.purchaseLimit);
		},
		buy() {
			if (tmp[this.layer].buyables[this.id].canAfford) {
				for (let i in tmp[this.layer].buyables[this.id].cost) {
					player[i].points = player[i].points.sub(tmp[this.layer].buyables[this.id].cost[i]);
				}
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1);
			}
			updateTemp();
			updateTemp();
			updateProcessActiveTemp(this.layer, this.id);
		},
		tooltip: null
	},
	dynAmt: {
		amt() {
			const b = player[this.layer].buyables[this.id] || decimalZero;
			let base = this.amtTiers[b.min(this.amtTiers.length - 1).toString()];
			if (this.rp == "produces") base = base.mul(tmp[this.layer].gainMult);
			if (this.amtMult) base = base.mul(tmp[this.layer].processes[this.id][this.rp][this.currencyName].amtMult || 1);
			if (tmp[this.layer].speedMult) base = base.mul(tmp[this.layer].speedMult);
			if (tmp[this.layer].processes[this.id].speedMult) base = base.mul(tmp[this.layer].processes[this.id].speedMult);
			return base;
		},
		cap() {
			const b = player[this.layer].buyables[this.id] || decimalZero;
			let base = this.capTiers[b.min(this.capTiers.length - 1).toString()];
			if (this.rp == "produces") base = base.mul(tmp[this.layer].gainMult);
			if (this.capMult) base = base.mul(tmp[this.layer].processes[this.id][this.rp][this.currencyName].capMult || 1);
			if (tmp[this.layer].globalCapMult) base = base.mul(tmp[this.layer].globalCapMult);
			return base;
		},
	},
	branches() {
		let branches = [];
		for (let i of this.usages) {
			const l = tmp[i[0]].connected || i[0];
			if (Date.now() - player[l].processes[i[1]].lastUsed < 1000 &&
			!tmp[i[0]].processes[i[1]].requires[this.layer].disabled)
				branches.push([l, Templates.branchFunction, tmp[this.layer].color, this.hashedId + hash(i[1])]);
		}
		for (let c of this.connectedResources) {
			for (let i of layers[c].usages) {
				if (Date.now() - player[i[0]].processes[i[1]].lastUsed < 1000 &&
					!tmp[i[0]].processes[i[1]].requires[c].disabled)
					branches.push([i[0], Templates.branchFunction, tmp[c].color, this.hashedId + hash(i[1])]);
			}
		}
		return branches;
	},
	branchesCircle() {
		let branches = [];
		for (let l of this.contains) {
			const layer = layers[l];
			for (let i of layer.usages) {
				const l = tmp[i[0]].connected || i[0];
				if (tmp[l].attachToCircle == this.layer) continue;
				if (Date.now() - player[l].processes[i[1]].lastUsed < 1000 &&
				!tmp[i[0]].processes[i[1]].requires[layer.layer].disabled)
					branches.push([tmp[l].attachToCircle, Templates.branchFunction,
						tmp[layer.layer].color, layer.hashedId + layers[i[0]].hashedId + hash(i[1])]);
			}
			for (let c of layer.connectedResources) {
				for (let i of layers[c].usages) {
					if (tmp[i[0]].attachToCircle == this.layer) continue;
					if (Date.now() - player[i[0]].processes[i[1]].lastUsed < 1000 &&
					!tmp[i[0]].processes[i[1]].requires[c].disabled)
						branches.push([tmp[i[0]].attachToCircle, Templates.branchFunction,
							tmp[c].color, layer.hashedId + layers[i[0]].hashedId + hash(i[1]) + hash(c)]);
				}
			}
		}
		if (this.otherBranches) {
			branches.push(...tmp[this.layer].otherBranches);
		}
		return branches;
	},
	branchFunction(x1, y1, x2, y2) {
		if (x1 == undefined) return;
		const time = Date.now() + tmp[this[0]].hashedId + this[3],
			tb = (Date.now()%2000)/2000;
		x1 += 5*Math.cos(time/2000); y1 += 5*Math.sin(time/2000);
		x2 -= 5*Math.cos(time/2000 + 1.57); y2 -= 5*Math.sin(time/2000 + 1.57);

		const c = ctx, clr = this[2];
		c.strokeStyle = clr + 'aa';
		c.lineWidth = 2;
		c.fillStyle = clr;
		c.beginPath();
		c.moveTo(x1, y1);
		c.lineTo(x2, y2);
		c.stroke();
		ctx.beginPath();
		c.arc(x1*(1 - tb) + x2*tb, y1*(1 - tb) + y2*tb, 4, 0, Math.PI*2);
		c.fill();
	},
	groupShouldNotify() {
		for (let i of this.contains) {
			if (shouldNotify(i)) return true;
		}
		return false;
	}
};
function getScalingMult(layer, id, scale, independCap = false) {
	let base = decimalInfinity;
	for (let i in tmp[layer].processes[id].requires) {
		const r = tmp[layer].processes[id].requires[i];
		if (tmp[layer].processes[id].requires[i].disabled || r.amt.m == 0) continue;
		base = base.min(player[i].points.sub(independCap ? 0 : r.cap).div(r.divisor || 1).max(0.001).mul(scale));
	}

	return base;
}
Templates.upgrade.tooltip = Templates.buyableCostTooltip;
let lastUIUpdate = 0;
let UIupdateElements = ["branches", "shouldNotify"];

let modInfo = {
	name: "The Alterhistorian",
	id: "Scarlet181TMTAlkahistorianRemake",
	author: "Scarlet",
	pointsName: `This is completely irrelevant. There is no such thing as "points" in this game. There is no single centralised currency.
	Why do so many TMT mods focus on the branding instead of the content? I don't want to see the xth iteration of The Y tree with points
	renamed to Y and prestige points renamed to something related. Give me new content, new mechanics!
	You aren't EA games, you're an indie developer! Stop writing the same stuff in every single mod and pretending that it's a new and good idea!`,
	modFiles: ["processes.js",
		"layers/element_groups.js",
		"layers/group0_elements.js",
		"layers/group1_elements.js",
		"layers/magicia_elements.js",
		"tree.js",
		"layers/lore.js",
		"layers/presets.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
};

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "(0, 0.002)",
};

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2</h3><br>
		- Added basic secondary elements.<br>
		- Refactored framework to use a bit less performance (again).<br>
		- Improved element graphics.
	<h3>v0.1</h3><br>
		- Added the emblem mechanic.<br>
		- Refactored framework to use a bit less performance.
	<h3>v0.0</h3><br>
		- Added the game.<br>
		- Base framework remakes.`;

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["usage", "unlockCondition", "active", "maxProduction"];

function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints() {
	return false;
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0);

	let gain = new Decimal(1);
	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
	};
}

// Display extra things at the top of the page
var displayThings = [
];

// Determines when the game "ends"
function isEndgame() {
	return false;
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600); // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}
