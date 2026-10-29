--[[
	@file StarterPlayer/StarterPlayerScripts/Controllers/InteractionController.client.lua
	@brief Client-side proximity interaction controller for looting and extraction.
]]

local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local remotes = ReplicatedStorage:WaitForChild("Remotes")
local RemoteNames = require(remotes:WaitForChild("RemoteNames"))
local requestInteractEvent = remotes:WaitForChild(RemoteNames.REQUEST_INTERACT) :: RemoteEvent

local player = Players.LocalPlayer

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end

	if input.KeyCode == Enum.KeyCode.E then
		-- Fire interaction request to server
		print("[InteractionController] 'E' pressed. Requesting interaction...")
		requestInteractEvent:FireServer("nearest_loot_node")
	end
end)
