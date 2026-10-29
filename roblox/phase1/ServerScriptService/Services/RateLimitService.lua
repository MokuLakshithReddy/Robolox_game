--[[
	@file ServerScriptService/Services/RateLimitService.lua
	@brief Rate limiting service to protect against remote spam and abuse.
]]

local RateLimitService = {}
local requestCounts: {[number]: {[string]: {count: number, resetTime: number}}} = {}

const WINDOW_SECONDS = 1.0
const MAX_REQUESTS_PER_WINDOW = 15

function RateLimitService.RegisterPlayer(player: Player)
	requestCounts[player.UserId] = {}
end

function RateLimitService.UnregisterPlayer(player: Player)
	requestCounts[player.UserId] = nil
end

function RateLimitService.CheckRateLimit(player: Player, actionName: string): boolean
	local userId = player.UserId
	local userActions = requestCounts[userId]
	if not userActions then return false end

	local now = tick()
	local actionData = userActions[actionName]

	if not actionData or now > actionData.resetTime then
		userActions[actionName] = {
			count = 1,
			resetTime = now + WINDOW_SECONDS,
		}
		return true
	end

	actionData.count += 1
	if actionData.count > MAX_REQUESTS_PER_WINDOW then
		warn("[RateLimit] Player", player.Name, "rate limited on action:", actionName)
		return false
	end

	return true
end

return RateLimitService
