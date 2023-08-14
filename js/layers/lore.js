function ur(d="") {
	return {
		u: d[0] == "t",
		r: d[1] == "t"
	};
}
addLayer("lore", {
	startData() {
		return {
			points: D(0),
			unlocked: true
		};
	},
	tooltip: "Lore",
	symbol: "🕮",
	row: "side",
	color: "#BD5CAC",
	tabFormat: {
		Origin: {
			embedLayer: "originlore",
			onClick() {
				player.originlore.chapters[player.subtabs.originlore.mainTabs].r = true;
			},
		},
		Secondary: {
			embedLayer: "secondarylore",
			onClick() {
				player.secondarylore.chapters[player.subtabs.secondarylore.mainTabs].r = true;
			},
			unlocked() {return player.merger.unlocked;}
		}
	},
	onClick() {
		showTab("lore");
		let s = this.tabFormat[player.subtabs.lore.mainTabs].embedLayer;
		player[s].chapters[player.subtabs[s].mainTabs].r = true;
	},
	shouldNotify() {
		return shouldNotify("originlore") || shouldNotify("secondarylore");
	}
});
addLayer("originlore", {
	startData() {
		return {
			points: D(0),
			unlocked: true,
			chapters: {
				start: ur("t"),
				start1: ur(),
				start2: ur(),
				upgrade: ur(),
				fire: ur(),
				emblems: ur(),
			}
		};
	},
	color: "#BD5CAC",
	infoboxes: {
		start: {
			title: "Origins",
			body: `My country has recently been invaded and taken control of by oppressive militarist rule.<br><br>
			Everything is in a state of chaos and disorder. There are mass demonstrations everywhere.<br>
			Basic resources are rationed and reserved for the army.<br>
			Anyone who doesn't comply with the rule will be arrested, and possibly killed.<br><br>
			The only weakness of the militarists is their lack of knowledge on elemental sciences. They have not limited access to books
			on the subject. I wonder if I can nab a few from the library...`
		},
		start1: {
			title: "The First",
			body: `I found a rusty old crystallising machine in the basement, and I've
			managed to start making some earth by putting a bunch of rocks inside the machine and allowing more to crystalise on it. It's pretty slow though...`,
			unlockCondition() {
				return hasUpgrade("earth", "rift");
			}
		},
		start2: {
			title: "The Second",
			body: `I've uncovered a liquefying machine in the basement.<br><br>I'm not sure what I'm doing wrong though.
			If the texts are correct, it should be able to produce water on its own, but the best I can do is force it to turn earth into water.`,
			unlockCondition() {
				return hasUpgrade("water", "rift");
			}
		},
		upgrade: {
			title: "The Fifth",
			body: `It looks like there's a slot on each machine which can be filled with the next element to make it more efficient.<br>
			With it, my earth and water production is looking good. <br><br>
			I still can't figure out what's wrong with my liquefier and my pressure chamber though.`,
			unlockCondition() {
				return hasUpgrade("water", "rift", 1);
			}
		},
		fire: {
			title: "Universal Reagent",
			body: `The missing piece to the liquefier was fire all along. 
			By putting some fire into another small slot on the side, I've managed to stumble upon a way to synthesize elements from nothing.<br><br>
			With some alchemical magic I can get fire to increase earth gain as well.`,
			unlockCondition() {
				return hasUpgrade("water", "rift", 2);
			}
		},
		emblems: {
			title: "Emblems",
			body: `These past few days have been a success. I found some old elemental compressors from the secret black market I discovered and I have enough elements to fill them.<br><br>
			The texts say that by using compressors with the crystal of the respective element inside them, you can create golems.<br>
			But the crystals are gone, possibly damaged during the invasion or sold for other possessions in a desperate attempt to not go hungry. All I've managed to make using them
			are these dense cores of elements that emit a weird glow which hasn't been documented. I'll call them emblems.<br><br>
			Also, I've noticed something- the texts report that reaction rate is proportional to the amount of reactant, but they always
			seem to stay constant regardless of the amount of reactant I have. I wonder why.`,
			unlockCondition() {
				return player.emblemEarth.points.gte(1) || player.emblemWater.points.gte(1) || player.emblemAir.points.gte(1) || player.emblemFire.points.gte(1);
			}
		},
	},
	shouldNotify() {
		for (let c in player.originlore.chapters) {
			if (player.originlore.chapters[c].u && !player.originlore.chapters[c].r) return true;
		}
		return false;
	},
	tabFormat: {
		"start": {
			title: "Day 0",
			content: [["infobox", "start"]],
			onClick() {
				player.originlore.chapters.start.r = true;
			}
		},
		"start1": {
			title: "Day 1",
			content: [["infobox", "start1"]],
			onClick() {
				player.originlore.chapters.start1.r = true;
			},
			shouldNotify() {return !player.originlore.chapters.start1.r;},
			unlocked() {return player.originlore.chapters.start1.u;}
		},
		"start2": {
			title: "Day 2",
			content: [["infobox", "start2"]],
			onClick() {
				player.originlore.chapters.start2.r = true;
			},
			shouldNotify() {return !player.originlore.chapters.start2.r;},
			unlocked() {return player.originlore.chapters.start2.u;}
		},
		"upgrade": {
			title: "Day 3",
			content: [["infobox", "upgrade"]],
			onClick() {
				player.originlore.chapters.upgrade.r = true;
			},
			shouldNotify() {return !player.originlore.chapters.upgrade.r;},
			unlocked() {return player.originlore.chapters.upgrade.u;}
		},
		"fire": {
			title: "Day 5",
			content: [["infobox", "fire"]],
			onClick() {
				player.originlore.chapters.fire.r = true;
			},
			shouldNotify() {return !player.originlore.chapters.fire.r;},
			unlocked() {return player.originlore.chapters.fire.u;}
		},
		"emblems": {
			title: "Day 8",
			content: [["infobox", "emblems"]],
			onClick() {
				player.originlore.chapters.emblems.r = true;
			},
			shouldNotify() {return !player.originlore.chapters.emblems.r;},
			unlocked() {return player.originlore.chapters.emblems.u;}
		},
	},
	update() {
		for (let i in player.originlore.chapters) {
			if (!player.originlore.chapters[i].u && layers.originlore.infoboxes[i].unlockCondition())
				player.originlore.chapters[i].u = true;
		}
	}
});
addLayer("secondarylore", {
	startData() {
		return {
			points: D(0),
			unlocked: true,
			chapters: {
				start: ur(),
				start1: ur(),
				start2: ur(),
				day21: ur(),
				start3: ur(),
				start4: ur(),
				day28: ur(),
				eVac: ur(),
				day35: ur(),
				day38: ur()
			}
		};
	},
	color: "#BD5CAC",
	infoboxes: {
		start: {
			title: "Secondary",
			body: `I thought it should've been possible to make secondary elements just by directly mixing the primary elements, but how wrong I was.<br><br>
			The primary elements by themselves are immiscible with each other and strongly repel each other when an attempt is made to mix them.<br>
			The best I can do is force a reaction which converts all elements involved into just one element.<br>
			But owing to a special property of the emblems, I can fuse them together using a specialised fusing machine to make secondary elements.`,
			unlockCondition() {
				return player.merger.unlocked;
			},
		},
		start1: {
			title: "Mutualism",
			body: `So it turns out I can use two secondary elements to upgrade the conversion speed of the similar element they represent.<br><br>
			In turn, I can use elements to upgrade the merger to produce more secondary elements. Pretty neat, though I'd really like to get away from the
			inefficient process of emblem merging. It uses way too much primary elements in exchange for just a tiny bit of secondary elements.<br><br>
			I've also noticed that there's no air+fire merge. All the books I can find on elemental sciences have had that part redacted or ripped out. I've tried merging them myself but nothing happened.`,
			unlockCondition() {
				return player.merger.upgrades.length >= 3;
			}
		},
		start2: {
			title: "Secondary II",
			body: `The secondary elements have some weird property that allows them to absorb the two primary elements they were made up of,
			converting them into the secondary element. After a bit of reading, I've found good documentation on this process. It still seems to be rather
			inefficient, and no documentation exists on upgrading them.<br><br>
			Meanwhile, there's the much more versatile element conversions. Unfortunately, they're horribly inefficient at the start, and there haven't been many
			attempts made to generalise the conversion process, so I'll have to figure out the formulae on my own. But combined with the forceful assimilation of primary elements,
			they should be enough to catalyse a more complicated process of producing the primary elements.`,
			unlockCondition() {
				return hasUpgrade("mud", "asi") || hasUpgrade("ice", "asi") || hasUpgrade("steam", "asi") || hasUpgrade("magma", "asi") || hasUpgrade("mud", "asi");
			}
		},
		day21: {
			title: "...",
			body: `Today a few militarymen came for "inspection", presumably checking for any anti-militarist things.<br>
			People say they come biweekly. I was lucky they didn't discover my laboratory, but I'll have to start relocating my laboratory to a more secluded space.<br><br>
			The production of secondary elements is going along slowly. It uses a huge amount of primary elements to make even trace amounts of secondaries.
			I'll have to figure out how to improve them.<br><br>
			There's a particularly interesting element in this text, which the author has named void. It is not described anywhere else, but according to my calculations it should exist.
			The process of creating void involves smashing magma and steam together, which produces a trace amount of void and some mud- Wait, doesn't that mean void is a convoluted form of air + fire?<br>
			I'll have to do some digging.`,
			unlockCondition() {
				return player.earth.points.gte(4000) || player.water.points.gte(4000) || player.air.points.gte(4000) || player.fire.points.gte(4000);
			}
		},
		start3: {
			title: "Void Synthesis",
			body: `It did not work out how I expected it to. I tried merging sand + steam, but all that did was spew elemental waves everywhere, damaging my laboratory.<br>
			I'll have to install some sort of shield to block the propagation of elemental waves. Meanwhile, though, merging ice and magma did give void, but only a really weak version of it. There was also no mud produced.<br>
			Seemingly everything in these texts are outdated in some way, even ones published recently. Surely they can't be leading future alchemists on false trails?<br><br>
			No, that can't be. Doing so would go directly against the oath that an alchemist has to swear before bearing the official title.
			The recipes must have worked when they were first discovered. But why don't they work now?`,
			unlockCondition() {
				return player.mVacuum.points.gt(0);
			}
		},
		start4: {
			title: "Void Usage",
			body: `This new weak substance might not be as useful as void, but it's pretty neat in its own right.<br>
			Its pulling force which is strong enough to hold things together without crushing them, improving the efficiency of the secondary conversions
			by reducing loss of elements to the surroundings. It can also forcefully pull large amount of elements out from rifts.<br><br>
			It could be holding the secret that allows for scaling reaction rates. I'm going to call it a matter vacuum for having properties similar to a vacuum.`,
			unlockCondition() {
				return player.mVacuum.points.gte(0.4);
			}
		},
		day28: {
			title: "...",
			body: `As expected, a couple of militarymen came today again. They didn't find my laboratory, but they nicked a bunch of rations.
			I'm out of food for the next few days.<br><br>
			I notice trace amounts of secondary elements forming around the voidal drain. I wonder if it's possible to extract them to improve the efficiency of the process.`,
			unlockCondition() {
				return player.mVacuum.points.gte(2);
			}
		},
		eVac: {
			title: "Better Vacuum?",
			body: `I accidentally placed a bunch of matter vacuum next to the four primary elements. It sucked them up and caused them to annihilate
			in a brilliant flash of violet light. The resulting substance started sucking all my primary elements towards it, and also sucked energy from the generator
			powering the machines, almost knocking me out.<br><br>
			After containing the substance and doing limited tests with it, I found that its sucking power was enough to bypass the speed of elemental waves in the pipes and
			trigger an exponential feedback loop for the primary elements. If I can fit the right amount into the machines, I could increase primary element production and stop having to worry about them.
			<br><br>I've named the new element an energy vacuum for its ability to suck energy.`,
			unlockCondition() {
				return player.eVacuum.points.gt(0);
			}
		},
		day35: {
			title: "....",
			body: `More inspectors came. They were quiet and didn't nick anything, unlike the last bunch.<br><br>
			I saw one of them leave a small notebook on my desk before leaving. On it was a note that read, "Hi. I'm an alchemist working undercover as an inspector.
			I'm part of the team trying to defeat the regime with elements. Part of my team detected a large amount of elemental waves coming from your region, so I decided to pay a visit.
			I'm impressed with your work. You've discovered new ways to synthesize elements that we never would've thought of.<br>
			"I've decided to help you out a bit by letting you know about our latest discovery, which involves synthesizing alkahest, the universal solvent.
			Alkahest is an extremely useful precursor for going beyond the secondary and voidal elements, but unfortunately, synthesizing alkahest 
			is quite a cumbersome process, and even subject to change over time. This change occurs ever 3-4 years, and mysteriously, every time it's changed, the city of Cassiopeia,
			the birthplace of alchemy, is plunged into complete darkness for a day or two. But that's getting off topic.<br>
			"Anyway, I thought I'd save you some time in discovering it yourself. In the book are some notes on the latest information
			about building a machine to synthesize and contain alkahest. I'll talk more about myself the next time I'm on duty in this region.<br>
			"Most importantly, don't tell anyone about this. You never know who to trust."`,
			unlockCondition() {
				return player.eVacuum.points.gte(2);
			}
		},
		day38: {
			title: ",,,",
			body: `Maybe it's about time I opened that book to see what's inside... Holy hell, you can infuse emblems together? I have to try this out some time soon...`,
			unlockCondition() {
				return player.eVacuum.points.gte(3);
			}
		},
	},
	shouldNotify() {
		for (let c in player.secondarylore.chapters) {
			if (player.secondarylore.chapters[c].u && !player.secondarylore.chapters[c].r) return true;
		}
		return false;
	},
	tabFormat: {
		"start": {
			title: "Day 10",
			content: [["infobox", "start"]],
			onClick() {
				player.secondarylore.chapters.start.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.start.r;}
		},
		"start1": {
			title: "Day 12",
			content: [["infobox", "start1"]],
			onClick() {
				player.secondarylore.chapters.start1.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.start1.r;},
			unlocked() {return player.secondarylore.chapters.start1.u;}
		},
		"start2": {
			title: "Day 16",
			content: [["infobox", "start2"]],
			onClick() {
				player.secondarylore.chapters.start2.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.start2.r;},
			unlocked() {return player.secondarylore.chapters.start2.u;}
		},
		"day21": {
			title: "Day 21",
			content: [["infobox", "day21"]],
			onClick() {
				player.secondarylore.chapters.day21.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.day21.r;},
			unlocked() {return player.secondarylore.chapters.day21.u;}
		},
		"start3": {
			title: "Day 26",
			content: [["infobox", "start3"]],
			onClick() {
				player.secondarylore.chapters.start3.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.start3.r;},
			unlocked() {return player.secondarylore.chapters.start3.u;}
		},
		"start4": {
			title: "Day 27",
			content: [["infobox", "start4"]],
			onClick() {
				player.secondarylore.chapters.start4.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.start4.r;},
			unlocked() {return player.secondarylore.chapters.start4.u;}
		},
		"day28": {
			title: "Day 28",
			content: [["infobox", "day28"]],
			onClick() {
				player.secondarylore.chapters.day28.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.day28.r;},
			unlocked() {return player.secondarylore.chapters.day28.u;}
		},
		"eVac": {
			title: "Day 32",
			content: [["infobox", "eVac"]],
			onClick() {
				player.secondarylore.chapters.eVac.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.eVac.r;},
			unlocked() {return player.secondarylore.chapters.eVac.u;}
		},
		"day35": {
			title: "Day 35",
			content: [["infobox", "day35"]],
			onClick() {
				player.secondarylore.chapters.day35.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.day35.r;},
			unlocked() {return player.secondarylore.chapters.day35.u;}
		},
		"day38": {
			title: "Day 38",
			content: [["infobox", "day38"]],
			onClick() {
				player.secondarylore.chapters.day38.r = true;
			},
			shouldNotify() {return !player.secondarylore.chapters.day38.r;},
			unlocked() {return player.secondarylore.chapters.day38.u;}
		}
	},
	update() {
		for (let i in player.secondarylore.chapters) {
			if (!player.secondarylore.chapters[i].u && layers.secondarylore.infoboxes[i].unlockCondition())
				player.secondarylore.chapters[i].u = true;
		}
	}
});
