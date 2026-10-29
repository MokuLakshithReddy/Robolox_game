--[[
	@file ReplicatedStorage/Shared/ItemDefinitions.lua
	@brief Authoritative display definitions for items, scrap, and artifacts.
]]

local Types = require(script.Parent.Types)

local ItemDefinitions: {[string]: Types.ItemDefinition} = {
	scrap_metal = {
		id = "scrap_metal",
		name = "Scrap Metal",
		category = "Scrap",
		rarity = "Common",
		baseValue = 8,
		description = "Corroded structural plating and rivets. Essential baseline salvage.",
	},
	copper_wire = {
		id = "copper_wire",
		name = "Copper Spool",
		category = "Scrap",
		rarity = "Common",
		baseValue = 12,
		description = "Insulated wiring stripped from industrial conduit.",
	},
	battery_cell = {
		id = "battery_cell",
		name = "Ion Power Cell",
		category = "Components",
		rarity = "Uncommon",
		baseValue = 35,
		description = "Partially charged reserve power unit from district substations.",
	},
	circuit_board = {
		id = "circuit_board",
		name = "Mainframe Logic Board",
		category = "Components",
		rarity = "Rare",
		baseValue = 80,
		description = "Intact micro-processor assembly from automated terminal stations.",
	},
	relic_compass = {
		id = "relic_compass",
		name = "Anomalous Gyro-Compass",
		category = "Artifacts",
		rarity = "Rare",
		baseValue = 120,
		description = "Spins wildly near magnetic anomalies. Prized collector artifact.",
		isArtifact = true,
	},
	signal_lens = {
		id = "signal_lens",
		name = "Prismatic Signal Lens",
		category = "Artifacts",
		rarity = "Epic",
		baseValue = 250,
		description = "Optical component that refracts unknown radiation frequencies.",
		isArtifact = true,
	},
}

return ItemDefinitions
