import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const loginUser = (email, password, currentLat, currentLon) => axios.post(`${API_BASE_URL}/auth/login`, { email, password, currentLat, currentLon });
export const signupUser = (userData) => axios.post(`${API_BASE_URL}/auth/signup`, userData);

export const getPlayers = () => axios.get(`${API_BASE_URL}/players`);
export const getRecommendations = (userId) => axios.post(`${API_BASE_URL}/recommendations`, { userId }); // Legacy
export const getMatchRecommendations = (userId) => axios.post(`${API_BASE_URL}/recommendations/matches`, { userId });
export const getDiscoverUsers = (userId, lat, lon, page = 1) => axios.get(`${API_BASE_URL}/users/discover`, { params: { userId, lat, lon, page, limit: 12 } });
export const postSwipe = (userId, targetUserId, action) => axios.post(`${API_BASE_URL}/swipe`, { userId, targetUserId, action });

export const getCommunities = () => axios.get(`${API_BASE_URL}/communities`);
export const createCommunity = (data) => axios.post(`${API_BASE_URL}/communities/create`, data);
export const joinCommunity = (id, userId) => axios.post(`${API_BASE_URL}/communities/${id}/join`, { userId });
export const getChannels = (communityId) => axios.get(`${API_BASE_URL}/channels/${communityId}`);
export const getMessages = (channelId) => axios.get(`${API_BASE_URL}/messages/${channelId}`);

export const getMatches = () => axios.get(`${API_BASE_URL}/matches`);
export const createMatch = (matchData) => axios.post(`${API_BASE_URL}/matches`, matchData);
export const joinMatch = (matchId, userId) => axios.post(`${API_BASE_URL}/matches/${matchId}/join`, { userId });
export const leaveMatch = (matchId, userId) => axios.post(`${API_BASE_URL}/matches/${matchId}/leave`, { userId });
export const getMatchPlayers = (matchId) => axios.get(`${API_BASE_URL}/matches/${matchId}/players`);
export const inviteToMatch = (matchId, targetUserIds) => axios.post(`${API_BASE_URL}/matches/${matchId}/invite`, { targetUserIds });

export const getTournaments = () => axios.get(`${API_BASE_URL}/tournaments`);
export const registerTournament = (tournamentId, teamName) => axios.post(`${API_BASE_URL}/tournaments/register`, { tournamentId, teamName });

export const getUserProfile = (userId) => axios.get(`${API_BASE_URL}/users/${userId}`);
export const updateUserProfile = (userData) => axios.put(`${API_BASE_URL}/users/update`, userData);

// Connections
export const sendConnectionRequest = (senderId, receiverId) => axios.post(`${API_BASE_URL}/connections/request`, { senderId, receiverId });
export const acceptConnection = (connectionId) => axios.post(`${API_BASE_URL}/connections/accept`, { connectionId });
export const rejectConnection = (connectionId) => axios.post(`${API_BASE_URL}/connections/reject`, { connectionId });
export const getUserConnections = (userId) => axios.get(`${API_BASE_URL}/connections/${userId}`);

// Direct Messages
export const sendDirectMessage = (senderId, receiverId, content, matchContext) => axios.post(`${API_BASE_URL}/direct_messages/send`, { senderId, receiverId, content, matchContext });
export const getDirectMessages = (userId1, userId2) => axios.get(`${API_BASE_URL}/direct_messages/${userId1}/${userId2}`);
