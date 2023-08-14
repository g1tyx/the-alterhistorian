addLayer("hex", {
	image: "assets/magicia/hex.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
	},
	name: "Caster",
	position: 0,
	onClick() {
		player.magicia.displayTab = "hex";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			disabled: false
		};
	},
	color: "#FFAAFF",
	resource: "Hexes",
	row: 0,
	layerShown() {return player.hex.unlocked;},

	processes: {
		layout: [
			["btb", "ftv"]
		],
		btb: {
			title: "Back to Basics",
			requires: {
				emblems: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(0.07), D(0.05)],
					cap: D(0.2)
				}
			},
			produces: {
				hex: {
					amt: Templates.dynAmt.amt,
					amtTiers: [D(0.1), D(0.25)],
					cap: D(10)
				}, 
				emblems: {
					amt: D(1e-100),
					cap: decimalInfinity
				}
			},
			producesText() {
				return `x2 to Earth, Water, Air, and Fire generation speed and cap
				<br>
				${format(tmp[this.layer].processes[this.id].produces.hex.amt)} Hexes/s (${format(player.hex.points)}/${format(tmp[this.layer].processes[this.id].produces.hex.cap)})`;
			},
			displayFill() {
				return player.hex.points.div(tmp.hex.processes.btb.produces.hex.cap);
			}
		},
		ftv: {
			title: "Forward to Vacuum",
			requires: {
				mVacuum: {
					amt: D(0.7),
					cap: D(1)
				},
				eVacuum: {
					amt: D(0.1),
					cap: D(1)
				}
			},
			produces: {
				hex: {
					...Templates.dynAmt,
					amtTiers: [D(0.1), D(0.3)],
					capTiers: [D(10), D(20)]
				},
				mVacuum: {
					amt: D(1e-100),
					cap: decimalInfinity
				}
			},
			producesText() {
				return `x1.5 to secondary element conversion efficiency
				<br>
				${format(tmp[this.layer].processes[this.id].produces.hex.amt)} Hexes/s (${format(player.hex.points)}/${format(tmp[this.layer].processes[this.id].produces.hex.cap)})`;
			},
			displayFill() {
				return player.hex.points.div(tmp.hex.processes.ftv.produces.hex.cap);
			}
		}
	},
	upgrades: {
		btb: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {emblems: 0.5}
		},
		ftv: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {mVacuum: 14.4, eVacuum: 1.44}
		}
	},
	buyables: {
		btb: {
			...Templates.upgrade,
			costTable: [{shell: 3}],
			purchaseLimit: 1
		}
	},

	update() {
		if (player.emblems.points.gt(0) && !player.hex.unlocked)
			player.hex.unlocked = true;
	},
	tabFormat: [["main-display", 2], "processes"],
	attachToCircle: "magicia",
	branches: Templates.branches,
	shouldNotify() {
		return;
	},
});

addLayer("shell", {
	image: "assets/magicia/shell.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
	},
	name: "Anticaster",
	position: 0,
	onClick() {
		player.magicia.displayTab = "shell";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			bestSpatial: 1,
			disabled: false
		};
	},
	color: "#2CAC71",
	resource: "Hex Shells",
	row: 0,
	layerShown() {return player.shell.unlocked;},

	effect: {
		spatial() {return D(player.shell.bestSpatial);}
	},

	processes: {
		layout: [
			["drain"]
		],
		drain: {
			title: "Hex Drain",
			requires: {
				hex: {
					amt: D(0.5),
					cap: D(0.001)
				}
			},
			produces: {
				shell: {
					amt: D(0.5),
					cap: D(31)
				}
			}
		}
	},
	upgrades: {
		drain: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {hex: 6, mud: 15.6, ice: 15.6, steam: 15.6, magma: 15.6, sand: 15.6}
		}
	},
	buyables: {},

	milestones: {
		0: {
			requirementDescription() { return "Spatial Anomaly x" + player.shell.bestSpatial;},
			effectDescription() {
				return `${format(Decimal.pow(2, player.shell.bestSpatial))} Hex Shells<br>
				x${format(tmp.shell.effect.spatial)} to primary element cap`;
			},
			done() {
				return player.shell.bestSpatial >= 20;
			}
		}
	},

	update() {
		if (player.shell.best.gte(Decimal.pow(2, player.shell.bestSpatial)) && player.shell.bestSpatial < 20) {
			player.shell.bestSpatial++;
			doPopup("milestone", `Spatial Anomaly x${player.shell.bestSpatial - 1}`, "Milestone Gotten!", 3, tmp.shell.color);
		}

		if (player.hex.points.gte(6) && !player.shell.unlocked)
			player.shell.unlocked = true;
	},
	tabFormat: {
		Production: {
			content: [["main-display", 2], "processes"]
		},
		Relation: {
			content: [["main-display", 2], "milestones"]
		}
	},
	attachToCircle: "magicia",
	branches: Templates.branches,
	shouldNotify() {
		return;
	},
});

addLayer("fluid", {
	image: "assets/magicia/fluid.png",
	nodeStyle: {
		...Templates.nodeStyle.machine,
	},
	name: "Distiller",
	position: 0,
	onClick() {
		player.magicia.displayTab = "fluid";
	},

	startData() {
		return {
			unlocked: false,
			points: D(0),
			bestTemporal: 1,
			disabled: false
		};
	},
	color: "#974DB7",
	resource: "Hex Fluid",
	row: 0,
	layerShown() {return player.fluid.unlocked;},

	effect: {
		temporal() {return D(0.8 + player.fluid.bestTemporal*0.2);}
	},

	processes: {
		layout: [
			["distill"]
		],
		distill: {
			title: "Hex Distillation",
			requires: {
				hex: {
					amt: D(0.5),
					cap: D(0.001)
				}
			},
			produces: {
				fluid: {
					amt: D(0.5),
					cap: D(31)
				}
			}
		}
	},
	upgrades: {
		distill: {
			...Templates.locked,
			tooltip: Templates.upgradeCostTooltip,
			cost: {shell: 15, earth: 3.6e5, water: 3.6e5, air: 3.6e5, fire: 3.6e5}
		}
	},
	buyables: {},

	milestones: {
		0: {
			requirementDescription() { return "Temporal Anomaly x" + player.fluid.bestTemporal;},
			effectDescription() {
				return `${format(Decimal.pow(2, player.fluid.bestTemporal))} Hex Fluid<br>
				x${format(tmp.fluid.effect.temporal)} to all secondary element generation speed`;
			},
			done() {
				return player.fluid.bestTemporal >= 10;
			}
		}
	},

	update() {
		if (player.fluid.best.gte(Decimal.pow(2, player.fluid.bestTemporal)) && player.fluid.bestTemporal < 10) {
			player.fluid.bestTemporal++;
			doPopup("milestone", `Temporal Anomaly x${player.fluid.bestTemporal - 1}`, "Milestone Gotten!", 3, tmp.fluid.color);
		}

		if (player.hex.points.gte(6) && !player.fluid.unlocked)
			player.fluid.unlocked = true;
	},
	tabFormat: {
		Production: {
			content: [["main-display", 2], "processes"]
		},
		Relation: {
			content: [["main-display", 2], "milestones"]
		}
	},
	attachToCircle: "magicia",
	branches: Templates.branches,
	shouldNotify() {
		return;
	},
});
