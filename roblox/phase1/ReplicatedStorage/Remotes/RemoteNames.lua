--[[
	@file ReplicatedStorage/Remotes/RemoteNames.lua
	@brief Centralized registry of RemoteEvent and RemoteFunction names.
]]

local RemoteNames = {
	REQUEST_INTERACT = "RequestInteract",
	REQUEST_UPGRADE = "RequestUpgrade",
	REQUEST_READY = "RequestReady",
	STATE_CHANGED = "StateChanged",
	NOTIFICATION = "Notification",
	PROFILE_SNAPSHOT = "ProfileSnapshot",
}

return RemoteNames
