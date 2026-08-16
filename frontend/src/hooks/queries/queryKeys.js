// Centralized Query Keys Factory

export const queryKeys = {
    // Auth
    auth: {
        currentUser: () => ['auth', 'currentUser'],
    },
    // Users/Profiles
    users: {
        profile: (userId) => ['users', 'profile', userId],
    },
    // Communities
    communities: {
        all: () => ['communities'],
        list: (filters) => ['communities', 'list', filters],
        detail: (slugOrId) => ['communities', 'detail', slugOrId],
        posts: (communityId) => ['communities', communityId, 'posts'],
        members: (communityId) => ['communities', communityId, 'members'],
        messages: (communityId) => ['communities', communityId, 'messages'],
        events: (communityId) => ['communities', communityId, 'events'],
        matches: (communityId) => ['communities', communityId, 'matches'],
    },
    // Matches
    matches: {
        all: () => ['matches'],
        list: (filters) => ['matches', 'list', filters],
        detail: (matchId) => ['matches', 'detail', matchId],
        feed: () => ['matches', 'feed'], // For dashboard
    },
    // Events
    events: {
        all: () => ['events'],
        list: (filters) => ['events', 'list', filters],
        detail: (eventId) => ['events', 'detail', eventId],
        feed: () => ['events', 'feed'],
    },
    // Notifications
    notifications: {
        all: () => ['notifications'],
        unreadCount: () => ['notifications', 'unreadCount'],
    },
    // Miscellaneous Static/Slow-changing Data
    static: {
        sports: () => ['static', 'sports'],
    }
};
