import apiClient from '../plugins/axios'

// --- Challenges Endpoints ---
export const createChallenge = (challengeData) =>
    apiClient.post('/challenges/', challengeData)

export const getChallenges = (params = {}) =>
    apiClient.get('/challenges/', { params })

// Complete a challenge (new endpoint)
export const completeChallenge = (challengeId, userId) =>
    apiClient.post(`/challenges/${challengeId}/complete`, null, { params: { user_id: userId } })

// --- Users Endpoints ---
export const createUser = (userData) =>
    apiClient.post('/users/', userData)

export const getUsers = (params = {}) =>
    apiClient.get('/users/', { params })

export const loginUser = (username, password) =>
    apiClient.post('/users/login', null, { params: { username, password } })

// --- Activities Endpoints ---
export const createActivity = (userId, activityData) =>
    apiClient.post('/activities/', activityData, { params: { user_id: userId } })

export const getActivities = (params = {}) =>
    apiClient.get('/activities/', { params })

export const getActivitiesByUser = (userId, params = {}) =>
    apiClient.get(`/activities/user/${userId}`, { params })

export const getActivity = (activityId) =>
    apiClient.get(`/activities/${activityId}`)

export const updateActivity = (activityId, updateData) =>
    apiClient.patch(`/activities/${activityId}`, updateData)

export const deleteActivity = (activityId) =>
    apiClient.delete(`/activities/${activityId}`)

export const completeActivity = (activityId, userId) =>
    apiClient.post(`/activities/${activityId}/complete`, null, { params: { user_id: userId } })

// --- Teams Endpoints ---
export const createTeam = (teamData) =>
    apiClient.post('/teams/', teamData)

export const getTeams = (params = {}) =>
    apiClient.get('/teams/', { params })

export const addTeamMember = (teamId, userId) =>
    apiClient.post(`/teams/${teamId}/members`, null, { params: { user_id: userId } })

export const listTeamMembers = (teamId) =>
    apiClient.get(`/teams/${teamId}/members`)

// --- Weekly Challenges Endpoints ---
export const getWeeklyChallenges = (userId) =>
    apiClient.get('/weekly-challenges/', { params: { user_id: userId } })

export const selectWeeklyChallenges = (userId, challengeIds) =>
    apiClient.post('/weekly-challenges/', challengeIds, { params: { user_id: userId } })

// --- User Profile Endpoints ---
export const getUserProfile = (userId) =>
    apiClient.get(`/users/${userId}`)

export const updateUserProfile = (userId, updateData) =>
    apiClient.patch(`/users/${userId}`, updateData)

// --- Challenge Participation Endpoints ---
export const getUserChallenges = (userId) =>
    apiClient.get(`/users/${userId}/challenges`)

export const getChallengeParticipants = (challengeId) =>
    apiClient.get(`/challenges/${challengeId}/participants`)

export const joinChallenge = (challengeId, userId) =>
    apiClient.post(`/challenges/${challengeId}/participants`, null, { params: { user_id: userId } })

// --- Leaderboards Endpoints ---
export const getChallengeLeaderboard = (challengeId) =>
    apiClient.get(`/leaderboards/challenges/${challengeId}`)

export const getTeamLeaderboard = () =>
    apiClient.get('/leaderboards/teams')

export const getUsersLeaderboard = (limit = 10) =>
    apiClient.get('/leaderboards/users', { params: { limit } })

// --- Statistics Endpoints ---
export const getUserStatistics = (userId) =>
    apiClient.get(`/statistics/user/${userId}`)

export const getChallengeStatistics = (challengeId) =>
    apiClient.get(`/statistics/challenge/${challengeId}`)

// --- Root Endpoint ---
export const getRoot = () =>
    apiClient.get('/')
