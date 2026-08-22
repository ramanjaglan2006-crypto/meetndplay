import { useQuery } from '@tanstack/react-query';
import { getMatches, getMyMatches } from '../../services/api';
import { queryKeys } from './queryKeys';
import { SEED_MATCHES } from '../../config/seedMatches';

export const useMatches = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.matches.list(filters),
        queryFn: () => getMatches().then(res => res.data),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useMyMatches = () => {
    return useQuery({
        queryKey: ['my-matches'],
        queryFn: async () => {
            try {
                const res = await getMyMatches();
                return res.data;
            } catch (err) {
                console.warn('API getMyMatches failed, using seed dataset for demo user');
                // Return structured fallback for demo user 'u1' (Raman Kumar)
                const created = SEED_MATCHES.filter(m => m.id === 'seed-fb-1' || m.id === 'seed-cr-1' || m.id === 'seed-bm-1');
                const joined = SEED_MATCHES.filter(m => m.joinedPlayers?.includes('u1') && !created.some(c => c.id === m.id)).map(m => ({
                    ...m,
                    myPosition: m.sport === 'Football' ? 'Striker' : (m.sport === 'Cricket' ? 'Batsman' : 'Player')
                }));

                const now = new Date();
                const allMatches = [...created, ...joined];
                const upcomingMatches = allMatches.filter(m => new Date(m.dateTime) >= now);
                const completedMatches = allMatches.filter(m => new Date(m.dateTime) < now);

                return {
                    created,
                    joined,
                    stats: {
                        createdCount: created.length,
                        joinedCount: joined.length,
                        upcomingCount: upcomingMatches.length,
                        completedCount: completedMatches.length
                    },
                    nextGame: upcomingMatches[0] || allMatches[0]
                };
            }
        },
        staleTime: 1000 * 30, // 30 seconds
    });
};
