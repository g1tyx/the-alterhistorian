addLayer("origin", {
	tooltip: "Origin",
	contains: ["earth", "water", "air", "fire", "emblems"],

	startData() {
		return {
			unlocked: true,
			displayTab: ""
		};
	},
	row: 9999,
	symbol: "Ø",
	color: "#000",
	nodeStyle: Templates.nodeStyle.dark,
	shouldNotify: Templates.groupShouldNotify,
	elGroup: true,

	tabFormat: [["raw-html", "<h1>Origin</h1>"], "blank", "blank", ["tree",
		[["air", "blank-nomargin", "fire"],
			["blank-nomargin", "emblems", "blank-nomargin"],
			["water", "blank-nomargin", "earth"]]],
	["blank", "30px"], "process-tab"],
	branches: Templates.branchesCircle
});
addLayer("secondary", {
	tooltip: "Secondary",
	contains: ["mud", "ice", "steam", "magma", "sand", "void", "merger"],

	startData() {
		return {
			unlocked: false,
			displayTab: ""
		};
	},
	row: 9999,
	symbol: "S",
	color: "#000",
	nodeStyle: Templates.nodeStyle.dark,
	layerShown() {
		return player.secondary.unlocked;
	},
	update() {
		if (!player.secondary.unlocked && player.earth.points.gte(1920)) player.secondary.unlocked = true;
	},
	shouldNotify: Templates.groupShouldNotify,
	elGroup: true,
	
	tabFormat: [["raw-html", "<h1>Secondary</h1>"], "blank", "blank", ["tree", [
		["steam", "void", "sand"],
		["ice", "merger", "magma"],
		["mud"]
	]],
	["blank", "30px"], "process-tab"
	],
	branches: Templates.branchesCircle
});
addLayer("magicia", {
	tooltip: "Magicia",
	contains: ["hex", "shell", "fluid"],

	startData() {
		return {
			unlocked: false,
			displayTab: ""
		};
	},
	row: 9999,
	symbol: "M",
	color: "#303",
	nodeStyle: {...Templates.nodeStyle.dark, "background-color": "#303"},
	layerShown() {
		return player.magicia.unlocked;
	},
	update() {
		if (!player.magicia.unlocked && player.emblems.points.gt(0)) player.magicia.unlocked = true;
	},
	shouldNotify: Templates.groupShouldNotify,
	elGroup: true,
	
	tabFormat: [["raw-html", "<h1>Magicia</h1>"], "blank", "blank", ["tree", [
		["hex"],
		["blank"],
		["shell", "fluid"]]],
	["blank", "30px"], "process-tab"
	],
	branches: Templates.branchesCircle
});

const elementGroups = ["origin", "secondary", "magicia"];