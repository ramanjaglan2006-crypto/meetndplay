import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunityPosts, createCommunityPost } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useCommunityPosts = (communityId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.communities.posts(communityId),
        queryFn: () => getCommunityPosts(communityId, { limit: 10 }).then(res => res.data),
        staleTime: 1000 * 30, // 30 seconds for feed
        enabled: !!communityId && (options.enabled !== false),
    });
};

export const useCreateCommunityPost = (communityId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createCommunityPost(communityId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.communities.posts(communityId) });
        }
    });
};
