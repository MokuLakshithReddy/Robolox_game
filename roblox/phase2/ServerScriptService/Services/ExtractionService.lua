--[[
	@file ServerScriptService/Services/ExtractionService.lua
	@brief Authoritative extraction zone validation and reward crediting.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local ExpeditionService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("ExpeditionService"))
local ItemDefinitions = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("ItemDefinitions"))

local ExtractionService = {}
ExtractionService.ExtractionZoneCenter = Vector3.new(0, 0, -45)
ExtractionService.ExtractionRadius = 8.0

function ExtractionService.Init()
	print("[ExtractionService] Initialized extraction beacon monitoring.")
end

function ExtractionService.RequestExtract(player: Player, playerHaul: { {itemId: string, quantity: number} }): (boolean, number)
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
		return false, 0 -- Not inside extraction zone
	end

	-- Calculate total reward
	local totalCredits = 0
	for _, item in ipairs(playerHaul) do
		local def = ItemDefinitions[item.itemId]
		if def then
			totalCredits += def.baseValue * item.quantity
		end
	end

	print("[ExtractionService] Player", player.Name, "successfully extracted with haul value:", totalCredits)
	return true, totalCredits
end

return ExtractionService
