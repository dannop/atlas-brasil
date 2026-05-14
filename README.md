# Atlas Brasil

Mapa interativo dos 5.570 municípios do Brasil (IBGE).
Clique em um estado para entrar nos municípios, clique em um município para abrir a ficha lateral.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (sem postcss, via plugin Vite)
- React Router 7
- TanStack Query 5
- React Leaflet 5 (renderiza apenas os polígonos, sem tile base)
- Headless UI (drawer acessível)
- Axios

## Requisitos

- Node `>=22` (use `nvm use` para carregar o `.nvmrc`)
- pnpm `>=11`

## Como rodar

```bash
nvm use
pnpm install
cp .env.example .env
pnpm dev
```

Abre em `http://localhost:5173`.

## Arquitetura

- `src/components/` — Atomic Design (atoms / molecules / organisms / template).
- `src/pages/` — composição final (apenas `MapPage` por enquanto).
- `src/context/` — `MapProvider` controla seleção de UF e município.
- `src/hooks/api/` — hooks React Query por recurso.
    - `ibge/useListUFs`, `ibge/useShowMunicipio`
    - `geo/useMalhaBrasil`, `geo/useMalhaMunicipiosByUF`
- `src/services/ibge.ts` — cliente da API pública de Localidades e Malhas do IBGE.
- `src/hooks/useAPI.ts` / `useAxios.ts` — preparados para a API própria futura (`VITE_APP_API_URL`).

## Estratégia de dados

O Brasil tem 5.570 municípios — carregar todos de uma vez é inviável.
Por isso o app trabalha em duas camadas:

1. **Zoom inicial:** GeoJSON do Brasil agregado por UF (27 polígonos).
2. **Drill-in:** ao clicar em uma UF, busca apenas a malha dos municípios daquela UF (em média ~200 a ~850 polígonos).

Os dados geográficos vêm da API oficial de Malhas do IBGE (`/api/v3/malhas`).

## API própria (futura)

O cliente `useAPI` aponta para `VITE_APP_API_URL`. Quando essa API existir, adicione hooks em `src/hooks/api/atlas/` consumindo o código IBGE como chave e dispare as queries pelo `selectedMunicipio.codigoIbge` do `MapContext`.

## Scripts

| comando | descrição |
| --- | --- |
| `pnpm dev` | servidor Vite |
| `pnpm build` | typecheck + build de produção |
| `pnpm preview` | servir build local |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm typecheck` | `tsc --noEmit` |
