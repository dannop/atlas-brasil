import axios from 'axios';

import type { IMunicipio, IUF } from '@/types';

const localidades = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
    timeout: 15000,
});

const malhas = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v3/malhas',
    timeout: 20000,
});

export const ibge = {
    listUFs: async (): Promise<IUF[]> => {
        const { data } = await localidades.get<IUF[]>('/estados', {
            params: { orderBy: 'nome' },
        });
        return data;
    },

    listMunicipiosByUF: async (ufId: number): Promise<IMunicipio[]> => {
        const { data } = await localidades.get<IMunicipio[]>(`/estados/${ufId}/municipios`);
        return data;
    },

    showMunicipio: async (codigoIbge: number | string): Promise<IMunicipio> => {
        const { data } = await localidades.get<IMunicipio>(`/municipios/${codigoIbge}`);
        return data;
    },

    /**
     * Malha GeoJSON dos estados (Brasil inteiro, agregada por UF).
     */
    malhaBrasilByUF: async (): Promise<GeoJSON.FeatureCollection> => {
        const { data } = await malhas.get<GeoJSON.FeatureCollection>('/paises/BR', {
            params: {
                formato: 'application/vnd.geo+json',
                qualidade: 'intermediaria',
                intrarregiao: 'UF',
            },
        });
        return data;
    },

    /**
     * Malha GeoJSON dos municípios de uma UF específica.
     */
    malhaMunicipiosByUF: async (ufId: number): Promise<GeoJSON.FeatureCollection> => {
        const { data } = await malhas.get<GeoJSON.FeatureCollection>(`/estados/${ufId}`, {
            params: {
                formato: 'application/vnd.geo+json',
                qualidade: 'intermediaria',
                intrarregiao: 'municipio',
            },
        });
        return data;
    },
};
