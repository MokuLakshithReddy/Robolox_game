--[[
	@file ServerScriptService/Services/LootService.lua
	@brief Authoritative loot generation, spawn management, and collection validation service.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Shared = ReplicatedStorage:WaitForChild("Shared")
local ItemDefinitions = require(Shared:WaitForChild("ItemDefinitions"))

local LootService = {}
LootService.ActiveLootNodes = {}

type LootNode = {
	nodeId: string,
	itemId: string,
	position: Vector3,
	collected: boolean,
}

function LootService.Init()
	print("[LootService] Initializing loot spawn points...")
	-- In production, spawn points are registered from Workspace tags or configuration
end

function LootService.RegisterNode(nodeId: string, itemId: string, position: Vector3)
	LootService.ActiveLootNodes[nodeId] = {
		nodeId = nodeId,
		itemId = itemId,
		position = position,
		collected = false,
	}
end

function LootService.RequestCollect(player: Player, nodeId: string): (boolean, string?)
	local node = LootService.ActiveLootNodes[nodeId]
	if not node then
		return false, "Invalid loot node."
	end

	if node.collected then
		return false, "Loot already collected."
	end

	-- Verify proximity on server (anti-exploit distance check)
	local character = player.Character
	if not character or not character:FindFirstChild("HumanoidRootPart") then
		return false, "Character not spawned."
	end

	local hrp = character.HumanoidRootPart :: Part
	local distance = (hrp.Position - node.position).Magnitude
	if distance > 15.0 then
		return false, "Target out of interaction range."
	end

	-- Mark collected
	node.collected = true
	print("[LootService] Player", player.Name, "successfully collected:", node.itemId)
	return true, node.itemId
end

return LootService
