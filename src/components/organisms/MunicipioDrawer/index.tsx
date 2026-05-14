import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { MapPin, X } from 'lucide-react';

import Badge from '@/components/atoms/Badge';
import Spinner from '@/components/atoms/Spinner';
import { useMap } from '@/context/MapContext';
import { useShowMunicipio } from '@/hooks/api/ibge/useShowMunicipio';

const MunicipioDrawer = () => {
    const { selectedMunicipio, selectMunicipio } = useMap();
    const open = selectedMunicipio !== null;

    const { data: municipio, isLoading } = useShowMunicipio(
        selectedMunicipio?.codigoIbge ?? null,
    );

    const close = () => selectMunicipio(null);

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={close}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-y-0 right-0 flex max-w-full">
                    <TransitionChild
                        as={Fragment}
                        enter="transform transition ease-out duration-300"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="flex h-full w-screen max-w-md flex-col bg-surface-soft text-slate-100 shadow-2xl">
                            <header className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <Badge variant="brand">
                                        <MapPin className="h-3 w-3" /> Município
                                    </Badge>
                                    <DialogTitle className="text-xl font-semibold leading-tight">
                                        {selectedMunicipio?.nome ?? '—'}
                                    </DialogTitle>
                                    {selectedMunicipio?.codigoIbge && (
                                        <span className="text-xs text-slate-400">
                                            Código IBGE: {selectedMunicipio.codigoIbge}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={close}
                                    aria-label="Fechar"
                                    className="rounded-full p-2 text-slate-400 transition hover:bg-surface-elevated hover:text-slate-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {isLoading && (
                                    <div className="flex h-32 items-center justify-center">
                                        <Spinner />
                                    </div>
                                )}

                                {!isLoading && municipio && (
                                    <dl className="space-y-4 text-sm">
                                        <Row
                                            label="Microrregião"
                                            value={municipio.microrregiao?.nome}
                                        />
                                        <Row
                                            label="Mesorregião"
                                            value={municipio.microrregiao?.mesorregiao?.nome}
                                        />
                                        <Row
                                            label="Estado"
                                            value={`${
                                                municipio.microrregiao?.mesorregiao?.UF?.nome ?? ''
                                            } (${
                                                municipio.microrregiao?.mesorregiao?.UF?.sigla ?? ''
                                            })`}
                                        />
                                        <Row
                                            label="Região"
                                            value={
                                                municipio.microrregiao?.mesorregiao?.UF?.regiao
                                                    ?.nome
                                            }
                                        />
                                    </dl>
                                )}

                                <section className="mt-8 rounded-lg border border-slate-800 bg-surface px-4 py-3 text-sm text-slate-400">
                                    <p className="font-medium text-slate-200">
                                        Mais dados em breve
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed">
                                        Esta área receberá indicadores enriquecidos pela API
                                        própria do Atlas, usando o código IBGE como chave.
                                    </p>
                                </section>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex flex-col gap-0.5 border-b border-slate-800 pb-3 last:border-none">
        <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="text-slate-100">{value ?? '—'}</dd>
    </div>
);

export default MunicipioDrawer;
