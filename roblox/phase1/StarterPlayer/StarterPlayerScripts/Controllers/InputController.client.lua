--[[
	@file StarterPlayer/StarterPlayerScripts/Controllers/InputController.client.lua
	@brief Client input and remote listener controller.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local remotes = ReplicatedStorage:WaitForChild("Remotes")
local RemoteNames = require(remotes:WaitForChild("RemoteNames"))

local stateEvent = remotes:WaitForChild(RemoteNames.STATE_CHANGED) :: RemoteEvent

print("[InputController] Client initialized.")

stateEvent.OnClientEvent:Connect(function(newPhase: string)
	print("[Client] Expedition state changed:", newPhase)
end)
