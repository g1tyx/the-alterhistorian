let include = {};
for (let i of elementGroups) {
	for (let j of layers[i].contains) {
		include[j] = false;
	}
}
addLayer("presets", {
	startData() {
		return {
			points: D(0),
			unlocked: true,
			presets: [],
			include: {...include}
		};
	},
	tooltip: "Presets",
	symbol: "✓",
	row: "side",
	color: "#3399ff",

	clickables: {
		new: {
			title: "Add new preset",
			onClick() {
				let affects = [];
				for (let i in player.presets.include) {
					if (player.presets.include[i]) affects.push(i);
				}
				if (affects.length == 0) {
					alert("请在继续之前至少选择一台机器.");
					return;
				}

				let values = {};
				for (let i of affects) {
					values[i] = {};
					for (let p in player[i].processes) {
						values[i][p] = {};
						values[i][p].on = player[i].processes[p].on;
						values[i][p].sliders = {...player[i].processes[p].sliders};
					}
				}
				player.presets.presets.push({
					name: "Preset " + (player.presets.presets.length + 1),
					desc: "",
					affects,
					values
				});
			},
			canClick: true,
			style: {
				"min-height": "40px",
				"width": "150px",
				"border-radius": "5px",
				"margin-bottom": "5px"
			}
		}
	},

	infoboxes: {
		Info: {
			title: "Info",
			body: `Presets are a way to save machine settings, so you can load them later
			without having to manually toggle them yourself.
			<br><br>
			To create a new preset, set all machine settings to the one you want to save in the preset.
			(For example, if you want to turn off the first process that produces Earth from nothing in a preset, go turn that off first.)
			<br>
			Then, choose all the machines you want to save in the preset. This makes loading the preset affect those machines and those machines only.
			In the above example, choose "Crystalliser."
			<br><br>
			After creating a new preset, you can rename the new preset to something more sensible by clicking on its title.`
		}
	}, 

	tabFormat: [["infobox", "Info"], "presets"]
});

function savePreset(preset) {
	for (let i of preset.affects) {
		for (let p in player[i].processes) {
			preset.values[i][p].on = player[i].processes[p].on;
			preset.values[i][p].sliders = {...player[i].processes[p].sliders};
		}
	}
	doPopup("", "Preset saved.", "Presets", 2, "#8bf");
}
function loadPreset(preset) {
	for (let i in preset.values) {
		for (let p in player[i].processes) {
			player[i].processes[p].on = preset.values[i][p].on;
			for (let s in player[i].processes[p].sliders) {
				player[i].processes[p].sliders[s] = preset.values[i][p].sliders[s];
			}
		}
	}
	doPopup("", "Preset \"" + preset.name + "\" loaded.", "Presets", 2, "#8bf");
}
function deletePreset(id) {
	if (confirm("您确定要删除此预设吗？")) player.presets.presets.splice(id, 1);
}
