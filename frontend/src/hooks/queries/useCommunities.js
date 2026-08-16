import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunities, getCommunityBySlug, joinCommunity, leaveCommunity } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useCommunities = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.communities.list(filters),
        queryFn: () => getCommunities().then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes (discovery cache)
    });
};

export const useCommunityDetail = (slug) => {
    return useQuery({
        queryKey: queryKeys.communities.detail(slug),
        queryFn: () => getCommunityBySlug(slug).then(res => res.data),
        staleTime: 1000 * 60 * 2, // 2 minutes (details can change if members join)
        enabled: !!slug,
    });
};

export const useJoinCommunity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (communityId) => joinCommunity(communityId),
        onSuccess: (data, communityId) => {
            // Invalidate both community list and specific detail to reflect new membership
            queryClient.invalidateQueries({ queryKey: queryKeys.communities.all() });
            // Optionally, we could specifically invalidate the detail query if we know the slug
            // Or just invalidate all communities.
        },
    });
};

export const useLeaveCommunity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (communityId) => leaveCommunity(communityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.communities.all() });
        },
    });
};
