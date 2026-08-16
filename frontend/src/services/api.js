import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Intercept 401s globally to clear session
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
    }
);

// Global axios configuration for cookies
axios.defaults.withCredentials = true;

// Optional: Add global interceptor to handle 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger a custom event that AuthProvider can listen to
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const loginUser = (email, password, currentLat, currentLon) => axios.post(`${API_BASE_URL}/auth/login`, { email, password, currentLat, currentLon });
export const signupUser = (userData) => axios.post(`${API_BASE_URL}/auth/signup`, userData);
export const logoutUser = () => axios.post(`${API_BASE_URL}/auth/logout`);
export const getCurrentUser = () => axios.get(`${API_BASE_URL}/auth/me`);

export const getPlayers = () => axios.get(`${API_BASE_URL}/players`);
export const getRecommendations = (userId) => axios.post(`${API_BASE_URL}/recommendations`, { userId }); // Legacy
export const getMatchRecommendations = (userId) => axios.post(`${API_BASE_URL}/recommendations/matches`, { userId });
export const getDiscoverUsers = (userId, lat, lon, page = 1) => axios.get(`${API_BASE_URL}/users/discover`, { params: { userId, lat, lon, page, limit: 12 } });
export const postSwipe = (userId, targetUserId, action) => axios.post(`${API_BASE_URL}/swipe`, { userId, targetUserId, action });

// Communities
export const getCommunities = (params) => API.get('/communities', { params });
export const getCommunityBySlug = (slug) => API.get(`/communities/${slug}`);
export const createCommunity = (data) => API.post('/communities', data);
export const joinCommunity = (id) => API.post(`/communities/${id}/join`);
export const leaveCommunity = (id) => API.delete(`/communities/${id}/leave`);
export const getCommunityMembers = (id) => API.get(`/communities/${id}/members`);

// Community Posts
export const getCommunityPosts = (communityId, params) => API.get(`/communities/${communityId}/posts`, { params });
export const createCommunityPost = (communityId, data) => API.post(`/communities/${communityId}/posts`, data);
export const likeCommunityPost = (postId) => API.post(`/communities/posts/${postId}/like`);
export const getCommunityComments = (postId) => API.get(`/communities/posts/${postId}/comments`);
export const addCommunityComment = (postId, data) => API.post(`/communities/posts/${postId}/comments`, data);

// Community Chat APIs
export const getCommunityChatMessages = (communityId, cursor = null) => {
    let url = `/communities/${communityId}/messages?limit=50`;
    if (cursor) url += `&cursor=${cursor}`;
    return API.get(url);
};
export const sendCommunityChatMessage = (communityId, data) => API.post(`/communities/${communityId}/messages`, data);
export const deleteCommunityChatMessage = (communityId, messageId) => API.delete(`/communities/${communityId}/messages/${messageId}`);

// Discord/Chat Legacy Channels
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

export const getUserProfile = (userId) => API.get(`/users/${userId}/profile`);
export const getMyProfile = () => API.get(`/users/profile`);
export const updateUserProfile = (userData) => API.patch(`/users/profile`, userData);

// Connections
export const sendConnectionRequest = (senderId, receiverId) => axios.post(`${API_BASE_URL}/connections/request`, { senderId, receiverId });
export const acceptConnection = (connectionId) => axios.post(`${API_BASE_URL}/connections/accept`, { connectionId });
export const rejectConnection = (connectionId) => axios.post(`${API_BASE_URL}/connections/reject`, { connectionId });
export const getUserConnections = (userId) => axios.get(`${API_BASE_URL}/connections/${userId}`);

// Direct Messages
export const sendDirectMessage = (senderId, receiverId, content, matchContext) => axios.post(`${API_BASE_URL}/direct_messages/send`, { senderId, receiverId, content, matchContext });
export const getDirectMessages = (userId1, userId2) => axios.get(`${API_BASE_URL}/direct_messages/${userId1}/${userId2}`);
