import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/hooks/api';
import { ibge } from '@/services/ibge';

export const useMalhaBrasil = () => {
    return useQuery({
        queryKey: [QueryKeys.geo_ufs],
        queryFn: () => ibge.malhaBrasilByUF(),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
    });
};
