--[[
	@file ServerScriptService/Bootstrap.server.lua
	@brief Authoritative server bootstrap initializing services, remotes, and lifecycle.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local Players = game:GetService("Players")

local RemoteNames = require(ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("RemoteNames"))
local ExpeditionService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("ExpeditionService"))
local RateLimitService = require(ServerScriptService:WaitForChild("Services"):WaitForChild("RateLimitService"))

print("[Loot Shift: Lockdown] Server Bootstrap Initializing...")

-- Ensure Remotes folder and events exist
local remotesFolder = ReplicatedStorage:FindFirstChild("Remotes")
if not remotesFolder then
	remotesFolder = Instance.new("Folder")
	remotesFolder.Name = "Remotes"
	remotesFolder.Parent = ReplicatedStorage
end

for _, remoteName in pairs(RemoteNames) do
	if not remotesFolder:FindFirstChild(remoteName) then
		local remoteEvent = Instance.new("RemoteEvent")
		remoteEvent.Name = remoteName
		remoteEvent.Parent = remotesFolder
	end
end

-- Initialize Services
ExpeditionService.Init()

Players.PlayerAdded:Connect(function(player)
	print("[Loot Shift] Player connected:", player.Name)
	RateLimitService.RegisterPlayer(player)
	ExpeditionService.OnPlayerAdded(player)
end)

Players.PlayerRemoving:Connect(function(player)
	print("[Loot Shift] Player disconnecting:", player.Name)
	RateLimitService.UnregisterPlayer(player)
	ExpeditionService.OnPlayerRemoving(player)
end)

print("[Loot Shift: Lockdown] Server Initialization Complete.")
