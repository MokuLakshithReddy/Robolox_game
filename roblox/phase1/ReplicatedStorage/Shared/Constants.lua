--[[
	@file ReplicatedStorage/Shared/Constants.lua
	@brief Global game constants and configuration parameters for Loot Shift: Lockdown.
]]

local Constants = {}

Constants.MAX_PLAYERS_PER_EXPEDITION = 4
Constants.BASE_SATCHEL_SLOTS = 8
Constants.MAX_SATCHEL_SLOTS = 14
Constants.DEFAULT_EXPEDITION_DURATION_SECONDS = 480 -- 8 minutes
Constants.LOCKDOWN_WARNING_SECONDS = 300            -- Warning at 5 minutes
Constants.REVIVE_DURATION_SECONDS = 4.0

Constants.RARITY_COLORS = {
	Common = Color3.fromRGB(156, 163, 175),     -- Gray
	Uncommon = Color3.fromRGB(59, 130, 246),   -- Blue
	Rare = Color3.fromRGB(147, 51, 234),       -- Purple
	Epic = Color3.fromRGB(245, 158, 11),       -- Amber
	Anomalous = Color3.fromRGB(239, 68, 68),   -- Red
}

return Constants
