import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useProfile = (userId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.users.profile(userId),
        queryFn: () => getUserProfile(userId).then(res => res.data),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!userId && (options.enabled !== false),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateUserProfile(data).then(res => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(queryKeys.users.profile(data._id));
            queryClient.invalidateQueries(['currentUser']);
        }
    });
};
