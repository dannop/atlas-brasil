import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Compass, Menu, X } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const MapLayout = ({ children }: IProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative h-screen bg-surface text-slate-100">
            <main className="absolute inset-0 overflow-hidden">{children}</main>

            <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
                title="Menu"
                className="group absolute top-4 right-4 z-[600] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface-elevated/85 text-slate-100 shadow-lg ring-1 ring-black/10 backdrop-blur transition-all duration-200 hover:border-brand-400/40 hover:bg-brand-700/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 active:scale-95"
            >
                <Menu size={20} strokeWidth={2.25} aria-hidden />
            </button>

            <Transition show={menuOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={setMenuOpen}>
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
                            <DialogPanel className="flex h-full w-80 max-w-[90vw] flex-col border-l border-slate-800/80 bg-surface-soft/95 shadow-2xl backdrop-blur">
                                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700/30 text-brand-200">
                                            <Compass className="h-5 w-5" />
                                        </span>
                                        <div className="flex flex-col leading-tight">
                                            <DialogTitle className="text-base font-semibold tracking-tight text-slate-50">
                                                Atlas Brasil
                                            </DialogTitle>
                                            <span className="text-xs text-slate-400">
                                                Mapa interativo dos municípios do IBGE
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen(false)}
                                        aria-label="Fechar menu"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                                    >
                                        <X size={18} aria-hidden />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-slate-300">
                                    <p className="text-slate-400">
                                        Selecione um estado no mapa para visualizar seus municípios.
                                        Clique em um município para ver detalhes.
                                    </p>
                                </div>

                                <div className="border-t border-slate-800/80 px-6 py-4 text-xs text-slate-500">
                                    v0.1.0
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default MapLayout;
