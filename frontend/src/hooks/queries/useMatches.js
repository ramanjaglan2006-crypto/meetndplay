import { useQuery } from '@tanstack/react-query';
import { getMatches } from '../../services/api';
import { queryKeys } from './queryKeys';

export const useMatches = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.matches.list(filters),
        queryFn: () => getMatches().then(res => res.data),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
