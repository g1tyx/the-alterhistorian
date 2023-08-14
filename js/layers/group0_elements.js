addLayer("earth", {
	image: "assets/group0/earth.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '5px'
	},
	name: "Crystalliser",
	position: 0,
	onClick() {
		player.origin.displayTab = "earth";
	},

	startData() {
		return {
			unlocked: true,
			points: D(0),
			disabled: false,
		};
	},
	color: "#66CC66",
	resource: "Earth",
	row: 0,
	layerShown() {return true;},
	gainMult() {
		let base = D(1);
		base = base.mul(tmp.emblemEarth.effect);
		return base;
	},
	globalCapMult() {
		let base = isActive("hex", "btb") ? D(2) : decimalOne;
		base = base.mul(tmp.shell.effect.spatial);
		return base;
	},
	speedMult() {
		return isActive("hex", "btb") ? D(2) : decimalOne;
	},

	processes: {
		layout: [
			["rift", "cat"],
			["cat2"]
		],
		rift: {
			title() {
				return this.titles[player.earth.buyables.rift.min(2).toString()];
			},
			titles: [
				"Earth Trickle",
				"Earth Stream",
				"Earth Avalanche",
				"Weak Earth Rift"
			],
			requires: {},
			produces: {
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(1), D(2), D(6.4), D(100)],
					capTiers: [D(20), D(48), D(500), D(750)]
				}
			}
		},
		cat: {
			title: "Simple Earth Conversion",
			requires: {
				earth: {
					amt() {
						let base = hasUpgrade("earth", "cat", 3) ? D(8) : D(2);
						if (hasUpgrade("earth", "cat", 4)) base = getScalingMult("earth", "cat", 0.12).mul(tmp.earth.gainMult);
						base = base.mul(tmp.earth.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("earth", "cat", 3) ? D(80) : D(30);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				},
				fire: {
					amt() {
						let base = hasUpgrade("earth", "cat", 3) ? D(5) : D(3);
						if (hasUpgrade("earth", "cat", 4)) base = getScalingMult("earth", "cat", 0.08);
						base = base.mul(tmp.earth.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("earth", "cat", 3) ? D(80) : D(10);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				}
			},
			produces: {
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(6), D(10), D(10), D(25), D(1)],
					capTiers: [D(100), D(150), D(640), D(1000), D(2e3)],
					amtMult() {
						return hasUpgrade("earth", "cat", 4) ? getScalingMult("earth", "cat", 0.22) : 1;
					}
				}
			}
		},
		cat2: {
			title: "Catalysed Earth Conversion",
			requires: {
				fire: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("earth", "cat2", 1) ? getScalingMult("earth", "cat2", 0.026).mul(tmp.earth.gainMult) : 1;
					},
					cap: D(400)
				},
				earth: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("earth", "cat2", 1) ? getScalingMult("earth", "cat2", 0.026).mul(tmp.earth.gainMult) : 1;
					},
					cap: D(400)
				},
				mud: {
					amt: D(0),
					cap: D(8)
				},
				magma: {
					amt: D(0),
					cap: D(8)
				}
			},
			produces: {
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(80), D(1)],
					capTiers: [D(5e3), D(1.2e4)],
					amtMult() {
						return hasUpgrade("earth", "cat2", 1) ? getScalingMult("earth", "cat2", 0.06) : 1;
					}
				}
			}
		}
	},
	upgrades: {
		rift: {
			fullDisplay: " ",
			style: Templates.locked.style,
			tooltip: "<span>Free</span>",
			cost: 0,
		},
		cat: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 10,
			currencyLayer: "fire",
		},
		cat2: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				mud: 6.6,
				magma: 6.6
			}
		}
	},
	buyables: {
		rift: {
			...Templates.upgrade,
			costTable: [{water: 5}, {emblemEarth: 3}, {mVacuum: 1}],
			purchaseLimit: 3,
		},
		cat: {
			...Templates.upgrade,
			costTable: [{fire: 48}, {earth: 1111}, {mud: 0.72, magma: 0.72}, {eVacuum: 0.7}],
			purchaseLimit: 4,
		},
		cat2: {
			...Templates.upgrade,
			costTable: [{emblemEarth: 20, eVacuum: 1.4}],
			purchaseLimit: 1,
		}
	},
	shouldNotify() {
		return canBuyBuyable("earth", "rift") || canBuyBuyable("earth", "cat") || canBuyBuyable("earth", "cat2");
	},


	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "origin",
	branches: Templates.branches
});

addLayer("water", {
	image: "assets/group0/water.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '5px'
	},
	name: "Liquefier",
	position: 0,
	onClick() {
		player.origin.displayTab = "water";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#74C8E8",
	resource: "Water",
	row: 0,
	layerShown() {return player.water.unlocked ? "troll" : "ghost";},
	gainMult() {
		let base = D(1);
		base = base.mul(tmp.emblemWater.effect);
		return base;
	},
	globalCapMult() {
		let base = isActive("hex", "btb") ? D(2) : decimalOne;
		base = base.mul(tmp.shell.effect.spatial);
		return base;
	},
	speedMult() {
		return isActive("hex", "btb") ? D(2) : decimalOne;
	},

	processes: {
		layout: [
			["rift", "cat"],
			["cat2"]
		],
		rift: {
			title() {
				return this.titles[player.water.buyables.rift.min(3).toString()];
			},
			titles: [
				"Lossful Water Conversion",
				"Water Forced Conversion",
				"Water Stream",
				"Water Avalanche",
				"Weak Water Rift"
			],
			requires: {
				earth: {
					amt: D(2),
					cap: D(5),
					disabled() {
						return hasUpgrade("water", "rift", 2);
					}
				}
			},
			produces: {
				water: {
					...Templates.dynAmt,
					amtTiers: [D(1), D(2), D(2), D(6.4), D(100)],
					capTiers: [D(20), D(48), D(48), D(500), D(750)]
				}
			}
		},
		cat: {
			title: "Simple Water Conversion",
			requires: {
				water: {
					amt() {
						let base = hasUpgrade("water", "cat", 3) ? D(8) : D(2);
						if (hasUpgrade("water", "cat", 4)) base = getScalingMult("water", "cat", 0.12).mul(tmp.water.gainMult);
						base = base.mul(tmp.water.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("water", "cat", 3) ? D(80) : D(30);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				},
				earth: {
					amt() {
						let base = hasUpgrade("water", "cat", 3) ? D(5) : D(3);
						if (hasUpgrade("water", "cat", 4)) base = getScalingMult("water", "cat", 0.08);
						base = base.mul(tmp.water.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("water", "cat", 3) ? D(80) : D(10);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				}
			},
			produces: {
				water: {
					...Templates.dynAmt,
					amtTiers: [D(6), D(10), D(10), D(25), D(1)],
					capTiers: [D(100), D(150), D(640), D(1000), D(2e3)],
					amtMult() {
						return hasUpgrade("water", "cat", 4) ? getScalingMult("water", "cat", 0.22) : 1;
					}
				}
			}
		},
		cat2: {
			title: "Catalysed Water Conversion",
			requires: {
				earth: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("water", "cat2", 1) ? getScalingMult("water", "cat2", 0.026).mul(tmp.water.gainMult) : 1;
					},
					cap: D(400)
				},
				water: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("water", "cat2", 1) ? getScalingMult("water", "cat2", 0.026).mul(tmp.water.gainMult) : 1;
					},
					cap: D(400)
				},
				mud: {
					amt: D(0),
					cap: D(8)
				},
				ice: {
					amt: D(0),
					cap: D(8)
				}
			},
			produces: {
				water: {
					...Templates.dynAmt,
					amtTiers: [D(80), D(1)],
					capTiers: [D(5e3), D(1.2e4)],
					amtMult() {
						return hasUpgrade("water", "cat2", 1) ? getScalingMult("water", "cat2", 0.06) : 1;
					}
				}
			}
		}
	},
	upgrades: {
		rift: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 20,
			currencyLayer: "earth",
		},
		cat: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 120,
			currencyLayer: "earth",
		},
		cat2: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				mud: 6.6,
				ice: 6.6
			}
		}
	},
	buyables: {
		rift: {
			...Templates.upgrade,
			costTable: [{air: 5}, {fire: 10}, {emblemWater: 3}, {mVacuum: 1}],
			purchaseLimit: 4,
		},
		cat: {
			...Templates.upgrade,
			costTable: [{fire: 100}, {water: 1111}, {ice: 0.72, steam: 0.72}, {eVacuum: 0.7}],
			purchaseLimit: 4,
		},
		cat2: {
			...Templates.upgrade,
			costTable: [{emblemWater: 20, eVacuum: 1.4}],
			purchaseLimit: 1,
		}
	},


	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "origin",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("water", "rift") || canBuyBuyable("water", "cat") || canBuyBuyable("water", "cat2");
	},
	update() {
		if (!player.water.unlocked && player.earth.points.gt(0))
			player.water.unlocked = true;
	}
});

addLayer("air", {
	image: "assets/group0/air.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '5px'
	},
	name: "Evaporator",
	position: 0,
	onClick() {
		player.origin.displayTab = "air";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#FFEAAD",
	resource: "Air",
	row: 0,
	layerShown() {return player.air.unlocked ? "troll" : "ghost";},
	gainMult() {
		let base = D(1);
		base = base.mul(tmp.emblemAir.effect);
		return base;
	},
	globalCapMult() {
		let base = isActive("hex", "btb") ? D(2) : decimalOne;
		base = base.mul(tmp.shell.effect.spatial);
		return base;
	},
	speedMult() {
		return isActive("hex", "btb") ? D(2) : decimalOne;
	},

	processes: {
		layout: [
			["rift", "cat"],
			["cat2"]
		],
		rift: {
			title() {
				return this.titles[player.air.buyables.rift.min(3).toString()];
			},
			titles: [
				"Lossful Air Conversion",
				"Air Forced Conversion",
				"Air Stream",
				"Air Avalanche",
				"Weak Air Rift"
			],
			requires: {
				water: {
					amt: D(2),
					cap: D(5),
					disabled() {
						return hasUpgrade("air", "rift", 2);
					}
				}
			},
			produces: {
				air: {
					...Templates.dynAmt,
					amtTiers: [D(1), D(2), D(2), D(6.4), D(100)],
					capTiers: [D(20), D(48), D(48), D(500), D(750)]
				}
			}
		},
		cat: {
			title: "Simple Air Conversion",
			requires: {
				air: {
					amt() {
						let base = hasUpgrade("air", "cat", 3) ? D(8) : D(2);
						if (hasUpgrade("air", "cat", 4)) base = getScalingMult("air", "cat", 0.12).mul(tmp.air.gainMult);
						base = base.mul(tmp.air.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("air", "cat", 3) ? D(80) : D(30);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				},
				water: {
					amt() {
						let base = hasUpgrade("air", "cat", 3) ? D(5) : D(3);
						if (hasUpgrade("air", "cat", 4)) base = getScalingMult("air", "cat", 0.08);
						base = base.mul(tmp.air.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("air", "cat", 3) ? D(80) : D(10);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					},
					divisor() {
						return tmp[this.layer].speedMult;
					}
				}
			},
			produces: {
				air: {
					...Templates.dynAmt,
					amtTiers: [D(6), D(10), D(10), D(25), D(1)],
					capTiers: [D(100), D(150), D(640), D(1000), D(2e3)],
					amtMult() {
						return hasUpgrade("air", "cat", 4) ? getScalingMult("air", "cat", 0.22) : 1;
					}
				}
			}
		},
		cat2: {
			title: "Catalysed Air Conversion",
			requires: {
				water: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("air", "cat2", 1) ? getScalingMult("air", "cat2", 0.026).mul(tmp.air.gainMult) : 1;
					},
					cap: D(400)
				},
				air: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("air", "cat2", 1) ? getScalingMult("air", "cat2", 0.026).mul(tmp.air.gainMult) : 1;
					},
					cap: D(400)
				},
				ice: {
					amt: D(0),
					cap: D(8)
				},
				steam: {
					amt: D(0),
					cap: D(8)
				}
			},
			produces: {
				air: {
					...Templates.dynAmt,
					amtTiers: [D(80), D(1)],
					capTiers: [D(5e3), D(1.2e4)],
					amtMult() {
						return hasUpgrade("air", "cat2", 1) ? getScalingMult("air", "cat2", 0.06) : 1;
					}
				}
			}
		}
	},
	upgrades: {
		rift: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 20,
			currencyLayer: "water",
		},
		cat: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 99,
			currencyLayer: "water",
		},
		cat2: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				ice: 6.6,
				steam: 6.6
			}
		}
	},
	buyables: {
		rift: {
			...Templates.upgrade,
			costTable: [{fire: 5}, {fire: 20}, {emblemAir: 3}, {mVacuum: 1}],
			purchaseLimit: 4,
		},
		cat: {
			...Templates.upgrade,
			costTable: [{water: 150}, {air: 1111}, {ice: 0.72, sand: 0.72}, {eVacuum: 0.7}],
			purchaseLimit: 4,
		},
		cat2: {
			...Templates.upgrade,
			costTable: [{emblemAir: 20, eVacuum: 1.4}],
			purchaseLimit: 1,
		}
	},


	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "origin",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("air", "rift") || canBuyBuyable("air", "cat") || canBuyBuyable("air", "cat2");
	},
	update() {
		if (!player.air.unlocked && player.water.points.gt(0))
			player.air.unlocked = true;
	}
});

addLayer("fire", {
	image: "assets/group0/fire.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '5px'
	},
	name: "Incinerator",
	position: 0,
	onClick() {
		player.origin.displayTab = "fire";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#FF8120",
	resource: "Fire",
	row: 0,
	layerShown() {return player.fire.unlocked ? "troll" : "ghost";},
	gainMult() {
		let base = D(1);
		base = base.mul(tmp.emblemFire.effect);
		return base;
	},
	globalCapMult() {
		let base = isActive("hex", "btb") ? D(2) : decimalOne;
		base = base.mul(tmp.shell.effect.spatial);
		return base;
	},
	speedMult() {
		return isActive("hex", "btb") ? D(2) : decimalOne;
	},

	processes: {
		layout: [
			["rift", "cat"],
			["cat2"]
		],
		rift: {
			title() {
				return this.titles[player.fire.buyables.rift.min(3).toString()];
			},
			titles: [
				"Lossful Fire Conversion",
				"Fire Forced Conversion",
				"Fire Stream",
				"Fire Avalanche",
				"Weak Fire Rift"
			],
			requires: {
				air: {
					amt: D(2),
					cap: D(5),
					disabled() {
						return hasUpgrade("fire", "rift", 2);
					}
				}
			},
			produces: {
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(1), D(2), D(2), D(6.4), D(100)],
					capTiers: [D(20), D(48), D(48), D(500), D(750)]
				}
			}
		},
		cat: {
			title: "Simple Fire Conversion",
			requires: {
				fire: {
					amt() {
						let base = hasUpgrade("fire", "cat", 3) ? D(8) : D(2);
						if (hasUpgrade("fire", "cat", 4)) base = getScalingMult("fire", "cat", 0.12).mul(tmp.fire.gainMult);
						base = base.mul(tmp.fire.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("fire", "cat", 3) ? D(80) : D(30);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				},
				air: {
					amt() {
						let base = hasUpgrade("fire", "cat", 3) ? D(5) : D(3);
						if (hasUpgrade("fire", "cat", 4)) base = getScalingMult("fire", "cat", 0.08);
						base = base.mul(tmp.fire.speedMult);
						return base;
					},
					cap() {
						let base = hasUpgrade("fire", "cat", 3) ? D(80) : D(10);
						base = base.mul(tmp[this.layer].globalCapMult);
						return base;
					}
				}
			},
			produces: {
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(6), D(10), D(10), D(25), D(1)],
					capTiers: [D(100), D(150), D(640), D(1000), D(2e3)],
					amtMult() {
						return hasUpgrade("fire", "cat", 4) ? getScalingMult("fire", "cat", 0.22) : 1;
					}
				}
			}
		},
		cat2: {
			title: "Catalysed Fire Conversion",
			requires: {
				air: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("fire", "cat2", 1) ? getScalingMult("fire", "cat2", 0.026).mul(tmp.fire.gainMult) : 1;
					},
					cap: D(400)
				},
				fire: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(50), D(1)],
					amtMult() {
						return hasUpgrade("fire", "cat2", 1) ? getScalingMult("fire", "cat2", 0.026).mul(tmp.fire.gainMult) : 1;
					},
					cap: D(400)
				},
				magma: {
					amt: D(0),
					cap: D(8)
				},
				sand: {
					amt: D(0),
					cap: D(8)
				}
			},
			produces: {
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(80), D(1)],
					capTiers: [D(5e3), D(1.2e4)],
					amtMult() {
						return hasUpgrade("fire", "cat2", 1) ? getScalingMult("fire", "cat2", 0.06) : 1;
					}
				}
			}
		}
	},
	upgrades: {
		rift: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 20,
			currencyLayer: "air",
		},
		cat: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: 99,
			currencyLayer: "air",
		},
		cat2: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				magma: 6.6,
				sand: 6.6
			}
		}
	},
	buyables: {
		rift: {
			...Templates.upgrade,
			costTable: [{earth: 99}, {fire: 48}, {emblemFire: 3}, {mVacuum: 1}],
			purchaseLimit: 4,
		},
		cat: {
			...Templates.upgrade,
			costTable: [{air: 150}, {fire: 1111}, {steam: 0.72, magma: 0.72}, {eVacuum: 0.7}],
			purchaseLimit: 4,
		},
		cat2: {
			...Templates.upgrade,
			costTable: [{emblemFire: 20, eVacuum: 1.4}],
			purchaseLimit: 1,
		}
	},


	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "origin",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("fire", "rift") || canBuyBuyable("fire", "cat") || canBuyBuyable("fire", "cat2");
	},
	update() {
		if (!player.fire.unlocked && player.air.points.gt(0))
			player.fire.unlocked = true;
	}
});


addLayer("emblems", {
	image: "assets/group0/emblem.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '5px'
	},
	name: "Infuser",
	position: 0,
	onClick() {
		player.origin.displayTab = "emblems";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#CCCCCC",
	resource: "Emblemic Power",
	row: 0,
	layerShown() {return player.emblems.unlocked;},
	tooltip: "Emblems",

	processes: {
		layout: [
			["earthE", "waterE"],
			["airE", "fireE"],
			["emblemE"]
		],
		earthE: {
			title: "Earth Orb Infusion",
			requires: {
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(125), D(250), D(200)],
					capTiers: [D(140), D(400), D(500)]
				}
			},
			produces: {
				emblemEarth: {
					...Templates.dynAmt,
					amtTiers: [D(1)],
					capTiers: [D(3), D(8), D(24), D(63)]
				}
			},
			whole: true,
			color: layers.earth.color,
		},
		waterE: {
			title: "Water Orb Infusion",
			requires: {
				water: {
					...Templates.dynAmt,
					amtTiers: [D(125), D(250), D(200)],
					capTiers: [D(140), D(400), D(500)]
				}
			},
			produces: {
				emblemWater: {
					...Templates.dynAmt,
					amtTiers: [D(1)],
					capTiers: [D(3), D(8), D(24), D(63)]
				}
			},
			whole: true,
			color: layers.water.color,
		},
		airE: {
			title: "Air Orb Infusion",
			requires: {
				air: {
					...Templates.dynAmt,
					amtTiers: [D(125), D(250), D(200)],
					capTiers: [D(140), D(400), D(500)]
				}
			},
			produces: {
				emblemAir: {
					...Templates.dynAmt,
					amtTiers: [D(1)],
					capTiers: [D(3), D(8), D(24), D(63)]
				}
			},
			whole: true,
			color: layers.air.color,
		},
		fireE: {
			title: "Fire Orb Infusion",
			requires: {
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(125), D(250), D(200)],
					capTiers: [D(140), D(400), D(500)]
				}
			},
			produces: {
				emblemFire: {
					...Templates.dynAmt,
					amtTiers: [D(1)],
					capTiers: [D(3), D(8), D(24), D(63)]
				}
			},
			whole: true,
			color: layers.fire.color,
		},
		emblemE: {
			title: "Orb Orb Infusion",
			requires: {
				emblemEarth: {
					...Templates.dynAmt,
					amtTiers: [D(4), D(3)],
					capTiers: [D(24), D(48)]
				},
				emblemWater: {
					...Templates.dynAmt,
					amtTiers: [D(4), D(3)],
					capTiers: [D(24), D(48)]
				},
				emblemAir: {
					...Templates.dynAmt,
					amtTiers: [D(4), D(3)],
					capTiers: [D(24), D(48)]
				},
				emblemFire: {
					...Templates.dynAmt,
					amtTiers: [D(4), D(3)],
					capTiers: [D(24), D(48)]
				}
			},
			produces: {
				emblems: {
					...Templates.dynAmt,
					amtTiers: [D(0.01)],
					capTiers: [D(1), D(1.2)]
				}
			},
			whole: true
		}
	},
	upgrades: {
		earthE: {
			...Templates.locked,
			color: layers.earth.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: 144,
			currencyLayer: "earth",
		},
		waterE: {
			...Templates.locked,
			color: layers.water.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: 144,
			currencyLayer: "water",
		},
		airE: {
			...Templates.locked,
			color: layers.air.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: 144,
			currencyLayer: "air",
		},
		fireE: {
			...Templates.locked,
			color: layers.fire.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: 144,
			currencyLayer: "fire",
		},
		emblemE: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {earth: 59483, water: 59483, air: 59483, fire: 59483, eVacuum: 3}
		}
	},
	buyables: {
		earthE: {
			...Templates.upgrade,
			color: layers.earth.color,
			costTable: [{earth: 800, emblemEarth: 2}, {earth: 1e4}, {mVacuum: 7.5, eVacuum: 2.4}],
			purchaseLimit: 3,
		},
		waterE: {
			...Templates.upgrade,
			color: layers.water.color,
			costTable: [{water: 800, emblemWater: 2}, {water: 1e4}, {mVacuum: 7.5, eVacuum: 2.4}],
			purchaseLimit: 3,
		},
		airE: {
			...Templates.upgrade,
			color: layers.air.color,
			costTable: [{air: 800, emblemAir: 2}, {air: 1e4}, {mVacuum: 7.5, eVacuum: 2.4}],
			purchaseLimit: 3,
		},
		fireE: {
			...Templates.upgrade,
			color: layers.fire.color,
			costTable: [{fire: 800, emblemFire: 2}, {fire: 1e4}, {mVacuum: 7.5, eVacuum: 2.4}],
			purchaseLimit: 3,
		},
		emblemE: {
			...Templates.upgrade,
			costTable: [{emblemEarth: 25, emblemWater: 25, emblemAir: 25, emblemFire: 25, shell: 10}],
			purchaseLimit: 1,
		},
	},

	update() {
		if (hasUpgrade("fire", "cat", 1) && !player.emblems.unlocked) {
			for (let i of emblems) {
				player[i].unlocked = true;
			}
			player.emblems.unlocked = true;
		}
	},
	tabFormat: [["layer-proxy", ["emblemEarth", ["main-display"]]],
		["layer-proxy", ["emblemWater", ["main-display"]]],
		["layer-proxy", ["emblemAir", ["main-display"]]],
		["layer-proxy", ["emblemFire", ["main-display"]]],
		"main-display",
		"processes"],
	attachToCircle: "origin",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("emblems", "earthE") || canBuyBuyable("emblems", "waterE") || canBuyBuyable("emblems", "airE") || canBuyBuyable("emblems", "fireE") || canBuyBuyable("emblems", "emblemE");
	}
});
const emblems = ["emblemEarth", "emblemWater", "emblemAir", "emblemFire"];
for (let c of emblems) {
	addLayer(c, {
		resource: c.split("lem")[1] + " Emblems",
		color: layers[c.split("lem")[1].toLowerCase()].color,
		startData() {
			return {
				points: D(0),
				unlocked: false,
			};
		},
		effect() {
			return player[this.layer].points.add(1).pow(0.5);
		},
		effectDescription() {
			return `boosting ${this.resource.split(" ")[0]} gain and cap by x${format(tmp[this.layer].effect)}`;
		},
		connected: "emblems",
		whole: true,
		row: 0
	});
}