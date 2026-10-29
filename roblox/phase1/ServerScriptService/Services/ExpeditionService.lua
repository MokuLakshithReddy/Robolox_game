--[[
	@file ServerScriptService/Services/ExpeditionService.lua
	@brief Authoritative expedition state machine and run lifecycle service.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RemoteNames = require(ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("RemoteNames"))
local remotes = ReplicatedStorage:WaitForChild("Remotes")

local ExpeditionService = {}
ExpeditionService.CurrentPhase = "Hub"
ExpeditionService.ActivePlayers = {}

function ExpeditionService.Init()
	print("[ExpeditionService] Initialized state machine: Hub")
end

function ExpeditionService.SetPhase(newPhase: string)
	ExpeditionService.CurrentPhase = newPhase
	print("[ExpeditionService] State transitioned to:", newPhase)
	
	local stateEvent = remotes:FindFirstChild(RemoteNames.STATE_CHANGED) :: RemoteEvent
	if stateEvent then
		stateEvent:FireAllClients(newPhase)
	end
end

function ExpeditionService.OnPlayerAdded(player: Player)
	ExpeditionService.ActivePlayers[player.UserId] = {
		extracted = false,
		haul = {},
	}
end

function ExpeditionService.OnPlayerRemoving(player: Player)
	ExpeditionService.ActivePlayers[player.UserId] = nil
end

return ExpeditionService
