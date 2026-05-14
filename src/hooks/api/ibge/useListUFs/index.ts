import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/hooks/api';
import { ibge } from '@/services/ibge';

export const useListUFs = () => {
    return useQuery({
        queryKey: [QueryKeys.ibge_ufs],
        queryFn: () => ibge.listUFs(),
        staleTime: 1000 * 60 * 60,
    });
};
