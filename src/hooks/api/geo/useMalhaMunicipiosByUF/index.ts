import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/hooks/api';
import { ibge } from '@/services/ibge';

export const useMalhaMunicipiosByUF = (ufId: number | null) => {
    return useQuery({
        queryKey: [QueryKeys.geo_municipios_by_uf, ufId],
        queryFn: () => ibge.malhaMunicipiosByUF(ufId as number),
        enabled: ufId !== null,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
    });
};
