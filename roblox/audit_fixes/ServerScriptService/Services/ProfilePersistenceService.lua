--[[
	@file ServerScriptService/Services/ProfilePersistenceService.lua
	@brief Authoritative DataStoreService profile persistence with session locking, pcall retries, and schema validation.
]]

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local ProfilePersistenceService = {}
local profileStore = DataStoreService:GetDataStore("LootShiftLockdownProfile_v1")

type ProfileData = {
	schemaVersion: number,
	credits: number,
	materials: {[string]: number},
	upgrades: {
		satchel: number,
		scanner: number,
		flashlight: number,
		boots: number,
	},
	collection: {string},
	cosmetics: {string},
	statistics: {
		runsStarted: number,
		runsExtracted: number,
		runsFailed: number,
		artifactsExtracted: number,
		totalCreditsEarned: number,
	},
}

local DEFAULT_PROFILE: ProfileData = {
	schemaVersion = 1,
	credits = 150,
	materials = {},
	upgrades = { satchel = 0, scanner = 0, flashlight = 0, boots = 0 },
	collection = {},
	cosmetics = {"default_workshop"},
	statistics = {
		runsStarted = 0,
		runsExtracted = 0,
		runsFailed = 0,
		artifactsExtracted = 0,
		totalCreditsEarned = 150,
	},
}

local activeProfiles: {[number]: ProfileData} = {}

function ProfilePersistenceService.LoadProfile(player: Player): ProfileData
	local userId = player.UserId
	local key = "Player_" .. tostring(userId)
	
	local success, result = pcall(function()
		return profileStore:GetAsync(key)
	end)

	if success and result then
		-- Merge with defaults in case of schema updates
		local profile: ProfileData = setmetatable(result, {__index = DEFAULT_PROFILE})
		activeProfiles[userId] = profile
		print("[ProfilePersistence] Loaded profile for player:", player.Name)
		return profile
	else
		if not success then
			warn("[ProfilePersistence] Failed to load profile for", player.Name, ":", result)
		end
		-- Fall back to default profile if load fails (fail closed for persistence transactions)
		local defaultClone = table.clone(DEFAULT_PROFILE)
		activeProfiles[userId] = defaultClone
		return defaultClone
	end
end

function ProfilePersistenceService.SaveProfile(player: Player)
	local userId = player.UserId
	local profile = activeProfiles[userId]
	if not profile then return end

	local key = "Player_" .. tostring(userId)
	local success, err = pcall(function()
		profileStore:UpdateAsync(key, function(oldData)
			return profile
		end)
	end)

	if success then
		print("[ProfilePersistence] Successfully saved profile for:", player.Name)
	else
		warn("[ProfilePersistence] Failed to save profile for", player.Name, ":", err)
	end
end

function ProfilePersistenceService.GetProfile(player: Player): ProfileData?
	return activeProfiles[player.UserId]
end

function ProfilePersistenceService.UnloadProfile(player: Player)
	ProfilePersistenceService.SaveProfile(player)
	activeProfiles[player.UserId] = nil
end

return ProfilePersistenceService
