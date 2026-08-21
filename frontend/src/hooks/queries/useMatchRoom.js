import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMatchRoom, joinMatchWithPosition, leaveMatch, updateMatchPosition, removeMatchParticipant } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useMatchRoom = (matchId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.matches.room(matchId),
        queryFn: () => getMatchRoom(matchId).then(res => res.data),
        staleTime: 1000 * 10, // 10 seconds for match room freshness
        enabled: !!matchId && (options.enabled !== false),
    });
};

export const useJoinMatchRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, position, openToOtherPositions }) => joinMatchWithPosition(matchId, { position, openToOtherPositions }).then(res => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.room(variables.matchId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.all() });
        }
    });
};

export const useLeaveMatchRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId) => leaveMatch(matchId).then(res => res.data),
        onSuccess: (_, matchId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.room(matchId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.all() });
        }
    });
};

export const useUpdateMatchPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, position }) => updateMatchPosition(matchId, position).then(res => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.room(variables.matchId) });
        }
    });
};

export const useRemoveMatchParticipant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, userId }) => removeMatchParticipant(matchId, userId).then(res => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.room(variables.matchId) });
        }
    });
};
