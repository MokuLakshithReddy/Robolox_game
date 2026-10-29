--[[
	@file ServerScriptService/Services/ExtractionService.lua
	@brief Authoritative extraction zone validation with duplicate prevention and rate limiting.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local ExpeditionService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("ExpeditionService"))
local RateLimitService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("RateLimitService"))
local ItemDefinitions = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("ItemDefinitions"))

local ExtractionService = {}
ExtractionService.ExtractionZoneCenter = Vector3.new(0, 0, -45)
ExtractionService.ExtractionRadius = 8.0
local extractedPlayers: {[number]: boolean} = {}

function ExtractionService.Init()
	print("[ExtractionService] Initialized with duplicate extraction prevention.")
end

function ExtractionService.ResetRun()
	table.clear(extractedPlayers)
end

function ExtractionService.RequestExtract(player: Player, playerHaul: { {itemId: string, quantity: number} }): (boolean, number)
	-- Rate limit check
	if not RateLimitService.CheckRateLimit(player, "RequestExtract") then
		return false, 0
	end

	-- Prevent duplicate reward claims
	if extractedPlayers[player.UserId] then
		return false, 0
	end

	if ExpeditionService.CurrentPhase ~= "ExpeditionActive" and ExpeditionService.CurrentPhase ~= "LockdownWarning" then
		return false, 0
	end

	local character = player.Character
	if not character or not character:FindFirstChild("HumanoidRootPart") then
		return false, 0
	end

	local hrp = character.HumanoidRootPart :: Part
	local distance = (hrp.Position - ExtractionService.ExtractionZoneCenter).Magnitude

	if distance > ExtractionService.ExtractionRadius then
		return false, 0
	end

	extractedPlayers[player.UserId] = true

	local totalCredits = 0
	for _, item in ipairs(playerHaul) do
		local def = ItemDefinitions[item.itemId]
		if def then
			totalCredits += def.baseValue * item.quantity
		end
	end

	print("[ExtractionService] Player", player.Name, "extracted successfully. Credits awarded:", totalCredits)
	return true, totalCredits
end

return ExtractionService
