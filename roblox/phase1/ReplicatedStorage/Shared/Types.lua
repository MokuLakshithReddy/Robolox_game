--[[
	@file ReplicatedStorage/Shared/Types.lua
	@brief Type definitions for Luau static analysis in Roblox Studio.
]]

export type ItemRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Anomalous"
export type ItemCategory = "Scrap" | "Components" | "Artifacts" | "Mission" | "Utility"

export type ItemDefinition = {
	id: string,
	name: string,
	category: ItemCategory,
	rarity: ItemRarity,
	baseValue: number,
	description: string,
	isArtifact: boolean?,
}

export type InventoryItem = {
	instanceId: string,
	itemId: string,
	quantity: number,
}

export type ExpeditionPhase = "Hub" | "Preparing" | "ExpeditionActive" | "LockdownWarning" | "ExtractionOpen" | "ExpeditionResolved"

export type PlayerProfile = {
	schemaVersion: number,
	credits: number,
	materials: {[string]: number},
	upgrades: {
		satchel: number,
		scanner: number,
		flashlight: number,
		boots: number,
	},
	collection: {string},
	cosmetics: {string},
	statistics: {
		runsStarted: number,
		runsExtracted: number,
		runsFailed: number,
		artifactsExtracted: number,
		totalCreditsEarned: number,
	},
}

return {}
