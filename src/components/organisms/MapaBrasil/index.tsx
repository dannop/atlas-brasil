import L, { type LeafletMouseEvent, type PathOptions } from 'leaflet';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GeoJSON, MapContainer, ZoomControl, useMap as useLeafletMap } from 'react-leaflet';

import Spinner from '@/components/atoms/Spinner';
import { useMap } from '@/context/MapContext';
import { useMalhaBrasil } from '@/hooks/api/geo/useMalhaBrasil';
import { useMalhaMunicipiosByUF } from '@/hooks/api/geo/useMalhaMunicipiosByUF';
import { tokens } from '@/util/tokens';

const BR_BOUNDS: L.LatLngBoundsExpression = [
    [-34, -74],
    [6, -34],
];

const BR_CENTER: L.LatLngExpression = [-14.5, -52.5];

const ufStyle: PathOptions = {
    color: tokens.map.ufStroke,
    weight: 1,
    fillColor: tokens.map.ufFill,
    fillOpacity: 0.85,
};

const ufHoverStyle: PathOptions = {
    color: tokens.map.ufStrokeHover,
    weight: 2,
    fillColor: tokens.map.ufFillHover,
    fillOpacity: 0.95,
};

const municipioStyle: PathOptions = {
    color: tokens.map.municipioStroke,
    weight: 0.5,
    fillColor: tokens.map.municipioFill,
    fillOpacity: 0.7,
};

const municipioHoverStyle: PathOptions = {
    color: tokens.map.municipioStrokeSelected,
    weight: 1.5,
    fillColor: tokens.map.municipioFillHover,
    fillOpacity: 0.95,
};

const municipioSelectedStyle: PathOptions = {
    color: tokens.map.municipioStrokeSelected,
    weight: 2,
    fillColor: tokens.map.municipioFillSelected,
    fillOpacity: 1,
};

interface IFitProps {
    targetBounds: L.LatLngBoundsExpression | null;
}

const FitTo = ({ targetBounds }: IFitProps) => {
    const map = useLeafletMap();
    useEffect(() => {
        if (!targetBounds) return;
        map.fitBounds(targetBounds, { padding: [40, 40], duration: 0.8 });
    }, [map, targetBounds]);
    return null;
};

const MapaBrasil = () => {
    const { selectedUF, selectedMunicipio, selectUF, selectMunicipio, resetSelection } = useMap();

    const { data: malhaBrasil, isLoading: loadingBrasil } = useMalhaBrasil();
    const { data: malhaMunicipios, isLoading: loadingMunicipios } = useMalhaMunicipiosByUF(
        selectedUF?.id ?? null,
    );

    useEffect(() => {
        if (!selectedUF) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !selectedMunicipio) resetSelection();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedUF, selectedMunicipio, resetSelection]);

    const layerRef = useRef<L.GeoJSON | null>(null);

    const ufsKey = useMemo(() => `ufs-${malhaBrasil ? 'ready' : 'empty'}`, [malhaBrasil]);
    const municipiosKey = useMemo(
        () => `municipios-${selectedUF?.id ?? 'none'}`,
        [selectedUF?.id],
    );

    const onEachUF = useCallback(
        (feature: GeoJSON.Feature, layer: L.Layer) => {
            const path = layer as L.Path;
            const props = (feature.properties ?? {}) as Record<string, unknown>;
            const id = Number(props.codarea);
            const sigla = (props.SIGLA_UF as string) ?? (props.sigla as string) ?? '';
            const nome = (props.NOME as string) ?? (props.nome as string) ?? sigla;

            path.on({
                mouseover: () => path.setStyle(ufHoverStyle),
                mouseout: () => path.setStyle(ufStyle),
                click: (e: LeafletMouseEvent) => {
                    L.DomEvent.stopPropagation(e);
                    selectUF({ id, sigla, nome });
                },
            });
            (path as L.Path & { bindTooltip: L.Path['bindTooltip'] }).bindTooltip(nome, {
                sticky: true,
                direction: 'top',
                className: 'atlas-tooltip',
            });
        },
        [selectUF],
    );

    const onEachMunicipio = useCallback(
        (feature: GeoJSON.Feature, layer: L.Layer) => {
            const path = layer as L.Path;
            const props = (feature.properties ?? {}) as Record<string, unknown>;
            const codigoIbge = Number(props.codarea);
            const nome = (props.NOME as string) ?? (props.nome as string) ?? String(codigoIbge);

            const isSelected = selectedMunicipio?.codigoIbge === codigoIbge;
            path.setStyle(isSelected ? municipioSelectedStyle : municipioStyle);

            path.on({
                mouseover: () => {
                    if (selectedMunicipio?.codigoIbge !== codigoIbge) {
                        path.setStyle(municipioHoverStyle);
                    }
                },
                mouseout: () => {
                    if (selectedMunicipio?.codigoIbge !== codigoIbge) {
                        path.setStyle(municipioStyle);
                    }
                },
                click: (e: LeafletMouseEvent) => {
                    L.DomEvent.stopPropagation(e);
                    selectMunicipio({ codigoIbge, nome });
                },
            });
            (path as L.Path & { bindTooltip: L.Path['bindTooltip'] }).bindTooltip(nome, {
                sticky: true,
                direction: 'top',
                className: 'atlas-tooltip',
            });
        },
        [selectMunicipio, selectedMunicipio?.codigoIbge],
    );

    const targetBounds = useMemo<L.LatLngBoundsExpression | null>(() => {
        if (!selectedUF || !malhaMunicipios || !layerRef.current) return null;
        const bounds = layerRef.current.getBounds();
        return bounds.isValid() ? bounds : null;
    }, [selectedUF, malhaMunicipios]);

    return (
        <div className="relative h-full w-full">
            {(loadingBrasil || loadingMunicipios) && (
                <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">
                    <div className="flex items-center gap-3 rounded-full bg-surface-elevated/90 px-4 py-2 shadow-lg backdrop-blur">
                        <Spinner size="sm" />
                        <span className="text-sm text-slate-300">
                            {loadingBrasil ? 'Carregando Brasil...' : 'Carregando municípios...'}
                        </span>
                    </div>
                </div>
            )}

            <MapContainer
                center={BR_CENTER}
                zoom={4}
                minZoom={4}
                maxZoom={11}
                maxBounds={BR_BOUNDS}
                maxBoundsViscosity={1}
                zoomControl={false}
                attributionControl
                style={{ height: '100%', width: '100%' }}
                className="bg-surface"
            >
                <ZoomControl position="bottomright" />
                {malhaBrasil && !selectedUF && (
                    <GeoJSON
                        key={ufsKey}
                        data={malhaBrasil}
                        style={() => ufStyle}
                        onEachFeature={onEachUF}
                    />
                )}

                {malhaMunicipios && selectedUF && (
                    <GeoJSON
                        key={municipiosKey}
                        data={malhaMunicipios}
                        style={(feature) => {
                            const codigoIbge = Number(feature?.properties?.codarea);
                            return selectedMunicipio?.codigoIbge === codigoIbge
                                ? municipioSelectedStyle
                                : municipioStyle;
                        }}
                        onEachFeature={onEachMunicipio}
                        ref={(instance) => {
                            layerRef.current = instance;
                        }}
                    />
                )}

                <FitTo targetBounds={targetBounds} />
            </MapContainer>

            {selectedUF && (
                <button
                    type="button"
                    onClick={resetSelection}
                    aria-label={`Voltar para o mapa do Brasil (atualmente em ${selectedUF.nome})`}
                    title="Voltar ao Brasil (Esc)"
                    className="group absolute top-4 left-4 z-[500] flex items-center gap-3 rounded-full border border-white/10 bg-surface-elevated/85 py-2 pr-4 pl-2 text-sm text-slate-100 shadow-lg ring-1 ring-black/10 backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:border-brand-400/40 hover:bg-brand-700/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 active:scale-[0.98]"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/15 text-brand-200 transition-colors group-hover:bg-brand-500/30 group-hover:text-white">
                        <ArrowLeft size={16} strokeWidth={2.25} aria-hidden />
                    </span>
                    <span className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            {selectedUF.sigla} · {selectedUF.nome}
                        </span>
                        <span className="text-sm font-semibold text-slate-50">
                            Voltar ao Brasil
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
};

export default MapaBrasil;
