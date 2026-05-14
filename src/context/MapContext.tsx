import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ISelectedUF {
    id: number;
    sigla: string;
    nome: string;
}

interface ISelectedMunicipio {
    codigoIbge: number;
    nome: string;
}

interface IMapContext {
    selectedUF: ISelectedUF | null;
    selectedMunicipio: ISelectedMunicipio | null;
    selectUF: (uf: ISelectedUF | null) => void;
    selectMunicipio: (municipio: ISelectedMunicipio | null) => void;
    resetSelection: () => void;
}

const MapContext = createContext<IMapContext | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
    const [selectedUF, setSelectedUF] = useState<ISelectedUF | null>(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState<ISelectedMunicipio | null>(null);

    const selectUF = useCallback((uf: ISelectedUF | null) => {
        setSelectedUF(uf);
        setSelectedMunicipio(null);
    }, []);

    const selectMunicipio = useCallback((municipio: ISelectedMunicipio | null) => {
        setSelectedMunicipio(municipio);
    }, []);

    const resetSelection = useCallback(() => {
        setSelectedUF(null);
        setSelectedMunicipio(null);
    }, []);

    const value = useMemo(
        () => ({
            selectedUF,
            selectedMunicipio,
            selectUF,
            selectMunicipio,
            resetSelection,
        }),
        [selectedUF, selectedMunicipio, selectUF, selectMunicipio, resetSelection],
    );

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = (): IMapContext => {
    const ctx = useContext(MapContext);
    if (!ctx) throw new Error('useMap deve ser usado dentro de MapProvider');
    return ctx;
};
