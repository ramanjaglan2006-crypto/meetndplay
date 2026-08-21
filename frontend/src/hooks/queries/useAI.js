import { useQuery, useMutation } from '@tanstack/react-query';
import { getAISynergy, balanceAISquad, getAIRecommendedInvites } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useAISynergy = (targetUserId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.ai.synergy(targetUserId),
        queryFn: () => getAISynergy(targetUserId).then(res => res.data),
        staleTime: 1000 * 60 * 15, // 15 minutes
        enabled: !!targetUserId && (options.enabled !== false),
    });
};

export const useAISquadBalance = () => {
    return useMutation({
        mutationFn: (payload) => balanceAISquad(payload).then(res => res.data),
    });
};

export const useAIRecommendedInvites = (matchId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.ai.recommendedInvites(matchId),
        queryFn: () => getAIRecommendedInvites(matchId).then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!matchId && (options.enabled !== false),
    });
};
