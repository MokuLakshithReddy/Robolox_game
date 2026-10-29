--[[
	@file ServerScriptService/Services/LootService.lua
	@brief Authoritative loot generation and collection validation with rate-limit and distance checks.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local Shared = ReplicatedStorage:WaitForChild("Shared")
local ItemDefinitions = require(Shared:WaitForChild("ItemDefinitions"))
local RateLimitService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("RateLimitService"))

local LootService = {}
LootService.ActiveLootNodes = {}

type LootNode = {
	nodeId: string,
	itemId: string,
	position: Vector3,
	collected: boolean,
}

function LootService.Init()
	print("[LootService] Initialized with rate-limit and distance security checks.")
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
	-- Rate limit check
	if not RateLimitService.CheckRateLimit(player, "RequestInteract") then
		return false, "Rate limit exceeded."
	end

	local node = LootService.ActiveLootNodes[nodeId]
	if not node then
		return false, "Invalid loot node."
	end

	if node.collected then
		return false, "Loot already collected."
	end

	-- Distance anti-exploit check
	local character = player.Character
	if not character or not character:FindFirstChild("HumanoidRootPart") then
		return false, "Character not spawned."
	end

	local hrp = character.HumanoidRootPart :: Part
	local distance = (hrp.Position - node.position).Magnitude
	if distance > 15.0 then
		return false, "Target out of interaction range."
	end

	node.collected = true
	print("[LootService] Secured loot collection for", player.Name, "-> Item:", node.itemId)
	return true, node.itemId
end

return LootService
