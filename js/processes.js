function tickProcesses(diff) {
	diff = Math.min(diff, 2);
	let activeProcesses = [], updateCurrencies = [];
	for (let l in layers) {
		if (!player[l].points) continue;
		if (!player[l].unlocked) continue;
		updateATCMaxed(l, player[l].points.sub(tmp[l].usage.mul(diff/20)));
	}
	for (let l in layers) {
		for (let p in tmp[l].processes) {
			const prcs = tmp[l].processes[p];
			if (!isPlainObject(prcs)) continue;
			if (!prcs.active) continue;
			activeProcesses.push(prcs);

			prcs.maxProduction = layers[l].processes[p].maxProduction(diff);
		}
	}
	let prevMud = player.mud.points;
	for (let prcs of activeProcesses) {
		if (!isPlainObject(prcs)) continue;
		if (!prcs.active) continue;

		let newDiff = diff;
		
		if (prcs.whole) newDiff = prcs.maxProduction.floor().min(1);
		else newDiff = prcs.maxProduction.min(newDiff);

		for (let c in prcs.requires) {
			if (prcs.requires[c].disabled || prcs.produces[c]) continue;
			player[c].points = player[c].points.sub(prcs.requires[c].amt.mul(newDiff));
			if (!updateCurrencies.includes(c)) updateCurrencies.push(c);
		}
		prcs.diff = newDiff;
	}
	/*for (let i = 0; i < 3; i++) {
		for (let i of updateCurrencies) {
			updateActiveTmpCurrency(i);
			for (let p of layers[i].productionProcesses) {
				tmp[p[0]].processes[p[1]].maxProduction = layers[p[0]].processes[p[1]].maxProduction();
			}
		}
		updateCurrencies = [];
		for (let l in layers) {
			for (let p in tmp[l].processes) {
				const prcs = tmp[l].processes[p];
				if (!isPlainObject(prcs)) continue;
				if (!prcs.active || activeProcesses.includes(prcs)) continue;
				let newDiff = diff;
				activeProcesses.push(prcs);
	
				if (prcs.whole) newDiff = prcs.maxProduction.floor().min(1);
				else newDiff = prcs.maxProduction.min(newDiff);
				player[l].processes[p].lastUsed = Date.now();
	
				for (let c in prcs.requires) {
					if (prcs.requires[c].disabled) continue;
					player[c].points = player[c].points.sub(prcs.requires[c].amt.mul(newDiff));
					if (!updateCurrencies.includes(c)) updateCurrencies.push(c);
				}
				prcs.diff = newDiff;
			}
		}
	}*/
	for (let prcs of activeProcesses) {
		let newDiff = prcs.diff;

		for (let c in prcs.produces) {
			if (prcs.produces[c].disabled) continue;
			let amt = prcs.produces[c].amt;
			if (prcs.requires[c]) amt = amt.sub(prcs.requires[c].amt);
			addPoints(c, amt.mul(newDiff).min(prcs.produces[c].cap.mul(1.005).sub(player[c].points).max(0)));
			player[c].points.m = Number(player[c].points.m.toFixed(8));
			player[prcs.layer].processes[prcs.id].lastUsed = Date.now();
		}
	}
	//mudStuff.push(player.mud.points.sub(prevMud).div(diff).toNumber());
}
let mudStuff = [];

function isActive(layer, id) {
	return tmp[layer].processes[id].active;
}
function meetsRequirements(layer, id) {
	const prcs = tmp[layer].processes[id];
	for (let i in prcs.requires) {
		if (prcs.requires[i].disabled) continue;
		if (player[i].points.lt(prcs.requires[i].cap)) {
			return false;
		}
	}
	return true;
}
function allMaxed(layer, id) {
	const prcs = tmp[layer].processes[id];
	for (let i in prcs.produces) {
		if (prcs.produces[i].disabled || prcs.produces[i].cap.eq(decimalZero)) continue;
		if (prcs.produces[i].cap.sub(player[i].points).gt(Number.EPSILON)) {
			return false;
		}
	}
	return true;
}

let activeTmp = {};
function setupProcessActiveTemp() {
	for (let layer in layers) {
		const prcss = layers[layer].processes;
		if (!prcss) continue;
		activeTmp[layer] = {};
		for (let p in prcss) {
			let prcs = prcss[p];
			activeTmp[layer][p] = {
				enough: {},
				maxed: {}
			};
			let actv = activeTmp[layer][p];
			for (let c in prcs.requires) {
				actv.enough[c] = {
					yes: player[layer].points.gte(tmp[layer].processes[p].requires[c].cap.mDown()),
					tInst: tmp[layer].processes[p].requires[c]
				};
			}
			for (let c in prcs.produces) {
				actv.maxed[c] = {
					yes: player[layer].points.gte(tmp[layer].processes[p].produces[c].cap.mDown()),
					tInst: tmp[layer].processes[p].produces[c]
				};
			}
		}
	}
}

function updateActiveTmpCurrency(layer) {
	if (layer === undefined) {
		for (let i in layers) {
			updateActiveTmpCurrency(i);
		}
		return;
	}
	let points = player[layer].points;
	updateATCEnough(layer, points);
	updateATCMaxed(layer, points);
}

function updateATCEnough(layer, points) {
	const usages = layers[layer].usages || [];
	for (let u of usages) {
		const l = u[0], p = u[1];
		if (tmp[l].processes[p].requires[layer].disabled) continue;
		const actv = activeTmp[l][p].enough[layer], condition = points.gte(actv.tInst.cap.mDown());
		if (condition ^ actv.yes) {
			let prevPlayerPoints = player[l].points;
			player[l].points = points;
			actv.yes = condition;
			updateProcessActiveTemp(l, p);
			player[l].points = prevPlayerPoints;
		}
	}
}
function updateATCMaxed(layer, points) {
	const productionProcesses = layers[layer].productionProcesses || [];
	for (let u of productionProcesses) {
		const l = u[0], p = u[1], actv = activeTmp[l][p].maxed[layer], condition = points.gte(actv.tInst.cap.mDown());
		if (condition ^ actv.yes) {
			actv.yes = condition;
			let prevPlayerPoints = player[l].points;
			player[l].points = points;
			updateProcessActiveTemp(l, p);
			player[l].points = prevPlayerPoints;
		}
	}
}