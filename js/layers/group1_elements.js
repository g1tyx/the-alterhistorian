const zerop001 = D(0.001);

addLayer("mud", {
	image: "assets/group1/mud.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Swamp",
	position: 0,
	onClick() {
		player.secondary.displayTab = "mud";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#9E7E6C",
	resource: "Mud",
	row: 0,
	layerShown() {return player.mud.unlocked ? "troll" : "ghost";},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},

	processes: {
		layout: [["con", "asi"]],
		con: {
			title() {
				return this.titles[player.mud.buyables.con.toString()];
			},
			titles: ["Forced Mud Conversion",
				"Forced Mud Conversion",
				"Lossful Mud Conversion",
				"Alt. Mud Assimilation",
				"Lossless Mud Conversion"],
			requires: {
				steam: {
					amt() {
						if (hasUpgrade("mud", "con", 4)) return D(0.8).mul(tmp.mud.speedMult);
						return D(0.3).mul(tmp.mud.speedMult);
					},
					cap() {
						const s = player.mud.processes.con.sliders.sand_req;
						if (s == 0) return zerop001;
						return D(s*10);
					}
				},
				sand: {
					amt() {
						if (hasUpgrade("mud", "con", 4)) return D(0.8).mul(tmp.mud.speedMult);
						return D(0.3).mul(tmp.mud.speedMult);
					},
					cap() {
						const s = player.mud.processes.con.sliders.sand_req;
						if (s == 0) return zerop001;
						return D(s*10);
					},
					slider() {
						return hasUpgrade("mud", "con", 1);
					},
					sliderDefault: "0.15"
				}
			},
			produces: {
				mud: {
					...Templates.dynAmt,
					amtTiers: [D(0.45), D(0.45), D(0.55), D(0.59), D(1.6)],
					capTiers: [D(12), D(12), D(12.5), D(16)],
					amtMult() {
						return isActive("hex", "ftv") ? D(1.5) : decimalOne;
					}
				}
			}
		},
		asi: {
			title: "Mud Assimilation",
			requires: {
				mud: {
					...Templates.dynAmt,
					amtTiers: [D(0.4)],
					capTiers: [D(1)]
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				mud: {
					...Templates.dynAmt,
					amtTiers: [D(0.8)],
					capTiers: [D(6)]
				}
			}
		}
	},
	upgrades: {
		con: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {mud: 4, steam: 2.5, sand: 2.5}
		},
		asi: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {mud: 1.5, earth: 2000, water: 2000}
		}
	},
	buyables: {
		con: {
			...Templates.upgrade,
			costTable: [{earth: 3500, water: 3500}, {mVacuum: 0.3},
				{eVacuum: 2, mud: 13.5}, {earth: 90000, water: 90000, hex: 0.5}],
			purchaseLimit: 4
		}
	},

	update() {
		if (player.mud.points.gt(0) && !player.mud.unlocked)
			player.mud.unlocked = true;
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("mud", "con");
	}
});

addLayer("ice", {
	image: "assets/group1/ice.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Refrigerator",
	position: 0,
	onClick() {
		player.secondary.displayTab = "ice";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#42AFAF",
	resource: "Ice",
	row: 0,
	layerShown() {return player.ice.unlocked ? "troll" : "ghost";},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},
	
	processes: {
		layout: [["con", "asi"]],
		con: {
			title() {
				return this.titles[player.ice.buyables.con.toString()];
			},
			titles: ["Forced Ice Conversion",
				"Forced Ice Conversion",
				"Lossful Ice Conversion",
				"Alt. Ice Assimilation",
				"Lossless Ice Conversion"],
			requires: {
				mud: {
					amt() {
						if (hasUpgrade("ice", "con", 4)) return D(0.8).mul(tmp.ice.speedMult);
						return D(0.6).mul(tmp.ice.speedMult);
					},
					cap() {
						const s = player.ice.processes.con.sliders.mud_req;
						if (s == 0) return zerop001;
						return D(s*10);
					},
					slider() {
						return hasUpgrade("ice", "con", 1);
					},
					sliderDefault: "0.15"
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				},
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				ice: {
					...Templates.dynAmt,
					amtTiers: [D(0.45), D(0.45), D(0.55), D(0.59), D(0.8)],
					capTiers: [D(12), D(12), D(12.5), D(16)],
					amtMult() {
						return isActive("hex", "ftv") ? D(1.5) : decimalOne;
					}
				}
			}
		},
		asi: {
			title: "Ice Assimilation",
			requires: {
				ice: {
					...Templates.dynAmt,
					amtTiers: [D(0.4)],
					capTiers: [D(1)]
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				},
				air: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				ice: {
					...Templates.dynAmt,
					amtTiers: [D(0.8)],
					capTiers: [D(6)]
				}
			}
		}
	},
	upgrades: {
		con: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {ice: 4, mud: 4}
		},
		asi: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {ice: 1.5, water: 2000, air: 2000}
		}
	},
	buyables: {
		con: {
			...Templates.upgrade,
			costTable: [{water: 3500, air: 3500}, {mVacuum: 0.3},
				{eVacuum: 2, ice: 12.1}, {water: 90000, air: 90000, hex: 0.5}],
			purchaseLimit: 4
		}
	},

	update() {
		if (player.ice.points.gt(0) && !player.ice.unlocked) {
			player.ice.unlocked = true;
			updEl(this.layer);
		}
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("ice", "con");
	}
});

addLayer("steam", {
	image: "assets/group1/steam.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Boiler",
	position: 0,
	onClick() {
		player.secondary.displayTab = "steam";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#A5A5C8",
	resource: "Steam",
	row: 0,
	layerShown() {return player.steam.unlocked ? "troll" : "ghost";},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},
	
	processes: {
		layout: [["con", "asi"]],
		con: {
			title() {
				return this.titles[player.steam.buyables.con.toString()];
			},
			titles: ["Forced Steam Conversion",
				"Forced Steam Conversion",
				"Lossful Steam Conversion",
				"Alt. Steam Assimilation",
				"Lossless Steam Conversion"],
			requires: {
				ice: {
					amt() {
						if (hasUpgrade("steam", "con", 4)) return D(0.8).mul(tmp.magma.speedMult);
						return D(0.6).mul(tmp.magma.speedMult);
					},
					cap() {
						const s = player.steam.processes.con.sliders.ice_req;
						if (s == 0) return zerop001;
						return D(s*10);
					},
					slider() {
						return hasUpgrade("steam", "con", 1);
					},
					sliderDefault: "0.15"
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				},
				air: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				steam: {
					...Templates.dynAmt,
					amtTiers: [D(0.45), D(0.45), D(0.55), D(0.59), D(0.8)],
					capTiers: [D(12), D(12), D(12.5), D(16)],
					amtMult() {
						return isActive("hex", "ftv") ? D(1.5) : decimalOne;
					}
				}
			}
		},
		asi: {
			title: "Steam Assimilation",
			requires: {
				steam: {
					...Templates.dynAmt,
					amtTiers: [D(0.4)],
					capTiers: [D(1)]
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				},
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				steam: {
					...Templates.dynAmt,
					amtTiers: [D(0.8)],
					capTiers: [D(6)]
				}
			}
		}
	},
	upgrades: {
		con: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {steam: 4, ice: 4}
		},
		asi: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {steam: 1.5, water: 2000, fire: 2000}
		}
	},
	buyables: {
		con: {
			...Templates.upgrade,
			costTable: [{water: 3500, fire: 3500}, {mVacuum: 0.3},
				{eVacuum: 2, steam: 13}, {water: 90000, fire: 90000, hex: 0.5}],
			purchaseLimit: 4
		}
	},

	update() {
		if (player.steam.points.gt(0) && !player.steam.unlocked)
			player.steam.unlocked = true;
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("steam", "con");
	}
});

addLayer("magma", {
	image: "assets/group1/magma.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Volcano",
	position: 0,
	onClick() {
		player.secondary.displayTab = "magma";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#D8582D",
	resource: "Magma",
	row: 0,
	layerShown() {return player.magma.unlocked ? "troll" : "ghost";},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},
	
	processes: {
		layout: [["con", "asi"]],
		con: {
			title() {
				return this.titles[player.magma.buyables.con.toString()];
			},
			titles: ["Forced Magma Conversion",
				"Forced Magma Conversion",
				"Lossful Magma Conversion",
				"Alt. Magma Assimilation",
				"Lossless Magma Conversion"],
			requires: {
				mud: {
					amt() {
						if (hasUpgrade("magma", "con", 4)) return D(0.8).mul(tmp.sand.speedMult);
						return D(0.6).mul(tmp.sand.speedMult);
					},
					cap() {
						const s = player.magma.processes.con.sliders.mud_req;
						if (s == 0) return zerop001;
						return D(s*10);
					},
					slider() {
						return hasUpgrade("magma", "con", 1);
					},
					sliderDefault: "0.15"
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				},
				air: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				magma: {
					...Templates.dynAmt,
					amtTiers: [D(0.45), D(0.45), D(0.55), D(0.59), D(0.8)],
					capTiers: [D(12), D(12), D(12.5), D(16)],
					amtMult() {
						return isActive("hex", "ftv") ? D(1.5) : decimalOne;
					}
				}
			}
		},
		asi: {
			title: "Magma Assimilation",
			requires: {
				magma: {
					...Templates.dynAmt,
					amtTiers: [D(0.4)],
					capTiers: [D(1)]
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				},
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				magma: {
					...Templates.dynAmt,
					amtTiers: [D(0.8)],
					capTiers: [D(6)]
				}
			}
		}
	},
	upgrades: {
		con: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {mud: 4, magma: 4}
		},
		asi: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {magma: 1.5, earth: 2000, fire: 2000}
		}
	},
	buyables: {
		con: {
			...Templates.upgrade,
			costTable: [{earth: 3500, fire: 3500}, {mVacuum: 0.3},
				{eVacuum: 2, magma: 12.1}, {earth: 90000, fire: 90000, hex: 0.5}],
			purchaseLimit: 4
		}
	},

	update() {
		if (player.magma.points.gt(0) && !player.magma.unlocked)
			player.magma.unlocked = true;
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("magma", "con");
	}
});

addLayer("sand", {
	image: "assets/group1/sand.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Pulverizer",
	position: 0,
	onClick() {
		player.secondary.displayTab = "sand";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#F4CE74",
	resource: "Sand",
	row: 0,
	layerShown() {return player.sand.unlocked ? "troll" : "ghost";},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},
	
	processes: {
		layout: [["con", "asi"]],
		con: {
			title() {
				return this.titles[player.sand.buyables.con.toString()];
			},
			titles: ["Forced Sand Conversion",
				"Forced Sand Conversion",
				"Lossful Sand Conversion",
				"Alt. Sand Assimilation",
				"Lossless Sand Conversion"],
			requires: {
				magma: {
					amt() {
						if (hasUpgrade("sand", "con", 4)) return D(0.8).mul(tmp.sand.speedMult);
						return D(0.6).mul(tmp.sand.speedMult);
					},
					cap() {
						const s = player.sand.processes.con.sliders.magma_req;
						if (s == 0) return zerop001;
						return D(s*10);
					},
					slider() {
						return hasUpgrade("sand", "con", 1);
					},
					sliderDefault: "0.15"
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				},
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(70)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				sand: {
					...Templates.dynAmt,
					amtTiers: [D(0.45), D(0.45), D(0.55), D(0.59), D(0.8)],
					capTiers: [D(12), D(12), D(12.5), D(16)],
					amtMult() {
						return isActive("hex", "ftv") ? D(1.5) : decimalOne;
					}
				}
			}
		},
		asi: {
			title: "Sand Assimilation",
			requires: {
				sand: {
					...Templates.dynAmt,
					amtTiers: [D(0.4)],
					capTiers: [D(1)]
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				},
				air: {
					...Templates.dynAmt,
					amtTiers: [D(100)],
					capTiers: [D(1500)]
				}
			},
			produces: {
				sand: {
					...Templates.dynAmt,
					amtTiers: [D(0.8)],
					capTiers: [D(6)]
				}
			}
		}
	},
	upgrades: {
		con: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {magma: 4, sand: 4}
		},
		asi: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {sand: 1.5, earth: 2000, air: 2000}
		}
	},
	buyables: {
		con: {
			...Templates.upgrade,
			costTable: [{earth: 3500, air: 3500}, {mVacuum: 0.3},
				{eVacuum: 2, sand: 13}, {earth: 90000, air: 90000, hex: 0.5}],
			purchaseLimit: 4
		}
	},

	update() {
		if (player.sand.points.gt(0) && !player.sand.unlocked)
			player.sand.unlocked = true;
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("sand", "con");
	}
});

addLayer("mVacuum", {
	resource: "Matter Vacuum",
	color: "#BBBBBB",
	startData() {
		return {
			points: D(0),
			unlocked: false,
		};
	},
	connected: "void",
	row: 0
});
addLayer("eVacuum", {
	resource: "Energy Vacuum",
	color: "#DDDDDD",
	startData() {
		return {
			points: D(0),
			unlocked: false,
		};
	},
	connected: "void",
	row: 0
});
addLayer("void", {
	image: "assets/group1/void.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
		margin: '-5px'
	},
	name: "Voidal Drain",
	position: 0,
	onClick() {
		player.secondary.displayTab = "void";
	},
	speedMult() {
		let base = decimalOne;
		base = base.mul(tmp.fluid.effect.temporal);
		return base;
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#FFFFFF",
	resource: "True Void",
	row: 0,
	layerShown() {return player.void.unlocked;},
	tooltip: "Endless Abyss",

	processes: {
		layout: [
			["infernal", "anni"],
			["exp"]
		],
		infernal: {
			title: "Failed Infernal Merge",
			requires: {
				ice: {
					...Templates.dynAmt,
					amtTiers: [D(0.5), D(0.5), D(0.38), D(0.38), D(0.43)],
					capTiers: [D(9)]
				},
				magma: {
					...Templates.dynAmt,
					amtTiers: [D(0.5), D(0.5), D(0.38), D(0.38), D(0.43)],
					capTiers: [D(9)]
				}
			},
			produces: {
				mVacuum: {
					...Templates.dynAmt,
					amtTiers: [D(0.1), D(0.2), D(0.2), D(0.4), D(0.5)],
					capTiers: [D(1), D(4), D(4), D(10), D(15)]
				},
				mud: {
					...Templates.dynAmt,
					amtTiers: [D(0.12)],
					capTiers: [D(15)],
					disabled() {
						return !hasUpgrade("void", "infernal", 2);
					}
				},
				steam: {
					...Templates.dynAmt,
					amtTiers: [D(0.12)],
					capTiers: [D(15)],
					disabled() {
						return !hasUpgrade("void", "infernal", 2);
					}
				},
				sand: {
					...Templates.dynAmt,
					amtTiers: [D(0.12)],
					capTiers: [D(15)],
					disabled() {
						return !hasUpgrade("void", "infernal", 2);
					}
				}
			},
			color: layers.mVacuum.color,
			displayFill() {
				return player.mVacuum.points.div(tmp.void.processes.infernal.produces.mVacuum.cap);
			}
		},
		anni: {
			title: "Antitype Annihilation",
			requires: {
				mVacuum: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(0.4), D(0.25), D(0.4)],
					cap: D(1)
				},
				earth: {
					...Templates.dynAmt,
					amtTiers: [D(300)],
					capTiers: [D(22222)]
				},
				water: {
					...Templates.dynAmt,
					amtTiers: [D(300)],
					capTiers: [D(22222)]
				},
				air: {
					...Templates.dynAmt,
					amtTiers: [D(300)],
					capTiers: [D(22222)]
				},
				fire: {
					...Templates.dynAmt,
					amtTiers: [D(300)],
					capTiers: [D(22222)]
				}
			},
			produces: {
				eVacuum: {
					...Templates.dynAmt,
					amtTiers: [D(0.07), D(0.15), D(0.4)],
					capTiers: [D(1), D(3), D(5)]
				}
			},
			color: layers.eVacuum.color
		},
		exp: {
			title: "Elementary Expulsion",
			requires: {
				eVacuum: {
					amt() {return tmp.void.processes.anni.produces.eVacuum.amt;},
					cap() {
						const s = player.void.processes.exp.sliders.eVacuum_req;
						if (s == 0) return zerop001;
						return D(s*2);
					},
					slider: true
				}
			},
			produces: {
				mVacuum: {
					amt() {return tmp.void.processes.anni.requires.mVacuum.amt.mul(0.6);},
					cap() {
						return tmp.void.processes.infernal.produces.mVacuum.cap;
					}
				}
			},
			color: "#999999"
		}
	},
	upgrades: {
		infernal: {
			...Templates.locked,
			color: layers.mVacuum.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {earth: 1.6e4, water: 1.6e4, air: 1.6e4, fire: 1.6e4},
		},
		anni: {
			...Templates.locked,
			color: layers.eVacuum.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {mud: 12.5, steam: 12.5, sand: 12.5},
		},
		exp: {
			...Templates.locked,
			color: "#999999",
			tooltip: Templates.upgradeCostTooltip,
			cost: {hex: 0.1},
		}
	},
	buyables: {
		infernal: {
			...Templates.upgrade,
			color: layers.mVacuum.color,
			costTable: [{mVacuum: 1, steam: 12.5, sand: 12.5},
				{mVacuum: 4, mud: 1, ice: 1, steam: 1, magma: 1, sand: 1},
				{eVacuum: 0.1, steam: 15, sand: 15},
				{emblems: 1, hex: 2}],
			purchaseLimit: 4
		},
		anni: {
			...Templates.upgrade,
			color: layers.eVacuum.color,
			costTable: [{mVacuum: 8}, {hex: 4, mud: 15.6}],
			purchaseLimit: 2
		}
	},

	update() {
		if (player.secondarylore.chapters.day21.u && !player.void.unlocked) {
			player.void.unlocked = true;
			player.mVacuum.unlocked = true;
			player.eVacuum.unlocked = true;
		}
	},
	tabFormat: [["layer-proxy", ["mVacuum", [["main-display", 2]]]],
		["layer-proxy", ["eVacuum", [["main-display", 2]]]],
		["main-display", 2], "processes"],
	attachToCircle: "secondary",
	branches: Templates.branches,
	shouldNotify() {
		return canBuyBuyable("void", "infernal") || canBuyBuyable("void", "anni");
	}
});


const mergeReq = {amt: D(1), cap: D(8)}, mergeProd = {...Templates.dynAmt, amtTiers: [D(0.12), D(0.27)], capTiers: [D(1), D(2)]};
addLayer("merger", {
	image: "assets/group1/merger.png",
	nodeStyle: {...Templates.nodeStyle.machine},
	name: "Emblem Merger",
	position: 0,
	onClick() {
		player.secondary.displayTab = "merger";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#B26CCC",
	resource: "Merge Power",
	row: 0,
	layerShown() {return player.secondary.unlocked;},
	tooltip: "Merger",

	processes: {
		layout: [
			["mudMerge"],
			["iceMerge", "steamMerge"],
			["magmaMerge", "sandMerge"]
		],
		mudMerge: {
			title: "Merge: Traces of Mud",
			requires: {
				emblemEarth: {...mergeReq},
				emblemWater: {...mergeReq}
			},
			produces: {
				mud: {...mergeProd}
			},
			whole: true,
			color: layers.mud.color,
		},
		iceMerge: {
			title: "Merge: Traces of Ice",
			requires: {
				emblemWater: {...mergeReq},
				emblemAir: {...mergeReq}
			},
			produces: {
				ice: {...mergeProd}
			},
			whole: true,
			color: layers.ice.color,
		},
		steamMerge: {
			title: "Merge: Traces of Steam",
			requires: {
				emblemWater: {...mergeReq},
				emblemFire: {...mergeReq}
			},
			produces: {
				steam: {...mergeProd}
			},
			whole: true,
			color: layers.steam.color,
		},
		magmaMerge: {
			title: "Merge: Traces of Magma",
			requires: {
				emblemEarth: {...mergeReq},
				emblemFire: {...mergeReq}
			},
			produces: {
				magma: {...mergeProd}
			},
			whole: true,
			color: layers.magma.color,
		},
		sandMerge: {
			title: "Merge: Traces of Sand",
			requires: {
				emblemEarth: {...mergeReq},
				emblemAir: {...mergeReq}
			},
			produces: {
				sand: {...mergeProd}
			},
			whole: true,
			color: layers.sand.color,
		}
	},
	upgrades: {
		mudMerge: {
			...Templates.locked,
			color: layers.mud.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				earth: 1920,
				water: 1920
			}
		},
		iceMerge: {
			...Templates.locked,
			color: layers.ice.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				water: 1920,
				air: 1920,
			}
		},
		steamMerge: {
			...Templates.locked,
			color: layers.steam.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				water: 1920,
				fire: 1920,
			}
		},
		magmaMerge: {
			...Templates.locked,
			color: layers.magma.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				earth: 1920,
				fire: 1920,
			}
		},
		sandMerge: {
			...Templates.locked,
			color: layers.sand.color,
			tooltip: Templates.upgradeCostTooltip,
			cost: {
				earth: 1920,
				air: 1920,
			}
		}
	},
	buyables: {
		mudMerge: {
			...Templates.upgrade,
			color: layers.mud.color,
			costTable: [{earth: 2345, water: 2345, mud: 0.48}],
			purchaseLimit: 1
		},
		iceMerge: {
			...Templates.upgrade,
			color: layers.ice.color,
			costTable: [{water: 2345, air: 2345, ice: 0.48}],
			purchaseLimit: 1
		},
		steamMerge: {
			...Templates.upgrade,
			color: layers.steam.color,
			costTable: [{water: 2345, fire: 2345, emblemWater: 8, emblemFire: 8}],
			purchaseLimit: 1
		},
		magmaMerge: {
			...Templates.upgrade,
			color: layers.magma.color,
			costTable: [{earth: 2345, fire: 2345, magma: 0.48}],
			purchaseLimit: 1
		},
		sandMerge: {
			...Templates.upgrade,
			color: layers.sand.color,
			costTable: [{earth: 2345, air: 2345, emblemEarth: 8, emblemAir: 8}],
			purchaseLimit: 1
		}
	},
	shouldNotify() {
		return canBuyBuyable("merger", "mudMerge") || canBuyBuyable("merger", "iceMerge") || canBuyBuyable("merger", "steamMerge") || canBuyBuyable("merger", "magmaMerge") || canBuyBuyable("merger", "sandMerge");
	},

	update() {
		if (player.secondary.unlocked && !player.merger.unlocked)
			player.merger.unlocked = true;
	},
	tabFormat: ["processes"],
	attachToCircle: "secondary",
	branches: Templates.branches
});