var layoutInfo = {
	startTab: "none",
	startNavTab: "tree-tab",
	showTree: true,

	treeLayout: [["origin"],
		["secondary", "magicia"]],

	get treeNodes() {
		let r = [];
		for (let i of this.treeLayout) r.push(...i);

		return r;
	}
};


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
	layerShown: "ghost",
	nodeStyle: {
		height: '100px',
		width: '100px',
		margin: '16px'
	}
});
addNode("blank-nomargin", {
	layerShown: "ghost",
	nodeStyle: {
		height: '100px',
		width: '100px',
		margin: "5px"
	}
});


addLayer("tree-tab", {
	tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS);}]],
	previousTab: "",
	leftTab: true,
});