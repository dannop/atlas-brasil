import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/hooks/api';
import { ibge } from '@/services/ibge';

export const useShowMunicipio = (codigoIbge: number | null) => {
    return useQuery({
        queryKey: [QueryKeys.ibge_municipio_show, codigoIbge],
        queryFn: () => ibge.showMunicipio(codigoIbge as number),
        enabled: codigoIbge !== null,
        staleTime: 1000 * 60 * 30,
    });
};
